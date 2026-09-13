import type { TwitterOptions } from "./options.js";

const palettes = {
  dark: {
    bg: "#000",
    fg: "#e7e9ea",
    muted: "#71767b",
    border: "#2f3336",
    "thread-line": "#333639",
  },
  light: {
    bg: "#fff",
    fg: "#0f1419",
    muted: "#536471",
    border: "#cfd9de",
    "thread-line": "#cfd9de",
  },
  dim: {
    bg: "#15202b",
    fg: "#f7f9f9",
    muted: "#8b98a5",
    border: "#38444d",
    "thread-line": "#38444d",
  },
};

function themeRule(selector: string, palette: keyof typeof palettes): string {
  const declarations = Object.entries(palettes[palette])
    .map(([name, value]) => `--twitter-theme-${name}:${value}`)
    .join(";");
  return `${selector}{${declarations}}`;
}

export const themeStyles = [
  themeRule(":host", "dark"),
  themeRule(':host([theme="light"])', "light"),
  themeRule(':host([theme="dim"])', "dim"),
  `@media(prefers-color-scheme:light){${themeRule(':host([theme="auto"])', "light")}}`,
].join("\n");

export function selectedThemeStyles(theme: TwitterOptions["theme"]): string {
  if (theme === "light" || theme === "dim") return themeRule(":host", theme);
  if (theme === "auto")
    return `@media(prefers-color-scheme:light){${themeRule(":host", "light")}}`;
  return "";
}

export function colorScheme(theme: TwitterOptions["theme"]): string {
  if (theme === "light") return "light";
  return theme === "auto" ? "light dark" : "dark";
}
