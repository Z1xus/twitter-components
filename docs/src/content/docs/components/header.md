---
title: twitter-header
description: Author, handle, date, and source menu.
---

Author, handle, date, and source menu.

## Data

Assign a `TwitterHeader` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-header')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

This component has no slots. Place a replacement in a post slot.

## CSS parts

- `header`
- `author`
- `handle`
- `date`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
