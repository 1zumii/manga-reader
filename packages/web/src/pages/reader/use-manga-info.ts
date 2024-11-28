import { createEffect, createMemo } from "solid-js";
import { useMangaResource } from "../../data/use-manga-resource";
import { getInitReadingInfo } from "./utils";

const useMangaInfo = () => {
  const mangaResource = useMangaResource();

  const currentManga = createMemo(() => {
    if (mangaResource.state !== "ready") {
      return undefined;
    }
    const current = getInitReadingInfo();
    if (!current) {
      return undefined;
    }

    return mangaResource().find((m) => m.id === current.mangaId);
  });

  createEffect(() => {
    const manga = currentManga();
    if (!manga) {
      return;
    }
    document.title = manga.title;
  });

  return {
    currentManga,
  };
};

export default useMangaInfo;
