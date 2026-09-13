import { resolveOptions, type TwitterOptions } from "../../options.js";
import type { TwitterImage } from "../../schema.js";
import { element } from "../base.js";
import { h } from "../../html.js";
import { Image, Link } from "../shared.js";
import styles from "./styles.css?raw";

export function renderMedia(
  images: TwitterImage[],
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  if (!images.length) return "";
  const single = images.length === 1;
  const first = images[0];
  const width =
    single && options.mediaFit === "contain"
      ? `min(100%,${Math.min(first.width, (options.mediaMaxHeight * first.width) / first.height)}px)`
      : "100%";
  const mediaStyle = `--media-width:${width};--media-fit:${options.mediaFit};--media-max-height:${options.mediaMaxHeight}px`;
  return element(
    "twitter-media",
    styles,
    <div part="media" class={`media count-${images.length}`} style={mediaStyle}>
      {images.map((image) => (
        <Link href={image.src} aria-label={`Open image: ${image.alt}`}>
          <Image image={image} />
        </Link>
      ))}
    </div>,
  );
}
