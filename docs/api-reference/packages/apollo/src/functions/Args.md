# Function: Args()

## Call Signature

```ts
function Args(): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/args.decorator.ts:124](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L124)

Decorator for resolver arguments.

### Returns

`ParameterDecorator`

### Example

```typescript
@Query()
async user(@Args('id') id: string) { }

@Query()
async users(@Args('limit') limit: number, @Args('offset') offset: number) { }

@Mutation()
async createUser(
  @Args({ name: 'input', type: () => CreateUserInput, description: 'User input' })
  input: CreateUserInput
) { }

@Query()
async search(
  @Args({ name: 'query', nullable: true, defaultValue: '' })
  query: string
) { }
```

## Call Signature

```ts
function Args(name): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/args.decorator.ts:125](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L125)

Decorator for resolver arguments.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

### Returns

`ParameterDecorator`

### Example

```typescript
@Query()
async user(@Args('id') id: string) { }

@Query()
async users(@Args('limit') limit: number, @Args('offset') offset: number) { }

@Mutation()
async createUser(
  @Args({ name: 'input', type: () => CreateUserInput, description: 'User input' })
  input: CreateUserInput
) { }

@Query()
async search(
  @Args({ name: 'query', nullable: true, defaultValue: '' })
  query: string
) { }
```

## Call Signature

```ts
function Args(options): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/args.decorator.ts:126](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L126)

Decorator for resolver arguments.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ArgsOptions`](../interfaces/ArgsOptions.md) |

### Returns

`ParameterDecorator`

### Example

```typescript
@Query()
async user(@Args('id') id: string) { }

@Query()
async users(@Args('limit') limit: number, @Args('offset') offset: number) { }

@Mutation()
async createUser(
  @Args({ name: 'input', type: () => CreateUserInput, description: 'User input' })
  input: CreateUserInput
) { }

@Query()
async search(
  @Args({ name: 'query', nullable: true, defaultValue: '' })
  query: string
) { }
```

## Call Signature

```ts
function Args(name, options): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/args.decorator.ts:127](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L127)

Decorator for resolver arguments.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `options` | `Omit`\<[`ArgsOptions`](../interfaces/ArgsOptions.md), `"name"`\> |

### Returns

`ParameterDecorator`

### Example

```typescript
@Query()
async user(@Args('id') id: string) { }

@Query()
async users(@Args('limit') limit: number, @Args('offset') offset: number) { }

@Mutation()
async createUser(
  @Args({ name: 'input', type: () => CreateUserInput, description: 'User input' })
  input: CreateUserInput
) { }

@Query()
async search(
  @Args({ name: 'query', nullable: true, defaultValue: '' })
  query: string
) { }
```
