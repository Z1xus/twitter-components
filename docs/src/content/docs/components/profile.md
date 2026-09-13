---
title: twitter-profile
description: A profile with a banner, bio, and follower counts.
---

A profile with a banner, bio, and follower counts.

## Data

Assign a `TwitterProfile` object to `.data`. Assign display settings to `.options`. Reassign the object to update the component.

```js
import 'twitter-components/register'
const element = document.querySelector('twitter-profile')
element.data = data
element.options = { theme: 'dark', countFormat: 'full' }
```


## Example

```js
import { renderTwitterProfile } from 'twitter-components/server'

const html = renderTwitterProfile({
  author: 'John Doe',
  handle: 'john_doe',
  avatar: '/avatar.svg',
  bio: 'would you look at that! i can make fake tweets',
  following: 42,
  followers: '1.2K',
  joined: 'September 2026'
})
```

Use the default slot for posts below the profile. The actions slot is empty until you supply controls.

## Slots

- `banner`
- `avatar`
- `actions`
- `bio`
- `details`
- `stats`
- `default`

## CSS parts

- `profile`
- `banner`
- `avatar`
- `identity`
- `bio`
- `details`
- `stats`

See [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.
