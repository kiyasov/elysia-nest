# Function: Directive()

```ts
function Directive(name, options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:317](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L317)

Decorator for GraphQL Directive.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Directive name. |
| `options?` | \{ `args?`: `Record`\<`string`, `unknown`\>; `description?`: `string`; `locations?`: `string`[]; \} | Directive options. |
| `options.args?` | `Record`\<`string`, `unknown`\> | - |
| `options.description?` | `string` | - |
| `options.locations?` | `string`[] | - |

## Returns

`ClassDecorator`
