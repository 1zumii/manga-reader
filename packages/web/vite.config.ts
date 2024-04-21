import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  base: "/manga-reader/",
  plugins: [solidPlugin()],
  server: {
    port: 7900,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: [
      { find: "$components", replacement: "/src/components" },
      { find: "$pages", replacement: "/src/pages" },
      { find: "$utils", replacement: "/src/utils" },
      { find: "$types", replacement: "/src/types" },
      { find: "$src", replacement: "/src" },
    ],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
