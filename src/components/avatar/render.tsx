import type { TwitterAvatar } from "../../schema.js";
import { element } from "../base.js";
import { h } from "../../html.js";
import { Link } from "../shared.js";
import styles from "./styles.css?raw";

export function renderAvatar(post: TwitterAvatar, small = false): string {
  const size = small ? 20 : 40;
  return element(
    "twitter-avatar",
    styles,
    <Link
      href={`https://x.com/${post.handle}`}
      aria-label={`${post.author} on X`}
    >
      {post.avatar ? (
        <img
          part="image"
          src={post.avatar}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span aria-hidden="true">{post.author.slice(0, 1)}</span>
      )}
    </Link>,
    small ? ' size="small"' : "",
  );
}
