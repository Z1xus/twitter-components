import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc from "starlight-typedoc";
import baseLinks from "./remark-base-links.mjs";
const base = process.env.DOCS_BASE_PATH || "/";
export default defineConfig({
  site: "https://z1xus.github.io",
  base,
  cacheDir: process.env.DOCS_BASE_PATH
    ? "./node_modules/.astro-pages"
    : "./node_modules/.astro",
  vite: {
    cacheDir: new URL(
      process.env.DOCS_BASE_PATH
        ? "./node_modules/.vite-pages"
        : "./node_modules/.vite",
      import.meta.url,
    ).pathname,
  },
  trailingSlash: "always",
  markdown: { remarkPlugins: [[baseLinks, { base }]] },
  integrations: [
    starlight({
      title: "Twitter Components",
      favicon: "/avatar.svg",
      tableOfContents: false,
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/z1xus/twitter-components",
        },
        {
          icon: "seti:npm",
          label: "npm",
          href: "https://www.npmjs.com/package/twitter-components",
        },
      ],
      components: {
        Footer: "./src/components/Footer.astro",
        PageFrame: "./src/components/PageFrame.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
      },
      customCss: ["./src/styles.css"],
      sidebar: [
        {
          label: "Start",
          items: [
            { slug: "index" },
            { slug: "playground" },
            { slug: "composition" },
            { slug: "frameworks" },
            { slug: "settings" },
            { slug: "development" },
          ],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "API",
          items: [
            { label: "Overview", slug: "api/readme" },
            {
              label: "Web components",
              items: [
                { label: "Exports", slug: "api/elements/readme" },
                {
                  label: "Classes",
                  items: [
                    { autogenerate: { directory: "api/elements/classes" } },
                  ],
                },
                {
                  label: "Functions",
                  items: [
                    { autogenerate: { directory: "api/elements/functions" } },
                  ],
                },
              ],
            },
            {
              label: "Data and rendering",
              items: [
                { label: "Exports", slug: "api/index/readme" },
                {
                  label: "Functions",
                  items: [
                    { autogenerate: { directory: "api/index/functions" } },
                  ],
                },
                {
                  label: "Interfaces",
                  items: [
                    { autogenerate: { directory: "api/index/interfaces" } },
                  ],
                },
                {
                  label: "Types",
                  items: [
                    { autogenerate: { directory: "api/index/type-aliases" } },
                  ],
                },
                {
                  label: "Variables",
                  items: [
                    { autogenerate: { directory: "api/index/variables" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            new URL("../src/index.ts", import.meta.url).pathname,
            new URL("../src/elements.ts", import.meta.url).pathname,
          ],
          tsconfig: new URL("../tsconfig.json", import.meta.url).pathname,
          typeDoc: {
            readme: new URL("./api.md", import.meta.url).pathname,
            excludePrivate: true,
            excludeProtected: true,
            disableSources: true,
            excludeExternals: true,
          },
        }),
      ],
    }),
  ],
});
