# Function: createElysiaNestApplicationWithControllers()

```ts
function createElysiaNestApplicationWithControllers(server, controllers?): ElysiaNestApplication;
```

Defined in: [packages/microservices/factory.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/factory.ts#L66)

Creates a new [ElysiaNestApplication](../classes/ElysiaNestApplication.md) with a set of controllers
pre-registered for pattern handler scanning.

Like [createElysiaNestApplication](createElysiaNestApplication.md), this bypasses the module system.
Prefer `createElysiaApplication(AppModule)` for module-based apps.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `server` | `Elysia` | `undefined` | A pre-configured Elysia application. |
| `controllers` | [`Type`](../../../index/interfaces/Type.md)\<`unknown`\>[] | `[]` | Controller classes to scan for `@MessagePattern` and `@EventPattern` decorators. |

## Returns

[`ElysiaNestApplication`](../classes/ElysiaNestApplication.md)

## Example

```typescript
const elysiaApp = new Elysia().get('/health', () => 'ok');
const app = createElysiaNestApplicationWithControllers(elysiaApp, [
  MathController,
  OrdersController,
]);
app.connectMicroservice({ transport: Transport.REDIS, options: {} });
await app.startAllMicroservices();
await app.listen(3000);
```
