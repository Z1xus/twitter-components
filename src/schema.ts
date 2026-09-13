import { z } from "zod";

const localAsset = z.string().refine((value) => {
  if (/^\/(?!\/)[a-zA-Z0-9/_.,%-]+$/.test(value) && !value.includes(".."))
    return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Expected a root-relative asset or HTTPS URL");
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "Expected an HTTPS URL without credentials");
const postUrl = z
  .string()
  .regex(/^https:\/\/x\.com\/[a-zA-Z0-9_]{1,15}\/status\/\d+$/);
const count = z.union([
  z.number().int().nonnegative(),
  z.string().regex(/^\d+(?:[.,]\d+)?[KMB]$/i),
]);

export const twitterImageSchema = z.object({
  src: localAsset,
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
const bodySchema = z.object({
  id: z.string().min(1).optional(),
  author: z.string().min(1),
  handle: z.string().regex(/^[a-zA-Z0-9_]{1,15}$/),
  avatar: localAsset.optional(),
  verified: z.boolean().optional(),
  url: postUrl.optional(),
  timestamp: z.iso.datetime().optional(),
  dateLabel: z.string().optional(),
  content: z.string(),
  images: z.array(twitterImageSchema).max(4).optional(),
  links: z
    .array(z.object({ text: z.string().min(1), url: httpsUrl }))
    .optional(),
});
export const twitterPostSchema = bodySchema.extend({
  replyTo: z.string().min(1).optional(),
  replyingTo: z.array(z.string().regex(/^[a-zA-Z0-9_]{1,15}$/)).optional(),
  stats: z
    .object({
      replies: count.optional(),
      reposts: count.optional(),
      likes: count.optional(),
      views: count.optional(),
      bookmarks: count.optional(),
      quotes: count.optional(),
    })
    .optional(),
  quote: bodySchema.optional(),
  state: z
    .object({
      liked: z.boolean().optional(),
      reposted: z.boolean().optional(),
      bookmarked: z.boolean().optional(),
    })
    .optional(),
  card: z
    .object({
      url: httpsUrl.optional(),
      domain: z.string(),
      title: z.string(),
      description: z.string().optional(),
      image: twitterImageSchema.optional(),
    })
    .optional(),
});
export const twitterAvatarSchema = twitterPostSchema.pick({
  author: true,
  handle: true,
  avatar: true,
});
export const twitterHeaderSchema = twitterPostSchema.pick({
  author: true,
  handle: true,
  verified: true,
  url: true,
  timestamp: true,
  dateLabel: true,
});
export const twitterContentSchema = twitterPostSchema.pick({
  content: true,
  links: true,
});
export type TwitterAvatar = z.infer<typeof twitterAvatarSchema>;
export type TwitterHeader = z.infer<typeof twitterHeaderSchema>;
export type TwitterContent = z.infer<typeof twitterContentSchema>;
export const twitterThreadSchema = z.object({
  label: z.string().min(1),
  note: z.string().optional(),
  capturedAt: z.iso.datetime().optional(),
  posts: z.array(twitterPostSchema).min(1),
});
export type TwitterImage = z.infer<typeof twitterImageSchema>;
export type TwitterPost = z.infer<typeof twitterPostSchema>;
export type TwitterThread = z.infer<typeof twitterThreadSchema>;
export type TwitterThreads = ReadonlyMap<string, TwitterThread>;
export function postId(post: Pick<TwitterPost, "url" | "id">): string {
  return post.id ?? post.url?.split("/").at(-1) ?? "";
}

export const twitterProfileSchema = twitterAvatarSchema.extend({
  url: httpsUrl.optional(),
  verified: z.boolean().optional(),
  banner: twitterImageSchema.optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.object({ url: httpsUrl, label: z.string() }).optional(),
  joined: z.string().optional(),
  following: count.optional(),
  followers: count.optional(),
  posts: count.optional(),
});
export type TwitterProfile = z.infer<typeof twitterProfileSchema>;
