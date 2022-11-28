import {
  ParentComponent, createSignal, createContext, useContext, Accessor,
} from 'solid-js';
import useData, { MangaInfo } from '$src/data/use-data';

const data = useData();
const DEFAULT_MANGA_LIST = data;

type ContextStore = {
  mangaList: Accessor<MangaInfo[]>;
  onSearch: (searchValue: string) => void;
}

const MangaListContext = createContext<ContextStore>({
  mangaList: () => DEFAULT_MANGA_LIST,
  onSearch: () => console.error('Solid Error: use context before Provider'),
});

export const MangaListProvider: ParentComponent = (props) => {
  const [mangaList, setMangaList] = createSignal(DEFAULT_MANGA_LIST);

  const handleSearch = (searchValue: string): void => {
    if (!searchValue) {
      setMangaList(DEFAULT_MANGA_LIST);
      return;
    }
    const nextMangaList = mangaList().filter(({ title }) => title.includes(searchValue));
    setMangaList(nextMangaList);
  };

  return (
    <MangaListContext.Provider value={{ mangaList, onSearch: handleSearch }}>
      { props.children }
    </MangaListContext.Provider>
  );
};

export const useMangaList = () => useContext(MangaListContext);
