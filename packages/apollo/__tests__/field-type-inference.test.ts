import "reflect-metadata";

import { afterEach, describe, expect, it } from "bun:test";
import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from "graphql";

import { Field, ObjectType } from "../src/decorators/type.decorator";
import { Query } from "../src/decorators/query.decorator";
import { Resolver } from "../src/decorators/resolver.decorator";
import { registerEnumType } from "../src/helpers/register-enum-type";
import { TypeMetadataStorage } from "../src/storages/type-metadata.storage";
import { SchemaBuilder } from "../src/schema-builder";

afterEach(() => {
  TypeMetadataStorage.reset();
});

const container = {
  get: async (ctor: new () => unknown) => new ctor(),
  register: () => {},
};

// ── Fixtures ──────────────────────────────────────────────────────────────────

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("@Field() type inference", () => {
  describe("primitives — inferred automatically", () => {
    it("infers String for string fields", () => {
      @ObjectType()
      class User {
        @Field()
        name!: string;
      }

      @Resolver(() => User)
      class UserResolver {
        @Query(() => User)
        user(): User {
          return new User();
        }
      }

      void UserResolver;

      const schema = new SchemaBuilder(container as never).buildSchema();
      const type = schema.getType("User");
      expect(type).toBeDefined();
    });
  });

  describe("Object design:type — throws immediately at decoration time", () => {
    it("throws when @Field() is used on a property typed as object (lowercase)", () => {
      // TypeScript emits design:type = Object (global) for `object` (lowercase) typed properties,
      // as well as union types, intersection types, and some complex generics.
      expect(() => {
        @ObjectType()
        class Profile {
          @Field()
          value!: object;
        }
        void Profile;
      }).toThrow(/cannot infer the GraphQL type/);
    });
  });

  describe("explicit type factory — always works", () => {
    it("resolves enum type when @Field(() => EnumType) and registerEnumType are both used", () => {
      registerEnumType(Role, { name: "Role" });

      @ObjectType()
      class User {
        @Field(() => Role)
        role!: Role;

        @Field()
        name!: string;
      }

      @Resolver(() => User)
      class UserResolver {
        @Query(() => User)
        user(): User {
          return new User();
        }
      }

      void UserResolver;

      const schema = new SchemaBuilder(container as never).buildSchema();
      const userType = schema.getType("User");
      expect(userType).toBeDefined();

      const roleField = (schema.getType("User") as any).getFields()["role"];
      const innerType = (roleField.type as GraphQLNonNull<GraphQLEnumType>).ofType;
      expect(innerType).toBeInstanceOf(GraphQLEnumType);
      expect(innerType.name).toBe("Role");
    });

    it("throws at schema build time when registerEnumType is missing", () => {
      // Status is NOT registered with registerEnumType — schema builder should throw.
      // Note: since the enum has no ENUM_METADATA, the type name in the message
      // won't be "Status" but the error itself is thrown correctly.
      @ObjectType()
      class Profile {
        @Field(() => Status)
        status!: Status;
      }

      @Resolver(() => Profile)
      class ProfileResolver {
        @Query(() => Profile)
        profile(): Profile {
          return new Profile();
        }
      }

      void ProfileResolver;

      expect(() =>
        new SchemaBuilder(container as never).buildSchema()
      ).toThrow(/Cannot determine GraphQL type|If this is an enum, call registerEnumType/);
    });

    it("includes ClassName.fieldName in the error when type factory returns undefined", () => {
      @ObjectType()
      class MyResponse {
        @Field()
        name!: string;

        // typeFn returns undefined — reaches resolveScalarOrRef null/undefined branch
        @Field(() => undefined as any)
        broken!: string;
      }

      @Resolver(() => MyResponse)
      class MyResolver {
        @Query(() => MyResponse)
        myQuery(): MyResponse {
          return new MyResponse();
        }
      }

      void MyResolver;

      expect(() =>
        new SchemaBuilder(container as never).buildSchema()
      ).toThrow(/MyResponse\.broken/);
    });

    it("resolves two enum fields independently", () => {
      registerEnumType(Role, { name: "Role" });
      registerEnumType(Status, { name: "Status" });

      @ObjectType()
      class User {
        @Field(() => Role)
        role!: Role;

        @Field(() => Status)
        status!: Status;
      }

      @Resolver(() => User)
      class UserResolver {
        @Query(() => User)
        user(): User {
          return new User();
        }
      }

      void UserResolver;

      const schema = new SchemaBuilder(container as never).buildSchema();
      const fields = (schema.getType("User") as any).getFields();

      const roleInner = (fields["role"].type as GraphQLNonNull<GraphQLEnumType>).ofType;
      expect(roleInner).toBeInstanceOf(GraphQLEnumType);
      expect(roleInner.name).toBe("Role");

      const statusInner = (fields["status"].type as GraphQLNonNull<GraphQLEnumType>).ofType;
      expect(statusInner).toBeInstanceOf(GraphQLEnumType);
      expect(statusInner.name).toBe("Status");
    });

    it("string field still resolves to GraphQLString without explicit type", () => {
      @ObjectType()
      class Item {
        @Field()
        title!: string;
      }

      @Resolver(() => Item)
      class ItemResolver {
        @Query(() => Item)
        item(): Item {
          return new Item();
        }
      }

      void ItemResolver;

      const schema = new SchemaBuilder(container as never).buildSchema();
      const fields = (schema.getType("Item") as any).getFields();
      const titleInner = (fields["title"].type as GraphQLNonNull<typeof GraphQLString>).ofType;
      expect(titleInner).toBe(GraphQLString);
    });
  });
});
