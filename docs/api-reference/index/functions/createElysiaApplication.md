# Function: createElysiaApplication()

```ts
function createElysiaApplication(rootModule): Promise<ElysiaNestApplication>;
```

Defined in: [packages/core/src/core/application.factory.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/application.factory.ts#L37)

Creates an Elysia-Nest application with microservices support.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootModule` | `Function` | Root module decorated with @Module() |

## Returns

`Promise`\<[`ElysiaNestApplication`](../../packages/microservices/classes/ElysiaNestApplication.md)\>

ElysiaNestApplication instance

## Example

```typescript
const app = await createElysiaApplication(AppModule);

// Connect Redis microservice
app.connectMicroservice({
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379
  }
});

// Start all microservices
await app.startAllMicroservices();

// Start HTTP server
await app.listen(3000);
```
