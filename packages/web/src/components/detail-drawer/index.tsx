import type {
  Component,
  JSX,
} from "solid-js";
import {
  For,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";

import type { MangaChapter, MangaInfo } from "@manga-reader/common";
import UrlTransformer from "../../data/url-transformer";
import { getReaderNavigateLink } from "../../router";
import styles from "./style.module.less";

type Props = {
  info?: MangaInfo;
  onClose: () => void;
};

const MangaDetailDrawer: Component<Props> = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  const renderChapterList = (chapters: MangaChapter[], mangaId: MangaInfo["id"]): JSX.Element => (
    <For each={chapters}>
      { ({ name, index: chapterIndex }) => (
        <a
          class={styles.chapter}
          target="_blank"
          rel="noreferrer"
          href={`${window.location.pathname}#${getReaderNavigateLink({ mangaId, chapterIndex, pageIndex: 1 })}`}
        >
          { name }
        </a>
      ) }
    </For>
  );

  return (
    <Portal mount={document.getElementById("root") ?? undefined}>
      <Show when={props.info}>
        {
          (info) => (
            <>
              <div class={styles.bgMask} onClick={handleClose} />
              <div class={styles.detailDrawer}>
                <div class={styles.briefInfo}>
                  <img src={UrlTransformer.getCover(info().id)} alt="cover" />
                  <h5>{ info().title }</h5>
                </div>
                <div class={styles.chapterList}>
                  { renderChapterList(info().chapters, info().id) }
                </div>
              </div>
            </>
          )
        }
      </Show>
    </Portal>
  );
};

export default MangaDetailDrawer;
