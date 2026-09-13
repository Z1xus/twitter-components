---
title: twitter-media
description: One to four images with alt text.
---

One to four images with alt text.

## Data

Assign a `TwitterImage[]` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-media')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

This component has no slots. Place a replacement in a post slot.

## CSS parts

- `media`
- `image`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
