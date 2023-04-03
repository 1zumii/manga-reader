import { createMemo, createSignal } from 'solid-js';
import { useMangaResource } from '$src/data/use-manga-resource';
import { getReaderNavigateLink, getReaderUrlParams } from '$src/router';
import { MangaPageImage } from '$types/manga';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PAGE_PADDING_NUM = 2;

export const generatePageImageId = (image: MangaPageImage): string => JSON.stringify(
  image,
  Object.keys(image).sort(),
);

// DEBUG:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateReaderUrlParams = (next: MangaPageImage): void => {
  const link = getReaderNavigateLink(next);
  window.history.pushState({}, '', link); // update url but not trigger page reload
};

// get reading information from matched url params at page loaded
const getInitReadingInfo = (): MangaPageImage | undefined => {
  const params = getReaderUrlParams();

  if (Number.isNaN(Number.parseInt(params.chapterIndex, 10))) return undefined;
  if (Number.isNaN(Number.parseInt(params.pageIndex, 10))) return undefined;

  return {
    mangaId: params.mangaId,
    chapterIndex: Number.parseInt(params.chapterIndex, 10),
    pageIndex: Number.parseInt(params.pageIndex, 10),
  };
};

// TODO: 根据 isLoading 作为返回类型的 narrow guard
const useMangaInfo = () => {
  const mangaList = useMangaResource();

  const [readingInfo] = createSignal(getInitReadingInfo());

  // render more image before and after current image
  const displayPageImages = createMemo<MangaPageImage[]>(() => {
    if (mangaList.state !== 'ready') return [];

    const currentReading = readingInfo();
    if (!currentReading) return [];

    // DEBUG:
    return [];
  });

  const currentMangaInfo = createMemo(() => {
    if (mangaList.state !== 'ready') return undefined;

    const currentReadingInfo = readingInfo();
    if (!currentReadingInfo) return undefined;

    return mangaList().find((m) => m.id === currentReadingInfo.mangaId);
  });

  return {
    displayPageImages,
    currentReading: readingInfo,
    info: currentMangaInfo,
    resourceState: mangaList.state,
    isLoading: mangaList.loading,
  };
};

export default useMangaInfo;
