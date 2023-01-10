import { createSignal, For } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import UrlTransformer from '$src/data/url-transformer';
import { MangaInfo, useMangaInfo } from '$src/data/use-manga-info';
import MangaDetailDrawer from './components/detail-drawer';
import SearchPanel from './components/search-panel';
import styles from './style.module.less';

const useMangaListWithSearch = () => {
  const mangaListResource = useMangaInfo();
  const allMangaList = () => mangaListResource() ?? [];

  const [searchResult, setSearchResult] = createSignal(allMangaList());

  const handleSearch = (searchValue: string): void => {
    if (!searchValue) {
      setSearchResult(allMangaList());
      return;
    }
    const nextMangaList = (allMangaList()).filter(({ title }) => title.includes(searchValue));
    setSearchResult(nextMangaList);
  };

  return { mangaList: searchResult, isLoading: mangaListResource.loading, handleSearch };
};

const useDetailDrawer = () => {
  const [currentDetail, setCurrentDetail] = createSignal<MangaInfo | undefined>();

  const openDrawer = (info: MangaInfo): void => {
    setCurrentDetail(info);
  };

  const closeDrawer = (): void => {
    setCurrentDetail(undefined);
  };

  return { currentDetail, openDrawer, closeDrawer };
};

const Home: Component = () => {
  const { mangaList, handleSearch } = useMangaListWithSearch();
  const {
    currentDetail: currentMangaDetail,
    openDrawer: openMangaDetailDrawer,
    closeDrawer: closeMangaDetailDrawer,
  } = useDetailDrawer();

  const renderMangaBaseInfoList = (): JSX.Element => (
    <div class={styles.baseInfoList}>
      <For each={mangaList()}>
        { (info) => {
          const latestChapter = info.chapters[info.chapters.length - 1];
          return (
            <div class={styles.card} onClick={[openMangaDetailDrawer, info]}>
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
        onClose={closeMangaDetailDrawer}
      />
    </div>
  );
};

export default Home;
