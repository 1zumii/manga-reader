import type { Component, JSX } from "solid-js";
import { For, createEffect, createSignal } from "solid-js";

import SearchPanel from "./components/search-panel";
import styles from "./style.module.less";

import MangaDetailDrawer from "$components/detail-drawer";
import useDetailDrawer from "$components/detail-drawer/use-detail-drawer";
import UrlTransformer from "$src/data/url-transformer";
import { useMangaResource } from "$src/data/use-manga-resource";
import type { MangaInfo } from "$types/manga";

const useMangaListWithSearch = () => {
  const mangaResource = useMangaResource();
  const mangaListAll = () => mangaResource() ?? [];

  const [searchResult, setSearchResult] = createSignal<MangaInfo[]>(mangaListAll());

  const handleSearch = (searchValue: string): void => {
    if (!searchValue) {
      setSearchResult(mangaListAll());
      return;
    }
    const nextMangaList = (mangaListAll()).filter(({ title }) => title.includes(searchValue));
    setSearchResult(nextMangaList);
  };

  createEffect(() => {
    if (mangaResource.loading) {
      return;
    }
    setSearchResult(mangaListAll());
  });

  return { mangaList: searchResult, isLoading: mangaResource.loading, handleSearch };
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
                loading="lazy"
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
