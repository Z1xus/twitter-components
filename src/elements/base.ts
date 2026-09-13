import { colorScheme, selectedThemeStyles } from "../theme.js";
import { resolveOptions, type TwitterOptions } from "../options.js";
import { optionAttributes, optionKey } from "../metadata.js";
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
          this.style.colorScheme = colorScheme(options.theme);
          const themeStyle = document.createElement("style");
          themeStyle.textContent = selectedThemeStyles(options.theme);
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
  protected onAction(_event: Event): void {}
}
