---
title: twitter-avatar
description: A profile image, or the author's initial when no image is set.
---

A profile image, or the author's initial when no image is set.

## Data

Assign a `TwitterAvatar` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-avatar')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

This component has no slots. Place a replacement in a post slot.

## CSS parts

- `image`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
