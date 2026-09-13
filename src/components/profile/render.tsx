import type { TwitterProfile } from "../../schema.js";
import {
  resolveOptions,
  themeStyles,
  type TwitterOptions,
  type ResolvedTwitterOptions,
} from "../../options.js";
import { formatCount } from "../../format.js";
import { element, payload } from "../base.js";
import { h, raw } from "../../html.js";
import { Link } from "../shared.js";
import { renderContent } from "../content/render.js";
import { icon } from "../icons.js";
import styles from "./styles.css?raw";

function ProfileStats({
  profile,
  options,
}: {
  profile: TwitterProfile;
  options: ResolvedTwitterOptions;
}) {
  const stats = [
    [profile.following, "Following"],
    [profile.followers, "Followers"],
    [profile.posts, "Posts"],
  ] as const;
  return (
    <div class="stats" part="stats">
      {stats.map(([value, label]) => {
        const count = formatCount(value, options);
        return count !== "" ? (
          <span>
            <strong>{count}</strong>
            {` ${label}`}
          </span>
        ) : null;
      })}
    </div>
  );
}

export function renderProfile(
  profile: TwitterProfile,
  settings: TwitterOptions = {},
): string {
  const options = resolveOptions(settings);
  const url = profile.url ?? `https://x.com/${profile.handle}`;
  return element(
    "twitter-profile",
    themeStyles + styles,
    <section part="profile" aria-label={`Profile of ${profile.author}`}>
      <slot name="banner">
        {profile.banner ? (
          <img
            class="banner"
            part="banner"
            src={profile.banner.src}
            alt={profile.banner.alt}
            width={profile.banner.width}
            height={profile.banner.height}
          />
        ) : (
          <div class="banner" part="banner"></div>
        )}
      </slot>
      <div class="body">
        <div class="top">
          <slot name="avatar">
            <div class="avatar" part="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.author} />
              ) : (
                profile.author.slice(0, 1)
              )}
            </div>
          </slot>
          <slot name="actions"></slot>
        </div>
        <div class="identity" part="identity">
          <Link href={url} class="name">
            {profile.author}
            {profile.verified && raw(icon("verified", "verified"))}
          </Link>
          <Link href={url} class="handle">{`@${profile.handle}`}</Link>
        </div>
        <slot name="bio">
          <div part="bio">
            {profile.bio && raw(renderContent({ content: profile.bio }))}
          </div>
        </slot>
        <slot name="details">
          <div class="details" part="details">
            {profile.location && <span>{profile.location}</span>}
            {profile.website && (
              <Link href={profile.website.url}>{profile.website.label}</Link>
            )}
            {profile.joined && <span>{`Joined ${profile.joined}`}</span>}
          </div>
        </slot>
        <slot name="stats">
          <ProfileStats profile={profile} options={options} />
        </slot>
      </div>
      <slot></slot>
    </section>,
    payload(profile, options) + ` theme="${options.theme}"`,
  );
}
