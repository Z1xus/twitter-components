import { resolveOptions, type TwitterOptions } from "../options.js";
import type { TwitterImage, TwitterPost } from "../schema.js";
import { element, escapeHtml, link } from "./base.js";
export function renderMedia(
  images: TwitterImage[],
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  if (!images.length) return "";
  const single = images.length === 1;
  const first = images[0];
  return element(
    "twitter-media",
    `
:host { margin-top:12px; }
.media { display:grid; grid-template-columns:${single ? "minmax(0,1fr)" : "repeat(2,minmax(0,1fr))"}; gap:2px; overflow:hidden; border:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); border-radius:16px; ${single && options.mediaFit === "contain" ? `width:min(100%,${Math.min(first.width, (options.mediaMaxHeight * first.width) / first.height)}px);` : single ? "width:100%;" : "aspect-ratio:16/9;"} }
a { display:block; min-width:0; min-height:0; }
img { display:block; width:100%; height:${single ? "auto" : "100%"}; object-fit:${options.mediaFit}; max-height:${options.mediaMaxHeight}px; }
.media.count-3 a:first-child { grid-row:span 2; }
`,
    `<div part="media" class="media count-${images.length}">${images
      .map((image) =>
        link(
          image.src,
          `<img part="image" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" />`,
          ` aria-label="Open image: ${escapeHtml(image.alt)}"`,
        ),
      )
      .join("")}</div>`,
  );
}
export function renderCard(card: NonNullable<TwitterPost["card"]>): string {
  return element(
    "twitter-card",
    `
:host { margin-top:12px; }
a { display:block; overflow:hidden; border:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); border-radius:16px; }
a:hover { text-decoration:none; background:#080808; }
img { display:block; width:100%; height:auto; aspect-ratio:1.91; object-fit:cover; border-bottom:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); }
.info { padding:12px; }
.domain,.description { color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); }
.title { margin-top:2px; }
.description { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
`,
    link(
      card.url,
      `${card.image ? `<img part="image" src="${escapeHtml(card.image.src)}" alt="${escapeHtml(card.image.alt)}" width="${card.image.width}" height="${card.image.height}" loading="lazy" decoding="async" />` : ""}<div class="info"><div class="domain">${escapeHtml(card.domain)}</div><div class="title">${escapeHtml(card.title)}</div>${card.description ? `<div class="description">${escapeHtml(card.description)}</div>` : ""}</div>`,
    ),
  );
}
