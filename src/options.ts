import * as z from "zod/mini";

export const actionNames = [
  "reply",
  "repost",
  "quote",
  "like",
  "views",
  "bookmark",
  "share",
] as const;
export type TwitterAction = (typeof actionNames)[number];

export const twitterOptionsSchema = z.object({
  theme: z._default(z.enum(["dark", "light", "dim", "auto"]), "dark"),
  layout: z._default(z.enum(["timeline", "detail"]), "timeline"),
  density: z._default(z.enum(["comfortable", "compact"]), "comfortable"),
  countFormat: z._default(z.enum(["compact", "full", "hidden"]), "compact"),
  showZeroCounts: z._default(z.boolean(), false),
  showBookmarkCount: z._default(z.boolean(), false),
  actions: z._default(
    z
      .array(z.enum(actionNames))
      .check(
        z.refine(
          (items) => new Set(items).size === items.length,
          "Actions must be unique",
        ),
      ),
    ["reply", "repost", "like", "views", "bookmark", "share"],
  ),
  actionMode: z._default(z.enum(["link", "event", "static"]), "static"),
  repostCount: z._default(z.enum(["combined", "reposts"]), "combined"),
  dateFormat: z._default(z.enum(["short", "full", "relative"]), "short"),
  locale: z._default(
    z.string().check(
      z.refine((value) => {
        try {
          new Intl.NumberFormat(value);
          return true;
        } catch {
          return false;
        }
      }, "Invalid locale"),
    ),
    "en-US",
  ),
  timeZone: z._default(
    z.string().check(
      z.refine((value) => {
        try {
          new Intl.DateTimeFormat("en", { timeZone: value });
          return true;
        } catch {
          return false;
        }
      }, "Invalid time zone"),
    ),
    "UTC",
  ),
  referenceTime: z.optional(z.iso.datetime()),
  showMedia: z._default(z.boolean(), true),
  showGrok: z._default(z.boolean(), true),
  showMenu: z._default(z.boolean(), false),
  showConnections: z._default(z.boolean(), true),
  mediaFit: z._default(z.enum(["contain", "cover"]), "contain"),
  mediaMaxHeight: z._default(z.int().check(z.gte(100), z.lte(1600)), 510),
  linkTarget: z._default(z.enum(["_blank", "_self"]), "_blank"),
});

export type TwitterOptions = z.input<typeof twitterOptionsSchema>;
export type ResolvedTwitterOptions = z.output<typeof twitterOptionsSchema>;

export function resolveOptions(
  options: TwitterOptions = {},
): ResolvedTwitterOptions {
  const resolved = twitterOptionsSchema.parse(options);
  if (resolved.dateFormat === "relative" && !resolved.referenceTime) {
    throw new Error(
      "Relative dates require referenceTime for stable server and client output.",
    );
  }
  return resolved;
}

export { themeStyles } from "./theme.js";
