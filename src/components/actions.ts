import type { TwitterPost } from "../schema.js";
import {
  resolveOptions,
  type TwitterOptions,
  type TwitterAction,
} from "../options.js";
import { formatCount } from "../format.js";
import { element, escapeHtml, payload } from "./base.js";
import { icon } from "./icons.js";

export function actionCount(
  post: TwitterPost,
  action: TwitterAction,
  options: TwitterOptions = {},
): number | string | undefined {
  const stats = post.stats ?? {};
  if (action === "repost")
    return typeof stats.reposts !== "number" || typeof stats.quotes === "string"
      ? stats.reposts
      : stats.reposts === undefined
        ? undefined
        : stats.reposts +
          (resolveOptions(options).repostCount === "combined"
            ? (stats.quotes ?? 0)
            : 0);
  return {
    reply: stats.replies,
    quote: stats.quotes,
    like: stats.likes,
    views: stats.views,
    bookmark: stats.bookmarks,
    share: undefined,
  }[action];
}
export function renderActions(
  post: TwitterPost,
  capturedAt?: string,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  if (options.layout === "detail")
    options.actions = options.actions.filter((action) => action !== "views");
  if (!options.actions.length)
    return element(
      "twitter-actions",
      ":host{display:none}",
      "",
      payload(post, { ...options, capturedAt }),
    );
  const labels = {
    reply: "replies",
    repost: "reposts",
    quote: "quotes",
    like: "likes",
    views: "views",
    bookmark: "bookmarks",
    share: "Copy post link",
  };
  return element(
    "twitter-actions",
    `
:host { margin-top:12px; color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); font-size:13px; container-type:inline-size; }
.actions { display:flex; align-items:center; justify-content:space-between; gap:12px 8px; min-height:20px; flex-wrap:wrap; }
.action { display:flex; align-items:center; gap:4px; min-width:0; position:relative; line-height:20px; flex:1 0 auto; cursor:pointer; --action-color:var(--twitter-accent,#1d9bf0); transition:color .2s; }
.bookmark,.share { flex:0 0 auto; }
svg { width:18.75px; height:18.75px; }
.glyph { display:grid; place-items:center; position:relative; }
.glyph::before { content:""; position:absolute; inset:-7px; border-radius:50%; transition:background-color .2s; }
.action:hover,.action:focus-visible { color:var(--action-color); text-decoration:none; }
.action:hover .glyph::before,.action:focus-visible .glyph::before { background:color-mix(in srgb,var(--action-color) 10%,transparent); }
.repost,.quote { --action-color:#00ba7c; }
.like { --action-color:#f91880; }
.action.selected { color:var(--action-color); }
@media(prefers-reduced-motion:reduce) { .action,.glyph::before { transition:none; } }
.count { padding:0 4px; font-variant-numeric:tabular-nums; }
@container(max-width:360px) { .actions { gap:12px 4px; } .action { gap:3px; } .count { padding:0; font-size:12px; } }
`,
    `<div part="actions" class="actions" role="group" aria-label="Post actions">${options.actions
      .map((action) => {
        const count = actionCount(post, action, options);
        const selected =
          action === "like"
            ? post.state?.liked
            : action === "repost"
              ? post.state?.reposted
              : action === "bookmark"
                ? post.state?.bookmarked
                : undefined;
        const label =
          action === "share"
            ? labels.share
            : `${count === undefined ? "Count unavailable for" : typeof count === "string" ? count : new Intl.NumberFormat(options.locale).format(count)} ${labels[action]}${capturedAt ? `. Captured ${capturedAt}` : ""}`;
        const attrs = ` class="action ${action}${selected ? " selected" : ""}" part="action ${action}" data-action="${action}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"`;
        const body = `<span class="glyph">${icon(action)}</span>${(action !== "bookmark" || options.showBookmarkCount || options.layout === "detail") && formatCount(count, options) ? `<span part="count" class="count">${escapeHtml(formatCount(count, options))}</span>` : ""}`;
        if (
          options.actionMode === "static" ||
          (options.actionMode === "link" && !post.url)
        )
          return `<span${attrs}>${body}</span>`;
        if (options.actionMode === "event" || action === "share")
          return `<button type="button"${attrs}${selected === undefined ? "" : ` aria-pressed="${selected}"`}>${body}</button>`;
        return `<a href="${escapeHtml(post.url!)}" target="${options.linkTarget}" rel="noopener noreferrer"${attrs}>${body}</a>`;
      })
      .join(
        "",
      )}<span class="sr-only" role="status" aria-live="polite"></span></div>`,
    payload(post, { ...options, capturedAt }),
  );
}
