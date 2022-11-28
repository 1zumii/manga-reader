/* @refresh reload */
import { Router, useRoutes } from '@solidjs/router';
import type { Component } from 'solid-js';
import { render } from 'solid-js/web';
import { MangaListProvider } from '$pages/home/use-manga-list';
import routes from './router';
import './index.less';

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <>
      <Router>
        <MangaListProvider>
          <Routes />
        </MangaListProvider>
      </Router>
    </>
  );
};

render(
  () => <App />,
  document.getElementById('root') as HTMLElement,
);
