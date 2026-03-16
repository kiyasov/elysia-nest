#!/usr/bin/env bun
/**
 * nestelia-gen — static schema generator (ts-morph edition).
 *
 * Reads @Controller / @Get / @Post / ... decorators and generates a fully-typed
 * Elysia schema file — including return types from TypeScript annotations.
 *
 * Usage:
 *   bunx nestelia-gen [--tsconfig <path>] [output-file]
 *
 * Examples:
 *   bunx nestelia-gen                               # → src/app.schema.ts
 *   bunx nestelia-gen src/schema.ts
 *   bunx nestelia-gen --tsconfig tsconfig.app.json src/schema.ts
 */

import {
  Project,
  Node,
  SyntaxKind,
  type Decorator,
  type SourceFile,
} from "ts-morph";
import { resolve, relative, dirname } from "node:path";
import { writeFileSync, readFileSync } from "node:fs";

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let tsConfigPath = "tsconfig.json";
let outputArg: string | undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--tsconfig" && args[i + 1]) {
    tsConfigPath = args[++i]!;
  } else {
    outputArg = args[i];
  }
}

const cwd = process.cwd();
const outputFile = resolve(cwd, outputArg ?? "src/app.schema.ts");
const outputDir = dirname(outputFile);

// ─── ts-morph project ────────────────────────────────────────────────────────

const project = new Project({
  tsConfigFilePath: resolve(cwd, tsConfigPath),
});

// ─── Constants ───────────────────────────────────────────────────────────────

const HTTP_METHODS: Record<string, string> = {
  Get: "get",
  Post: "post",
  Put: "put",
  Patch: "patch",
  Delete: "delete",
};

// ─── Data structures ─────────────────────────────────────────────────────────

interface Route {
  method: string;
  path: string;
  returnType: string; // TypeScript type text, e.g. "Todo | null"
  body?: string; // TypeBox expression text, e.g. "t.Object({ title: t.String() })"
  params?: string;
  query?: string;
}

// importMap: typeName → { isType, fromPath (relative to output) }
const importMap = new Map<string, { isType: boolean; from: string }>();
const routes: Route[] = [];

// ─── Source file walker ──────────────────────────────────────────────────────

for (const sf of project.getSourceFiles()) {
  if (sf.isDeclarationFile()) continue;
  if (sf.getFilePath().includes("node_modules")) continue;

  for (const classDecl of sf.getClasses()) {
    const ctrlDec = classDecl.getDecorator("Controller");
    if (!ctrlDec) continue;

    const prefix = stringLiteralOrEmpty(ctrlDec, 0);

    for (const method of classDecl.getMethods()) {
      let httpMethod: string | undefined;
      let routePath = "/";

      for (const dec of method.getDecorators()) {
        const m = HTTP_METHODS[dec.getName()];
        if (m) {
          httpMethod = m;
          routePath = stringLiteralOrEmpty(dec, 0) || "/";
          break;
        }
      }

      if (!httpMethod) continue;

      // ── Return type ────────────────────────────────────────────────────────
      const returnTypeNode = method.getReturnTypeNode();
      let returnType = "unknown";
      if (returnTypeNode) {
        returnType = returnTypeNode.getText();
        collectReturnTypeImports(returnType, sf);
      }

      // ── Parameter decorators: @Body, @Param, @Query ────────────────────────
      let body: string | undefined;
      let params: string | undefined;
      let query: string | undefined;

      for (const param of method.getParameters()) {
        for (const dec of param.getDecorators()) {
          const arg = dec.getArguments()[0];
          if (!arg) continue;
          const expr = resolveExpression(arg, sf);
          if (dec.getName() === "Body") body = expr;
          else if (dec.getName() === "Param") params = expr;
          else if (dec.getName() === "Query") query = expr;
        }
      }

      routes.push({
        method: httpMethod,
        path: joinPaths(prefix, routePath),
        returnType,
        body,
        params,
        query,
      });
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stringLiteralOrEmpty(dec: Decorator, index: number): string {
  const arg = dec.getArguments()[index];
  if (arg && Node.isStringLiteral(arg)) return arg.getLiteralValue();
  return "";
}

function joinPaths(...parts: string[]): string {
  const joined = ("/" + parts.join("/")).replace(/\/+/g, "/");
  // strip trailing slash unless it's the root "/"
  return joined.length > 1 ? joined.replace(/\/$/, "") : joined;
}

/**
 * Given a decorator argument node, return the corresponding TypeBox expression
 * text. If the node is an identifier (e.g. `TodoBody`), look up its definition
 * in the same file or in the file it was imported from, and return the
 * initializer expression text instead of the variable name.
 */
function resolveExpression(node: Node, sf: SourceFile): string {
  if (!Node.isIdentifier(node)) return node.getText();

  const name = node.getText();

  // Try local variable declarations first
  const local = sf.getVariableDeclaration(name);
  if (local) {
    const init = local.getInitializer();
    if (init) return init.getText();
  }

  // Try named imports
  for (const imp of sf.getImportDeclarations()) {
    for (const named of imp.getNamedImports()) {
      if (named.getName() !== name) continue;
      const importedSf = imp.getModuleSpecifierSourceFile();
      if (!importedSf) continue;
      const varDecl = importedSf.getVariableDeclaration(
        named.getAliasNode()?.getText() ?? name,
      );
      if (varDecl) {
        const init = varDecl.getInitializer();
        if (init) return init.getText();
      }
    }
  }

  return name; // fallback — use identifier as-is
}

/**
 * Scan `typeText` for identifiers that are imported in `sf`, then record
 * those imports (with paths adjusted to be relative to the output file).
 */
function collectReturnTypeImports(typeText: string, sf: SourceFile): void {
  for (const imp of sf.getImportDeclarations()) {
    const impSf = imp.getModuleSpecifierSourceFile();
    // Keep track of both resolved source files and raw specifiers (e.g. "elysia")
    const absPath = impSf?.getFilePath();

    for (const named of imp.getNamedImports()) {
      const typeName = named.getName();
      if (!new RegExp(`\\b${typeName}\\b`).test(typeText)) continue;
      if (importMap.has(typeName)) continue;

      // Compute the import specifier for the generated file
      let fromSpec: string;
      if (absPath) {
        // Local file — compute a relative path from the output file's directory
        fromSpec =
          "./" +
          relative(outputDir, absPath)
            .replace(/\\/g, "/")
            .replace(/\.tsx?$/, "");
      } else {
        // External package — keep the original specifier
        fromSpec = imp.getModuleSpecifierValue();
      }

      importMap.set(typeName, {
        isType: named.isTypeOnly() || imp.isTypeOnly(),
        from: fromSpec,
      });
    }
  }
}

// ─── Code generation ─────────────────────────────────────────────────────────

if (routes.length === 0) {
  console.warn(
    "Warning: no routes found. Make sure your source files are included in tsconfig.json.",
  );
}

// Build import statements grouped by module
const importsByModule = new Map<string, { types: string[]; values: string[] }>();
for (const [name, { isType, from }] of importMap) {
  const entry = importsByModule.get(from) ?? { types: [], values: [] };
  if (isType) entry.types.push(name);
  else entry.values.push(name);
  importsByModule.set(from, entry);
}

const importLines = [
  `import { Elysia, t } from "elysia";`,
  ...[...importsByModule.entries()].flatMap(([from, { types, values }]) => {
    const lines: string[] = [];
    if (types.length)
      lines.push(`import type { ${types.join(", ")} } from "${from}";`);
    if (values.length)
      lines.push(`import { ${values.join(", ")} } from "${from}";`);
    return lines;
  }),
].join("\n");

function buildOptions(route: Route): string {
  const opts: string[] = [];
  if (route.body) opts.push(`    body: ${route.body}`);
  if (route.params) opts.push(`    params: ${route.params}`);
  if (route.query) opts.push(`    query: ${route.query}`);
  if (!opts.length) return "";
  return `, {\n${opts.join(",\n")}\n  }`;
}

function buildHandler(returnType: string): string {
  if (returnType === "unknown") return "(): unknown => undefined";
  // "undefined as never" satisfies any return type annotation
  return `(): ${returnType} => undefined as never`;
}

const chain = routes
  .map(
    (r) =>
      `  .${r.method}("${r.path}", ${buildHandler(r.returnType)}${buildOptions(r)})`,
  )
  .join("\n");

const banner = [
  "// This file is auto-generated by nestelia-gen — do not edit manually.",
  "//",
  "// Re-generate with:",
  `//   bunx nestelia-gen ${outputArg ?? ""}`.trimEnd(),
].join("\n");

const output = `${banner}
${importLines}

export const appSchema = new Elysia()
${chain};

export type App = typeof appSchema;
`;

let existing: string | undefined;
try { existing = readFileSync(outputFile, "utf8"); } catch {}
if (existing !== output) {
  writeFileSync(outputFile, output, "utf8");
  console.log(`Written ${routes.length} routes → ${outputFile}`);
} else {
  console.log(`Up to date → ${outputFile}`);
}

process.exit(0);
