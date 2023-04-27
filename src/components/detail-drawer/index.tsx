import {
  Component, JSX, Show, For,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import UrlTransformer from '$src/data/url-transformer';
import { getReaderNavigateLink } from '$src/router';
import { MangaChapter, MangaInfo } from '$types/manga';
import styles from './style.module.less';

type Props = {
  info?: MangaInfo;
  onClose: () => void;
}

const MangaDetailDrawer: Component<Props> = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  const renderChapterList = (chapters: MangaChapter[], mangaId: MangaInfo['id']): JSX.Element => (
    <For each={chapters}>
      { ({ name, index: chapterIndex }) => (
        <a
          class={styles.chapter}
          target='_blank'
          rel="noreferrer"
          href={`${window.location.pathname}#${getReaderNavigateLink({ mangaId, chapterIndex, pageIndex: 1 })}`}
        >
          { name }
        </a>
      ) }
    </For>
  );

  return (
    <Portal mount={document.getElementById('root') ?? undefined}>
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
