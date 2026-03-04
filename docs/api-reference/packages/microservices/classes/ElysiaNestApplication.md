# Class: ElysiaNestApplication

Defined in: [packages/microservices/elysia-nest-application.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L66)

Top-level application class that ties together an Elysia HTTP server and
one or more microservice transport servers.

Typical usage:
```typescript
const app = createElysiaNestApplication(new Elysia());
app
  .connectMicroservice({ transport: Transport.REDIS, options: { host: 'localhost' } })
  .useGlobalFilters(new HttpExceptionFilter());

await app.startAllMicroservices();
await app.listen(3000);
```

## Constructors

### Constructor

```ts
new ElysiaNestApplication(httpServer?): ElysiaNestApplication;
```

Defined in: [packages/microservices/elysia-nest-application.ts:81](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L81)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `httpServer?` | `Elysia`\<`""`, \{ `decorator`: \{ \}; `derive`: \{ \}; `resolve`: \{ \}; `store`: \{ \}; \}, \{ `error`: \{ \}; `typebox`: \{ \}; \}, \{ `macro`: \{ \}; `macroFn`: \{ \}; `parser`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}, \{ \}, \{ `derive`: \{ \}; `resolve`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}, \{ `derive`: \{ \}; `resolve`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}\> |

#### Returns

`ElysiaNestApplication`

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [packages/microservices/elysia-nest-application.ts:581](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L581)

Gracefully shuts down all microservice transports and the HTTP server,
triggering the corresponding lifecycle hooks.

#### Returns

`Promise`\<`void`\>

***

### connectMicroservice()

```ts
connectMicroservice(options): this;
```

Defined in: [packages/microservices/elysia-nest-application.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L102)

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
getHttpServer(): Elysia;
```

Defined in: [packages/microservices/elysia-nest-application.ts:553](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L553)

Returns the underlying Elysia HTTP server instance.

#### Returns

`Elysia`

***

### getMicroservices()

```ts
getMicroservices(): MicroserviceServerInfo[];
```

Defined in: [packages/microservices/elysia-nest-application.ts:561](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L561)

Returns all registered microservice descriptors.

#### Returns

[`MicroserviceServerInfo`](../interfaces/MicroserviceServerInfo.md)[]

***

### getUrl()

```ts
getUrl(): string;
```

Defined in: [packages/microservices/elysia-nest-application.ts:569](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L569)

Returns the base URL of the HTTP server.
Only meaningful after [listen](#listen) has been called.

#### Returns

`string`

***

### initGlobalFilters()

```ts
initGlobalFilters(): this;
```

Defined in: [packages/microservices/elysia-nest-application.ts:493](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L493)

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

Defined in: [packages/microservices/elysia-nest-application.ts:506](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L506)

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
callback?): Promise<void>;
```

Defined in: [packages/microservices/elysia-nest-application.ts:512](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L512)

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

Defined in: [packages/microservices/elysia-nest-application.ts:373](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L373)

Registers controllers whose methods will be scanned for `@MessagePattern`
and `@EventPattern` decorators.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `controllers` | [`Type`](../../../index/interfaces/Type.md)\<`unknown`\>[] |

#### Returns

`void`

***

### setHttpServer()

```ts
setHttpServer(server): void;
```

Defined in: [packages/microservices/elysia-nest-application.ts:362](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L362)

Sets (or replaces) the Elysia HTTP server instance.
Applies any already-registered global filters to the new server.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `server` | `Elysia` |

#### Returns

`void`

***

### startAllMicroservices()

```ts
startAllMicroservices(): Promise<void>;
```

Defined in: [packages/microservices/elysia-nest-application.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L116)

Starts all registered microservice transports and registers their pattern
handlers.

#### Returns

`Promise`\<`void`\>

***

### useGlobalFilters()

```ts
useGlobalFilters(...filters): this;
```

Defined in: [packages/microservices/elysia-nest-application.ts:392](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L392)

Registers one or more global exception filters.

Filters are applied to:
1. Microservice message / event handlers.
2. The Elysia HTTP server (via `onError` and `onAfterHandle` hooks).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`filters` | ( \| [`ExceptionFilter`](../../../index/interfaces/ExceptionFilter.md) \| [`Type`](../../../index/interfaces/Type.md)\<[`ExceptionFilter`](../../../index/interfaces/ExceptionFilter.md)\>)[] | Filter class constructors or pre-constructed instances. |

#### Returns

`this`

`this` for chaining.

#### Example

```typescript
app.useGlobalFilters(new HttpExceptionFilter(), ValidationFilter);
```
