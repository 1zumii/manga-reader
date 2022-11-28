import { Component, JSX } from 'solid-js';
import styles from './style.module.less';

type Props = {
  class?: string;
  onSearch: (searchValue: string) => void;
}

const SearchPanel: Component<Props> = (props) => {
  let inputRef: HTMLInputElement;

  const handleSearch: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.code !== 'Enter') return;
    // DEBUG:
    console.log(inputRef.value);
    props.onSearch(inputRef.value);
  };

  return (
    <div
      class={styles.searchPanel}
      classList={{ [props.class!]: !!props.class }}
    >
      <div class={styles.prefixIcon} />
      <input ref={inputRef!} class={styles.input} type="text" onKeyUp={handleSearch} />
    </div>
  );
};

export default SearchPanel;
