import { createSignal } from "solid-js";
import type { MangaInfo } from "$types/manga";

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
