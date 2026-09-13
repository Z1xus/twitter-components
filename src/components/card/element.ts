import { TwitterElement } from "../../elements/base.js";
import { twitterPostSchema, type TwitterPost } from "../../schema.js";
import { renderCard } from "./render.js";
export class TwitterCardElement extends TwitterElement<
  NonNullable<TwitterPost["card"]>
> {
  protected render(data: NonNullable<TwitterPost["card"]>): string {
    return renderCard(twitterPostSchema.shape.card.unwrap().parse(data));
  }
}
