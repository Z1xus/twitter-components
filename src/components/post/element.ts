import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterPostSchema, type TwitterPost } from "../../schema.js";
import { renderPost } from "./render.js";
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
