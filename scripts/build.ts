#!/usr/bin/env bun
/**
 * Build script — compiles nestelia to ESM + CJS + TypeScript declarations.
 *
 * Output structure:
 *   dist/
 *   ├── esm/           ESM (.js)  — "import" condition
 *   ├── cjs/           CJS (.js)  — "require" condition  (has own package.json)
 *   └── types/         .d.ts declarations — "types" condition
 */

import { rmSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir + "/..";

// ─── Entry points ─────────────────────────────────────────────────────────────

const ENTRYPOINTS = [
  "./index.ts",
  "./packages/scheduler/src/index.ts",
  "./packages/microservices/index.ts",
  "./packages/apollo/src/index.ts",
  "./packages/passport/src/index.ts",
  "./packages/testing/src/index.ts",
  "./packages/cache/src/index.ts",
  "./packages/rabbitmq/src/index.ts",
  "./packages/graphql-pubsub/src/index.ts",
  "./packages/drizzle/src/index.ts",
];

// All peer + optional dependencies — must NOT be bundled
const EXTERNAL = [
  "elysia",
  "nestelia",                  // self-import in sub-packages (e.g. apollo)
  "reflect-metadata",
  "@sinclair/typebox",
  "cron",
  "class-validator",
  "class-transformer",
  "@apollo/server",
  "@graphql-tools/schema",
  "graphql",
  "graphql-ws",
  "cache-manager",
  "cacheable",
  "keyv",
  "ioredis",
  "rxjs",
  "passport",
  "amqplib",
  "drizzle-orm",
];

// ─── Clean dist ───────────────────────────────────────────────────────────────

console.log("Cleaning dist/...");
rmSync(join(ROOT, "dist"), { recursive: true, force: true });

// ─── ESM build ────────────────────────────────────────────────────────────────

console.log("Building ESM...");
const esm = await Bun.build({
  entrypoints: ENTRYPOINTS.map((e) => join(ROOT, e)),
  outdir: join(ROOT, "dist/esm"),
  target: "node",
  format: "esm",
  splitting: true,
  external: EXTERNAL,
  minify: false,
});

if (!esm.success) {
  console.error("ESM build failed:");
  for (const log of esm.logs) console.error(log);
  process.exit(1);
}
console.log(`  ${esm.outputs.length} files written to dist/esm`);

// ─── CJS build ────────────────────────────────────────────────────────────────

console.log("Building CJS...");
const cjs = await Bun.build({
  entrypoints: ENTRYPOINTS.map((e) => join(ROOT, e)),
  outdir: join(ROOT, "dist/cjs"),
  target: "node",
  format: "cjs",
  splitting: true,
  external: EXTERNAL,
  minify: false,
});

if (!cjs.success) {
  console.error("CJS build failed:");
  for (const log of cjs.logs) console.error(log);
  process.exit(1);
}
console.log(`  ${cjs.outputs.length} files written to dist/cjs`);

// Node needs this to treat .js files inside dist/cjs as CommonJS
writeFileSync(join(ROOT, "dist/cjs/package.json"), JSON.stringify({ type: "commonjs" }, null, 2));

// ─── TypeScript declarations ──────────────────────────────────────────────────

console.log("Generating type declarations...");
const tsc = Bun.spawnSync(
  ["bunx", "tsc", "-p", "tsconfig.build.json", "--noEmit", "false"],
  { cwd: ROOT, stdout: "pipe", stderr: "pipe" },
);

const tscStderr = new TextDecoder().decode(tsc.stderr);
const tscStdout = new TextDecoder().decode(tsc.stdout);
const tscOutput = (tscStdout + tscStderr).trim();

if (tsc.exitCode !== 0) {
  // Print errors as warnings — noEmitOnError: false means .d.ts files are still emitted
  if (tscOutput) {
    console.warn("tsc warnings (declarations still generated):\n" + tscOutput);
  }
}
console.log("  declarations written to dist/types");

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log("\nBuild complete.");
