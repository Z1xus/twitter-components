import { rm } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist", { recursive: true, force: true });
await build({
  entryPoints: [
    "src/index.ts",
    "src/server.ts",
    "src/elements.ts",
    "src/register.ts",
  ],
  outdir: "dist",
  platform: "browser",
  target: "es2022",
  format: "esm",
  bundle: true,
  splitting: true,
  external: ["zod"],
  minify: true,
  legalComments: "none",
  sourcemap: "external",
});
