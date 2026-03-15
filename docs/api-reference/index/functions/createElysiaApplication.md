# Function: createElysiaApplication()

```ts
function createElysiaApplication(rootModule, options?): Promise<ElysiaNestApplication<Elysia<"", {
  decorator: {
  };
  derive: {
  };
  resolve: {
  };
  store: {
  };
}, {
  error: {
  };
  typebox: {
  };
}, {
  macro: {
  };
  macroFn: {
  };
  parser: {
  };
  response: {
  };
  schema: {
  };
  standaloneSchema: {
  };
}, {
}, {
  derive: {
  };
  resolve: {
  };
  response: {
  };
  schema: {
  };
  standaloneSchema: {
  };
}, {
  derive: {
  };
  resolve: {
  };
  response: {
  };
  schema: {
  };
  standaloneSchema: {
  };
}>>>;
```

Defined in: [packages/core/src/core/application.factory.ts:57](https://github.com/nestelia/nestelia/blob/main/packages/core/src/core/application.factory.ts#L57)

Creates an Elysia-Nest application with microservices support.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootModule` | `Function` | Root module decorated with @Module() |
| `options?` | [`ApplicationOptions`](../interfaces/ApplicationOptions.md) | Application options (logger, etc.) |

## Returns

`Promise`\<[`ElysiaNestApplication`](../../packages/microservices/src/classes/ElysiaNestApplication.md)\<`Elysia`\<`""`, \{
  `decorator`: \{
  \};
  `derive`: \{
  \};
  `resolve`: \{
  \};
  `store`: \{
  \};
\}, \{
  `error`: \{
  \};
  `typebox`: \{
  \};
\}, \{
  `macro`: \{
  \};
  `macroFn`: \{
  \};
  `parser`: \{
  \};
  `response`: \{
  \};
  `schema`: \{
  \};
  `standaloneSchema`: \{
  \};
\}, \{
\}, \{
  `derive`: \{
  \};
  `resolve`: \{
  \};
  `response`: \{
  \};
  `schema`: \{
  \};
  `standaloneSchema`: \{
  \};
\}, \{
  `derive`: \{
  \};
  `resolve`: \{
  \};
  `response`: \{
  \};
  `schema`: \{
  \};
  `standaloneSchema`: \{
  \};
\}\>\>\>

ElysiaNestApplication instance

## Example

```typescript
const app = await createElysiaApplication(AppModule);

// Disable logging
const app = await createElysiaApplication(AppModule, { logger: false });

// Custom log levels
const app = await createElysiaApplication(AppModule, { logger: ['error', 'warn'] });
```
