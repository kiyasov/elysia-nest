# Class: Logger

Defined in: [packages/core/src/logger/logger.service.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L15)

## Implements

- [`LoggerService`](../interfaces/LoggerService.md)

## Accessors

### localInstance

#### Get Signature

```ts
get localInstance(): LoggerService;
```

Defined in: [packages/core/src/logger/logger.service.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L31)

##### Returns

[`LoggerService`](../interfaces/LoggerService.md)

## Constructors

### Constructor

```ts
new Logger(): Logger;
```

Defined in: [packages/core/src/logger/logger.service.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L23)

#### Returns

`Logger`

### Constructor

```ts
new Logger(context): Logger;
```

Defined in: [packages/core/src/logger/logger.service.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L24)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |

#### Returns

`Logger`

### Constructor

```ts
new Logger(context, options): Logger;
```

Defined in: [packages/core/src/logger/logger.service.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L25)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |
| `options` | \{ `timestamp?`: `boolean`; \} |
| `options.timestamp?` | `boolean` |

#### Returns

`Logger`

## Methods

### debug()

```ts
debug(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:83](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L83)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`debug`](../interfaces/LoggerService.md#debug)

***

### error()

```ts
error(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:54](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L54)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`error`](../interfaces/LoggerService.md#error)

***

### fatal()

```ts
fatal(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:101](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`fatal`](../interfaces/LoggerService.md#fatal)

***

### log()

```ts
log(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L65)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`log`](../interfaces/LoggerService.md#log)

***

### verbose()

```ts
verbose(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:92](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`verbose`](../interfaces/LoggerService.md#verbose)

***

### warn()

```ts
warn(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:74](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L74)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`warn`](../interfaces/LoggerService.md#warn)

***

### attachBuffer()

```ts
static attachBuffer(): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:154](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L154)

#### Returns

`void`

***

### debug()

```ts
static debug(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:128](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### detachBuffer()

```ts
static detachBuffer(): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:158](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L158)

#### Returns

`void`

***

### error()

```ts
static error(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:110](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L110)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### fatal()

```ts
static fatal(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:140](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L140)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### flush()

```ts
static flush(): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:146](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L146)

#### Returns

`void`

***

### getTimestamp()

```ts
static getTimestamp(): string;
```

Defined in: [packages/core/src/logger/logger.service.ts:162](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L162)

#### Returns

`string`

***

### isLevelEnabled()

```ts
static isLevelEnabled(level): boolean;
```

Defined in: [packages/core/src/logger/logger.service.ts:183](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L183)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `level` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` |

#### Returns

`boolean`

***

### log()

```ts
static log(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L116)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

***

### overrideLogger()

```ts
static overrideLogger(logger): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:166](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L166)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `logger` | \| `boolean` \| [`LoggerService`](../interfaces/LoggerService.md) \| (`"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"`)[] |

#### Returns

`void`

***

### verbose()

```ts
static verbose(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:134](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L134)

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
static warn(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/logger.service.ts:122](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L122)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="context"></a> `context?` | `protected` | `string` | `undefined` | [packages/core/src/logger/logger.service.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L27) |
| <a id="localinstanceref"></a> `localInstanceRef?` | `protected` | [`LoggerService`](../interfaces/LoggerService.md) | `undefined` | [packages/core/src/logger/logger.service.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L21) |
| <a id="options"></a> `options` | `protected` | \{ `timestamp?`: `boolean`; \} | `{}` | [packages/core/src/logger/logger.service.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L28) |
| `options.timestamp?` | `public` | `boolean` | `undefined` | [packages/core/src/logger/logger.service.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L28) |
| <a id="logbuffer"></a> `logBuffer` | `static` | `LogBufferRecord`[] | `undefined` | [packages/core/src/logger/logger.service.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L16) |
| <a id="loglevels"></a> `logLevels?` | `static` | (`"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"`)[] | `undefined` | [packages/core/src/logger/logger.service.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L18) |
| <a id="staticinstanceref"></a> `staticInstanceRef?` | `static` | [`LoggerService`](../interfaces/LoggerService.md) | `DEFAULT_LOGGER` | [packages/core/src/logger/logger.service.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/logger.service.ts#L17) |
