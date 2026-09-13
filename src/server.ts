import {
  twitterPostSchema,
  twitterThreadSchema,
  twitterProfileSchema,
} from "./schema.js";
import { resolveOptions, type TwitterOptions } from "./options.js";
import { renderProfile } from "./components/profile/render.js";
import { renderPost } from "./components/post/render.js";
import { renderThread } from "./components/thread/render.js";

export function renderTwitterPost(
  data: unknown,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return targets(
    renderPost(twitterPostSchema.parse(data), options),
    options.linkTarget,
  );
}

export function renderTwitterTimeline(
  data: unknown,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return targets(
    renderThread(twitterThreadSchema.parse(data), options),
    options.linkTarget,
  );
}
function targets(html: string, target: string): string {
  return target === "_self"
    ? html.replaceAll('target="_blank"', 'target="_self"')
    : html;
}

export function renderTwitterProfile(
  data: unknown,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  return targets(
    renderProfile(twitterProfileSchema.parse(data), options),
    options.linkTarget,
  );
}
