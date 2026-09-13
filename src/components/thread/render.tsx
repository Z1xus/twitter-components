import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
} from "../../options.js";
import { postId, type TwitterThread } from "../../schema.js";
import { element, payload } from "../base.js";
import { h, raw } from "../../html.js";
import { renderPost } from "../post/render.js";
import styles from "./styles.css?raw";

export function renderThread(
  thread: TwitterThread,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  const detail = options.layout === "detail";
  return element(
    "twitter-thread",
    themeStyles + styles,
    <section part="thread" aria-label={thread.label}>
      <slot>
        {thread.posts.map((post, index, posts) => {
          const connectedAbove =
            options.showConnections &&
            index > (detail ? 1 : 0) &&
            post.replyTo === postId(posts[index - 1]);
          return raw(
            renderPost(post, {
              ...options,
              layout: detail && index === 0 ? "detail" : "timeline",
              connectedAbove,
              connectedBelow:
                options.showConnections &&
                (!detail || index > 0) &&
                index + 1 < posts.length &&
                posts[index + 1].replyTo === postId(post),
              separator: index > 0 && !connectedAbove,
              note: thread.note,
              capturedAt: thread.capturedAt,
            }),
          );
        })}
      </slot>
    </section>,
    payload(thread, options) + ` theme="${options.theme}"`,
  );
}
