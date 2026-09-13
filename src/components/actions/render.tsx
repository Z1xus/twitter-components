import type { TwitterPost } from "../../schema.js";
import {
  resolveOptions,
  type TwitterOptions,
  type TwitterAction,
  type ResolvedTwitterOptions,
} from "../../options.js";
import { formatCount } from "../../format.js";
import { element, payload } from "../base.js";
import { h, raw } from "../../html.js";
import { icon } from "../icons.js";
import styles from "./styles.css?raw";

const labels = {
  reply: "replies",
  repost: "reposts",
  quote: "quotes",
  like: "likes",
  views: "views",
  bookmark: "bookmarks",
  share: "Copy post link",
};

export function actionCount(
  post: TwitterPost,
  action: TwitterAction,
  options: TwitterOptions = {},
): number | string | undefined {
  const stats = post.stats ?? {};
  if (action === "repost") {
    if (typeof stats.reposts !== "number" || typeof stats.quotes === "string")
      return stats.reposts;
    return (
      stats.reposts +
      (resolveOptions(options).repostCount === "combined"
        ? (stats.quotes ?? 0)
        : 0)
    );
  }
  return {
    reply: stats.replies,
    quote: stats.quotes,
    like: stats.likes,
    views: stats.views,
    bookmark: stats.bookmarks,
    share: undefined,
  }[action];
}

export function actionSelected(
  post: TwitterPost,
  action: TwitterAction,
): boolean | undefined {
  if (action === "like") return post.state?.liked;
  if (action === "repost") return post.state?.reposted;
  if (action === "bookmark") return post.state?.bookmarked;
}

function actionLabel(
  post: TwitterPost,
  action: TwitterAction,
  options: ResolvedTwitterOptions,
  capturedAt?: string,
): string {
  if (action === "share") return labels.share;
  const count = actionCount(post, action, options);
  const formatted =
    count === undefined
      ? "Count unavailable for"
      : typeof count === "string"
        ? count
        : new Intl.NumberFormat(options.locale).format(count);
  return `${formatted} ${labels[action]}${capturedAt ? `. Captured ${capturedAt}` : ""}`;
}

function Action({
  post,
  action,
  options,
  capturedAt,
}: {
  post: TwitterPost;
  action: TwitterAction;
  options: ResolvedTwitterOptions;
  capturedAt?: string;
}) {
  const count = formatCount(actionCount(post, action, options), options);
  const selected = actionSelected(post, action);
  const label = actionLabel(post, action, options, capturedAt);
  const showCount =
    action !== "bookmark" ||
    options.showBookmarkCount ||
    options.layout === "detail";
  const attributes = {
    class: `action ${action}${selected ? " selected" : ""}`,
    part: `action ${action}`,
    "data-action": action,
    "aria-label": label,
    title: label,
  };
  const body = [
    <span class="glyph">
      {raw(icon(action === "like" && selected ? "liked" : action))}
    </span>,
    showCount && count ? (
      <span part="count" class="count">
        {count}
      </span>
    ) : null,
  ];
  if (
    options.actionMode === "static" ||
    (options.actionMode === "link" && !post.url)
  )
    return <span {...attributes}>{body}</span>;
  if (options.actionMode === "event" || action === "share")
    return (
      <button
        type="button"
        {...attributes}
        aria-pressed={selected === undefined ? undefined : String(selected)}
      >
        {body}
      </button>
    );
  return (
    <a
      href={post.url}
      target={options.linkTarget}
      rel="noopener noreferrer"
      {...attributes}
    >
      {body}
    </a>
  );
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
  return element(
    "twitter-actions",
    styles,
    <div part="actions" class="actions" role="group" aria-label="Post actions">
      {options.actions.map((action) => (
        <Action
          post={post}
          action={action}
          options={options}
          capturedAt={capturedAt}
        />
      ))}
      <span class="sr-only" role="status" aria-live="polite"></span>
    </div>,
    payload(post, { ...options, capturedAt }),
  );
}
