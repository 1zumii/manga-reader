import type { MangaChapter, MangaPageImage } from "@manga-reader/common";
import { getReaderUrlParams } from "../../router";

export const generatePageImageId = (image: MangaPageImage): string => JSON.stringify(
  image,
  Object.keys(image).sort(),
);

// get reading information from matched url params at page loaded
export const getInitReadingInfo = (): MangaPageImage | undefined => {
  const params = getReaderUrlParams();

  if (Number.isNaN(Number.parseInt(params.chapterIndex, 10))) {
    return undefined;
  }
  if (Number.isNaN(Number.parseInt(params.pageIndex, 10))) {
    return undefined;
  }

  return {
    mangaId: params.mangaId,
    chapterIndex: Number.parseInt(params.chapterIndex, 10),
    pageIndex: Number.parseInt(params.pageIndex, 10),
  };
};

export const getAdjacentPages = (
  current: MangaPageImage,
  direction: "prev" | "next",
  count: number,
  chapters: MangaChapter[],
): MangaPageImage[] => {
  if (count === 0) {
    return [];
  }

  const { pageIndex, chapterIndex } = current;
  const currentChapter = chapters.find((c) => c.index === chapterIndex);

  const getRecursionResult = (
    adjacentPage: MangaPageImage,
  ): ReturnType<typeof getAdjacentPages> => {
    const result = getAdjacentPages(adjacentPage, direction, count - 1, chapters);
    return direction === "prev" ? [...result, adjacentPage] : [adjacentPage, ...result];
  };

  if (direction === "prev") {
    // previous page
    if (pageIndex !== 1) {
      return getRecursionResult({ ...current, pageIndex: pageIndex - 1 });
    }
    // previous chapter's last page
    const prevChapter = chapters.find((c) => c.index === currentChapter?.prevIndex);
    if (!prevChapter) {
      return [];
    }
    return getRecursionResult({
      ...current,
      chapterIndex: prevChapter.index,
      pageIndex: prevChapter.total,
    });
  }
  // direction === 'next'
  // next page
  if (typeof currentChapter?.total !== "undefined" && pageIndex !== currentChapter.total) {
    return getRecursionResult({ ...current, pageIndex: pageIndex + 1 });
  }
  // next chapter's first page
  const nextChapter = chapters.find((c) => c.index === currentChapter?.nextIndex);
  if (!nextChapter) {
    return [];
  }
  return getRecursionResult({ ...current, chapterIndex: nextChapter.index, pageIndex: 1 });
};

export const isSamePageImage = (
  page1: MangaPageImage,
  page2: MangaPageImage,
): boolean => generatePageImageId(page1) === generatePageImageId(page2);

export const isBeforeCurrentPage = (
  current: MangaPageImage,
  comparative: MangaPageImage,
): boolean => {
  if (current.mangaId !== comparative.mangaId) {
    return false;
  }
  if (current.chapterIndex !== comparative.chapterIndex) {
    return comparative.chapterIndex < current.chapterIndex;
  }
  return comparative.pageIndex < current.pageIndex;
};

/** get container's inner display page element, return `undefined` means error */
export const getDisplayElements = (containerElement?: Element) => {
  if (!containerElement) {
    return undefined;
  }

  const displayElements = Array.from(containerElement.children).map((childElement) => {
    try {
      const pageInfo: MangaPageImage = JSON.parse((childElement as HTMLDivElement).dataset.id ?? "null");
      if (!pageInfo) {
        return undefined;
      }
      const { top, height } = childElement.getBoundingClientRect();
      return {
        pageInfo,
        /** DOMRect.height */
        height,
        /** DOMRect.top: left top from browser window top */
        clientTop: top,
        element: childElement,
      };
    } catch {
      return undefined;
    }
  });

  if (displayElements.includes(undefined)) {
    return undefined;
  }

  return displayElements.filter((e): e is (NonNullable<typeof e>) => !!e);
};

/**
 * - if element's upper side is higher than browser window, clientTop < 0
 * - scrollTop is positive
 * - result scrollTop is
 *    ```
 *    e1.height + e2.height ... - clientTop
 *    ```
 */
export const calcScrollTop = (
  elementsScrolledUp: NonNullable<ReturnType<typeof getDisplayElements>>,
  relativeReadingElementClientTop: number,
): number => elementsScrolledUp.reduce(
  (sum, e) => sum + e.height,
  -relativeReadingElementClientTop,
);
