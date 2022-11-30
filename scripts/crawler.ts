import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs-extra';
import Coder from 'iconv-lite';
import * as Parser from 'node-html-parser';
import { OpenCC } from 'opencc';

type MangaChapter = {
  name: string;
  total: number;
}

type MangaInfo = {
  id: string;
  title: string;
  chapters: MangaChapter[];
}

/**
 *
 * @param n number need to format
 * @param digit result total digits
 *
 * @example
 * ```js
 * const result = formatNumber(1, 3)
 * result -> '001'
 * ```
 */
const formatNumber = (n: number, digit: number): string => {
  if (n.toString().length > digit) return n.toString();
  const difference = digit - n.toString().length;
  return `${'0'.repeat(difference)}${n}`;
};

const ORIGIN = 'https://www.cartoonmad.com';

const API = {
  allManga: '/comic99.html',
  getMangaList: (pageIndex: number): string => `/comic99.${formatNumber(pageIndex, 2)}.html`,
  getMangaChapterList: (id: string): string => `/comic/${id}.html`,
};

const HIGHER_PRIORITY_MANGA = ['咒术回战', '鬼灭之刃', '进击的巨人'];

const converter = new OpenCC('t2s.json');

const fetchBig5HtmlDocument = async (url: string): Promise<Parser.HTMLElement | undefined> => {
  const response = await axios<Buffer>({
    url,
    method: 'get',
    baseURL: ORIGIN,
    headers: { 'Accept-Language': 'zh-CN,zh;q=0.8' },
    /**
     * axios 默认 responseEncoding 值为 utf-8
     * 参考 https://stackoverflow.com/questions/19557325 中的解决 big5 的方式，是将 request 设置「encoding: null」
     * 参考 https://stackoverflow.com/questions/14855015 中的回答，「encoding: null」的效果是 body 变成 type `Buffer`
     * 参考 https://stackoverflow.com/questions/40211246，需要同时设置 axios 的 responseEncoding 和 responseType
     */
    responseEncoding: 'binary',
    responseType: 'arraybuffer',
  });
  if (response.status !== 200) return undefined;

  return Parser.parse(
    converter.convertSync(
      Coder.decode(response.data, 'big5'),
    ),
  );
};

const getMangaListPageCount = async (): Promise<number> => {
  const doc = await fetchBig5HtmlDocument(API.allManga);
  if (!doc) return 0;

  const pageItemElements = doc.querySelectorAll('table[width="728"] td[align="center"] > a');
  return pageItemElements.length;
};

const queryMangaChapterList = async (
  id: string,
  onSuccess?: (resultChapters: MangaChapter[]) => void,
): Promise<MangaChapter[]> => {
  const doc = await fetchBig5HtmlDocument(API.getMangaChapterList(id));
  if (!doc) return [];

  const chapters = doc
    .querySelectorAll('table[width="800"][align="center"] td:has(font)')
    .map((e): MangaChapter | undefined => {
      const aElement = e.querySelector('a');
      const fontElement = e.querySelector('font');
      if (!aElement || !fontElement) return undefined;

      const name = aElement.innerHTML;
      const totalRegExpResult = fontElement.innerHTML.match(/(\d+)/);
      if (!totalRegExpResult) return undefined;
      const total = Number(totalRegExpResult[1]);

      return { name, total };
    })
    .filter((i): i is MangaChapter => !!i);

  onSuccess?.(chapters);

  return chapters;
};

const queryMangaList = async (pageIndex: number): Promise<MangaInfo[]> => {
  const doc = await fetchBig5HtmlDocument(API.getMangaList(pageIndex));
  if (!doc) return [];

  const results = await Promise.allSettled(
    doc
      .querySelectorAll(
        [
          'td[valign="top"]', '>', 'table[width="890"]',
          'tr', '>', 'td[align="right"]', '>', 'table[width="890"]',
          'table[width="860"]', 'td[align="center"]', '>', 'table', 'td', '>', 'a',
        ].join(' '),
      )
      .map(async (e): Promise<MangaInfo> => {
        // id
        const attrRegExpResult = e.attributes.href.match(/^comic\/(\d+)\.html$/);
        if (!attrRegExpResult) throw new Error('MangaInfo: attributes.href matches no id');
        const id = attrRegExpResult[1];

        // title
        if (!e.attributes.title) throw new Error('MangaInfo: attributes.title not found');
        const title = e.attributes.title.trim();

        // chapters
        const chapters = await queryMangaChapterList(
          id,
          (resultChapters) => {
            console.log(chalk.bgGreen(' DONE '), chalk.magenta(title), resultChapters.length);
          },
        );

        return { id, title, chapters };
      }),
  );

  const mangaInfoList = results
    .map((p) => {
      if (p.status === 'rejected') {
        console.error(p.reason);
        return undefined;
      }
      return p.value;
    })
    .filter((i): i is MangaInfo => !!i);

  return mangaInfoList;
};

(async (): Promise<void> => {
  const pageCount = await getMangaListPageCount();
  const results = await Promise.allSettled(
    new Array(pageCount)
      .fill(NaN)
      .map((_, i) => queryMangaList(i + 1)),
  );

  const mangaInfoList = results
    .map((p): MangaInfo[] | undefined => {
      if (p.status === 'rejected') {
        console.error(p.reason);
        return undefined;
      }
      return p.value;
    })
    .filter((i): i is MangaInfo[] => !!i)
    .flat(1)
    .sort((a, b) => {
      let orderA: number = 0;
      let orderB: number = 0;

      if (HIGHER_PRIORITY_MANGA.some((title) => a.title.includes(title))) {
        orderA += 1;
      }
      if (HIGHER_PRIORITY_MANGA.some((title) => b.title.includes(title))) {
        orderB += 1;
      }
      if (Number(a.id) <= Number(b.id)) {
        orderA += 1;
      } else {
        orderB += 1;
      }
      return orderB - orderA;
    });

  try {
    const jsonFilePath = path.resolve('manga-info.json'); // output to project root folder
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(mangaInfoList, null, 2),
    );

    console.log('\n');
    console.log(chalk.bgGreen(' DONE '), 'write JSON', chalk.cyan(mangaInfoList.length));
  } catch (error) {
    console.error('\n');
    console.error(chalk.bgRed(' ERROR '), 'write JSON failed');
  }
})();
