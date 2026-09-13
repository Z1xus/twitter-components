import { readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build, transform } from "esbuild";

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
  plugins: [
    {
      name: "component-styles",
      setup(build) {
        build.onResolve({ filter: /\.css\?raw$/ }, (args) => ({
          path: resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
          namespace: "component-styles",
        }));
        build.onLoad(
          { filter: /.*/, namespace: "component-styles" },
          async (args) => {
            const { code } = await transform(
              await readFile(args.path, "utf8"),
              {
                loader: "css",
                minify: true,
              },
            );
            return { contents: code, loader: "text" };
          },
        );
      },
    },
  ],
});
