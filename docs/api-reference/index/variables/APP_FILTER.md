# Variable: APP\_FILTER

```ts
const APP_FILTER: typeof APP_FILTER;
```

Defined in: [packages/core/src/di/constants.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/constants.ts#L24)

Injection token for exception filters
Use this token to provide a global exception filter

## Example

```typescript
{
  provide: APP_FILTER,
  useClass: HttpExceptionFilter
}
```
