import {
  Component, createSignal, onCleanup, onMount,
} from 'solid-js';
import generateObserveThresholds from '$utils/observe-threshold';
import styles from './style.module.less';

export type Props = {
    src: string;
    id: string;
    alt?: string;
    /** `<img>` size is determinate, start to load image content */
    onLoadStart?: () => void;
    /** image content loaded ➡️ `htmlImageElement.complete = true` */
    onLoaded?: () => void;
    /** image loaded error */
    onError?: () => void;
    /** IntersectionObserver's callback */
    onIntersect?: (
      intersectInfo: Pick<IntersectionObserverEntry, 'boundingClientRect' | 'intersectionRatio' | 'isIntersecting'>
    ) => void;
    /** intersection's relative root element ➡️ `IntersectionObserver.option.root` */
    containerRef?: IntersectionObserverInit['root'];
}

const PageImage: Component<Props> = (props) => {
  let imageRef: HTMLImageElement | undefined;
  const [status, setStatus] = createSignal<'unload' | 'loading' | 'loaded' | 'error'>('unload');

  // cancel <img> request
  const cancelImgRequest = () => {
    if (!imageRef) return;
    imageRef.src = '';
  };
  onCleanup(cancelImgRequest); // cancel at component unmounted
  /* createEffect(on( // cancel at id changes
    () => props.id,
    cancelImgRequest,
  )); */

  const handleLoaded = () => {
    setStatus('loaded');
    props.onLoaded?.();
  };

  const handleError = () => {
    setStatus('error');
    props.onError?.();
  };

  // observer <img> request status
  const resizeObserver = new ResizeObserver(
    (observeEntries) => {
      observeEntries.forEach((entry) => {
        const imgHeight = entry.contentBoxSize[0].blockSize;
        const currentStatus = status();
        // once <img>'s auto request get response, <img> will be resize to image's size
        // <img> height is 0 means this request hasn't get response
        if (currentStatus !== 'unload' || imgHeight === 0) return;
        props.onLoadStart?.();
        setStatus('loading');
      });
    },
  );
  onMount(() => {
    if (!imageRef) return;
    resizeObserver.observe(imageRef);
  });
  onCleanup(() => resizeObserver.disconnect());

  // observer PageImage display
  let wrapperRef: HTMLDivElement | undefined;
  const intersectionObserver = new IntersectionObserver(
    (observeEntries) => {
      observeEntries.forEach((entry) => {
        const { boundingClientRect, intersectionRatio, isIntersecting } = entry;
        props.onIntersect?.({ boundingClientRect, intersectionRatio, isIntersecting });
      });
    },
    { threshold: generateObserveThresholds(0.0001) },
  );
  onMount(() => {
    if (!wrapperRef) return;
    intersectionObserver.observe(wrapperRef);
  });
  onCleanup(() => intersectionObserver.disconnect());

  return (
    <div
      class={styles.image}
      classList={{
        [styles.unload]: status() === 'unload',
        [styles.loading]: status() === 'loading',
      }}
      ref={wrapperRef}
      data-id={props.id}
    >
      { /* DEBUG: */ }
      { /* <pre
        style={{
          position: 'absolute',
          'z-index': 10,
          padding: '8px',
          'font-size': '16px',
          'border-radius': '5px',
          'backdrop-filter': 'blur(25px)',
          '-webkit-backdrop-filter': 'blur(25px)',
          width: '100%',
          'overflow-x': 'scroll',
        }}
      >
        { props.id }
      </pre> */ }
      <img
        // loading='lazy' // TODO: 需要实验
        ref={imageRef}
        src={props.src}
        alt={props.alt}
        onLoad={handleLoaded}
        onError={handleError}
      />
    </div>

  );
};

export default PageImage;
