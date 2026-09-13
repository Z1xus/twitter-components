import type { TwitterHeader } from "../../schema.js";
import { element } from "../base.js";
import { h, raw } from "../../html.js";
import { Link } from "../shared.js";
import { formatDate } from "../../format.js";
import { resolveOptions, type TwitterOptions } from "../../options.js";
import { icon } from "../icons.js";
import styles from "./styles.css?raw";

function PostMenu({ url, note }: { url: string; note?: string }) {
  return (
    <details>
      <summary aria-label="More post options" title="More">
        {raw(icon("more"))}
      </summary>
      <div class="menu">
        <Link href={url}>View original post on X</Link>
        {note && <p>{note}</p>}
      </div>
    </details>
  );
}

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
  const detail = options.layout === "detail" && !compact;
  const showTools =
    !compact && post.url && (options.showGrok || options.showMenu);
  const profileUrl = `https://x.com/${post.handle}`;
  return element(
    "twitter-header",
    styles,
    <div
      class={`header${detail ? " detail" : ""}${options.dateFormat === "full" ? " full-date" : ""}`}
      part="header"
    >
      <div class="identity">
        <Link href={profileUrl} class="name" part="author" title={post.author}>
          <span>{post.author}</span>
          {post.verified && raw(icon("verified", "verified"))}
        </Link>
        <Link
          href={profileUrl}
          class="handle"
          part="handle"
        >{`@${post.handle}`}</Link>
      </div>
      {date && <span class="dot">·</span>}
      {date && (
        <Link href={post.url} class="date" part="date">
          {post.timestamp ? (
            <time datetime={post.timestamp}>{date}</time>
          ) : (
            date
          )}
        </Link>
      )}
      {showTools && (
        <div class="tools">
          {options.showGrok && (
            <Link
              href={post.url}
              aria-label="View post context on X"
              title="View post context on X"
            >
              {raw(icon("grok"))}
            </Link>
          )}
          {options.showMenu && <PostMenu url={post.url!} note={note} />}
        </div>
      )}
    </div>,
  );
}
