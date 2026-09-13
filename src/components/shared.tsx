import { h, type Child, type Attributes } from "../html.js";
import type { TwitterImage } from "../schema.js";

export function Link({
  href,
  children = [],
  ...attributes
}: Attributes & { href?: string; children?: Child }) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...attributes}>
      {children}
    </a>
  ) : (
    <span {...attributes}>{children}</span>
  );
}

export function Image({ image }: { image: TwitterImage }) {
  return (
    <img
      part="image"
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
    />
  );
}
