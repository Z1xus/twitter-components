import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterPostSchema, type TwitterPost, postId } from "../../schema.js";
import { renderActions, actionCount, actionSelected } from "./render.js";
import type { TwitterAction } from "../../options.js";
import type { TwitterActionDetail } from "../../events.js";
export class TwitterActionsElement extends TwitterElement<TwitterPost> {
  protected render(data: TwitterPost, options: TwitterOptions): string {
    return renderActions(
      twitterPostSchema.parse(data),
      (options as TwitterOptions & { capturedAt?: string }).capturedAt,
      options,
    );
  }
  protected onAction(event: Event): void {
    const control = (event.target as Element).closest<HTMLElement>(
      "[data-action]",
    );
    if (!control || !this.data) return;
    const options = this.currentOptions();
    if (options.actionMode === "static") return;
    const post = twitterPostSchema.parse(this.data);
    const action = control.dataset.action as TwitterAction;
    const selected = actionSelected(post, action);
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
