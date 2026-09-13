import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterThreadSchema, type TwitterThread } from "../../schema.js";
import { renderThread } from "./render.js";
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
