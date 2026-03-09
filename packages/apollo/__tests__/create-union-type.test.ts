import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { GraphQLUnionType } from "graphql";

import { Field, ObjectType } from "../src/decorators/type.decorator";
import { Query } from "../src/decorators/query.decorator";
import { Resolver } from "../src/decorators/resolver.decorator";
import { createUnionType } from "../src/helpers/create-union-type";
import { TypeMetadataStorage } from "../src/storages/type-metadata.storage";
import { SchemaBuilder } from "../src/schema-builder";

beforeEach(() => {
  // Re-register module-level fixtures cleared by reset()
  ObjectType()(Cat);
  (Field() as PropertyDecorator)(Cat.prototype, "meow");
  ObjectType()(Dog);
  (Field() as PropertyDecorator)(Dog.prototype, "bark");
  ObjectType()(Bird);
  (Field() as PropertyDecorator)(Bird.prototype, "tweet");
  (Field() as PropertyDecorator)(Bird.prototype, "canFly");
});

afterEach(() => {
  TypeMetadataStorage.reset();
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

@ObjectType()
class Cat {
  @Field()
  meow!: string;
}

@ObjectType()
class Dog {
  @Field()
  bark!: string;
}

@ObjectType()
class Bird {
  @Field()
  tweet!: string;

  @Field()
  canFly!: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const container = {
  get: async (ctor: new () => unknown) => new ctor(),
  register: () => {},
};

function buildSchema(unionCtor: new (...args: unknown[]) => object) {
  @ObjectType()
  class Wrapper {
    @Field(() => unionCtor)
    animal!: typeof unionCtor;
  }

  @Resolver(() => Wrapper)
  class WrapperResolver {
    @Query(() => Wrapper)
    getAnimal(): Wrapper {
      return new Wrapper();
    }
  }

  void WrapperResolver;

  return new SchemaBuilder(container as never).buildSchema();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createUnionType", () => {
  describe("metadata", () => {
    it("stores union metadata on the returned placeholder class", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
      });

      const schema = buildSchema(PetUnion);
      const type = schema.getType("PetUnion");

      expect(type).toBeInstanceOf(GraphQLUnionType);
      const union = type as GraphQLUnionType;
      const memberNames = union.getTypes().map((t) => t.name);
      expect(memberNames).toContain("Cat");
      expect(memberNames).toContain("Dog");
    });

    it("registers description when provided", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
        description: "A cat or a dog",
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      expect(union.description).toBe("A cat or a dog");
    });

    it("supports three or more union members", () => {
      const AnimalUnion = createUnionType({
        name: "AnimalUnion",
        types: () => [Cat, Dog, Bird] as const,
      });

      const schema = buildSchema(AnimalUnion);
      const union = schema.getType("AnimalUnion") as GraphQLUnionType;
      expect(union.getTypes()).toHaveLength(3);
    });
  });

  describe("resolveType — string return", () => {
    it("resolves to the correct type name string", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
        resolveType(value) {
          return "meow" in value ? "Cat" : "Dog";
        },
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      expect(union.resolveType).toBeDefined();
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ meow: "purr" }, {}, null, null)).toBe("Cat");
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ bark: "woof" }, {}, null, null)).toBe("Dog");
    });

    it("returns undefined when resolveType returns null", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
        resolveType() {
          return null;
        },
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ meow: "purr" }, {}, null, null)).toBeUndefined();
    });
  });

  describe("resolveType — constructor return (NestJS-style)", () => {
    it("resolves constructor to the matching type name", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
        resolveType(value) {
          return "meow" in value ? Cat : Dog;
        },
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      expect(union.resolveType).toBeDefined();
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ meow: "purr" }, {}, null, null)).toBe("Cat");
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ bark: "woof" }, {}, null, null)).toBe("Dog");
    });

    it("allows value parameter typed as Record<string, unknown>", () => {
      // This mirrors the NestJS usage pattern from the user's code
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
        resolveType(value: Record<string, unknown>) {
          return "meow" in value ? Cat : Dog;
        },
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ meow: "purr" }, {}, null, null)).toBe("Cat");
    });

    it("resolves three-member union via constructor", () => {
      const AnimalUnion = createUnionType({
        name: "AnimalUnion",
        types: () => [Cat, Dog, Bird] as const,
        resolveType(value: Record<string, unknown>) {
          if ("meow" in value) return Cat;
          if ("bark" in value) return Dog;
          return Bird;
        },
      });

      const schema = buildSchema(AnimalUnion);
      const union = schema.getType("AnimalUnion") as GraphQLUnionType;
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ meow: "x" }, {}, null, null)).toBe("Cat");
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ bark: "x" }, {}, null, null)).toBe("Dog");
      // @ts-expect-error: calling internal resolveType directly for testing
      expect(union.resolveType({ tweet: "x", canFly: true }, {}, null, null)).toBe("Bird");
    });
  });

  describe("resolveType — omitted", () => {
    it("produces a union without a resolveType function when not provided", () => {
      const PetUnion = createUnionType({
        name: "PetUnion",
        types: () => [Cat, Dog] as const,
      });

      const schema = buildSchema(PetUnion);
      const union = schema.getType("PetUnion") as GraphQLUnionType;
      expect(union.resolveType).toBeUndefined();
    });
  });
});
