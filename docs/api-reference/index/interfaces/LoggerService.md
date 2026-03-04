# Interface: LoggerService

Defined in: [packages/core/src/logger/logger.interface.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L12)

## Methods

### debug()?

```ts
optional debug(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### error()

```ts
error(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L14)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### fatal()?

```ts
optional fatal(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### log()

```ts
log(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L13)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### setLogLevels()?

```ts
optional setLogLevels(levels): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `levels` | (`"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"`)[] |

#### Returns

`void`

***

### verbose()?

```ts
optional verbose(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### warn()

```ts
warn(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.interface.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`
