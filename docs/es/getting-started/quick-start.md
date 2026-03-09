---
title: Inicio Rápido
icon: zap
description: Construye una API CRUD con nestelia en 5 minutos
---

Esta guía te lleva paso a paso a construir una API simple de usuarios con nestelia.

## 1. Crear el Servicio

Los servicios contienen la lógica de negocio y se marcan con `@Injectable()` para que el contenedor de DI los gestione.

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}
```

## 2. Crear el Controlador

Los controladores definen las rutas HTTP. Usa `@Controller` para establecer un prefijo de ruta y los decoradores HTTP para los métodos individuales.

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Body, Param, Inject, Ctx } from "nestelia";

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}
```

::: info
`@Body`, `@Param` y `@Query` aceptan un esquema de [TypeBox](https://github.com/sinclairzx81/typebox) para validación. Para acceder a parámetros individuales de ruta sin esquema, usa `@Ctx()` para obtener el contexto completo de Elysia.
:::

## 3. Crear el Módulo

Los módulos agrupan controladores y proveedores. Toda aplicación tiene al menos un módulo raíz.

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. Inicializar la Aplicación

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. Probar

```bash
# Listar usuarios
curl http://localhost:3000/users

# Obtener usuario por ID
curl http://localhost:3000/users/1

# Crear un usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## Ejemplo Completo

```typescript
import { t } from "elysia";
import {
  createElysiaApplication,
  Controller,
  Get,
  Post,
  Module,
  Body,
  Ctx,
  Inject,
  Injectable,
} from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Próximos Pasos

- [Módulos](/es/core-concepts/modules) — Aprende a organizar tu app con módulos.
- [Inyección de Dependencias](/es/features/dependency-injection) — Comprende los alcances de DI y proveedores personalizados.
