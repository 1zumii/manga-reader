import type { MangaPageImage } from "$types/manga";
import formatNumber from "$utils/format-number";

const COVER_ORIGIN = "https://www.cartoonmad.com";
const IMAGE_ORIGIN = "https://cc.fun8.us";

const getCover = (id: string): string => `${COVER_ORIGIN}/cartoonimg/coimg/${id}.jpg`;
const getPageImage = (
  {
    mangaId,
    chapterIndex,
    pageIndex,
  }: MangaPageImage,
): string => `${IMAGE_ORIGIN}//2e5fc/${mangaId}/${formatNumber(chapterIndex, 3)}/${formatNumber(pageIndex, 3)}.jpg`;

export default {
  getCover,
  getPageImage,
};
