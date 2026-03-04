# Function: Module()

```ts
function Module(options): any;
```

Defined in: [packages/core/src/core/module.decorator.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/module.decorator.ts#L30)

Module decorator that creates an Elysia plugin from the module configuration.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ModuleOptions`](../interfaces/ModuleOptions.md) | Module configuration options |

## Returns

`any`

Class decorator

## Example

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule],
})
export class AppModule {}
```
