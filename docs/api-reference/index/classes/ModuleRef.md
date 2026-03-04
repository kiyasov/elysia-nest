# Class: ModuleRef

Defined in: [packages/core/src/di/module-ref.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/module-ref.ts#L36)

ModuleRef provides a way to access providers within a module.
It is automatically injected by the framework and allows retrieving
providers dynamically at runtime.

## Example

```typescript
@Injectable()
class MyService {
  constructor(private moduleRef: ModuleRef) {}

  doSomething() {
    const configService = this.moduleRef.get(ConfigService);
    // use configService
  }
}
```

## Accessors

### moduleMetatype

#### Get Signature

```ts
get moduleMetatype(): ProviderToken;
```

Defined in: [packages/core/src/di/module-ref.ts:128](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/module-ref.ts#L128)

Get the module metatype (class)

##### Returns

[`ProviderToken`](../type-aliases/ProviderToken.md)

***

### moduleToken

#### Get Signature

```ts
get moduleToken(): string;
```

Defined in: [packages/core/src/di/module-ref.ts:121](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/module-ref.ts#L121)

Get the module token/name

##### Returns

`string`

## Constructors

### Constructor

```ts
new ModuleRef(container, moduleRef): ModuleRef;
```

Defined in: [packages/core/src/di/module-ref.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/module-ref.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `container` | [`Container`](Container.md) |
| `moduleRef` | `Module` |

#### Returns

`ModuleRef`

## Methods

### get()

```ts
get<T>(token, options?): T;
```

Defined in: [packages/core/src/di/module-ref.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/module-ref.ts#L63)

Get a provider instance from the module.
Returns only already resolved instances (synchronous).

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | [`ProviderToken`](../type-aliases/ProviderToken.md) | The provider token (class or injection token) |
| `options` | [`GetOptions`](../interfaces/GetOptions.md) | Options for the lookup |

#### Returns

`T`

The provider instance

#### Throws

Error if provider not found or not resolved

#### Example

```typescript
// Get from current module and imports
const service = this.moduleRef.get(MyService);

// Get only from current module (strict mode)
const service = this.moduleRef.get(MyService, { strict: true });
```
