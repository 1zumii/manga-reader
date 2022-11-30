import { createSignal, For } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import UrlTransformer from '$src/data/url-transformer';
import useData, { MangaInfo } from '$src/data/use-data';
import MangaDetailDrawer from './components/detail-drawer';
import SearchPanel from './components/search-panel';
import styles from './style.module.less';

const DEFAULT_MANGA_LIST = useData();

const Home: Component = () => {
  const [mangaList, setMangaList] = createSignal(DEFAULT_MANGA_LIST);
  const [currentMangaDetail, setCurrentMangaDetail] = createSignal<MangaInfo | undefined>();

  const handleSearch = (searchValue: string): void => {
    if (!searchValue) {
      setMangaList(DEFAULT_MANGA_LIST);
      return;
    }
    const nextMangaList = mangaList().filter(({ title }) => title.includes(searchValue));
    setMangaList(nextMangaList);
  };

  const openMangaDetail = (info: MangaInfo): void => {
    setCurrentMangaDetail(info);
  };

  const closeMangaDetail = (): void => {
    setCurrentMangaDetail(undefined);
  };

  const renderMangaBaseInfoList = (): JSX.Element => (
    <div class={styles.baseInfoList}>
      <For each={mangaList()}>
        { (info) => {
          const latestChapter = info.chapters[info.chapters.length - 1];
          return (
            <div class={styles.card} onClick={[openMangaDetail, info]}>
              <img
                class={styles.cover}
                src={UrlTransformer.getCover(info.id)}
                alt={`cover-${info.id}`}
              />
              <div class={styles.title} title={info.title}>{ info.title }</div>
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
      <SearchPanel class={styles.searchPanel} onSearch={handleSearch} />
      { renderMangaBaseInfoList() }

      <MangaDetailDrawer
        info={currentMangaDetail()}
        onClose={closeMangaDetail}
      />
    </div>
  );
};

export default Home;
