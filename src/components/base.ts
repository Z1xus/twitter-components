export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
export const baseStyles = `
:host { display:block; min-width:0; font:inherit; color:inherit; }
*, *::before, *::after { box-sizing:border-box; }
a { color:inherit; text-decoration:none; }
a:hover { text-decoration:underline; }
button, summary { font:inherit; color:inherit; cursor:pointer; }
button { border:0; padding:0; background:none; }
a:focus-visible, button:focus-visible, summary:focus-visible { outline:2px solid var(--twitter-accent,#1d9bf0); outline-offset:3px; border-radius:3px; }
svg { display:block; width:1.25em; height:1.25em; fill:currentColor; flex-shrink:0; }
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
`;
export function element(
  tag: string,
  styles: string,
  body: string,
  attributes = "",
): string {
  return `<${tag}${attributes}><template shadowrootmode="open"><style>${baseStyles}${styles}</style>${body}</template></${tag}>`;
}
export function link(url: string, body: string, attributes = ""): string {
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"${attributes}>${body}</a>`;
}
export function payload(data: unknown, options?: unknown): string {
  return ` data-twitter="${escapeHtml(JSON.stringify({ data, options }))}"`;
}
