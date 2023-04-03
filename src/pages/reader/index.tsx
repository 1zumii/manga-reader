import {
  Component, createEffect, JSX, Show,
} from 'solid-js';
import PageImage from '$components/page-image';
import UrlTransformer from '$src/data/url-transformer';
import useMangaInfo, { generatePageImageId } from './use-manga-info';
import styles from './style.module.less';

/**
 * https://juejin.cn/post/7132277540806213645
 * https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
 * https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
 */

// TODO: 滚动的时候，监听挂载的 img 元素
// 一旦有加载好的，重置当前元素被卷起的高度
// 使得图片加载好的时候，当前图片不会发生位移
// 可考虑 requestAnimationFrame

type ScrollEventCallback = NonNullable<JSX.CustomEventHandlersCamelCase<HTMLDivElement>['onScroll']>

const Reader: Component = () => {
  const { info, isLoading } = useMangaInfo();

  createEffect(() => {
    console.log('🚀', info());
  });

  // TODO: 维护一个 currentReading，当有另外的页的 Rect.top 小于 50vh 时，更新 buffer list，且静默更新 url

  const handleScroll: ScrollEventCallback = (e) => {
    console.log(e);
  };

  return (
    <Show when={!isLoading}>
      <div
        class={styles.readView}
        onScroll={handleScroll}
      >
        <PageImage
          src={UrlTransformer.getPageImage({
            mangaId: info()!.id,
            chapterIndex: 14,
            pageIndex: 5,
          })}
          id={generatePageImageId({
            mangaId: info()!.id,
            chapterIndex: 14,
            pageIndex: 5,
          })}
          onLoaded={() => { console.log('lll'); }}
        />
      </div>
    </Show>
  );
};

export default Reader;
