import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import { MangaPageImage } from '$src/types/manga';

export const URL_PREFIX = '/manga-reader';

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/home')),
  },
  {
    path: '/read/:mangaId/:chapterIndex/:pageIndex',
    component: lazy(() => import('./pages/reader')),
  },
].map((route) => {
  const { path, ...restConfigs } = route;
  return {
    path: `${URL_PREFIX}${path}`,
    ...restConfigs,
  };
});

export const getReaderNavigateLink = (to: MangaPageImage): string => {
  const { mangaId, chapterIndex, pageIndex } = to;
  return `${URL_PREFIX}/read/${mangaId}/${chapterIndex}/${pageIndex}`;
};

export const getReaderUrlParams = (): Record<keyof MangaPageImage, string> => {
  const path = window.location.pathname;
  const paramList = path.split('/read/')[1]?.split('/');
  return {
    mangaId: paramList[0],
    chapterIndex: paramList[1],
    pageIndex: paramList[2],
  };
};

export default routes;
