import * as esbuild from "esbuild";
import fs from "node:fs";
// Pages serves docs/; the Tab workspace builds into site/ (OUT_DIR=site).
const out = process.env.OUT_DIR || "docs";
fs.rmSync(`${out}/js`, { recursive: true, force: true });
await esbuild.build({ entryPoints: ["src/main.js"], bundle: true, splitting: true, format: "esm", outdir: `${out}/js`, minify: true, target: ["es2020"], legalComments: "none", chunkNames: "[name]-[hash]", logLevel: "info" });
