export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export class Markup {
  constructor(private readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export type Child =
  Markup | string | number | boolean | null | undefined | Child[];
export type Attributes = Record<string, Child>;
type Component<P> = (props: P & { children: Child[] }) => Markup;
const voidElements = new Set([
  "img",
  "input",
  "br",
  "hr",
  "meta",
  "link",
  "source",
  "area",
  "base",
  "col",
  "embed",
  "param",
  "track",
  "wbr",
]);

function childrenHtml(children: Child[]): string {
  return children
    .map((child): string => {
      if (Array.isArray(child)) return childrenHtml(child);
      if (child === undefined || child === null || typeof child === "boolean")
        return "";
      return child instanceof Markup
        ? child.toString()
        : escapeHtml(String(child));
    })
    .join("");
}

export function h<P extends object>(
  tag: string | Component<P>,
  props: P | null,
  ...children: Child[]
): Markup {
  if (typeof tag === "function")
    return tag({ ...props, children } as P & { children: Child[] });
  const attributes = Object.entries(props ?? {})
    .map(([name, value]) => {
      if (
        name === "children" ||
        value === undefined ||
        value === null ||
        value === false
      )
        return "";
      return value === true
        ? ` ${name}`
        : ` ${name}="${escapeHtml(String(value))}"`;
    })
    .join("");
  const opening = `<${tag}${attributes}>`;
  return raw(
    voidElements.has(tag)
      ? opening
      : `${opening}${childrenHtml(children)}</${tag}>`,
  );
}

export function Fragment({ children = [] }: { children?: Child[] }): Markup {
  return raw(childrenHtml(children));
}

export function raw(html: string): Markup {
  return new Markup(html);
}

export namespace h {
  export namespace JSX {
    export type Element = Markup;
    export interface IntrinsicElements {
      [tag: string]: Attributes;
    }
    export interface ElementChildrenAttribute {
      children: unknown;
    }
  }
}
