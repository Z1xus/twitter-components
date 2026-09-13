import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
} from "../../options.js";
import type { TwitterPost } from "../../schema.js";
import { element, payload } from "../base.js";
import { h, Fragment, raw } from "../../html.js";
import { Link } from "../shared.js";
import { renderAvatar } from "../avatar/render.js";
import { renderHeader } from "../header/render.js";
import { renderContent } from "../content/render.js";
import { renderMedia } from "../media/render.js";
import { renderCard } from "../card/render.js";
import { renderQuote } from "../quote/render.js";
import { renderActions } from "../actions/render.js";
import { formatCount } from "../../format.js";
import styles from "./styles.css?raw";

export type TwitterPostOptions = TwitterOptions & {
  connectedAbove?: boolean;
  connectedBelow?: boolean;
  separator?: boolean;
  note?: string;
  capturedAt?: string;
};
type PostProps = {
  post: TwitterPost;
  options: ReturnType<typeof resolveOptions> & TwitterPostOptions;
};

function PostDetails({ post, options }: PostProps) {
  const date =
    post.dateLabel ||
    (post.timestamp
      ? new Intl.DateTimeFormat(options.locale, {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: options.timeZone,
        }).format(new Date(post.timestamp))
      : "");
  return (
    <div part="details" class="details">
      {post.dateLabel ? (
        date
      ) : post.timestamp ? (
        <time datetime={post.timestamp}>{date}</time>
      ) : (
        ""
      )}
      {post.stats?.views !== undefined &&
        options.countFormat !== "hidden" &&
        ` · ${formatCount(post.stats.views, options)} Views`}
    </div>
  );
}

function PostContent({ post, options }: PostProps) {
  return (
    <>
      {!options.connectedAbove && !!post.replyingTo?.length && (
        <div class="replying">
          Replying to{" "}
          {post.replyingTo.map((handle, index) => (
            <>
              {index > 0 && " "}
              <Link href={`https://x.com/${handle}`}>{`@${handle}`}</Link>
            </>
          ))}
        </div>
      )}
      <slot>{raw(renderContent(post))}</slot>
      <slot name="media">
        {options.showMedia &&
          post.images &&
          raw(renderMedia(post.images, options))}
      </slot>
      <slot name="quote">
        {post.quote && raw(renderQuote(post.quote, options))}
      </slot>
      <slot name="card">{post.card && raw(renderCard(post.card))}</slot>
      {options.layout === "detail" && (
        <PostDetails post={post} options={options} />
      )}
      <slot name="actions">
        {raw(renderActions(post, options.capturedAt, options))}
      </slot>
      <slot name="footer"></slot>
    </>
  );
}

export function renderPost(
  post: TwitterPost,
  settings: TwitterPostOptions = {},
): string {
  const options = { ...settings, ...resolveOptions(settings) };
  const classes = [
    options.density === "compact" && "compact",
    options.separator && "separator",
    options.connectedAbove && "connected-above",
    options.connectedBelow && "connected-below",
  ]
    .filter(Boolean)
    .join(" ");
  return element(
    "twitter-post",
    themeStyles + styles,
    <article
      part="post"
      aria-label={`Post by ${post.author}`}
      class={classes || undefined}
    >
      <div class="layout">
        <div class="rail">
          <slot name="avatar">{raw(renderAvatar(post))}</slot>
        </div>
        <div class={`body ${options.layout}`}>
          <slot name="header">
            {raw(renderHeader(post, options.note, false, options))}
          </slot>
          {options.layout !== "detail" && (
            <PostContent post={post} options={options} />
          )}
        </div>
        {options.layout === "detail" && (
          <div class="detail-content">
            <PostContent post={post} options={options} />
          </div>
        )}
      </div>
    </article>,
    payload(post, options) + ` theme="${options.theme}"`,
  );
}
