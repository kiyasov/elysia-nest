# Function: createElysiaNestApplication()

```ts
function createElysiaNestApplication(server?): ElysiaNestApplication;
```

Defined in: [packages/microservices/factory.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/factory.ts#L37)

Creates a bare [ElysiaNestApplication](../classes/ElysiaNestApplication.md) that wraps an already-configured
Elysia instance.

**When to use this function:**
Use it only when you are **not** using the `@Module` decorator system.
If you do use modules, call `createElysiaApplication(AppModule)` from
`src/core/application.factory` instead – it handles DI, controllers,
providers, and lifecycle hooks automatically and returns an
`ElysiaNestApplication` ready to connect microservices.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `server?` | `Elysia`\<`""`, \{ `decorator`: \{ \}; `derive`: \{ \}; `resolve`: \{ \}; `store`: \{ \}; \}, \{ `error`: \{ \}; `typebox`: \{ \}; \}, \{ `macro`: \{ \}; `macroFn`: \{ \}; `parser`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}, \{ \}, \{ `derive`: \{ \}; `resolve`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}, \{ `derive`: \{ \}; `resolve`: \{ \}; `response`: \{ \}; `schema`: \{ \}; `standaloneSchema`: \{ \}; \}\> | A pre-configured Elysia application. When omitted the instance can still host microservice transports; attach an HTTP server later via [ElysiaNestApplication.setHttpServer](../classes/ElysiaNestApplication.md#sethttpserver). |

## Returns

[`ElysiaNestApplication`](../classes/ElysiaNestApplication.md)

## Example

```typescript
// Typical module-based usage (preferred):
const app = await createElysiaApplication(AppModule); // from src/core
app.connectMicroservice({ transport: Transport.REDIS, options: {} });
await app.startAllMicroservices();
await app.listen(3000);

// Direct (non-module) usage:
const elysiaApp = new Elysia().get('/health', () => 'ok');
const app = createElysiaNestApplication(elysiaApp);
app.connectMicroservice({ transport: Transport.TCP, options: { port: 4000 } });
await app.startAllMicroservices();
await app.listen(3000);
```
