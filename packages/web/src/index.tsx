/* @refresh reload */
import { Router, hashIntegration, useRoutes } from "@solidjs/router";
import type { Component } from "solid-js";
import { render } from "solid-js/web";
import MangaInfoProvider from "./data/use-manga-resource";
import routes from "./router";

import "./index.less";

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <>
      <Router source={hashIntegration()}>
        <MangaInfoProvider>
          <Routes />
        </MangaInfoProvider>
      </Router>
    </>
  );
};

render(
  () => <App />,
  document.getElementById("root") as HTMLElement,
);
