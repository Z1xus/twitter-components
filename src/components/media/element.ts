import * as z from "zod/mini";
import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterImageSchema, type TwitterImage } from "../../schema.js";
import { renderMedia } from "./render.js";
export class TwitterMediaElement extends TwitterElement<TwitterImage[]> {
  protected render(data: TwitterImage[], options: TwitterOptions): string {
    return renderMedia(
      z
        .array(twitterImageSchema)
        .check(z.minLength(1), z.maxLength(4))
        .parse(data),
      options,
    );
  }
}
