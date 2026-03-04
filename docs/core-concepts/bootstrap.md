---
title: Bootstrap
icon: power
description: Initialize and start your @kiyasov/elysia-nest application
---

The `createElysiaApplication` function initializes the root module and returns an Elysia instance ready to listen for requests.

## Basic Usage

```typescript
import { createElysiaApplication } from "@kiyasov/elysia-nest";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## What createElysiaApplication Does

1. **Resolves the module tree** — processes imports, providers, and controllers recursively
2. **Registers providers** — adds all providers to the DI container
3. **Instantiates controllers** — creates controller instances with dependencies injected
4. **Registers routes** — maps decorated methods to Elysia routes
5. **Runs lifecycle hooks** — calls `onModuleInit` and `onApplicationBootstrap` in order
6. **Returns an ElysiaNestApplication** — ready to call `.listen()`

## With Microservices

When using the microservices package, `createElysiaApplication` returns an `ElysiaNestApplication` that supports hybrid HTTP + microservice mode:

```typescript
import { createElysiaApplication } from "@kiyasov/elysia-nest";
import { Transport } from "@kiyasov/elysia-nest/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## Graceful Shutdown

@kiyasov/elysia-nest supports shutdown lifecycle hooks. When the process receives a termination signal:

1. `BeforeApplicationShutdown` hooks run first
2. `OnModuleDestroy` hooks run for cleanup
3. `OnApplicationShutdown` hooks run last

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
