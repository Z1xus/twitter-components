import type { TwitterAvatar } from "../schema.js";
import { element, escapeHtml, link } from "./base.js";
export function renderAvatar(post: TwitterAvatar, small = false): string {
  const size = small ? 20 : 40;
  return element(
    "twitter-avatar",
    `
:host { width:${size}px; height:${size}px; flex:0 0 ${size}px; }
a, img, span { display:block; width:100%; height:100%; border-radius:50%; }
img { object-fit:cover; }
a:hover { filter:brightness(.9); }
span { background:#333639; text-align:center; line-height:${size}px; }
`,
    link(
      `https://x.com/${post.handle}`,
      post.avatar
        ? `<img part="image" src="${escapeHtml(post.avatar)}" alt="" width="${size}" height="${size}" loading="lazy" decoding="async" />`
        : `<span aria-hidden="true">${escapeHtml(post.author.slice(0, 1))}</span>`,
      ` aria-label="${escapeHtml(post.author)} on X"`,
    ),
  );
}
