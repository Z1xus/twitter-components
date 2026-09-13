---
title: Settings
description: Every shared display option and its default.
---

Use camelCase keys in `.options` or the HTML attributes below. An attribute overrides the matching object setting. Remove it to use the object value again. Boolean attributes accept `false`. An empty boolean attribute means true.

| HTML attribute | JavaScript key | Default |
| --- | --- | --- |
| `theme` | `theme` | `"dark"` |
| `layout` | `layout` | `"timeline"` |
| `density` | `density` | `"comfortable"` |
| `count-format` | `countFormat` | `"compact"` |
| `show-zero-counts` | `showZeroCounts` | `false` |
| `show-bookmark-count` | `showBookmarkCount` | `false` |
| `actions` | `actions` | `["reply","repost","like","views","bookmark","share"]` |
| `action-mode` | `actionMode` | `"static"` |
| `repost-count` | `repostCount` | `"combined"` |
| `date-format` | `dateFormat` | `"short"` |
| `locale` | `locale` | `"en-US"` |
| `time-zone` | `timeZone` | `"UTC"` |
| `reference-time` | `referenceTime` | `undefined` |
| `show-media` | `showMedia` | `true` |
| `show-grok` | `showGrok` | `true` |
| `show-menu` | `showMenu` | `false` |
| `show-connections` | `showConnections` | `true` |
| `media-fit` | `mediaFit` | `"contain"` |
| `media-max-height` | `mediaMaxHeight` | `510` |
| `link-target` | `linkTarget` | `"_blank"` |

## Counts

`compact` uses locale-aware abbreviations. `full` uses group separators. `hidden` hides the visible value but keeps the exact accessible label. Missing values remain unknown. A preformatted string such as `2.9K` keeps its original precision in every count format. `showZeroCounts` controls whether zero values appear.

Store raw reposts in `stats.reposts` and quotes in `stats.quotes`. The repost count combines them by default. Set `repostCount: 'reposts'` for reposts alone. The optional quote action always shows quotes alone.

## Actions

Pass an ordered array of `reply`, `repost`, `quote`, `like`, `views`, `bookmark`, and `share`. An empty array hides all actions. `link` opens the original post and enables copy-link. `event` sends an event for your app to handle. `static` displays values without active controls. Counts change only when your app updates the data.

In detail layout, views appear beside the timestamp instead of repeating in the action row.

## Dates and media

Relative dates require an explicit ISO `referenceTime` so server and browser output agree. Supply a new reference time to refresh the label. Posts support one to four images with alt text. Video playback and live X data fetching are not part of version 0.1.
