import { For } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import SearchPanel from '$components/search-panel';
import UrlTransformer from '$src/data/url-transformer';
import { useMangaList } from './use-manga-list';
import styles from './style.module.less';

const Home: Component = () => {
  const { mangaList, onSearch: handleSearch } = useMangaList();

  const renderMangaBaseInfoList = (): JSX.Element => (
    <div class={styles.baseInfoList}>
      <For each={mangaList()}>
        { ({
          id, title, coverUrl, chapters,
        }) => {
          const latestChapter = chapters[chapters.length - 1];
          return (
            <div class={styles.card}>
              <img
                class={styles.cover}
                src={UrlTransformer.getCover(coverUrl)}
                alt={`cover-${id}`}
              />
              <div class={styles.title} title={title}>{ title }</div>
              <div class={styles.description}>
                更新至「
                { latestChapter.name }
                」
              </div>
            </div>
          );
        } }
      </For>
    </div>
  );

  return (
    <div class={styles.home}>
      <SearchPanel onSearch={handleSearch} />
      { renderMangaBaseInfoList() }
    </div>
  );
};

export default Home;
