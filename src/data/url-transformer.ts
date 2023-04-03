import { MangaPageImage } from '$types/manga';
import formatNumber from '$utils/format-number';

const ORIGIN = 'https://www.cartoonmad.com';

const getCover = (id: string): string => `${ORIGIN}/cartoonimg/coimg/${id}.jpg`;
const getPageImage = (
  {
    mangaId,
    chapterIndex,
    pageIndex,
  }: MangaPageImage,
): string => `${ORIGIN}/5e585/${mangaId}/${formatNumber(chapterIndex, 3)}/${formatNumber(pageIndex, 3)}.jpg`;

export default {
  getCover,
  getPageImage,
};
