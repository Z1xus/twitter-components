import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterPostSchema, type TwitterPost } from "../../schema.js";
import { renderQuote } from "./render.js";
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
