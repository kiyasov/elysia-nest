# Class: ValidationError

Defined in: [packages/apollo/src/errors/validation.error.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/errors/validation.error.ts#L21)

Error thrown when the user input does not pass validation.

This class was removed in Apollo Server 4.0.0.
This implementation provides the same functionality.

## Example

```typescript
@Mutation()
async updateUser(@Args('input') input: UpdateUserInput) {
  if (input.age < 0) {
    throw new ValidationError('Age must be positive');
  }
  return this.userService.update(input);
}
```

## Extends

- `GraphQLError`

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/error/GraphQLError.d.ts:107

##### Returns

`string`

#### Inherited from

```ts
GraphQLError.[toStringTag]
```

## Constructors

### Constructor

```ts
new ValidationError(message, options?): ValidationError;
```

Defined in: [packages/apollo/src/errors/validation.error.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/errors/validation.error.ts#L27)

Creates a new ValidationError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | Error message. |
| `options?` | `GraphQLErrorOptions` | Additional GraphQL error options. |

#### Returns

`ValidationError`

#### Overrides

```ts
GraphQLError.constructor
```

## Methods

### toJSON()

```ts
toJSON(): GraphQLFormattedError;
```

Defined in: node\_modules/graphql/error/GraphQLError.d.ts:109

#### Returns

`GraphQLFormattedError`

#### Inherited from

```ts
GraphQLError.toJSON
```

***

### toString()

```ts
toString(): string;
```

Defined in: node\_modules/graphql/error/GraphQLError.d.ts:108

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

```ts
GraphQLError.toString
```

***

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
GraphQLError.captureStackTrace
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
GraphQLError.captureStackTrace
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
GraphQLError.isError
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
GraphQLError.isError
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
GraphQLError.prepareStackTrace
```

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | The cause of the error. | `GraphQLError.cause` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="coordinate"></a> `coordinate?` | `readonly` | `string` | An optional schema coordinate (e.g. "MyType.myField") associated with this error. | `GraphQLError.coordinate` | node\_modules/@graphql-tools/utils/typings/errors.d.ts:19 |
| <a id="extensions"></a> `extensions` | `readonly` | `GraphQLErrorExtensions` | Extension fields to add to the formatted error. | `GraphQLError.extensions` | node\_modules/graphql/error/GraphQLError.d.ts:89 |
| <a id="locations"></a> `locations` | `readonly` | readonly `SourceLocation`[] \| `undefined` | An array of `{ line, column }` locations within the source GraphQL document which correspond to this error. Errors during validation often contain multiple locations, for example to point out two things with the same name. Errors during execution include a single location, the field which produced the error. Enumerable, and appears in the result of JSON.stringify(). | `GraphQLError.locations` | node\_modules/graphql/error/GraphQLError.d.ts:58 |
| <a id="message"></a> `message` | `public` | `string` | - | `GraphQLError.message` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name"></a> `name` | `public` | `string` | - | `GraphQLError.name` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| <a id="nodes"></a> `nodes` | `readonly` | readonly `ASTNode`[] \| `undefined` | An array of GraphQL AST Nodes corresponding to this error. | `GraphQLError.nodes` | node\_modules/graphql/error/GraphQLError.d.ts:69 |
| <a id="originalerror"></a> `originalError` | `readonly` | `Error` \| `undefined` | The original error thrown from a field resolver during execution. | `GraphQLError.originalError` | node\_modules/graphql/error/GraphQLError.d.ts:85 |
| <a id="path"></a> `path` | `readonly` | readonly (`string` \| `number`)[] \| `undefined` | An array describing the JSON-path into the execution response which corresponds to this error. Only included for errors during execution. Enumerable, and appears in the result of JSON.stringify(). | `GraphQLError.path` | node\_modules/graphql/error/GraphQLError.d.ts:65 |
| <a id="positions"></a> `positions` | `readonly` | readonly `number`[] \| `undefined` | An array of character offsets within the source GraphQL document which correspond to this error. | `GraphQLError.positions` | node\_modules/graphql/error/GraphQLError.d.ts:81 |
| <a id="source"></a> `source` | `readonly` | `Source` \| `undefined` | The source GraphQL document for the first location of this error. Note that if this Error represents more than one node, the source may not represent nodes after the first node. | `GraphQLError.source` | node\_modules/graphql/error/GraphQLError.d.ts:76 |
| <a id="stack"></a> `stack?` | `public` | `string` | - | `GraphQLError.stack` | node\_modules/.bun/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `GraphQLError.stackTraceLimit` | node\_modules/@types/node/globals.d.ts:67 |
