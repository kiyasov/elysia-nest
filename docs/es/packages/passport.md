---
title: Passport
icon: key
description: Autenticación con estrategias Passport.js
---

El paquete Passport integra las estrategias de autenticación de Passport.js en el sistema de guards de nestelia.

## Instalación

```bash
bun add passport
# Más tu estrategia elegida
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

Crea una estrategia extendiendo el mixin `PassportStrategy`:

```typescript
import { Injectable } from "nestelia";
import { PassportStrategy } from "nestelia/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "my-secret",
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

El método `validate()` se llama después de que la estrategia verifica las credenciales. Su valor de retorno se adjunta a la solicitud como `request.user`.

## AuthGuard

Usa `AuthGuard` para proteger rutas con una estrategia específica:

```typescript
import { Controller, Get } from "nestelia";
import { AuthGuard } from "nestelia/passport";

@Controller("/profile")
class ProfileController {
  @Get("/")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Req() req: any) {
    return req.user;
  }
}
```

## Ejemplo con Estrategia Local

```typescript
@Injectable()
class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}

@Controller("/auth")
class AuthController {
  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Req() req: any) {
    return { token: this.authService.generateToken(req.user) };
  }
}
```

## Múltiples Estrategias

`AuthGuard` acepta un arreglo de nombres de estrategias. La solicitud se autentica si alguna estrategia tiene éxito:

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## Registrar Estrategias

Incluye el proveedor de la estrategia en tu módulo:

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
