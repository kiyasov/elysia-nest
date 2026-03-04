# Class: FileValidationError

Defined in: [packages/core/src/decorators/param.decorators.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L116)

## Extends

- `Error`

## Constructors

### Constructor

```ts
new FileValidationError(
   field, 
   code, 
   message): FileValidationError;
```

Defined in: [packages/core/src/decorators/param.decorators.ts:117](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L117)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `string` |
| `code` | `"SIZE_LIMIT"` \| `"INVALID_TYPE"` \| `"MAX_FILES"` \| `"MISSING_FILE"` |
| `message` | `string` |

#### Returns

`FileValidationError`

#### Overrides

```ts
Error.constructor
```

## Methods

### captureStackTrace()

#### Call Signature

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

##### Returns

`void`

##### Inherited from

```ts
Error.captureStackTrace
```

#### Call Signature

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/.bun/bun-types@1.3.10/node\_modules/bun-types/globals.d.ts:1042

Create .stack property on a target object

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

##### Returns

`void`

##### Inherited from

```ts
Error.captureStackTrace
```

***

### isError()

#### Call Signature

```ts
static isError(error): error is Error;
```

Defined in: node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

##### Returns

`error is Error`

##### Inherited from

```ts
Error.isError
```

#### Call Signature

```ts
static isError(value): value is Error;
```

Defined in: node\_modules/.bun/bun-types@1.3.10/node\_modules/bun-types/globals.d.ts:1037

Check if a value is an instance of Error

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to check |

##### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

##### Inherited from

```ts
Error.isError
```

***

### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

```ts
Error.prepareStackTrace
```

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | The cause of the error. | `Error.cause` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code"></a> `code` | `readonly` | `"SIZE_LIMIT"` \| `"INVALID_TYPE"` \| `"MAX_FILES"` \| `"MISSING_FILE"` | - | - | [packages/core/src/decorators/param.decorators.ts:119](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L119) |
| <a id="field"></a> `field` | `readonly` | `string` | - | - | [packages/core/src/decorators/param.decorators.ts:118](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L118) |
| <a id="message"></a> `message` | `public` | `string` | - | `Error.message` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name"></a> `name` | `public` | `string` | - | `Error.name` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| <a id="stack"></a> `stack?` | `public` | `string` | - | `Error.stack` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `Error.stackTraceLimit` | node\_modules/@types/node/globals.d.ts:67 |
