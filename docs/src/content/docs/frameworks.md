---
title: Frameworks and server rendering
description: Use plain HTML, Svelte, React, Vue, or server-rendered markup.
---

## Svelte 5

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import type { TwitterPost } from 'twitter-components'
  import type { TwitterPostElement } from 'twitter-components/elements'
  let { data }: { data: TwitterPost } = $props()
  let element: TwitterPostElement
  onMount(async () => {
    const { defineTwitterComponents } = await import('twitter-components/elements')
    defineTwitterComponents()
    element.data = data
  })
  $effect(() => { if (element) element.data = data })
</script>

<twitter-post bind:this={element} theme="dark" />
```

## React

Register the components in a client effect, then assign data through a ref. For TypeScript JSX, declare the custom tag in your application's React JSX namespace using `React.HTMLAttributes<TwitterPostElement>` plus a typed `ref`. You don't need a React adapter.

```jsx
function Post({ data }) {
  const ref = useRef(null);
  useEffect(() => {
    let active = true;
    import("twitter-components/elements").then(
      ({ defineTwitterComponents }) => {
        defineTwitterComponents();
        if (active && ref.current) ref.current.data = data;
      },
    );
    return () => {
      active = false;
    };
  }, [data]);
  return <twitter-post ref={ref} theme="dark" />;
}
```

## Vue

Configure `compilerOptions.isCustomElement` to accept names that start with `twitter-`. Import `twitter-components/register` in the browser entry point. Bind structured data as a property with `<twitter-post :data.prop="post" />`.

## Server rendering

```ts
import { renderTwitterTimeline } from "twitter-components/server";
const html = renderTwitterTimeline(thread, { theme: "dark" });
```

Insert the returned HTML using your framework's raw HTML syntax. The renderer validates data and escapes text and URLs. Do not insert arbitrary user HTML. Declarative shadow DOM displays the initial page without JavaScript in current browsers. Import `twitter-components/register` in the browser for actions, updates, and templates inserted during client navigation.

The root and server entries do not access browser globals. Import the elements and register entries only in the browser. The library does not fetch post data. Images load from the URLs you provide.
