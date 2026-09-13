import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterHeaderSchema, type TwitterHeader } from "../../schema.js";
import { renderHeader } from "./render.js";
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
