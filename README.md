# Twitter Components

<a href="https://www.npmjs.com/package/twitter-components"><picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/npm/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=dark"><img alt="npm version" src="https://www.shieldcn.dev/npm/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=light"></picture></a>
<a href="https://www.npmjs.com/package/twitter-components"><picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/npm/dw/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=dark"><img alt="Weekly downloads" src="https://www.shieldcn.dev/npm/dw/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=light"></picture></a>
<a href="https://www.npmjs.com/package/twitter-components"><picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/npm/dt/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=dark"><img alt="Total downloads" src="https://www.shieldcn.dev/npm/dt/twitter-components.svg?variant=secondary&amp;size=xs&amp;mode=light"></picture></a>

Add Twitter posts to your site using your own data.

[Documentation](https://z1xus.github.io/twitter-components/)

![an example tweet rendered with Twitter Components](/assets/preview.png)

## Install

```sh
bun add twitter-components
```

Also works with npm, pnpm, and Yarn.

## Use

```html
<twitter-post id="post" theme="dark"></twitter-post>
```

```js
import "twitter-components/register";

const post = document.querySelector("twitter-post");
post.data = {
  author: "John Doe",
  handle: "john_doe",
  url: "https://x.com/john_doe/status/1",
  timestamp: "2026-09-13T12:30:00Z",
  content: "would you look at that! i can make fake tweets",
  stats: { likes: 12480, views: 84947 },
};
```

Use `.options` for themes, counts, dates, media, and actions. Replace individual regions with slots. Render HTML on the server with `renderTwitterPost` or `renderTwitterTimeline` from `twitter-components/server`.

## Develop

```sh
bun install
bun run check
bun run docs:dev
bun run build
```

The same scripts work with npm, pnpm, and Yarn. Run `docs:build` for the static docs.

## Notes

This project is licensed under the MIT license. See [NOTICE.md](NOTICE.md) for design references used.  

Skyra-project's discord-components was a big inspiration for me to create this project.
