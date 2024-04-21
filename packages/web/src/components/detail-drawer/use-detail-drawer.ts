import type { MangaInfo } from "@manga-reader/common";
import { createSignal } from "solid-js";

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

export default useDetailDrawer;
