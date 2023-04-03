import { A as Link } from '@solidjs/router';
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

  const renderChapterList = (chapters: MangaChapter[], infoId: MangaInfo['id']): JSX.Element => (
    <For each={chapters}>
      { ({ name }, index) => (
        <Link
          class={styles.chapter}
          href={getReaderNavigateLink({ mangaId: infoId, chapterIndex: index() + 1, pageIndex: 1 })}
        >
          { name }
        </Link>
      ) }
    </For>
  );

  return (
    <Portal mount={document.getElementById('root') ?? undefined}>
      <Show when={props.info}>
        <div class={styles.bgMask} onClick={handleClose} />
        <div class={styles.detailDrawer}>
          <div class={styles.briefInfo}>
            <img src={UrlTransformer.getCover(props.info!.id)} alt="cover" />
            <h5>{ props.info!.title }</h5>
          </div>
          <div class={styles.chapterList}>
            { renderChapterList(props.info!.chapters, props.info!.id) }
          </div>
        </div>
      </Show>
    </Portal>
  );
};

export default MangaDetailDrawer;
