import { createMemo, createSignal } from 'solid-js';
import { useMangaResource } from '$src/data/use-manga-resource';
import { MangaPageImage } from '$types/manga';
import { getAdjacentPages, getInitReadingInfo, updateReaderUrlParams } from './utils';

const PAGE_PADDING_NUM = 2;

// TODO: 根据 isLoading 作为返回类型的 narrow guard
const useMangaInfo = () => {
  const mangaList = useMangaResource();

  const [readingInfo, setReadingInfo] = createSignal(getInitReadingInfo());

  const mangaInfo = createMemo(() => {
    if (mangaList.state !== 'ready') return undefined;

    const currentReadingInfo = readingInfo();
    if (!currentReadingInfo) return undefined;

    return mangaList().find((m) => m.id === currentReadingInfo.mangaId);
  });

  // render more image before and after current image
  const displayPageImages = createMemo<MangaPageImage[]>(() => {
    const currentReading = readingInfo();
    if (!currentReading) return [];
    const currentMangaInfo = mangaInfo();
    if (!currentMangaInfo) return [];

    return [
      ...getAdjacentPages(currentReading, 'prev', PAGE_PADDING_NUM, currentMangaInfo.chapters),
      currentReading,
      ...getAdjacentPages(currentReading, 'next', PAGE_PADDING_NUM, currentMangaInfo.chapters),
    ];
  });

  const handleReadingInfoChange = (
    direction: Parameters<typeof getAdjacentPages>[1],
    afterChange?: () => void,
  ): void => {
    const currentReading = readingInfo();
    if (!currentReading) return;
    const currentMangaInfo = mangaInfo();
    if (!currentMangaInfo) return;

    const nextReading = getAdjacentPages(
      currentReading,
      direction,
      1,
      currentMangaInfo.chapters,
    )[0];
    if (!nextReading) return;

    setReadingInfo(nextReading);
    updateReaderUrlParams(nextReading);
    afterChange?.();
  };

  return {
    mangaInfo,
    readingInfo,
    displayPageImages,
    handleReadingInfoChange,
    resourceState: mangaList.state,
    isLoading: mangaList.loading,
  };
};

export default useMangaInfo;
