# Class: GraphQLObjectType\<TSource, TContext\>

Defined in: node\_modules/graphql/type/definition.d.ts:435

Object Type Definition

Almost all of the GraphQL types you define will be object types. Object types
have a name, but most importantly describe their fields.

Example:

```ts
const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: { type: GraphQLString },
    number: { type: GraphQLInt },
    formatted: {
      type: GraphQLString,
      resolve(obj) {
        return obj.number + ' ' + obj.street
      }
    }
  }
});
```

When two types need to refer to each other, or a type needs to refer to
itself in a field, you can use a function expression (aka a closure or a
thunk) to supply the fields lazily.

Example:

```ts
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    name: { type: GraphQLString },
    bestFriend: { type: PersonType },
  })
});
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TSource` | `any` |
| `TContext` | `any` |

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:445

##### Returns

`string`

## Constructors

### Constructor

```ts
new GraphQLObjectType<TSource, TContext>(config): GraphQLObjectType<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:444

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Readonly`\<`GraphQLObjectTypeConfig`\<`TSource`, `TContext`\>\> |

#### Returns

`GraphQLObjectType`\<`TSource`, `TContext`\>

## Methods

### getFields()

```ts
getFields(): GraphQLFieldMap<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:446

#### Returns

`GraphQLFieldMap`\<`TSource`, `TContext`\>

***

### getInterfaces()

```ts
getInterfaces(): readonly GraphQLInterfaceType[];
```

Defined in: node\_modules/graphql/type/definition.d.ts:447

#### Returns

readonly `GraphQLInterfaceType`[]

***

### toConfig()

```ts
toConfig(): GraphQLObjectTypeNormalizedConfig<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:448

#### Returns

`GraphQLObjectTypeNormalizedConfig`\<`TSource`, `TContext`\>

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:450

#### Returns

`string`

***

### toString()

```ts
toString(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:449

#### Returns

`string`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="astnode"></a> `astNode` | `Maybe`\<`ObjectTypeDefinitionNode`\> | node\_modules/graphql/type/definition.d.ts:440 |
| <a id="description"></a> `description` | `Maybe`\<`string`\> | node\_modules/graphql/type/definition.d.ts:437 |
| <a id="extensionastnodes"></a> `extensionASTNodes` | readonly `ObjectTypeExtensionNode`[] | node\_modules/graphql/type/definition.d.ts:441 |
| <a id="extensions"></a> `extensions` | `Readonly`\<`GraphQLObjectTypeExtensions`\<`TSource`, `TContext`\>\> | node\_modules/graphql/type/definition.d.ts:439 |
| <a id="istypeof"></a> `isTypeOf` | `Maybe`\<`GraphQLIsTypeOfFn`\<`TSource`, `TContext`\>\> | node\_modules/graphql/type/definition.d.ts:438 |
| <a id="name"></a> `name` | `string` | node\_modules/graphql/type/definition.d.ts:436 |
