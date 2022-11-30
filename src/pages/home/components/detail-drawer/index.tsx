import {
  Component, JSX, Show, For,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import UrlTransformer from '$src/data/url-transformer';
import { MangaInfo } from '$src/data/use-data';
import styles from './style.module.less';

type Props = {
    info?: MangaInfo;
    onClose: () => void;
}

const MangaDetailDrawer: Component<Props> = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  const renderChapterList = (): JSX.Element => (
    <For each={props.info!.chapters}>
      { ({ name }) => <div class={styles.chapter}>{ name }</div> }
    </For>
  );

  return (
    <Portal mount={document.getElementById('root') ?? undefined}>
      <Show when={props.info}>
        <div class={styles.bgMask} onClick={handleClose} />
        { !!props.info && (
        <div class={styles.detailDrawer}>
          <div class={styles.briefInfo}>
            <img src={UrlTransformer.getCover(props.info.id)} alt="cover" />
            <h5>{ props.info.title }</h5>
          </div>
          <div class={styles.chapterList}>{ renderChapterList() }</div>
        </div>
        ) }
      </Show>
    </Portal>
  );
};

export default MangaDetailDrawer;
