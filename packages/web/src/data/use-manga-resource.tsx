import type { ParentComponent, Resource } from "solid-js";
import {
  createContext,
  createResource,
  useContext,
} from "solid-js";

import type { MangaInfo } from "@manga-reader/common";
import { DATA_FILE } from "@manga-reader/common";

const OSS_BUCKET: string = import.meta.env.VITE_ALI_OSS_BUCKET_URL;

const fetchMangaResourceFromAliOss = async (): Promise<MangaInfo[]> => {
  try {
    const response = await fetch(
      `https://${OSS_BUCKET}/${DATA_FILE}`,
      {
        method: "GET", // ali-oss only accept `get`
        headers: { Accept: "application/json" },
      },
    );
    if (response.status !== 200) {
      throw new Error(`request status is ${response.status}`);
    }

    const responseData = await response.json() as MangaInfo[];
    return responseData;
  } catch (error) {
    console.error("fetch from ali-oss failed", "\n", error);
    return [];
  }
};

// TODO: maybe there is not need to do so much work,
// to exclude `undefined` from context default value
const CONTEXT_DEFAULT_PENDING = (() => undefined) as Resource<MangaInfo[]>;
CONTEXT_DEFAULT_PENDING.state = "pending";
CONTEXT_DEFAULT_PENDING.loading = true;
const context = createContext<Resource<MangaInfo[]>>(CONTEXT_DEFAULT_PENDING);
const { Provider } = context;

const MangaResourceProvider: ParentComponent = (props) => {
  const [data] = createResource(fetchMangaResourceFromAliOss);

  return (
    <Provider value={data}>
      { props.children }
    </Provider>
  );
};

export const useMangaResource = () => useContext(context);

export default MangaResourceProvider;
