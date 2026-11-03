import * as z from "zod/mini";

const localAsset = z.string().check(
  z.refine((value) => {
    if (/^\/(?!\/)[a-zA-Z0-9/_.,%-]+$/.test(value) && !value.includes(".."))
      return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "Expected a root-relative asset or HTTPS URL"),
);
const httpsUrl = z.url().check(
  z.refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  }, "Expected an HTTPS URL without credentials"),
);
const postUrl = z
  .string()
  .check(z.regex(/^https:\/\/x\.com\/[a-zA-Z0-9_]{1,15}\/status\/\d+$/));
const handle = z.string().check(z.regex(/^[a-zA-Z0-9_]{1,15}$/));
const nonEmpty = z.string().check(z.minLength(1));
const count = z.union([
  z.int().check(z.nonnegative()),
  z.string().check(z.regex(/^\d+(?:[.,]\d+)?[KMB]$/i)),
]);

export const twitterImageSchema = z.object({
  src: localAsset,
  alt: z.string(),
  width: z.int().check(z.positive()),
  height: z.int().check(z.positive()),
});
const bodySchema = z.object({
  id: z.optional(nonEmpty),
  author: nonEmpty,
  handle,
  avatar: z.optional(localAsset),
  verified: z.optional(z.boolean()),
  url: z.optional(postUrl),
  timestamp: z.optional(z.iso.datetime()),
  dateLabel: z.optional(z.string()),
  content: z.string(),
  images: z.optional(z.array(twitterImageSchema).check(z.maxLength(4))),
  links: z.optional(z.array(z.object({ text: nonEmpty, url: httpsUrl }))),
});
export const twitterPostSchema = z.extend(bodySchema, {
  replyTo: z.optional(nonEmpty),
  replyingTo: z.optional(z.array(handle)),
  stats: z.optional(
    z.object({
      replies: z.optional(count),
      reposts: z.optional(count),
      likes: z.optional(count),
      views: z.optional(count),
      bookmarks: z.optional(count),
      quotes: z.optional(count),
    }),
  ),
  quote: z.optional(bodySchema),
  state: z.optional(
    z.object({
      liked: z.optional(z.boolean()),
      reposted: z.optional(z.boolean()),
      bookmarked: z.optional(z.boolean()),
    }),
  ),
  card: z.optional(
    z.object({
      url: z.optional(httpsUrl),
      domain: z.string(),
      title: z.string(),
      description: z.optional(z.string()),
      image: z.optional(twitterImageSchema),
    }),
  ),
});
export const twitterAvatarSchema = z.pick(twitterPostSchema, {
  author: true,
  handle: true,
  avatar: true,
});
export const twitterHeaderSchema = z.pick(twitterPostSchema, {
  author: true,
  handle: true,
  verified: true,
  url: true,
  timestamp: true,
  dateLabel: true,
});
export const twitterContentSchema = z.pick(twitterPostSchema, {
  content: true,
  links: true,
});
export type TwitterAvatar = z.infer<typeof twitterAvatarSchema>;
export type TwitterHeader = z.infer<typeof twitterHeaderSchema>;
export type TwitterContent = z.infer<typeof twitterContentSchema>;
export const twitterThreadSchema = z.object({
  label: nonEmpty,
  note: z.optional(z.string()),
  capturedAt: z.optional(z.iso.datetime()),
  posts: z.array(twitterPostSchema).check(z.minLength(1)),
});
export type TwitterImage = z.infer<typeof twitterImageSchema>;
export type TwitterPost = z.infer<typeof twitterPostSchema>;
export type TwitterThread = z.infer<typeof twitterThreadSchema>;
export type TwitterThreads = ReadonlyMap<string, TwitterThread>;
export function postId(post: Pick<TwitterPost, "url" | "id">): string {
  return post.id ?? post.url?.split("/").at(-1) ?? "";
}

export const twitterProfileSchema = z.extend(twitterAvatarSchema, {
  url: z.optional(httpsUrl),
  verified: z.optional(z.boolean()),
  banner: z.optional(twitterImageSchema),
  bio: z.optional(z.string()),
  location: z.optional(z.string()),
  website: z.optional(z.object({ url: httpsUrl, label: z.string() })),
  joined: z.optional(z.string()),
  following: z.optional(count),
  followers: z.optional(count),
  posts: z.optional(count),
});
export type TwitterProfile = z.infer<typeof twitterProfileSchema>;
