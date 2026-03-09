---
title: Guards
icon: shield
description: Proteja rotas com lógica de autorização usando @UseGuards()
---

Guards determinam se uma requisição deve prosseguir para o handler de rota. Eles implementam a interface `CanActivate` e são executados automaticamente antes que o handler seja chamado.

## Interface CanActivate

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

Se `canActivate` retornar `false`, a requisição é rejeitada com **403 Forbidden**. Se retornar `true`, a requisição prossegue normalmente.

## Criando um Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from "nestelia";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

Guards também podem ser assíncronos:

```typescript
@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.get("authorization");
    const user = await this.userService.verifyToken(token);
    return user?.role === "admin";
  }
}
```

## Decorador @UseGuards()

Aplique guards no nível do **método** (rota única) ou no nível da **classe** (todas as rotas de um controller). Quando ambos estão presentes, os guards de nível de classe são executados primeiro.

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // executado para todas as rotas neste controller
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → handler
  stats() {
    return { data: "stats" };
  }
}
```

Múltiplos guards podem ser encadeados — eles são executados **em ordem**, e o primeiro `false` interrompe a cadeia:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## Guards com Injeção de Dependências

Se um guard for registrado como provider em um módulo, ele será resolvido pelo container de DI (permitindo injeção por construtor). Caso contrário, é instanciado diretamente.

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard recebe DI
})
class AdminModule {}
```

## ExecutionContext

O `ExecutionContext` passado para `canActivate` fornece acesso à requisição atual e aos metadados do handler:

```typescript
interface ExecutionContext {
  /** Classe do controller */
  getClass<T = any>(): T;
  /** Função do handler de rota */
  getHandler(): (...args: unknown[]) => unknown;
  /** Todos os argumentos do handler */
  getArgs<T extends any[] = any[]>(): T;
  /** Argumento único por índice */
  getArgByIndex<T = any>(index: number): T;
  /** Tipo de contexto — "http" para rotas HTTP */
  getType<T extends string = string>(): T;
  /** Alterna para o contexto HTTP */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Objeto Web API Request */
  getRequest<T = any>(): T;
  /** Contexto do Elysia (contém set.status, set.headers, etc.) */
  getResponse<T = any>(): T;
}
```

### Acessando a requisição bruta

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Acessando o contexto do Elysia (status, headers, cookies)

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## Pipeline de Requisição

Guards são executados **após** o controller e o handler serem resolvidos, **antes** dos interceptors e do próprio handler:

```
Requisição → Controller resolvido → Guards → Interceptors → Handler → Resposta
```
