import type { TwitterContent } from "../../schema.js";
import { element } from "../base.js";
import { h, type Child } from "../../html.js";
import { Link } from "../shared.js";
import styles from "./styles.css?raw";

export function renderContent(post: TwitterContent): string {
  const entities = [...(post.links ?? [])].sort(
    (a, b) => b.text.length - a.text.length,
  );
  let remaining = post.content;
  const content: Child[] = [];
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
    content.push(remaining.slice(0, offset));
    if (!next) break;
    content.push(<Link href={next.url}>{next.text}</Link>);
    remaining = remaining.slice(offset + next.text.length);
  }
  return element(
    "twitter-content",
    styles,
    <div part="content" dir="auto">
      {content}
    </div>,
  );
}
