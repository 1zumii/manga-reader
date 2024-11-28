import type {
  Component,
  JSX,
} from "solid-js";
import {
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import generateObserveThresholds from "../../utils/observe-threshold";
import styles from "./style.module.less";

const renderDevFootprint = (id: string): JSX.Element => {
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    return <></>;
  }

  const footprintStyle: JSX.CSSProperties = {
    "position": "absolute",
    "padding": "10px",
    "margin": "10px",
    "font-size": "1.2rem",
    "z-index": 10,
    "border-radius": "5px",
    "backdrop-filter": "blur(25px)",
    "-webkit-backdrop-filter": "blur(25px)",
    "overflow-x": "scroll",
  };
  const info = JSON.parse(id);
  return (
    <pre style={footprintStyle}>
      <span style={{ color: "blue" }}>{ info.chapterIndex }</span>
      &nbsp;&nbsp;
      <span style={{ color: "deeppink" }}>{ info.pageIndex }</span>
    </pre>
  );
};

export type Props = {
  src: string;
  id: string;
  alt?: string;
  /** top in absolute position's list wrapper */
  offsetTop: number;
  /** `<img>` size is determinate, start to load image content */
  onLoadStart?: (imgHeight: number) => void;
  /** image content loaded ➡️ `htmlImageElement.complete = true` */
  onLoaded?: () => void;
  /** image loaded error */
  onError?: () => void;
  /** IntersectionObserver's callback */
  onIntersect?: (
    intersectInfo: Pick<IntersectionObserverEntry, "boundingClientRect" | "intersectionRatio" | "isIntersecting">
  ) => void;
  /** intersection's relative root element ➡️ `IntersectionObserver.option.root` */
  containerRef?: IntersectionObserverInit["root"];
};

const PageImage: Component<Props> = (props) => {
  let imageRef: HTMLImageElement | undefined;
  const [status, setStatus] = createSignal<"unload" | "loading" | "loaded" | "error">("unload");

  // cancel <img> request
  const cancelImgRequest = () => {
    if (!imageRef) {
      return;
    }
    imageRef.src = "";
  };
  onCleanup(cancelImgRequest); // cancel at component unmounted
  /* createEffect(on( // cancel at id changes
    () => props.id,
    cancelImgRequest,
  )); */

  const handleLoaded = () => {
    setStatus("loaded");
    props.onLoaded?.();
  };

  const handleError = () => {
    setStatus("error");
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
        if (currentStatus !== "unload" || imgHeight === 0) {
          return;
        }
        props.onLoadStart?.(imgHeight);
        setStatus("loading");
      });
    },
  );
  onMount(() => {
    if (!imageRef) {
      return;
    }
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
    if (!wrapperRef) {
      return;
    }
    intersectionObserver.observe(wrapperRef);
  });
  onCleanup(() => intersectionObserver.disconnect());

  return (
    <div
      class={styles.image}
      classList={{
        [styles.unload]: status() === "unload",
        [styles.loading]: status() === "loading",
      }}
      ref={wrapperRef}
      style={{ top: `${props.offsetTop}px` }}
      data-id={props.id}
    >
      { renderDevFootprint(props.id) }
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
