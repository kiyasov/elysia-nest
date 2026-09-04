# Class: ElysiaNestApplication\<TApp\>

Defined in: [packages/microservices/src/elysia-nest-application.ts:87](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L87)

Top-level application class that ties together an Elysia HTTP server and
one or more microservice transport servers.

The generic parameter `TApp` represents the underlying Elysia instance type.
When you need to export the application type for Eden Treaty, use:

```typescript
const app = await createElysiaApplication(AppModule);
await app.listen(3000);

// Export the Elysia instance type for use with @elysiajs/eden treaty()
export type App = typeof app extends ElysiaNestApplication<infer T> ? T : never;
// or simply:
export type App = ReturnType<typeof app.getHttpServer>;
```

Note: route types from `@Get()` / `@Post()` decorators are registered at
runtime and cannot be inferred into the Elysia generic by TypeScript.
The returned instance has all routes registered at runtime and works with
`treaty<App>()` for HTTP calls.  For fully-typed route generics, declare a
parallel Elysia schema and use it as the `TApp` type parameter.

Typical usage:
```typescript
const app = await createElysiaApplication(AppModule);
app
  .connectMicroservice({ transport: Transport.REDIS, options: { host: 'localhost' } })
  .useGlobalFilters(new HttpExceptionFilter());

await app.startAllMicroservices();
await app.listen(3000);
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TApp` *extends* `AnyElysia` | `Elysia` |

## Constructors

### Constructor

```ts
new ElysiaNestApplication<TApp>(httpServer?): ElysiaNestApplication<TApp>;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:100](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L100)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `httpServer?` | `TApp` |

#### Returns

`ElysiaNestApplication`\<`TApp`\>

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:610](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L610)

Gracefully shuts down all microservice transports and the HTTP server,
triggering the corresponding lifecycle hooks.

#### Returns

`Promise`\<`void`\>

***

### connectMicroservice()

```ts
connectMicroservice(options): this;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:121](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L121)

Registers a new microservice transport.  Supports both built-in transports
(Redis, RabbitMQ, TCP) and custom transport strategies.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`MicroserviceOptions`](../type-aliases/MicroserviceOptions.md) | Transport configuration or a custom strategy instance. |

#### Returns

`this`

`this` for chaining.

#### Example

```typescript
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});
```

***

### getHttpServer()

```ts
getHttpServer(): TApp;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:545](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L545)

Returns the underlying Elysia HTTP server instance.

Use this to export the type for Eden Treaty:
```typescript
export type App = ReturnType<typeof app.getHttpServer>;
// client:
const client = treaty<App>('http://localhost:3000');
```

#### Returns

`TApp`

***

### getMicroservices()

```ts
getMicroservices(): MicroserviceServerInfo[];
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:590](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L590)

Returns all registered microservice descriptors.

#### Returns

[`MicroserviceServerInfo`](../interfaces/MicroserviceServerInfo.md)[]

***

### getUrl()

```ts
getUrl(): string;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:598](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L598)

Returns the base URL of the HTTP server.
Only meaningful after [listen](#listen) has been called.

#### Returns

`string`

***

### initGlobalFilters()

```ts
initGlobalFilters(): this;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:482](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L482)

Ensures HTTP error hooks are registered.
Called internally by [useGlobalFilters](#useglobalfilters) and externally by the core
application factory after all filters have been set up.

#### Returns

`this`

`this` for chaining.

***

### listen()

#### Call Signature

```ts
listen(port, callback?): Promise<void>;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:495](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L495)

Starts the Elysia HTTP server.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `port` | `number` | Port to listen on. |
| `callback?` | () => `void` | Optional callback invoked once the server is ready. |

##### Returns

`Promise`\<`void`\>

#### Call Signature

```ts
listen(
   port, 
   hostname, 
   callback?
): Promise<void>;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:501](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L501)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `port` | `number` | Port to listen on. |
| `hostname` | `string` | Network interface to bind to. |
| `callback?` | () => `void` | Optional callback invoked once the server is ready. |

##### Returns

`Promise`\<`void`\>

***

### setControllers()

```ts
setControllers(controllers): void;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:351](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L351)

Registers controllers whose methods will be scanned for `@MessagePattern`
and `@EventPattern` decorators.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `controllers` | [`Type`](../../../../index/interfaces/Type.md)\<`unknown`\>[] |

#### Returns

`void`

***

### setHttpServer()

```ts
setHttpServer(server): void;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:340](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L340)

Sets (or replaces) the Elysia HTTP server instance.
Applies any already-registered global filters to the new server.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `server` | `TApp` |

#### Returns

`void`

***

### startAllMicroservices()

```ts
startAllMicroservices(): Promise<void>;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:135](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L135)

Starts all registered microservice transports and registers their pattern
handlers.

#### Returns

`Promise`\<`void`\>

***

### useGlobalFilters()

```ts
useGlobalFilters(...filters): this;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:370](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L370)

Registers one or more global exception filters.

Filters are applied to:
1. Microservice message / event handlers.
2. The Elysia HTTP server (via `onError` and `onAfterHandle` hooks).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`filters` | ( \| [`ExceptionFilter`](../../../../index/interfaces/ExceptionFilter.md) \| [`Type`](../../../../index/interfaces/Type.md)\<[`ExceptionFilter`](../../../../index/interfaces/ExceptionFilter.md)\>)[] | Filter class constructors or pre-constructed instances. |

#### Returns

`this`

`this` for chaining.

#### Example

```typescript
app.useGlobalFilters(new HttpExceptionFilter(), ValidationFilter);
```

***

### withSchema()

```ts
withSchema<TSchema>(schema): TSchema;
```

Defined in: [packages/microservices/src/elysia-nest-application.ts:581](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/elysia-nest-application.ts#L581)

Returns the underlying Elysia HTTP server typed as `TSchema`.

Route types from `@Get()` / `@Post()` decorators cannot be inferred by
TypeScript because they are registered at runtime.  Pass a typed Elysia
schema built with the native builder pattern and this method will cast the
live server to that type so `treaty<App>()` clients get full
autocomplete for paths, request bodies, and response shapes.

At runtime the **actual live server** (with all Nestelia routes) is
returned — the schema is only used for its TypeScript type.

```typescript
import { t } from "elysia";

const typedServer = app.withSchema(
  new Elysia()
    .get("/todos", (): Todo[] => [])
    .post("/todos", (): Todo => ({} as Todo), {
      body: t.Object({ title: t.String() }),
    }),
);

export type App = typeof typedServer;
// client:
const client = treaty<App>("http://localhost:3000");
const { data } = await client.todos.get(); // data: Todo[]
```

#### Type Parameters

| Type Parameter |
| ------ |
| `TSchema` *extends* `AnyElysia` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | `TSchema` |

#### Returns

`TSchema`
