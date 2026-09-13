import { TwitterElement } from "../../elements/base.js";
import { twitterAvatarSchema, type TwitterAvatar } from "../../schema.js";
import { renderAvatar } from "./render.js";
export class TwitterAvatarElement extends TwitterElement<TwitterAvatar> {
  protected render(data: TwitterAvatar): string {
    return renderAvatar(twitterAvatarSchema.parse(data));
  }
}
