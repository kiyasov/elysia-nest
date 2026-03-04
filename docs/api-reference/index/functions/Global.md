# Function: Global()

```ts
function Global(): ClassDecorator;
```

Defined in: [packages/core/src/decorators/index.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/index.ts#L37)

Marks a module as global, meaning its providers can be accessed from any other module
without explicitly importing it.

## Returns

`ClassDecorator`

## Example

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```
