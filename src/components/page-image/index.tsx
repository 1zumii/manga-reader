import { Component, createSignal, onMount } from 'solid-js';
import styles from './style.module.less';

type Props = {
    src: string;
    id: string;
    alt?: string;
    onLoaded?: () => void;
    onError?: () => void;
}

const PageImage: Component<Props> = (props) => {
  const [status, setStatus] = createSignal<'loading' | 'load' | 'error'>('load');

  onMount(() => setStatus('loading'));

  const handleLoaded = () => {
    setStatus('load');
    props.onLoaded?.();
  };

  const handleError = () => {
    setStatus('error');
    props.onError?.();
  };

  return (
    <div
      class={styles.image}
      classList={{ [styles.loading]: status() === 'loading' }}
    >
      <img
        src={props.src}
        alt={props.alt}
        onLoad={handleLoaded}
        onError={handleError}
        data-id={props.id}
      />
    </div>

  );
};

export default PageImage;
