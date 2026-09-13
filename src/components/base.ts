import baseStyles from "./base.css?raw";
import { escapeHtml, type Markup } from "../html.js";

export function element(
  tag: string,
  styles: string,
  body: Markup | string,
  attributes = "",
): string {
  return `<${tag}${attributes}><template shadowrootmode="open"><style>${baseStyles}${styles}</style>${body}</template></${tag}>`;
}
export function payload(data: unknown, options?: unknown): string {
  return ` data-twitter="${escapeHtml(JSON.stringify({ data, options }))}"`;
}
