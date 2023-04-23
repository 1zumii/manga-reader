import {
  Component, For, Show, onMount,
} from 'solid-js';
import PageImage, { Props as PageImageProps } from '$components/page-image';
import UrlTransformer from '$src/data/url-transformer';
import { MangaPageImage } from '$types/manga';
import useMangaInfo from './use-manga-info';
import {
  calcScrollTop,
  generatePageImageId,
  getDisplayElements,
  isBeforeCurrentPage,
  isSamePageImage,
} from './utils';
import styles from './style.module.less';

// TODO: page 高度过小导致 intersectionRatio 一直为 1
const TRIGGER_UPDATE_RATIO = 0.25;

const Reader: Component = () => {
  const {
    mangaResource,
    readingInfo,
    displayPageImages,
    handleReadingInfoChange,
  } = useMangaInfo();

  /**
   * store latest clientTop of current reading element
   * 1. once PageImage resize, reset container.scrollTop to previous value before resize
   * 2. at current reading page changing, set this variable to next reading page's element.clientTop
   */
  let currentReadingElementClientTop: number;

  let containerRef: HTMLDivElement | undefined;
  onMount(() => {
    const currentReading = readingInfo();
    if (!currentReading) return;

    const displayElements = getDisplayElements(containerRef);
    if (!displayElements) return;
    const currentReadingElement = displayElements.find(
      (e) => isSamePageImage(e.pageInfo, currentReading),
    );

    currentReadingElementClientTop = 0;
    requestAnimationFrame(() => {
      currentReadingElement?.element.scrollIntoView(true);
    });
  });

  const handlePageStartLoad = (pageInfo: MangaPageImage): void => {
    const currentReading = readingInfo();
    if (!currentReading) return;
    if (!isBeforeCurrentPage(currentReading, pageInfo)) return;

    const displayElements = getDisplayElements(containerRef);
    if (!displayElements) return;
    const previousElements = displayElements.filter(
      (e) => isBeforeCurrentPage(currentReading, e.pageInfo),
    );

    // DEBUG:
    /* console.log(
      Date.now(),
      '🏵',
      [currentReading.chapterIndex, currentReading.pageIndex],
      { currentReadingElementClientTop },
    ); */

    // reset current page's clientTop, prevent window scroll once page image resize(because of load)
    requestAnimationFrame(() => {
      containerRef?.scrollTo({
        top: calcScrollTop(previousElements, currentReadingElementClientTop),
      });
    });
  };

  // observe current reading page scroll
  const handlePageIntersect = (
    info: Parameters<NonNullable<PageImageProps['onIntersect']>>[0] & { pageInfo: MangaPageImage },
  ): void => {
    const { pageInfo, boundingClientRect, intersectionRatio } = info;
    const currentReading = readingInfo();
    if (!currentReading) return;
    if (!isSamePageImage(currentReading, pageInfo)) return;

    /* update current reading page image */
    // update display pages but no scroll, prevent auto trigger next round update and dead cycle
    if (currentReadingElementClientTop === boundingClientRect.top) return;

    currentReadingElementClientTop = boundingClientRect.top;

    // DEBUG:
    /* console.log(
      Date.now(),
      '❎',
      [currentReading.chapterIndex, currentReading.pageIndex],
      {
        currentReadingElementClientTop,
        intersectionRatio,
        height: boundingClientRect.height,
      },
    ); */

    // page's display ratio still not trigger update
    if (intersectionRatio >= TRIGGER_UPDATE_RATIO) return;

    const direction: Parameters<typeof handleReadingInfoChange>[0] = boundingClientRect.top > 0 ? 'prev' : 'next';
    const clientTopBeforeUpdate = currentReadingElementClientTop;
    const currentReadingBeforeUpdate = currentReading;

    handleReadingInfoChange(
      direction,
      () => requestAnimationFrame(() => {
        const displayElements = getDisplayElements(containerRef);
        if (!displayElements) return;
        const previousElements = displayElements.filter(
          (e) => isBeforeCurrentPage(currentReadingBeforeUpdate, e.pageInfo),
        );

        const currentReadingElementIndex = displayElements.findIndex(
          (e) => isSamePageImage(currentReading, e.pageInfo),
        );
        if (currentReadingElementIndex === -1) return;
        const nextReadingElementIndex = direction === 'prev'
          ? Math.max(currentReadingElementIndex - 1, -1)
          : Math.min(currentReadingElementIndex + 1, displayElements.length);
        const nextReadingElement = displayElements[nextReadingElementIndex];

        // DEBUG:
        /* console.log(
          Date.now(),
          '🍟',
          [
            currentReadingBeforeUpdate.chapterIndex,
            currentReadingBeforeUpdate.pageIndex,
          ],
          {
            clientTopBeforeUpdate,
            nextReadingElement: JSON.parse(JSON.stringify(nextReadingElement)),
            previousElements: JSON.parse(JSON.stringify(previousElements)),
            displayElements: JSON.parse(JSON.stringify(displayElements)),
          },
        ); */

        containerRef?.scrollTo({
          top: calcScrollTop(previousElements, clientTopBeforeUpdate),
        });
        currentReadingElementClientTop = nextReadingElement.clientTop;
      }),
    );
  };

  return (
    <Show when={!mangaResource.loading}>
      <div ref={containerRef} class={styles.readView}>
        <For each={displayPageImages()}>
          { (page) => (
            <PageImage
              id={generatePageImageId(page)}
              src={UrlTransformer.getPageImage(page)}
              containerRef={containerRef}
              onLoadStart={() => handlePageStartLoad(page)}
              onIntersect={(info) => handlePageIntersect({ ...info, pageInfo: page })}
            />
          ) }
        </For>
      </div>
    </Show>
  );
};

export default Reader;
