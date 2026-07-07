import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { GraphQLObjectType } from "graphql";

import { GUARDS_METADATA, PARAMS_METADATA, UseGuards } from "nestelia";
import {
  ARGS_METADATA,
  CONTEXT_METADATA,
  INFO_METADATA,
  PARENT_METADATA,
} from "../src/decorators/constants";
import { Args } from "../src/decorators/args.decorator";
import { Context } from "../src/decorators/ctx.decorator";
import { FieldResolver } from "../src/decorators/field-resolver.decorator";
import { Info } from "../src/decorators/info.decorator";
import { Parent } from "../src/decorators/parent.decorator";
import { Query } from "../src/decorators/query.decorator";
import { Resolver } from "../src/decorators/resolver.decorator";
import { Field, ObjectType } from "../src/decorators/type.decorator";
import { SchemaBuilder } from "../src/schema-builder";
import { TypeMetadataStorage } from "../src/storages/type-metadata.storage";

/**
 * Perf regression guard (issue A2): the immutable per-resolver reflect-metadata
 * reads (@Args / @Parent / @Context / @Info / factory params / guards) must be
 * hoisted to schema-build time so that each resolver invocation performs ZERO
 * `Reflect.getMetadata` reads for those keys.
 */

/** Metadata keys that must only ever be read at schema-build time. */
const HOISTED_KEYS = new Set<string>([
  ARGS_METADATA,
  PARENT_METADATA,
  CONTEXT_METADATA,
  INFO_METADATA,
  PARAMS_METADATA,
  GUARDS_METADATA,
]);

const originalGetMetadata = Reflect.getMetadata;
let counts: Record<string, number> = {};

function installCounter(): void {
  counts = {};
  (Reflect as unknown as { getMetadata: typeof Reflect.getMetadata }).getMetadata =
    ((metadataKey: unknown, target: unknown, propertyKey?: unknown) => {
      if (typeof metadataKey === "string" && HOISTED_KEYS.has(metadataKey)) {
        counts[metadataKey] = (counts[metadataKey] ?? 0) + 1;
      }
      return (originalGetMetadata as unknown as (...a: unknown[]) => unknown)(
        metadataKey,
        target,
        propertyKey,
      );
    }) as typeof Reflect.getMetadata;
}

function uninstallCounter(): void {
  (Reflect as unknown as { getMetadata: typeof Reflect.getMetadata }).getMetadata =
    originalGetMetadata;
}

function snapshot(): Record<string, number> {
  return { ...counts };
}

function resetCounts(): void {
  counts = {};
}

function totalHoistedReads(snap: Record<string, number>): number {
  let total = 0;
  for (const key of HOISTED_KEYS) {
    total += snap[key] ?? 0;
  }
  return total;
}

class AllowGuard {
  static calls = 0;
  canActivate(): boolean {
    AllowGuard.calls += 1;
    return true;
  }
}

const container = {
  get: async (ctor: new () => unknown) => new ctor(),
  register: () => {},
};

beforeEach(() => {
  AllowGuard.calls = 0;
});

afterEach(() => {
  uninstallCounter();
  TypeMetadataStorage.reset();
});

describe("SchemaBuilder – resolver metadata hoisting (perf A2)", () => {
  it("reads hoisted metadata at build time and NEVER per invocation", async () => {
    @ObjectType()
    class Author {
      @Field()
      id!: string;

      @Field()
      name!: string;
    }

    @Resolver(() => Author)
    @UseGuards(AllowGuard)
    class AuthorResolver {
      @Query(() => Author)
      author(
        @Args("id") id: string,
        @Context() ctx: { tag?: string },
        @Info() _info: unknown,
      ): Author {
        return { id, name: `ctx:${ctx?.tag ?? "none"}` };
      }

      @FieldResolver(() => String)
      displayName(@Parent() parent: Author): string {
        return `Mr. ${parent.name}`;
      }
    }

    void AuthorResolver;

    installCounter();

    // ── Build phase ────────────────────────────────────────────────────────
    const schema = new SchemaBuilder(container as never).buildSchema();
    const authorField = schema.getQueryType()!.getFields()["author"];
    const authorType = schema.getType("Author") as GraphQLObjectType;
    // Force lazy object-type field thunk (triggers createResolver for @FieldResolver).
    const displayNameField = authorType.getFields()["displayName"];

    const buildCounts = snapshot();

    // The reads MUST have happened during build (proves the hoist).
    expect(totalHoistedReads(buildCounts)).toBeGreaterThan(0);
    expect(buildCounts[ARGS_METADATA] ?? 0).toBeGreaterThan(0);
    expect(buildCounts[CONTEXT_METADATA] ?? 0).toBeGreaterThan(0);
    expect(buildCounts[INFO_METADATA] ?? 0).toBeGreaterThan(0);
    expect(buildCounts[PARENT_METADATA] ?? 0).toBeGreaterThan(0);
    expect(buildCounts[PARAMS_METADATA] ?? 0).toBeGreaterThan(0);
    expect(buildCounts[GUARDS_METADATA] ?? 0).toBeGreaterThan(0);

    // ── Invocation phase ───────────────────────────────────────────────────
    resetCounts();

    const INVOCATIONS = 5;
    for (let i = 0; i < INVOCATIONS; i++) {
      const result = (await authorField.resolve!(
        undefined,
        { id: String(i) },
        { tag: "X" },
        {} as never,
        // biome-ignore lint/suspicious/noExplicitAny: test invocation
      )) as any;
      expect(result).toEqual({ id: String(i), name: "ctx:X" });

      const fieldResult = await displayNameField.resolve!(
        { id: String(i), name: "Ada" },
        {},
        {},
        {} as never,
      );
      expect(fieldResult).toBe("Mr. Ada");
    }

    const invokeCounts = snapshot();

    // Zero reflect-metadata reads of hoisted keys across all invocations.
    expect(totalHoistedReads(invokeCounts)).toBe(0);
    for (const key of HOISTED_KEYS) {
      expect(invokeCounts[key] ?? 0).toBe(0);
    }

    // Behavior preserved: the class-level guard runs for every guarded
    // resolver invocation (the query AND the field resolver, both on
    // AuthorResolver) — twice per loop iteration.
    expect(AllowGuard.calls).toBe(INVOCATIONS * 2);
  });
});
