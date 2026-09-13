import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
} from "../options.js";
import type { TwitterPost } from "../schema.js";
import { element, escapeHtml, link, payload } from "./base.js";
import { renderAvatar } from "./avatar.js";
import { renderHeader } from "./header.js";
import { renderContent } from "./content.js";
import { renderMedia, renderCard } from "./media.js";
import { renderQuote } from "./quote.js";
import { formatCount } from "../format.js";
import { renderActions } from "./actions.js";
export type TwitterPostOptions = TwitterOptions & {
  connectedAbove?: boolean;
  connectedBelow?: boolean;
  separator?: boolean;
  note?: string;
  capturedAt?: string;
};
export function renderPost(
  post: TwitterPost,
  settings: TwitterPostOptions = {},
): string {
  const options = { ...settings, ...resolveOptions(settings) };
  const replying =
    !options.connectedAbove && post.replyingTo?.length
      ? `<div class="replying">Replying to ${post.replyingTo.map((handle) => link(`https://x.com/${handle}`, `@${handle}`)).join(" ")}</div>`
      : "";
  return element(
    "twitter-post",
    `${themeStyles}
:host { display:block; background:var(--twitter-bg,var(--twitter-theme-bg,#000)); color:var(--twitter-fg,var(--twitter-theme-fg,#e7e9ea)); font:400 15px/20px var(--twitter-font-family,"Twitter Chirp"),-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; text-align:left; }
article { padding:${options.density === "compact" ? "8px 12px" : "12px 16px"}; ${options.separator ? "border-top:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336));" : ""} }
.layout { display:grid; grid-template-columns:40px minmax(0,1fr); gap:8px; }
.rail { position:relative; }
.rail::before, .rail::after { content:""; position:absolute; width:2px; left:19px; background:var(--twitter-thread-line,var(--twitter-theme-thread-line,#333639)); }
.rail::before { top:-12px; height:8px; display:${options.connectedAbove ? "block" : "none"}; }
.rail::after { top:44px; bottom:-12px; display:${options.connectedBelow ? "block" : "none"}; }
.body { min-width:0; }
.details { margin-top:12px; color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); }
.detail-content { grid-column:1 / -1; margin-top:4px; }
.detail-content twitter-actions { border-top:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); padding-top:16px; margin-top:16px; }
.replying { color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); margin-bottom:4px; }
.replying a { color:var(--twitter-accent,#1d9bf0); }
`,
    `<article part="post" aria-label="Post by ${escapeHtml(post.author)}"><div class="layout"><div class="rail"><slot name="avatar">${renderAvatar(post)}</slot></div><div class="body ${options.layout}"><slot name="header">${renderHeader(post, options.note, false, options)}</slot>${options.layout === "detail" ? `</div><div class="detail-content">` : ""}${replying}<slot>${renderContent(post)}</slot><slot name="media">${options.showMedia && post.images ? renderMedia(post.images, options) : ""}</slot><slot name="quote">${post.quote ? renderQuote(post.quote, options) : ""}</slot><slot name="card">${post.card ? renderCard(post.card) : ""}</slot>${options.layout === "detail" ? `<div part="details" class="details">${post.dateLabel ? escapeHtml(post.dateLabel) : post.timestamp ? `<time datetime="${post.timestamp}">${escapeHtml(new Intl.DateTimeFormat(options.locale, { dateStyle: "medium", timeStyle: "short", timeZone: options.timeZone }).format(new Date(post.timestamp)))}</time>` : ""}${post.stats?.views !== undefined && options.countFormat !== "hidden" ? ` · ${escapeHtml(formatCount(post.stats.views, options))} Views` : ""}</div>` : ""}<slot name="actions">${renderActions(post, options.capturedAt, options)}</slot><slot name="footer"></slot></div></div></article>`,
    payload(post, options) + ` theme="${options.theme}"`,
  );
}
