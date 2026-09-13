import type { ResolvedTwitterOptions } from "./options.js";

export function formatCount(
  value: number | string | undefined,
  options: Pick<
    ResolvedTwitterOptions,
    "countFormat" | "showZeroCounts" | "locale"
  >,
): string {
  if (
    value === undefined ||
    options.countFormat === "hidden" ||
    (!value && !options.showZeroCounts)
  )
    return "";
  if (typeof value === "string") return value;
  return new Intl.NumberFormat(options.locale, {
    notation: options.countFormat === "full" ? "standard" : "compact",
    maximumFractionDigits: options.countFormat === "full" ? 0 : 1,
  }).format(value);
}

export function formatDate(
  timestamp: string,
  options: ResolvedTwitterOptions,
): string {
  const date = new Date(timestamp);
  if (options.dateFormat === "relative") {
    const seconds =
      (date.getTime() - new Date(options.referenceTime!).getTime()) / 1000;
    const magnitude = Math.abs(seconds);
    const [divisor, unit] =
      magnitude < 60
        ? [1, "second"]
        : magnitude < 3600
          ? [60, "minute"]
          : magnitude < 86400
            ? [3600, "hour"]
            : [86400, "day"];
    return new Intl.RelativeTimeFormat(options.locale, {
      numeric: "auto",
      style: "narrow",
    }).format(
      Math.trunc(seconds / Number(divisor)),
      unit as Intl.RelativeTimeFormatUnit,
    );
  }
  return new Intl.DateTimeFormat(options.locale, {
    month: "short",
    day: "numeric",
    timeZone: options.timeZone,
    ...(options.dateFormat === "full"
      ? ({ year: "numeric", hour: "2-digit", minute: "2-digit" } as const)
      : {}),
  }).format(date);
}
