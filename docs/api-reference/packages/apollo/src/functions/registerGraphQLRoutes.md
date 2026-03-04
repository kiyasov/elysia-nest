# Function: registerGraphQLRoutes()

```ts
function registerGraphQLRoutes(
   app, 
   apolloService, 
   path): void;
```

Defined in: [packages/apollo/src/graphql.controller.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/graphql.controller.ts#L60)

Registers GraphQL HTTP routes on the Elysia application.
Handles GET, POST, and OPTIONS requests for the GraphQL endpoint.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `app` | `Elysia` | Elysia application instance. |
| `apolloService` | [`ApolloService`](../classes/ApolloService.md) | Apollo service instance. |
| `path` | `string` | GraphQL endpoint path. |

## Returns

`void`

## Example

```typescript
const app = new Elysia();
const apolloService = new ApolloService(options, app);
await apolloService.start();
registerGraphQLRoutes(app, apolloService, '/graphql');
```
