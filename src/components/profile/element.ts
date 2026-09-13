import { TwitterElement } from "../../elements/base.js";
import type { TwitterOptions } from "../../options.js";
import { twitterProfileSchema, type TwitterProfile } from "../../schema.js";
import { renderProfile } from "./render.js";
export class TwitterProfileElement extends TwitterElement<TwitterProfile> {
  get profile(): TwitterProfile | undefined {
    return this.data;
  }
  set profile(value: TwitterProfile | undefined) {
    this.data = value;
  }
  protected render(data: TwitterProfile, options: TwitterOptions): string {
    return renderProfile(twitterProfileSchema.parse(data), options);
  }
}
