import {
  createContext, createResource, ParentComponent, Resource, useContext,
} from 'solid-js';

export type MangaChapter = {
  name: string;
  total: number;
}

export type MangaInfo = {
  id: string;
  title: string;
  chapters: MangaChapter[];
}

const OSS_BUCKET: string = import.meta.env.VITE_ALI_OSS_BUCKET;
const DATA_FILE: string = 'manga-info.json';

const fetchMangaInfoFromAliOss = async (): Promise<MangaInfo[]> => {
  try {
    const response = await fetch(
      `https://${OSS_BUCKET}/${DATA_FILE}`,
      {
        method: 'GET', // ali-oss only accept `get`
        headers: { Accept: 'application/json' },
      },
    );
    if (response.status !== 200) throw new Error(`request status is ${response.status}`);

    const responseData = await response.json() as MangaInfo[];
    return responseData;
  } catch (error) {
    console.error('fetch from ali-oss failed', '\n', error);
    return [];
  }
};

const CONTEXT_DEFAULT_PENDING = (() => undefined) as Resource<MangaInfo[]>;
CONTEXT_DEFAULT_PENDING.state = 'pending';
CONTEXT_DEFAULT_PENDING.loading = true;
const context = createContext<Resource<MangaInfo[]>>(CONTEXT_DEFAULT_PENDING);
const { Provider } = context;

const MangaInfoProvider: ParentComponent = (props) => {
  const [data] = createResource(fetchMangaInfoFromAliOss);

  return (
    <Provider value={data}>
      { props.children }
    </Provider>
  );
};

export const useMangaInfo = () => useContext(context);

export default MangaInfoProvider;
