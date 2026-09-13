import type { TwitterPost } from "../../schema.js";
import { element } from "../base.js";
import { h } from "../../html.js";
import { Image, Link } from "../shared.js";
import styles from "./styles.css?raw";

export function renderCard(card: NonNullable<TwitterPost["card"]>): string {
  return element(
    "twitter-card",
    styles,
    <Link href={card.url}>
      {card.image && <Image image={card.image} />}
      <div class="info">
        <div class="domain">{card.domain}</div>
        <div class="title">{card.title}</div>
        {card.description && <div class="description">{card.description}</div>}
      </div>
    </Link>,
  );
}
