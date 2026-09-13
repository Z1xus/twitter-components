import { resolveOptions, type TwitterOptions } from "../../options.js";
import type { TwitterPost } from "../../schema.js";
import { element } from "../base.js";
import { h, Fragment, raw } from "../../html.js";
import { renderAvatar } from "../avatar/render.js";
import { renderHeader } from "../header/render.js";
import { renderContent } from "../content/render.js";
import { renderMedia } from "../media/render.js";
import styles from "./styles.css?raw";

export function renderQuote(
  post: NonNullable<TwitterPost["quote"]>,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return element(
    "twitter-quote",
    styles,
    <>
      <div class="author">
        {raw(renderAvatar(post, true))}
        {raw(renderHeader(post, undefined, true, options))}
      </div>
      {raw(renderContent(post))}
      {options.showMedia &&
        post.images &&
        raw(renderMedia(post.images, options))}
    </>,
  );
}
