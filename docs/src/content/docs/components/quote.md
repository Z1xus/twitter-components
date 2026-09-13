---
title: twitter-quote
description: A quoted post.
---

A quoted post.

## Data

Assign a `NonNullable<TwitterPost['quote']>` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-quote')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```

## Slots

This component has no slots. Place a replacement in a post slot.

## CSS parts

Use inherited CSS custom properties to style this component.

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
