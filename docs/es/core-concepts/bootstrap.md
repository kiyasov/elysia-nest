---
title: Bootstrap
icon: power
description: Inicializa y arranca tu aplicación nestelia
---

La función `createElysiaApplication` inicializa el módulo raíz y devuelve una instancia de Elysia lista para escuchar solicitudes.

## Uso Básico

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Qué hace createElysiaApplication

1. **Resuelve el árbol de módulos** — procesa imports, proveedores y controladores de forma recursiva
2. **Registra proveedores** — agrega todos los proveedores al contenedor de DI
3. **Instancia controladores** — crea instancias de los controladores con las dependencias inyectadas
4. **Registra rutas** — mapea los métodos decorados a rutas de Elysia
5. **Ejecuta hooks de ciclo de vida** — llama a `onModuleInit` y `onApplicationBootstrap` en orden
6. **Devuelve un ElysiaNestApplication** — listo para llamar a `.listen()`

## Con Microservicios

Al usar el paquete de microservicios, `createElysiaApplication` devuelve un `ElysiaNestApplication` que soporta el modo híbrido HTTP + microservicio:

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## Apagado Controlado

nestelia soporta hooks de ciclo de vida para el apagado. Cuando el proceso recibe una señal de terminación:

1. Los hooks `BeforeApplicationShutdown` se ejecutan primero
2. Los hooks `OnModuleDestroy` se ejecutan para la limpieza
3. Los hooks `OnApplicationShutdown` se ejecutan al final

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
