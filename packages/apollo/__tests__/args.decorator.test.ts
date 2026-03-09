import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";

import {
  Args,
  getOperationArgsDefinitions,
} from "../src/decorators/args.decorator";
import {
  Field,
  InputType,
  Int,
  ObjectType,
} from "../src/decorators/type.decorator";
import { Mutation } from "../src/decorators/mutation.decorator";
import { Query } from "../src/decorators/query.decorator";
import {
  TypeMetadataStorage,
} from "../src/storages/type-metadata.storage";
import { SchemaBuilder } from "../src/schema-builder";

beforeEach(() => {
  // Re-register module-level fixtures cleared by reset()
  InputType()(CreatePostInput);
  (Field() as PropertyDecorator)(CreatePostInput.prototype, "title");
  (Field({ nullable: true }) as PropertyDecorator)(CreatePostInput.prototype, "body");
  ObjectType()(Post);
  (Field() as PropertyDecorator)(Post.prototype, "id");
  (Field() as PropertyDecorator)(Post.prototype, "title");
});

afterEach(() => {
  TypeMetadataStorage.reset();
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

@InputType()
class CreatePostInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  body?: string;
}

@ObjectType()
class Post {
  @Field()
  id!: string;

  @Field()
  title!: string;
}

// ── getOperationArgsDefinitions ───────────────────────────────────────────────

describe("getOperationArgsDefinitions", () => {
  it("infers InputType from design:paramtypes when type option is omitted", () => {
    class PostResolver {
      @Mutation(() => Post)
      createPost(@Args("input") _input: CreatePostInput): Post {
        return { id: "1", title: "x" };
      }
    }

    const defs = getOperationArgsDefinitions(
      PostResolver.prototype,
      "createPost",
    );

    expect(defs).toHaveLength(1);
    expect(defs[0].name).toBe("input");
    expect(defs[0].typeFn).toBeFunction();
    expect(defs[0].typeFn!()).toBe(CreatePostInput);
  });

  it("uses explicit type option when provided", () => {
    class PostResolver {
      @Mutation(() => Post)
      createPost(
        @Args("input", { type: () => CreatePostInput }) _input: CreatePostInput,
      ): Post {
        return { id: "1", title: "x" };
      }
    }

    const defs = getOperationArgsDefinitions(
      PostResolver.prototype,
      "createPost",
    );

    expect(defs[0].typeFn!()).toBe(CreatePostInput);
  });

  it("infers String scalar from design:paramtypes", () => {
    class PostResolver {
      @Query(() => Post)
      post(@Args("id") _id: string): Post {
        return { id: _id, title: "x" };
      }
    }

    const defs = getOperationArgsDefinitions(PostResolver.prototype, "post");

    expect(defs).toHaveLength(1);
    expect(defs[0].typeFn!()).toBe(String);
  });

  it("infers Number from design:paramtypes", () => {
    class PostResolver {
      @Query(() => Post)
      posts(@Args("limit") _limit: number): Post[] {
        return [];
      }
    }

    const defs = getOperationArgsDefinitions(PostResolver.prototype, "posts");

    expect(defs[0].typeFn!()).toBe(Number);
  });

  it("infers Boolean from design:paramtypes", () => {
    class PostResolver {
      @Query(() => Post)
      posts(@Args("published") _published: boolean): Post[] {
        return [];
      }
    }

    const defs = getOperationArgsDefinitions(PostResolver.prototype, "posts");

    expect(defs[0].typeFn!()).toBe(Boolean);
  });

  it("handles multiple named args with mixed explicit/inferred types", () => {
    class PostResolver {
      @Query(() => Post)
      posts(
        @Args("id") _id: string,
        @Args("limit", { type: () => Int }) _limit: number,
      ): Post[] {
        return [];
      }
    }

    const defs = getOperationArgsDefinitions(PostResolver.prototype, "posts");
    const byName = Object.fromEntries(defs.map((d) => [d.name, d]));

    expect(byName["id"].typeFn!()).toBe(String);
    expect(byName["limit"].typeFn!()).toBe(Int);
  });

  it("preserves nullable and description alongside inferred type", () => {
    class PostResolver {
      @Query(() => Post)
      posts(
        @Args("search", { nullable: true, description: "search term" })
        _search: string,
      ): Post[] {
        return [];
      }
    }

    const defs = getOperationArgsDefinitions(PostResolver.prototype, "posts");

    expect(defs[0].nullable).toBe(true);
    expect(defs[0].description).toBe("search term");
    expect(defs[0].typeFn!()).toBe(String);
  });
});

// ── Schema builder integration ─────────────────────────────────────────────────

describe("SchemaBuilder – InputType arg inference", () => {
  function buildSchema() {
    const container = {
      get: async (ctor: new () => unknown) => new ctor(),
      register: () => {},
    };
    return new SchemaBuilder(container as never).buildSchema();
  }

  it("generates InputObjectType arg when type is inferred (no explicit type option)", () => {
    class PostResolver {
      @Mutation(() => Post)
      createPost(@Args("input") _input: CreatePostInput): Post {
        return { id: "1", title: "x" };
      }
    }

    const schema = buildSchema();
    const field = schema.getMutationType()!.getFields()["createPost"];
    const inputArg = field.args.find((a) => a.name === "input");

    // Should be NonNull(CreatePostInput), NOT String
    expect(inputArg!.type).toBeInstanceOf(GraphQLNonNull);
    const inner = (inputArg!.type as GraphQLNonNull<GraphQLInputObjectType>)
      .ofType;
    expect(inner).toBeInstanceOf(GraphQLInputObjectType);
    expect(inner.name).toBe("CreatePostInput");
  });

  it("generates InputObjectType arg when type is explicit", () => {
    class PostResolver {
      @Mutation(() => Post)
      createPost(
        @Args("input", { type: () => CreatePostInput }) _input: CreatePostInput,
      ): Post {
        return { id: "1", title: "x" };
      }
    }

    const schema = buildSchema();
    const field = schema.getMutationType()!.getFields()["createPost"];
    const inputArg = field.args.find((a) => a.name === "input");
    const inner = (inputArg!.type as GraphQLNonNull<GraphQLInputObjectType>)
      .ofType;

    expect(inner).toBeInstanceOf(GraphQLInputObjectType);
    expect(inner.name).toBe("CreatePostInput");
  });

  it("generates String arg when inferred from string param", () => {
    class PostResolver {
      @Query(() => Post)
      post(@Args("id") _id: string): Post {
        return { id: _id, title: "x" };
      }
    }

    const schema = buildSchema();
    const field = schema.getQueryType()!.getFields()["post"];
    const idArg = field.args.find((a) => a.name === "id");

    expect(
      (idArg!.type as GraphQLNonNull<typeof GraphQLString>).ofType,
    ).toBe(GraphQLString);
  });

  it("generates Int arg when explicit Int type is used", () => {
    class PostResolver {
      @Query(() => Post)
      posts(@Args("limit", { type: () => Int }) _limit: number): Post[] {
        return [];
      }
    }

    const schema = buildSchema();
    const field = schema.getQueryType()!.getFields()["posts"];
    const limitArg = field.args.find((a) => a.name === "limit");

    expect(
      (limitArg!.type as GraphQLNonNull<typeof GraphQLInt>).ofType,
    ).toBe(GraphQLInt);
  });

  it("generates nullable String arg correctly", () => {
    class PostResolver {
      @Query(() => Post)
      posts(
        @Args("search", { nullable: true }) _search: string,
      ): Post[] {
        return [];
      }
    }

    const schema = buildSchema();
    const field = schema.getQueryType()!.getFields()["posts"];
    const searchArg = field.args.find((a) => a.name === "search");

    // nullable → no NonNull wrapper
    expect(searchArg!.type).toBe(GraphQLString);
  });
});
