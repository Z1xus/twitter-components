---
title: twitter-post
description: A post with slots for replacing its parts.
---

A post with slots for replacing its parts.

## Data

Assign a `TwitterPost` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-post')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

- `default`
- `avatar`
- `header`
- `media`
- `quote`
- `card`
- `actions`
- `footer`

## CSS parts

- `post`
- `details`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
