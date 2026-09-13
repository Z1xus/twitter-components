import { resolveOptions, type TwitterOptions } from "../options.js";
import type { TwitterPost } from "../schema.js";
import { element } from "./base.js";
import { renderAvatar } from "./avatar.js";
import { renderHeader } from "./header.js";
import { renderContent } from "./content.js";
import { renderMedia } from "./media.js";
export function renderQuote(
  post: NonNullable<TwitterPost["quote"]>,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return element(
    "twitter-quote",
    `
:host { margin-top:12px; border:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); border-radius:16px; padding:12px; }
.author { display:flex; align-items:center; gap:4px; margin-bottom:4px; }
twitter-header { flex:1; min-width:0; }
`,
    `<div class="author">${renderAvatar(post, true)}${renderHeader(post, undefined, true, options)}</div>${renderContent(post)}${options.showMedia && post.images ? renderMedia(post.images, options) : ""}`,
  );
}
