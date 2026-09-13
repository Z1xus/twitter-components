import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
} from "../options.js";
import { postId, type TwitterThread } from "../schema.js";
import { element, escapeHtml, payload } from "./base.js";
import { renderPost } from "./post.js";
export function renderThread(
  thread: TwitterThread,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return element(
    "twitter-thread",
    `${themeStyles}
:host { display:block; width:100%; max-width:600px; margin:0 auto; background:var(--twitter-bg,var(--twitter-theme-bg,#000)); color:var(--twitter-fg,var(--twitter-theme-fg,#e7e9ea)); font:400 15px/20px var(--twitter-font-family,"Twitter Chirp"),-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; text-align:left; border:1px solid var(--twitter-border,var(--twitter-theme-border,#2f3336)); border-radius:3px; }
`,
    `<section part="thread" aria-label="${escapeHtml(thread.label)}"><slot>${thread.posts
      .map((post, index, posts) => {
        const connectedAbove =
          options.showConnections &&
          index > 0 &&
          post.replyTo === postId(posts[index - 1]);
        return renderPost(post, {
          ...options,
          connectedAbove,
          connectedBelow:
            index + 1 < posts.length &&
            posts[index + 1].replyTo === postId(post),
          separator: index > 0 && !connectedAbove,
          note: thread.note,
          capturedAt: thread.capturedAt,
        });
      })
      .join("")}</slot></section>`,
    payload(thread, options) + ` theme="${options.theme}"`,
  );
}
