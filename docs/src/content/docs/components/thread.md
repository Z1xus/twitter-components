---
title: twitter-thread
description: A list of posts with lines connecting replies.
---

A list of posts with lines connecting replies.

## Data

Assign a `TwitterThread` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-thread')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

- `default`

## CSS parts

- `thread`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
