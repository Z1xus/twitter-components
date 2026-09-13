import { TwitterElement } from "../../elements/base.js";
import { twitterContentSchema, type TwitterContent } from "../../schema.js";
import { renderContent } from "./render.js";
export class TwitterContentElement extends TwitterElement<TwitterContent> {
  protected render(data: TwitterContent): string {
    return renderContent(twitterContentSchema.parse(data));
  }
}
