import type { MangaChapter, MangaInfo, MangaPageImage } from "@manga-reader/common";
import type {
  Component,
  JSX,
} from "solid-js";
import {
  For,
  Show,
  batch,
  createEffect,
  createSignal,
} from "solid-js";
import { throttle } from "radash";
import PageImage from "../../components/page-image";
import UrlTransformer from "../../data/url-transformer";
import useMangaInfo from "./use-manga-info";
import {
  generatePageImageId,
  getAdjacentPages,
  getInitReadingInfo,
} from "./utils";
import styles from "./style.module.less";
import { updateReaderUrlParams } from "$src/router";

type ChapterIndex = MangaChapter["index"];
type PageId = `${ChapterIndex}-${number}`;
type DisplayPage = MangaPageImage & {
  offsetTop: number;
  height: number;
};

const encodePageId = (
  { chapterIndex, pageIndex }: {
    chapterIndex: number;
    pageIndex: number;
  },
): PageId => `${chapterIndex}-${pageIndex}`;
/* const decodePageId = (id: PageId): {
  chapterIndex: number;
  pageIndex: number;
} => {
  const [chapterIndex, pageIndex] = id.split("-").map((part) => Number(part));
  return { chapterIndex, pageIndex };
}; */

const DEFAULT_PAGE_HEIGHT = 888; // use as loading image's height (px)
const BUFFER_PAGE_NUM = 2;

const Reader: Component = () => {
  const { currentManga } = useMangaInfo();

  let containerRef: HTMLDivElement | undefined;

  const pageHeights = new Map<PageId, number>();
  const chapterHeights = new Map<ChapterIndex, number>();

  const calcListHeight = (manga: MangaInfo): number => (
    manga.chapters.reduce(
      (height, chapter) => {
        const chapterSumHeight = chapterHeights.get(chapter.index)
          ?? chapter.total * DEFAULT_PAGE_HEIGHT;
        return height + chapterSumHeight;
      },
      0,
    )
  );

  const [listHeight, setListHeight] = createSignal(0);

  const [displayPages, setDisplayPages] = createSignal<DisplayPage[]>([]);

  createEffect(() => {
    const pages = displayPages();
    const firstPage = pages[BUFFER_PAGE_NUM];

    if (!firstPage) {
      return;
    }

    // DEBUG:
    // eslint-disable-next-line no-console
    console.log(pages);

    updateReaderUrlParams(firstPage);
  });

  const handleContainerScroll = (scrollTop: number): void => {
    // DEBUG:
    // eslint-disable-next-line no-console
    console.log("handleContainerScroll", { scrollTop });

    const manga = currentManga();
    if (!manga) {
      return;
    }

    const containerHeight = window.innerHeight;

    // update displayPages
    const pages: DisplayPage[] = [];

    let offsetTop = 0;
    for (const chapter of manga.chapters) {
      const chapterSumHeight = chapterHeights.get(chapter.index)
        ?? chapter.total * DEFAULT_PAGE_HEIGHT;

      if (offsetTop + chapterSumHeight < scrollTop) {
        offsetTop += chapterSumHeight;
      } else if (offsetTop - scrollTop >= containerHeight) {
        break;
      } else {
        for (let pageIndex = 1; pageIndex <= chapter.total; pageIndex++) { // 页码从 1 开始
          const pageHeight = pageHeights.get(
            encodePageId({ chapterIndex: chapter.index, pageIndex }),
          ) ?? DEFAULT_PAGE_HEIGHT;

          offsetTop += pageHeight;

          if (offsetTop - scrollTop >= containerHeight) {
            // out container
            break;
          }

          if (offsetTop >= scrollTop) {
            // found start page
            pages.push({
              mangaId: manga.id,
              chapterIndex: chapter.index,
              pageIndex,
              offsetTop,
              height: pageHeight,
            });
          }
        }
      }
    }

    const firstVisiblePage = pages[0];
    const previousBufferPages = getAdjacentPages(firstVisiblePage, "prev", BUFFER_PAGE_NUM, manga.chapters);
    previousBufferPages.reverse();
    let previousOffsetTop = firstVisiblePage.offsetTop;
    const previouses = previousBufferPages.map((page) => {
      const { chapterIndex, pageIndex } = page;
      const pageHeight = pageHeights.get(
        encodePageId({ chapterIndex, pageIndex }),
      ) ?? DEFAULT_PAGE_HEIGHT;

      previousOffsetTop -= pageHeight;

      const displayPage: DisplayPage = {
        ...page,
        offsetTop: previousOffsetTop,
        height: pageHeight,
      };

      return displayPage;
    });
    previouses.reverse();
    pages.unshift(...previouses);

    const lastVisiblePage = pages.at(-1)!;
    const followingBufferPages = getAdjacentPages(lastVisiblePage, "next", BUFFER_PAGE_NUM, manga.chapters);
    let followingOffsetTop = lastVisiblePage.offsetTop + lastVisiblePage.height;
    const followings = followingBufferPages.map((page) => {
      const { chapterIndex, pageIndex } = page;
      const pageHeight = pageHeights.get(
        encodePageId({ chapterIndex, pageIndex }),
      ) ?? DEFAULT_PAGE_HEIGHT;

      const displayPage: DisplayPage = {
        ...page,
        offsetTop: followingOffsetTop,
        height: pageHeight,
      };

      followingOffsetTop += pageHeight;

      return displayPage;
    });
    pages.push(...followings);

    // update list height
    const nextListHeight = calcListHeight(manga);

    // batch update
    batch(() => {
      setDisplayPages(pages);
      setListHeight(nextListHeight);
    });
  };

  // run once on mounted
  createEffect(() => {
    const manga = currentManga();

    if (!manga) {
      setListHeight(0);
      return;
    }

    setListHeight(
      calcListHeight(manga),
    );

    // DEBUG:
    // eslint-disable-next-line no-console
    console.log("set initial scrollTop");

    // initial scrollTop
    const firstVisiblePage = getInitReadingInfo()!;

    const initScrollTop = manga.chapters.reduce(
      (height, chapter) => {
        if (chapter.index !== firstVisiblePage.chapterIndex) { // TODO: 可能要包含前后两个 chapter
          const chapterSumHeight = chapterHeights.get(chapter.index)
            ?? chapter.total * DEFAULT_PAGE_HEIGHT;
          return height + chapterSumHeight;
        }

        return height + Array
          .from({ length: chapter.total })
          .reduce<number>(
            (chapterSumHeight, _, pageIndex) => {
              const pageHeight = pageHeights.get(
                encodePageId({ chapterIndex: chapter.index, pageIndex }),
              ) ?? DEFAULT_PAGE_HEIGHT;
              return chapterSumHeight + pageHeight;
            },
            0,
          );
      },
      0,
    );

    if (!containerRef) {
      return;
    }
    containerRef.scrollTop = initScrollTop;
    handleContainerScroll(initScrollTop); // trigger container's scroll event
  });

  const throttledScrollHandler = throttle(
    { interval: 50 },
    ((e) => {
      const container = e.target;
      if (!container) {
        return;
      }

      handleContainerScroll(container.scrollTop);
    }) satisfies JSX.EventHandler<HTMLDivElement, Event>,
  );

  const handlePageStartLoad = (page: MangaPageImage, height: number): void => {
    const pageId = encodePageId(page);

    if (pageHeights.has(pageId)) {
      return;
    }

    // TODO:

    pageHeights.set(pageId, height);
    // TODO: chapterHeight.set()
  };

  return (
    <Show when={currentManga()}>
      <div
        ref={containerRef}
        class={styles.readView}
        onScroll={throttledScrollHandler}
      >
        <div class={styles.imageList} style={{ height: `${listHeight()}px` }}>
          <For each={displayPages()}>
            { (page) => (
              <PageImage
                id={generatePageImageId(page)}
                src={UrlTransformer.getPageImage(page)}
                containerRef={containerRef}
                offsetTop={page.offsetTop}
                onLoadStart={(height) => handlePageStartLoad(page, height)}
              // onIntersect={(info) => handlePageIntersect({ ...info, pageInfo: page })}
              />
            ) }
          </For>
        </div>
      </div>
    </Show>
  );
};

export default Reader;
