import type { TwitterHeader } from "../schema.js";
import { element, escapeHtml, link } from "./base.js";
import { formatDate } from "../format.js";
import { resolveOptions, type TwitterOptions } from "../options.js";
import { icon } from "./icons.js";
export function renderHeader(
  post: TwitterHeader,
  note?: string,
  compact = false,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  const date =
    post.dateLabel ??
    (post.timestamp ? formatDate(post.timestamp, options) : "");
  const dateMarkup = date
    ? `<span class="dot">·</span>${link(post.url, post.timestamp ? `<time datetime="${post.timestamp}">${escapeHtml(date)}</time>` : escapeHtml(date), ' class="date" part="date"')}`
    : "";
  const detail = options.layout === "detail" && !compact;
  return element(
    "twitter-header",
    `
.header { display:flex; align-items:center; gap:4px; min-height:20px; min-width:0; flex-wrap:${options.dateFormat === "full" ? "wrap" : "nowrap"}; }
.identity { display:flex; gap:4px; min-width:0; overflow:hidden; flex:0 1 auto; }
.name { display:flex; align-items:center; gap:3px; min-width:0; font-weight:700; flex:0 1 auto; }
.name span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.handle { color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:0 2 auto; }
.dot, .date, time { color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); white-space:nowrap; }
.date { flex-shrink:0; }
.tools { display:flex; align-items:center; gap:8px; margin-left:auto; padding-left:4px; color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); }
.tools svg { width:18.75px; height:18.75px; }
.tools > a:hover, summary:hover { color:var(--twitter-accent,#1d9bf0); }
.verified { color:var(--twitter-accent,#1d9bf0); width:18px; height:18px; }
details { position:relative; }
summary { list-style:none; }
summary::-webkit-details-marker { display:none; }
.menu { position:absolute; right:0; top:26px; z-index:5; width:240px; max-width:70vw; padding:12px; border:1px solid #2f3336; border-radius:12px; background:var(--twitter-bg,var(--twitter-theme-bg,#000)); box-shadow:0 0 12px #ffffff26; color:var(--twitter-fg,var(--twitter-theme-fg,#e7e9ea)); font-size:13px; line-height:18px; }
.menu a { display:block; font-weight:700; padding-bottom:8px; }
.menu p { margin:0; color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); }
${detail ? ".identity { flex-direction:column; gap:0; } .header { min-height:40px; } .dot,.date { display:none; }" : ""}
`,
    `<div class="header" part="header"><div class="identity">${link(`https://x.com/${post.handle}`, `<span>${escapeHtml(post.author)}</span>${post.verified ? icon("verified", "verified") : ""}`, ` class="name" part="author" title="${escapeHtml(post.author)}"`)}${link(`https://x.com/${post.handle}`, `@${post.handle}`, ` class="handle" part="handle"`)}</div>${dateMarkup}${compact || !post.url || (!options.showGrok && !options.showMenu) ? "" : `<div class="tools">${options.showGrok ? link(post.url, icon("grok"), ` aria-label="View post context on X" title="View post context on X"`) : ""}${options.showMenu ? `<details><summary aria-label="More post options" title="More">${icon("more")}</summary><div class="menu">${link(post.url, "View original post on X")}${note ? `<p>${escapeHtml(note)}</p>` : ""}</div></details>` : ""}</div>`}</div>`,
  );
}
