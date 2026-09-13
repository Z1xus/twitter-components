import type { TwitterAction } from "./options.js";
export interface TwitterActionDetail {
  action: TwitterAction;
  postId: string;
  url?: string;
  count?: number | string;
  selected?: boolean;
}
export interface TwitterErrorDetail {
  error: unknown;
}
