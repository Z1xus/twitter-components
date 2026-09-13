---
title: twitter-actions
description: Action buttons and counts. Actions can open links or send events.
---

Action buttons and counts. Actions can open links or send events.

## Data

Assign a `TwitterPost` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-actions')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

This component has no slots. Place a replacement in a post slot.

## CSS parts

- `actions`
- `action`
- `count`
- `reply`
- `repost`
- `quote`
- `like`
- `views`
- `bookmark`
- `share`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
