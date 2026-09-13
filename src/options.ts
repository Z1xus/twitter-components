import { z } from "zod";

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
  theme: z.enum(["dark", "light", "dim", "auto"]).default("dark"),
  layout: z.enum(["timeline", "detail"]).default("timeline"),
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
  countFormat: z.enum(["compact", "full", "hidden"]).default("compact"),
  showZeroCounts: z.boolean().default(false),
  showBookmarkCount: z.boolean().default(false),
  actions: z
    .array(z.enum(actionNames))
    .refine(
      (items) => new Set(items).size === items.length,
      "Actions must be unique",
    )
    .default(["reply", "repost", "like", "views", "bookmark", "share"]),
  actionMode: z.enum(["link", "event", "static"]).default("static"),
  repostCount: z.enum(["combined", "reposts"]).default("combined"),
  dateFormat: z.enum(["short", "full", "relative"]).default("short"),
  locale: z
    .string()
    .refine((value) => {
      try {
        new Intl.NumberFormat(value);
        return true;
      } catch {
        return false;
      }
    }, "Invalid locale")
    .default("en-US"),
  timeZone: z
    .string()
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Invalid time zone")
    .default("UTC"),
  referenceTime: z.iso.datetime().optional(),
  showMedia: z.boolean().default(true),
  showGrok: z.boolean().default(true),
  showMenu: z.boolean().default(false),
  showConnections: z.boolean().default(true),
  mediaFit: z.enum(["contain", "cover"]).default("contain"),
  mediaMaxHeight: z.number().int().min(100).max(1600).default(510),
  linkTarget: z.enum(["_blank", "_self"]).default("_blank"),
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
