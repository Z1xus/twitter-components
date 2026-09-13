import type { TwitterContent } from "../schema.js";
import { element, escapeHtml, link } from "./base.js";
export function renderContent(post: TwitterContent): string {
  const entities = [...(post.links ?? [])].sort(
    (a, b) => b.text.length - a.text.length,
  );
  let remaining = post.content;
  let html = "";
  while (remaining) {
    let next: (typeof entities)[number] | undefined;
    let offset = remaining.length;
    for (const entity of entities) {
      const found = remaining.indexOf(entity.text);
      if (found >= 0 && found < offset) {
        next = entity;
        offset = found;
      }
    }
    html += escapeHtml(remaining.slice(0, offset));
    if (!next) break;
    html += link(next.url, escapeHtml(next.text));
    remaining = remaining.slice(offset + next.text.length);
  }
  return element(
    "twitter-content",
    `
:host { white-space:pre-wrap; overflow-wrap:anywhere; }
a { color:var(--twitter-accent,#1d9bf0); }
`,
    `<div part="content" dir="auto">${html}</div>`,
  );
}
