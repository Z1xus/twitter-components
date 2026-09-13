import { mkdir, writeFile } from "node:fs/promises";
import {
  componentMetadata,
  optionAttributes,
  optionKey,
} from "../src/metadata";
import { resolveOptions } from "../src/options";
const directory = "docs/src/content/docs/components";
await mkdir(directory, { recursive: true });
const defaults = resolveOptions();
const attributes = Object.entries(optionAttributes).map(([name, type]) => ({
  name,
  fieldName: optionKey(name),
  type: { text: type === "list" ? "string" : type },
  default: JSON.stringify(Reflect.get(defaults, optionKey(name))),
}));
const css = [
  "bg",
  "fg",
  "muted",
  "border",
  "thread-line",
  "accent",
  "font-family",
].map((name) => ({ name: `--twitter-${name}` }));
await writeFile(
  "custom-elements.json",
  JSON.stringify(
    {
      schemaVersion: "1.0.0",
      modules: [
        {
          kind: "javascript-module",
          path: "dist/elements.js",
          declarations: componentMetadata.map((component) => ({
            kind: "class",
            name: component.className,
            tagName: `twitter-${component.name}`,
            customElement: true,
            description: component.description,
            attributes: attributes.map(
              ({ fieldName, ...attribute }) => attribute,
            ),
            members: [
              { kind: "field", name: "data", type: { text: component.data } },
              {
                kind: "field",
                name: "options",
                type: { text: "TwitterOptions" },
              },
            ],
            slots: component.slots.map((name) => ({ name })),
            cssParts: component.parts.map((name) => ({ name })),
            cssProperties: css,
            events: [
              {
                name: "twitter-action",
                type: { text: "CustomEvent<TwitterActionDetail>" },
              },
              {
                name: "twitter-copy",
                type: { text: "CustomEvent<{url: string}>" },
              },
              {
                name: "twitter-error",
                type: { text: "CustomEvent<TwitterErrorDetail>" },
              },
            ],
          })),
        },
      ],
    },
    null,
    2,
  ) + "\n",
);
for (const component of componentMetadata) {
  const example =
    component.name === "profile"
      ? `
## Example

\`\`\`js
import { renderTwitterProfile } from 'twitter-components/server'

const html = renderTwitterProfile({
  author: 'John Doe',
  handle: 'john_doe',
  avatar: '/avatar.svg',
  bio: 'im john doe and im real',
  url: 'https://z1x.us',
  website: { url: 'https://z1x.us', label: 'z1x.us' },
  following: 42,
  followers: '1.2K',
  joined: 'September 2026'
})
\`\`\`

Use the default slot for posts below the profile. The actions slot is empty until you supply controls.
`
      : "";
  const text = `---\ntitle: twitter-${component.name}\ndescription: ${component.description}\n---\n\n${component.description}\n\n## Data\n\nAssign a \`${component.data}\` object to \`.data\`. Assign display settings to \`.options\`. Reassign the object to update the component.\n\n\`\`\`js\nimport 'twitter-components/register'\nconst element = document.querySelector('twitter-${component.name}')\nelement.data = data\nelement.options = { theme: 'dark', countFormat: 'full' }\n\`\`\`\n\n${example ? example + "\n" : ""}## Slots\n\n${component.slots.length ? component.slots.map((name) => `- \`${name || "default"}\``).join("\n") : "This component has no slots. Place a replacement in a post slot."}\n\n## CSS parts\n\n${component.parts.length ? component.parts.map((name) => `- \`${name}\``).join("\n") : "Use inherited CSS custom properties to style this component."}\n\nSee [settings](/settings/) for the shared options and [composition](/composition/) for slots and events. Each component uses only the settings that apply to it.\n`;
  await writeFile(`${directory}/${component.name}.md`, text);
}
await writeFile(
  "docs/src/content/docs/settings.md",
  `---\ntitle: Settings\ndescription: Every shared display option and its default.\n---\n\nUse camelCase keys in \`.options\` or the HTML attributes below. An attribute overrides the matching object setting. Remove it to use the object value again. Boolean attributes accept \`false\`. An empty boolean attribute means true.\n\n| HTML attribute | JavaScript key | Default |\n| --- | --- | --- |\n${attributes.map((a) => `| \`${a.name}\` | \`${a.fieldName}\` | \`${a.default ?? "undefined"}\` |`).join("\n")}\n\n## Counts\n\n\`compact\` uses locale-aware abbreviations. \`full\` uses group separators. \`hidden\` hides the visible value but keeps the exact accessible label. Missing values remain unknown. A preformatted string such as \`2.9K\` keeps its original precision in every count format. \`showZeroCounts\` controls whether zero values appear.\n\nStore raw reposts in \`stats.reposts\` and quotes in \`stats.quotes\`. The repost count combines them by default. Set \`repostCount: 'reposts'\` for reposts alone. The optional quote action always shows quotes alone.\n\n## Actions\n\nPass an ordered array of \`reply\`, \`repost\`, \`quote\`, \`like\`, \`views\`, \`bookmark\`, and \`share\`. An empty array hides all actions. \`link\` opens the original post and enables copy-link. \`event\` sends an event for your app to handle. \`static\` displays values without active controls. Counts change only when your app updates the data.\n\nIn detail layout, views appear beside the timestamp instead of repeating in the action row.\n\n## Dates and media\n\nRelative dates require an explicit ISO \`referenceTime\` so server and browser output agree. Supply a new reference time to refresh the label. Posts support one to four images with alt text. Video playback and live X data fetching are not part of version 0.1.\n`,
);
