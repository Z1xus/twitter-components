import {
  twitterProfileSchema,
  type TwitterProfile,
  twitterAvatarSchema,
  twitterHeaderSchema,
  twitterContentSchema,
  type TwitterAvatar,
  type TwitterHeader,
  type TwitterContent,
  twitterPostSchema,
  twitterThreadSchema,
  twitterImageSchema,
  postId,
  type TwitterPost,
  type TwitterThread,
  type TwitterImage,
} from "./schema.js";
import {
  resolveOptions,
  type TwitterOptions,
  type TwitterAction,
} from "./options.js";
import { optionAttributes, optionKey } from "./metadata.js";
import type { TwitterActionDetail } from "./events.js";
import { renderProfile } from "./components/profile.js";
import { renderPost } from "./components/post.js";
import { renderThread } from "./components/thread.js";
import { renderAvatar } from "./components/avatar.js";
import { renderHeader } from "./components/header.js";
import { renderContent } from "./components/content.js";
import { renderMedia, renderCard } from "./components/media.js";
import { renderQuote } from "./components/quote.js";
import { renderActions, actionCount } from "./components/actions.js";

export abstract class TwitterElement<T> extends HTMLElement {
  static observedAttributes = [
    "data-twitter",
    ...Object.keys(optionAttributes),
  ];
  private value?: T;
  private settings: TwitterOptions = {};
  private queued = false;
  private listening = false;

  get data(): T | undefined {
    return this.value;
  }
  set data(value: T | undefined) {
    this.value = value;
    this.schedule();
  }

  get options(): TwitterOptions {
    return this.settings;
  }
  set options(value: TwitterOptions) {
    this.settings = { ...value };
    this.schedule();
  }
  protected abstract render(data: T, options: TwitterOptions): string;
  connectedCallback(): void {
    for (const key of ["data", "options", "post", "thread", "profile"]) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = Reflect.get(this, key);
        Reflect.deleteProperty(this, key);
        Reflect.set(this, key, value);
      }
    }
    this.schedule();
  }
  attributeChangedCallback(name: string): void {
    if (name === "data-twitter") {
      this.value = undefined;
    }
    this.schedule();
  }
  private schedule(): void {
    if (this.queued) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.isConnected) this.update();
    });
  }
  private update(): void {
    try {
      const template = this.querySelector<HTMLTemplateElement>(
        ":scope > template[shadowrootmode]",
      );
      if (!this.shadowRoot && template) {
        this.attachShadow({ mode: "open" }).append(
          template.content.cloneNode(true),
        );
        template.remove();
      }
      if (this.value === undefined && this.hasAttribute("data-twitter")) {
        const saved = JSON.parse(this.getAttribute("data-twitter")!);
        this.value = saved.data;
        this.settings = { ...saved.options, ...this.settings };
      }
      if (this.value !== undefined) {
        const options = this.currentOptions();
        const rendered = this.render(this.value, options);
        const html =
          options.linkTarget === "_self"
            ? rendered.replaceAll('target="_blank"', 'target="_self"')
            : rendered;
        const parsed = document.createElement("template");
        parsed.innerHTML = html;
        const host = parsed.content.firstElementChild;
        const shadow = host?.querySelector<HTMLTemplateElement>(
          "template[shadowrootmode]",
        );
        if (shadow) {
          const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
          root.replaceChildren(shadow.content.cloneNode(true));
          this.style.colorScheme =
            options.theme === "light"
              ? "light"
              : options.theme === "auto"
                ? "light dark"
                : "dark";
          const theme = options.theme ?? "dark";
          const themeStyle = document.createElement("style");
          themeStyle.textContent =
            theme === "light"
              ? ":host{--twitter-theme-bg:#fff;--twitter-theme-fg:#0f1419;--twitter-theme-muted:#536471;--twitter-theme-border:#cfd9de;--twitter-theme-thread-line:#cfd9de}"
              : theme === "dim"
                ? ":host{--twitter-theme-bg:#15202b;--twitter-theme-fg:#f7f9f9;--twitter-theme-muted:#8b98a5;--twitter-theme-border:#38444d;--twitter-theme-thread-line:#38444d}"
                : theme === "auto"
                  ? "@media(prefers-color-scheme:light){:host{--twitter-theme-bg:#fff;--twitter-theme-fg:#0f1419;--twitter-theme-muted:#536471;--twitter-theme-border:#cfd9de;--twitter-theme-thread-line:#cfd9de}}"
                  : "";
          root.append(themeStyle);
        }
      }
      if (this.shadowRoot && !this.listening) {
        this.shadowRoot.addEventListener("click", (event) =>
          this.onAction(event),
        );
        this.listening = true;
      }
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("twitter-error", {
          detail: { error },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
  protected currentOptions(): TwitterOptions {
    const options: Record<string, unknown> = { ...this.settings };
    for (const [attribute, type] of Object.entries(optionAttributes)) {
      if (!this.hasAttribute(attribute)) continue;
      const value = this.getAttribute(attribute)!;
      options[optionKey(attribute)] =
        type === "boolean"
          ? value !== "false"
          : type === "number"
            ? Number(value)
            : type === "list"
              ? value.split(/[\s,]+/).filter(Boolean)
              : value;
    }
    return { ...this.settings, ...resolveOptions(options as TwitterOptions) };
  }
  private onAction(event: Event): void {
    if (this.localName !== "twitter-actions") return;
    const control = (event.target as Element).closest<HTMLElement>(
      "[data-action]",
    );
    if (!control || !this.value) return;
    const options = this.currentOptions();
    if (options.actionMode === "static") return;
    const post = twitterPostSchema.parse(this.value);
    const action = control.dataset.action as TwitterAction;
    const selected =
      action === "like"
        ? post.state?.liked
        : action === "repost"
          ? post.state?.reposted
          : action === "bookmark"
            ? post.state?.bookmarked
            : undefined;
    const detail: TwitterActionDetail = {
      action,
      postId: postId(post),
      url: post.url,
      count: actionCount(post, action, options),
      selected,
    };
    if (
      !this.dispatchEvent(
        new CustomEvent("twitter-action", {
          detail,
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
    ) {
      event.preventDefault();
      return;
    }
    if (action === "share" && options.actionMode === "link" && post.url) {
      event.preventDefault();
      void Promise.resolve()
        .then(() => navigator.clipboard.writeText(post.url!))
        .then(() => {
          const status = this.shadowRoot?.querySelector('[role="status"]');
          if (status) status.textContent = "Post link copied";
          this.dispatchEvent(
            new CustomEvent("twitter-copy", {
              detail: { url: post.url },
              bubbles: true,
              composed: true,
            }),
          );
        })
        .catch((error) =>
          this.dispatchEvent(
            new CustomEvent("twitter-error", {
              detail: { error },
              bubbles: true,
              composed: true,
            }),
          ),
        );
    }
  }
}
export class TwitterProfileElement extends TwitterElement<TwitterProfile> {
  get profile(): TwitterProfile | undefined {
    return this.data;
  }
  set profile(value: TwitterProfile | undefined) {
    this.data = value;
  }
  protected render(data: TwitterProfile, options: TwitterOptions): string {
    return renderProfile(twitterProfileSchema.parse(data), options);
  }
}
export class TwitterPostElement extends TwitterElement<TwitterPost> {
  get post(): TwitterPost | undefined {
    return this.data;
  }
  set post(value: TwitterPost | undefined) {
    this.data = value;
  }
  protected render(data: TwitterPost, options: TwitterOptions): string {
    return renderPost(twitterPostSchema.parse(data), options);
  }
}
export class TwitterThreadElement extends TwitterElement<TwitterThread> {
  get thread(): TwitterThread | undefined {
    return this.data;
  }
  set thread(value: TwitterThread | undefined) {
    this.data = value;
  }
  protected render(data: TwitterThread, options: TwitterOptions): string {
    return renderThread(twitterThreadSchema.parse(data), options);
  }
}
export class TwitterAvatarElement extends TwitterElement<TwitterAvatar> {
  protected render(data: TwitterAvatar): string {
    return renderAvatar(twitterAvatarSchema.parse(data));
  }
}
export class TwitterHeaderElement extends TwitterElement<TwitterHeader> {
  protected render(data: TwitterHeader, options: TwitterOptions): string {
    return renderHeader(
      twitterHeaderSchema.parse(data),
      undefined,
      false,
      options,
    );
  }
}
export class TwitterContentElement extends TwitterElement<TwitterContent> {
  protected render(data: TwitterContent): string {
    return renderContent(twitterContentSchema.parse(data));
  }
}
export class TwitterMediaElement extends TwitterElement<TwitterImage[]> {
  protected render(data: TwitterImage[], options: TwitterOptions): string {
    return renderMedia(
      twitterImageSchema.array().min(1).max(4).parse(data),
      options,
    );
  }
}
export class TwitterCardElement extends TwitterElement<
  NonNullable<TwitterPost["card"]>
> {
  protected render(data: NonNullable<TwitterPost["card"]>): string {
    return renderCard(twitterPostSchema.shape.card.unwrap().parse(data));
  }
}
export class TwitterQuoteElement extends TwitterElement<
  NonNullable<TwitterPost["quote"]>
> {
  protected render(
    data: NonNullable<TwitterPost["quote"]>,
    options: TwitterOptions,
  ): string {
    return renderQuote(
      twitterPostSchema.shape.quote.unwrap().parse(data),
      options,
    );
  }
}
export class TwitterActionsElement extends TwitterElement<TwitterPost> {
  protected render(data: TwitterPost, options: TwitterOptions): string {
    return renderActions(
      twitterPostSchema.parse(data),
      (options as TwitterOptions & { capturedAt?: string }).capturedAt,
      options,
    );
  }
}

export function defineTwitterComponents(
  registry: CustomElementRegistry = customElements,
): void {
  const components = {
    profile: TwitterProfileElement,
    thread: TwitterThreadElement,
    post: TwitterPostElement,
    avatar: TwitterAvatarElement,
    header: TwitterHeaderElement,
    content: TwitterContentElement,
    media: TwitterMediaElement,
    card: TwitterCardElement,
    quote: TwitterQuoteElement,
    actions: TwitterActionsElement,
  };
  for (const [name, constructor] of Object.entries(components))
    if (!registry.get(`twitter-${name}`))
      registry.define(`twitter-${name}`, constructor);
}
declare global {
  interface HTMLElementTagNameMap {
    "twitter-profile": TwitterProfileElement;
    "twitter-thread": TwitterThreadElement;
    "twitter-post": TwitterPostElement;
    "twitter-avatar": TwitterAvatarElement;
    "twitter-header": TwitterHeaderElement;
    "twitter-content": TwitterContentElement;
    "twitter-media": TwitterMediaElement;
    "twitter-card": TwitterCardElement;
    "twitter-quote": TwitterQuoteElement;
    "twitter-actions": TwitterActionsElement;
  }
  interface HTMLElementEventMap {
    "twitter-action": CustomEvent<TwitterActionDetail>;
    "twitter-copy": CustomEvent<{ url: string }>;
    "twitter-error": CustomEvent<{ error: unknown }>;
  }
}
