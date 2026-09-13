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

export const themeStyles = `
:host { --twitter-theme-bg:#000; --twitter-theme-fg:#e7e9ea; --twitter-theme-muted:#71767b; --twitter-theme-border:#2f3336; --twitter-theme-thread-line:#333639; }
:host([theme="light"]) { --twitter-theme-bg:#fff; --twitter-theme-fg:#0f1419; --twitter-theme-muted:#536471; --twitter-theme-border:#cfd9de; --twitter-theme-thread-line:#cfd9de; }
:host([theme="dim"]) { --twitter-theme-bg:#15202b; --twitter-theme-fg:#f7f9f9; --twitter-theme-muted:#8b98a5; --twitter-theme-border:#38444d; --twitter-theme-thread-line:#38444d; }
@media(prefers-color-scheme:light) { :host([theme="auto"]) { --twitter-theme-bg:#fff; --twitter-theme-fg:#0f1419; --twitter-theme-muted:#536471; --twitter-theme-border:#cfd9de; --twitter-theme-thread-line:#cfd9de; } }
`;
