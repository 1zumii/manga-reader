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
    // FIXME: macos safari doesn't work
    currentReadingElement?.element.scrollIntoView(true);
  });

  /*  const handlePageStartLoad = (pageInfo: MangaPageImage): void => {
    const currentReading = readingInfo();
    if (!currentReading) return;
    if (!isBeforeCurrentPage(currentReading, pageInfo)) return;

    const displayElements = getDisplayElements(containerRef);
    if (!displayElements) return;
    const previousElements = displayElements.filter(
      (e) => isBeforeCurrentPage(currentReading, e.pageInfo),
    );

    // DEBUG:
    console.log(
      Date.now(),
      '🏵',
      [currentReading.chapterIndex, currentReading.pageIndex],
      { currentReadingElementClientTop },
    );

    // reset current page's clientTop, prevent window scroll once page image resize(because of load)
    requestAnimationFrame(() => {
      containerRef?.scrollTo({
        top: calcScrollTop(previousElements, currentReadingElementClientTop),
      });
    });
  }; */

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
    // TODO: 符号相反，且 intersectionRatio 较小
    if (
      (currentReadingElementClientTop * boundingClientRect.top < 0)
      && (intersectionRatio < TRIGGER_UPDATE_RATIO)
    ) return;

    // DEBUG:
    console.log(
      Date.now(),
      '❎',
      JSON.parse(JSON.stringify([currentReading.chapterIndex, currentReading.pageIndex])),
      JSON.parse(JSON.stringify({
        currentReadingElementClientTopBeforeUpdate: currentReadingElementClientTop,
        currentReadingElementClientTop: boundingClientRect.top,
        intersectionRatio,
        height: boundingClientRect.height,
      })),
    );

    currentReadingElementClientTop = boundingClientRect.top;

    /** determine trigger update or not */
    // page's display ratio still not trigger update
    if (intersectionRatio >= TRIGGER_UPDATE_RATIO) return;

    if (!containerRef) return;
    const direction: Parameters<typeof handleReadingInfoChange>[0] = boundingClientRect.top > 0 ? 'prev' : 'next';
    const previousReading = currentReading;
    const previousContainerScrollTop = containerRef.scrollTop;
    const previousReadingElementClientTop = currentReadingElementClientTop;

    handleReadingInfoChange(
      direction,
      // use `requestAnimationFrame` instead of `queueMicroTask`,
      // for deferring data update closer to rendering.
      (nextReading) => requestAnimationFrame(() => {
        if (!containerRef) return;
        const currentContainerScrollTop = containerRef.scrollTop;
        // scrollTop has changed after update pages and before rerender(rAF call)
        const scrollOffset = currentContainerScrollTop - previousContainerScrollTop;

        const displayElements = getDisplayElements(containerRef);
        if (!displayElements) return;
        const elementsScrolledUp = displayElements.filter(
          (e) => isBeforeCurrentPage(previousReading, e.pageInfo),
        );

        const nextReadingElement = displayElements.find(
          (e) => isSamePageImage(nextReading, e.pageInfo),
        );
        if (!nextReadingElement) return;

        // DEBUG:
        console.log(
          Date.now(),
          '🍟',
          JSON.parse(JSON.stringify([
            previousReading.chapterIndex,
            previousReading.pageIndex,
          ])),
          JSON.parse(JSON.stringify({
            currentReadingElementClientTop,
            previousReadingElementClientTop,
            scrolledPreviousReadingElementClientTop: previousReadingElementClientTop - scrollOffset,
            nextReadingElement: JSON.parse(JSON.stringify(nextReadingElement)),
            elementsScrolledUp: JSON.parse(JSON.stringify(elementsScrolledUp)),
            displayElements: JSON.parse(JSON.stringify(displayElements)),
          })),
        );

        const nextContainerScrollTop = calcScrollTop(
          elementsScrolledUp,
          previousReadingElementClientTop - scrollOffset,
        );
        containerRef?.scrollTo({ top: nextContainerScrollTop });

        const elementsBeforeNextReading = displayElements.filter(
          (e) => isBeforeCurrentPage(nextReadingElement.pageInfo, e.pageInfo),
        );
        // DEBUG:
        console.log(
          Date.now(),
          '🌧',
          JSON.parse(JSON.stringify({
            nextContainerScrollTop,
            elementsBeforeNextReading,
            nextClientTop: elementsBeforeNextReading.reduce(
              (sum, e) => sum + e.height,
              -nextContainerScrollTop,
            ),
          })),
        );
        // previous elements' height sum - next container's scrollTop
        const nextReadingElementClientTop = elementsBeforeNextReading.reduce(
          (sum, e) => sum + e.height,
          -nextContainerScrollTop,
        );
        currentReadingElementClientTop = nextReadingElementClientTop;

        // only for ios safari
        requestAnimationFrame(() => {
          containerRef?.scrollTo({ top: nextContainerScrollTop });
          currentReadingElementClientTop = nextReadingElementClientTop;
        });
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
              // onLoadStart={() => handlePageStartLoad(page)}
              onIntersect={(info) => handlePageIntersect({ ...info, pageInfo: page })}
            />
          ) }
        </For>
      </div>
    </Show>
  );
};

export default Reader;
