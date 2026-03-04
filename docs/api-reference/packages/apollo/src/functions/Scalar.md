# Function: Scalar()

```ts
function Scalar(
   name, 
   typeFnOrOptions?, 
   options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:263](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L263)

Decorator for GraphQL Scalar.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Scalar name. |
| `typeFnOrOptions?` | \| () => `unknown` \| \{ `description?`: `string`; \} | Type factory function or scalar options. |
| `options?` | \{ `description?`: `string`; \} | Scalar options when typeFnOrOptions is a function. |
| `options.description?` | `string` | - |

## Returns

`ClassDecorator`

## Example

```typescript
@Scalar('Date')
class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value);
  }

  serialize(value: Date): string {
    return value.toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
```
