# Function: createElysiaPlugin()

```ts
function createElysiaPlugin(
   _target, 
   metadata, 
   moduleinstance): (app) => Promise<Elysia<"", {
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

Defined in: [packages/core/src/core/elysia-plugin.factory.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/elysia-plugin.factory.ts#L33)

Helper function to create the Elysia plugin from module metadata.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `_target` | `any` |
| `metadata` | [`ModuleOptions`](../interfaces/ModuleOptions.md) |
| `moduleinstance` | `any` |

## Returns

```ts
(app): Promise<Elysia<"", {
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

### Parameters

| Parameter | Type |
| ------ | ------ |
| `app` | `Elysia` |

### Returns

`Promise`\<`Elysia`\<`""`, \{
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
