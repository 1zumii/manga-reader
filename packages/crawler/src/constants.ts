import type { MangaInfo } from "@manga-reader/common";
import { formatNumber } from "@manga-reader/common";

export const ORIGIN = "https://www.cartoonmad.com";

export const API = {
  allManga: "/comic99.html",
  getMangaList: (pageIndex: number): string => `/comic99.${formatNumber(pageIndex, 2)}.html`,
  getMangaChapterList: (id: string): string => `/comic/${id}.html`,
};

export const HIGHER_PRIORITY_MANGA: MangaInfo["id"][] = [
  "7654", // 咒术回战
  "4975", // 鬼灭之刃
  "1221", // 进击的巨人
  "8151", // 电锯人
  "1152", // 海贼王
  "8223", // 间谍过家家
  "4455", // 迷宫饭
  "7544", // 更衣人偶坠入爱河
  "8067", // 异世界叔叔
  "7882", // 地狱乐
  "1798", // 堀与宫村
  "5049", // 恶魔姐姐
  "1066", // 名侦探柯南
  // "GrandBlue",
  // "来自深渊",
  // "擅长捉弄人的高木同学",
  // "月刊少女野崎君",
];
