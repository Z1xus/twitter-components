---
title: Composition and events
description: Replace regions and control actions without a fork.
---

## Replace one region

Each post has slots for its avatar, header, media, quote, card, actions, and footer. The default slot replaces the text. Your light DOM stays in place when data or settings change.

```html
<twitter-post id="post">
  <a slot="footer" href="/posts">More posts</a>
  <twitter-actions
    slot="actions"
    id="actions"
    action-mode="event"
  ></twitter-actions>
</twitter-post>
```

```js
post.data = data;
actions.data = data;
actions.options = { actions: ["reply", "like", "share"] };
```

Each component has its own `.data` and `.options`. Components placed in slots use their own settings. Thread options apply to the posts generated from thread data.

## Control an action

```js
post.options = { actionMode: "event" };
post.addEventListener("twitter-action", (event) => {
  const { action, postId, count, selected } = event.detail;
  if (action === "like") {
    const liked = !selected;
    post.data = {
      ...post.data,
      state: { ...post.data.state, liked },
      stats: { ...post.data.stats, likes: (count ?? 0) + (liked ? 1 : -1) },
    };
  }
});
```

This handler changes the post's local data. Save the change in your app if it needs to persist. The library does not send likes to X or update counts automatically.

`twitter-action` bubbles across shadow roots and is cancelable. Call `preventDefault()` to cancel link navigation or copying in link mode. `twitter-copy` reports a copied URL. `twitter-error` reports invalid data, invalid settings, or copy errors. Invalid updates keep the last successful render.

## Style a region

```css
twitter-post {
  --twitter-font-family: Arial;
  --twitter-accent: #1d9bf0;
}
twitter-post::part(post) {
  padding: 16px;
}
twitter-actions::part(count) {
  font-weight: 600;
}
```

The inherited CSS variables are `--twitter-bg`, `--twitter-fg`, `--twitter-muted`, `--twitter-border`, `--twitter-thread-line`, `--twitter-accent`, and `--twitter-font-family`. Each component page lists its CSS parts. Put a component in a slot to style its parts from your stylesheet. Shadow DOM keeps page styles from affecting the rest of the post.

Set `--twitter-font-family` to use your own font. The default uses system fonts. Chirp files are not included.

## Partial post data

Omit `url` or `timestamp` when they are unknown. Without a URL, link actions and the source menu stay inactive. Use `dateLabel` for a date copied from a screenshot. It takes precedence over the formatted timestamp.

Set `id` and `replyTo` to connect posts without source URLs. IDs must be unique within the thread. Preformatted counts such as `2.9K` retain their precision. They are not converted to exact numbers or added to other counts.
