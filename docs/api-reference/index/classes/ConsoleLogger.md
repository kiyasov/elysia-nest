# Class: ConsoleLogger

Defined in: [packages/core/src/logger/console-logger.service.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L15)

## Implements

- [`LoggerService`](../interfaces/LoggerService.md)

## Constructors

### Constructor

```ts
new ConsoleLogger(): ConsoleLogger;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L19)

#### Returns

`ConsoleLogger`

### Constructor

```ts
new ConsoleLogger(context): ConsoleLogger;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L20)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |

#### Returns

`ConsoleLogger`

### Constructor

```ts
new ConsoleLogger(context, options): ConsoleLogger;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |
| `options` | [`ConsoleLoggerOptions`](../interfaces/ConsoleLoggerOptions.md) |

#### Returns

`ConsoleLogger`

## Methods

### colorize()

```ts
protected colorize(message, logLevel): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:92](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `logLevel` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` |

#### Returns

`string`

***

### debug()

#### Call Signature

```ts
debug(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:185](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L185)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`debug`](../interfaces/LoggerService.md#debug)

#### Call Signature

```ts
debug(message, context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:186](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.debug
```

***

### error()

#### Call Signature

```ts
error(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:160](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`error`](../interfaces/LoggerService.md#error)

#### Call Signature

```ts
error(
   message, 
   stack?, 
   context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:161](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L161)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `stack?` | `string` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.error
```

***

### fatal()

#### Call Signature

```ts
fatal(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:211](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L211)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`fatal`](../interfaces/LoggerService.md#fatal)

#### Call Signature

```ts
fatal(
   message, 
   stack?, 
   context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:212](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L212)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `stack?` | `string` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.fatal
```

***

### formatContext()

```ts
protected formatContext(context): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |

#### Returns

`string`

***

### formatMessage()

```ts
protected formatMessage(
   logLevel, 
   message, 
   pidMessage, 
   formattedLogLevel, 
   contextMessage, 
   timestampDiff): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L43)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `logLevel` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` |
| `message` | `unknown` |
| `pidMessage` | `string` |
| `formattedLogLevel` | `string` |
| `contextMessage` | `string` |
| `timestampDiff` | `string` |

#### Returns

`string`

***

### formatPid()

```ts
protected formatPid(pid): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

`string`

***

### getColorByLogLevel()

```ts
protected getColorByLogLevel(level): (message) => string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `level` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` |

#### Returns

```ts
(message): string;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

##### Returns

`string`

***

### getContextAndMessagesToPrint()

```ts
protected getContextAndMessagesToPrint(args): {
  context: string;
  messages: unknown[];
};
```

Defined in: [packages/core/src/logger/console-logger.service.ts:223](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L223)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `unknown`[] |

#### Returns

```ts
{
  context: string;
  messages: unknown[];
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `context` | `string` | [packages/core/src/logger/console-logger.service.ts:225](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L225) |
| `messages` | `unknown`[] | [packages/core/src/logger/console-logger.service.ts:224](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L224) |

***

### getContextAndStackAndMessagesToPrint()

```ts
protected getContextAndStackAndMessagesToPrint(args): {
  context: string;
  messages: unknown[];
  stack?: string;
};
```

Defined in: [packages/core/src/logger/console-logger.service.ts:241](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L241)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `unknown`[] |

#### Returns

```ts
{
  context: string;
  messages: unknown[];
  stack?: string;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `context` | `string` | [packages/core/src/logger/console-logger.service.ts:243](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L243) |
| `messages` | `unknown`[] | [packages/core/src/logger/console-logger.service.ts:242](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L242) |
| `stack?` | `string` | [packages/core/src/logger/console-logger.service.ts:244](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L244) |

***

### getTimestamp()

```ts
getTimestamp(): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L31)

#### Returns

`string`

***

### isLevelEnabled()

```ts
isLevelEnabled(level): boolean;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:142](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L142)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `level` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` |

#### Returns

`boolean`

***

### log()

#### Call Signature

```ts
log(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:147](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L147)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`log`](../interfaces/LoggerService.md#log)

#### Call Signature

```ts
log(message, context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:148](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.log
```

***

### printMessages()

```ts
protected printMessages(
   messages, 
   context?, 
   logLevel?, 
   writeStreamType?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L65)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `messages` | `unknown`[] | `undefined` |
| `context` | `string` | `""` |
| `logLevel` | `"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"` | `"log"` |
| `writeStreamType?` | `"stdout"` \| `"stderr"` | `undefined` |

#### Returns

`void`

***

### printStackTrace()

```ts
protected printStackTrace(stack): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:276](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L276)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stack` | `string` \| `undefined` |

#### Returns

`void`

***

### resetContext()

```ts
resetContext(): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:138](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L138)

#### Returns

`void`

***

### setContext()

```ts
setContext(context): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:134](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L134)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `string` |

#### Returns

`void`

***

### setLogLevels()

```ts
setLogLevels(levels): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:127](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L127)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `levels` | (`"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"`)[] |

#### Returns

`void`

#### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`setLogLevels`](../interfaces/LoggerService.md#setloglevels)

***

### updateAndGetTimestampDiff()

```ts
protected updateAndGetTimestampDiff(): string;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:97](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L97)

#### Returns

`string`

***

### verbose()

#### Call Signature

```ts
verbose(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:198](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L198)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`verbose`](../interfaces/LoggerService.md#verbose)

#### Call Signature

```ts
verbose(message, context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:199](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L199)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.verbose
```

***

### warn()

#### Call Signature

```ts
warn(message, ...optionalParams): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:172](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L172)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| ...`optionalParams` | `unknown`[] |

##### Returns

`void`

##### Implementation of

[`LoggerService`](../interfaces/LoggerService.md).[`warn`](../interfaces/LoggerService.md#warn)

#### Call Signature

```ts
warn(message, context?): void;
```

Defined in: [packages/core/src/logger/console-logger.service.ts:173](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L173)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `unknown` |
| `context?` | `string` |

##### Returns

`void`

##### Implementation of

```ts
LoggerService.warn
```

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="context"></a> `context?` | `protected` | `string` | `undefined` | [packages/core/src/logger/console-logger.service.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L23) |
| <a id="options"></a> `options` | `protected` | [`ConsoleLoggerOptions`](../interfaces/ConsoleLoggerOptions.md) | `{}` | [packages/core/src/logger/console-logger.service.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/logger/console-logger.service.ts#L24) |
