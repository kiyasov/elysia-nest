# Function: createElysiaPlugin()

```ts
function createElysiaPlugin(
   _target, 
   metadata, 
   moduleinstance
): (app) => Promise<Elysia<"", {
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
}>>;
```

Defined in: [packages/core/src/core/elysia-plugin.factory.ts:32](https://github.com/nestelia/nestelia/blob/main/packages/core/src/core/elysia-plugin.factory.ts#L32)

Helper function to create the Elysia plugin from module metadata.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `_target` | `any` |
| `metadata` | [`ModuleOptions`](../interfaces/ModuleOptions.md) |
| `moduleinstance` | `any` |

## Returns

(`app`) => `Promise`\<`Elysia`\<`""`, \{
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
\}\>\>
