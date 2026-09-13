import type { TwitterProfile } from "../schema.js";
import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
} from "../options.js";
import { formatCount } from "../format.js";
import { element, escapeHtml, link, payload } from "./base.js";
import { renderContent } from "./content.js";
import { icon } from "./icons.js";

export function renderProfile(
  profile: TwitterProfile,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  const url = profile.url ?? `https://x.com/${profile.handle}`;
  const count = (value: number | string | undefined) =>
    escapeHtml(formatCount(value, options));
  return element(
    "twitter-profile",
    `${themeStyles}
:host { display:block; width:100%; max-width:600px; margin:0 auto; background:var(--twitter-bg,var(--twitter-theme-bg,#000)); color:var(--twitter-fg,var(--twitter-theme-fg,#e7e9ea)); font:400 15px/20px var(--twitter-font-family,"Twitter Chirp"),-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; text-align:left; border:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); overflow:hidden; }
.banner { display:block; width:100%; height:auto; aspect-ratio:3 / 1; object-fit:cover; background:var(--twitter-border,var(--twitter-theme-border,#2f3336)); }
.body { padding:12px 16px 16px; }
.top { margin-inline:-16px; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; min-height:0; }
.avatar { display:grid; place-items:center; width:24%; aspect-ratio:1; margin-left:2.5%; margin-top:calc(-12% - 12px); border:4px solid var(--twitter-bg,var(--twitter-theme-bg,#000)); border-radius:50%; overflow:hidden; background:var(--twitter-border,var(--twitter-theme-border,#2f3336)); font-size:36px; }
.avatar img { width:100%; height:100%; object-fit:cover; }
.identity { margin:12px 0 12px; }
.name { display:flex; align-items:center; gap:4px; font-size:20px; line-height:24px; font-weight:800; }
.verified { color:var(--twitter-accent,#1d9bf0); width:20px; height:20px; }
.handle,.details,.stats { color:var(--twitter-muted,var(--twitter-theme-muted,#71767b)); }
.details,.stats { display:flex; gap:4px 16px; flex-wrap:wrap; margin-top:12px; }
.details a { color:var(--twitter-accent,#1d9bf0); }
.stats > span { cursor:pointer; }
.stats > span:hover { text-decoration:underline; }
.stats strong { color:var(--twitter-fg,var(--twitter-theme-fg,#e7e9ea)); font-weight:700; }
`,
    `<section part="profile" aria-label="Profile of ${escapeHtml(profile.author)}"><slot name="banner">${profile.banner ? `<img class="banner" part="banner" src="${escapeHtml(profile.banner.src)}" alt="${escapeHtml(profile.banner.alt)}" width="${profile.banner.width}" height="${profile.banner.height}">` : '<div class="banner" part="banner"></div>'}</slot><div class="body"><div class="top"><slot name="avatar"><div class="avatar" part="avatar">${profile.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="${escapeHtml(profile.author)}">` : escapeHtml(profile.author.slice(0, 1))}</div></slot><slot name="actions"></slot></div><div class="identity" part="identity">${link(url, `${escapeHtml(profile.author)}${profile.verified ? icon("verified", "verified") : ""}`, ' class="name"')}${link(url, `@${profile.handle}`, ' class="handle"')}</div><slot name="bio"><div part="bio">${profile.bio ? renderContent({ content: profile.bio }) : ""}</div></slot><slot name="details"><div class="details" part="details">${profile.location ? `<span>${escapeHtml(profile.location)}</span>` : ""}${profile.website ? link(profile.website.url, escapeHtml(profile.website.label)) : ""}${profile.joined ? `<span>Joined ${escapeHtml(profile.joined)}</span>` : ""}</div></slot><slot name="stats"><div class="stats" part="stats">${count(profile.following) !== "" ? `<span><strong>${count(profile.following)}</strong> Following</span>` : ""}${count(profile.followers) !== "" ? `<span><strong>${count(profile.followers)}</strong> Followers</span>` : ""}${count(profile.posts) !== "" ? `<span><strong>${count(profile.posts)}</strong> Posts</span>` : ""}</div></slot></div><slot></slot></section>`,
    payload(profile, options) + ` theme="${options.theme}"`,
  );
}
