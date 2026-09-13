import type { TwitterActionDetail } from "./events.js";
export { TwitterElement } from "./elements/base.js";
import { TwitterProfileElement } from "./components/profile/element.js";
export { TwitterProfileElement };
import { TwitterPostElement } from "./components/post/element.js";
export { TwitterPostElement };
import { TwitterThreadElement } from "./components/thread/element.js";
export { TwitterThreadElement };
import { TwitterAvatarElement } from "./components/avatar/element.js";
export { TwitterAvatarElement };
import { TwitterHeaderElement } from "./components/header/element.js";
export { TwitterHeaderElement };
import { TwitterContentElement } from "./components/content/element.js";
export { TwitterContentElement };
import { TwitterMediaElement } from "./components/media/element.js";
export { TwitterMediaElement };
import { TwitterCardElement } from "./components/card/element.js";
export { TwitterCardElement };
import { TwitterQuoteElement } from "./components/quote/element.js";
export { TwitterQuoteElement };
import { TwitterActionsElement } from "./components/actions/element.js";
export { TwitterActionsElement };
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
