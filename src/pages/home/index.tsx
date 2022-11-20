import type { Component, JSX } from 'solid-js';
import { For } from 'solid-js';
import logo from './logo.svg';
import styles from './style.module.css';

const Home: Component = () => {
  const renderChapter = (): JSX.Element => {
    const url = 'https://www.cartoonmad.com/5e585/7654/152/';
    const pages = new Array(9).fill(0).map((_, i) => `00${i + 1}.jpg`);
    return (
      <For each={pages}>
        { (page) => <img src={`${url}${page}`} alt={`test-${page}`} /> }
      </For>
    );
  };

  return (
    <div class={styles.home}>
      <img src={logo} class={styles.logo} alt="logo" />
      { renderChapter() }
    </div>
  );
};

export default Home;
