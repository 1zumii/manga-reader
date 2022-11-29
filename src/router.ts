import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

const URL_PREFIX = '/manga-reader';

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/home')),
  },
  {
    path: '/read/:id/:chapterNum',
    component: lazy(() => import('./pages/reader')),
  },
].map((route) => {
  const { path, ...restConfigs } = route;
  return {
    path: `${URL_PREFIX}${path}`,
    ...restConfigs,
  };
});

export default routes;
