import axios from 'axios';
import Coder from 'iconv-lite';
import * as Parser from 'node-html-parser';

type MangaBaseInfo = {
  id: string;
  title: string;
  coverUrl: string;
}

const formatNumber = (n: number, digit: number): string => {
  if (n.toString().length > digit) return n.toString();
  const difference = digit - n.toString().length;
  return `${'0'.repeat(difference)}${n}`;
};

const ORIGIN = 'https://www.cartoonmad.com';

const API = {
  allManga: '/comic99.html',
  getMangaList: (pageIndex: number): string => `/comic99.${formatNumber(pageIndex, 2)}.html`,
};

const getMangaListPageCount = async (): Promise<number> => {
  const response = await axios<string>({
    url: API.allManga,
    method: 'get',
    baseURL: ORIGIN,
    headers: { 'Accept-Language': 'zh-CN,zh;q=0.8' },
  });
  if (response.status !== 200) return 0;

  const doc = Parser.parse(response.data);
  const pageItemElements = doc.querySelectorAll('table[width="728"] td[align="center"] > a');
  return pageItemElements.length;
};

const queryMangaList = async (pageIndex: number): Promise<MangaBaseInfo[]> => {
  const response = await axios<Buffer>({
    url: API.getMangaList(pageIndex),
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
  if (response.status !== 200) return [];

  const doc = Parser.parse(
    Coder.decode(response.data, 'big5'),
  );
  const mangaInfoList = doc
    .querySelectorAll(
      [
        'td[valign="top"]', '>', 'table[width="890"]',
        'tr', '>', 'td[align="right"]', '>', 'table[width="890"]',
        'table[width="860"]', 'td[align="center"]', '>', 'table', 'td', '>', 'a',
      ].join(' '),
    )
    .map((e): MangaBaseInfo | undefined => {
      // id
      const attrRegExpResult = e.attributes.href.match(/^comic\/(\d+)\.html$/);
      if (!attrRegExpResult) return undefined;
      const id = attrRegExpResult[1];

      // title
      if (!e.attributes.title) return undefined;
      const title = e.attributes.title.trim();

      // coverUrl
      const coverImageElement = e.querySelector('img');
      if (!coverImageElement || !coverImageElement.attributes.src) return undefined;

      return {
        id,
        title,
        coverUrl: coverImageElement.attributes.src,
      };
    })
    .filter((e): e is MangaBaseInfo => !!e);

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
    .map((p): MangaBaseInfo[] | undefined => {
      if (p.status === 'rejected') {
        console.error(p.reason);
        return undefined;
      }
      return p.value;
    })
    .filter((i): i is MangaBaseInfo[] => !!i)
    .flat(1);
  // DEBUG:
  console.log(mangaInfoList.length);
  mangaInfoList.forEach((e) => {
    console.log(e);
  });

  // TODO: write to json
})();
