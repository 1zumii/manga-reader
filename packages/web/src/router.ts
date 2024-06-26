import type { MangaPageImage } from "@manga-reader/common";
import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/home")),
  },
  {
    path: "/read/:mangaId/:chapterIndex/:pageIndex",
    component: lazy(() => import("./pages/reader")),
  },
];

export const getReaderNavigateLink = (to: MangaPageImage): string => {
  const { mangaId, chapterIndex, pageIndex } = to;
  return `/read/${mangaId}/${chapterIndex}/${pageIndex}`;
};

export const getReaderUrlParams = (): Record<keyof MangaPageImage, string> => {
  const path = window.location.hash;
  const paramList = path.split("/read/")[1]?.split("/");
  return {
    mangaId: paramList[0],
    chapterIndex: paramList[1],
    pageIndex: paramList[2],
  };
};

// update url but not trigger page reload
export const updateReaderUrlParams = (next: MangaPageImage): void => {
  const nextRoute = `${window.location.pathname}#${getReaderNavigateLink(next)}`;
  window.history.replaceState({}, "", nextRoute);
};

export default routes;
