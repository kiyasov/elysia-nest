import "reflect-metadata";

import { describe, expect, it, mock } from "bun:test";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLError, type FormattedExecutionResult } from "graphql";
import { createElysiaApplication, Module } from "nestelia";

import { GraphQLModule } from "../src/graphql.module";
import type { ApolloOptions } from "../src/interfaces";

describe("GraphQLModule HTTP integration", () => {
  it.each(["schema", "typeDefs", "async"] as const)(
    "%s: executes operations, reports errors, and shuts Apollo down",
    async (mode) => {
      let count = 0;
      const stopped = mock(async () => {});
      const typeDefs = `
        type Query {
          count: Int!
          token: String
          denied: String
        }
        type Mutation { increment(by: Int!): Int! }
      `;
      const resolvers = {
        Query: {
          count: () => count,
          token: (_root: unknown, _args: unknown, context: { token: string | null }) =>
            context.token,
          denied: () => {
            throw new GraphQLError("denied", { extensions: { code: "FORBIDDEN" } });
          },
        },
        Mutation: {
          increment: (_root: unknown, { by }: { by: number }) => (count += by),
        },
      };
      const options: ApolloOptions = {
        playground: false,
        context: ({ request }) => ({ token: request.headers.get("authorization") }),
        plugins: [{ serverWillStart: async () => ({ serverWillStop: stopped }) }],
        ...(mode === "schema"
          ? { schema: makeExecutableSchema({ typeDefs, resolvers }) }
          : { typeDefs, resolvers }),
      };

      @Module({
        imports: [
          mode === "async"
            ? GraphQLModule.forRootAsync({ useFactory: async () => options })
            : GraphQLModule.forRoot(options),
        ],
      })
      class AppModule {}

      const app = await createElysiaApplication(AppModule);
      const server = app.getHttpServer();
      await app.listen(0);
      const url = new URL("/graphql", server.server!.url);
      const post = (query: string, variables?: Record<string, unknown>) =>
        fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: "test-token" },
          body: JSON.stringify({ query, variables }),
        });

      try {
        const query = await post("{ count token }");
        expect(query.status).toBe(200);
        expect(await query.json()).toEqual({ data: { count: 0, token: "test-token" } });

        const mutation = await post("mutation($by: Int!) { increment(by: $by) }", { by: 3 });
        expect(mutation.status).toBe(200);
        expect(await mutation.json()).toEqual({ data: { increment: 3 } });

        const invalidVariables = await post("mutation($by: Int!) { increment(by: $by) }", {
          by: "invalid",
        });
        expect(invalidVariables.status).toBe(400);
        const variableResult = (await invalidVariables.json()) as FormattedExecutionResult;
        expect(variableResult.errors?.[0]?.extensions?.code).toBe("BAD_USER_INPUT");
        expect(count).toBe(3);

        const invalidQuery = await post("{ unknownField }");
        expect(invalidQuery.status).toBe(400);
        const validationResult = (await invalidQuery.json()) as FormattedExecutionResult;
        expect(validationResult.errors?.[0]?.extensions?.code).toBe("GRAPHQL_VALIDATION_FAILED");

        const denied = await post("{ denied count }");
        expect(denied.status).toBe(200);
        const errorResult = (await denied.json()) as FormattedExecutionResult;
        expect(errorResult.data).toEqual({ denied: null, count: 3 });
        expect(errorResult.errors?.[0]?.extensions?.code).toBe("FORBIDDEN");

        const introspection = await fetch(
          `${url}?${new URLSearchParams({
            query: "{ __schema { queryType { name } mutationType { name } } }",
          })}`,
        );
        expect(introspection.status).toBe(200);
        expect(await introspection.json()).toEqual({
          data: { __schema: { queryType: { name: "Query" }, mutationType: { name: "Mutation" } } },
        });
      } finally {
        await app.close();
      }
      expect(stopped).toHaveBeenCalledTimes(1);
    },
  );
});
