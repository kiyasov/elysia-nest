# Class: GraphQLSchema

Defined in: node\_modules/graphql/type/schema.d.ts:101

Schema Definition

A Schema is created by supplying the root types of each type of operation,
query and mutation (optional). A schema definition is then supplied to the
validator and executor.

Example:

```ts
const MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType,
  mutation: MyAppMutationRootType,
})
```

Note: When the schema is constructed, by default only the types that are
reachable by traversing the root types are included, other types must be
explicitly referenced.

Example:

```ts
const characterInterface = new GraphQLInterfaceType({
  name: 'Character',
  ...
});

const humanType = new GraphQLObjectType({
  name: 'Human',
  interfaces: [characterInterface],
  ...
});

const droidType = new GraphQLObjectType({
  name: 'Droid',
  interfaces: [characterInterface],
  ...
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hero: { type: characterInterface, ... },
    }
  }),
  ...
  // Since this schema references only the `Character` interface it's
  // necessary to explicitly list the types that implement it if
  // you want them to be included in the final schema.
  types: [humanType, droidType],
})
```

Note: If an array of `directives` are provided to GraphQLSchema, that will be
the exact list of directives represented and allowed. If `directives` is not
provided then a default set of the specified directives (e.g. `@include` and
`@skip`) will be used. If you wish to provide *additional* directives to these
specified directives, you must explicitly declare them. Example:

```ts
const MyAppSchema = new GraphQLSchema({
  ...
  directives: specifiedDirectives.concat([ myCustomDirective ]),
})
```

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/schema.d.ts:115

##### Returns

`string`

## Constructors

### Constructor

```ts
new GraphQLSchema(config): GraphQLSchema;
```

Defined in: node\_modules/graphql/type/schema.d.ts:114

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Readonly`\<`GraphQLSchemaConfig`\> |

#### Returns

`GraphQLSchema`

## Methods

### getDirective()

```ts
getDirective(name): Maybe<GraphQLDirective>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:134

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`Maybe`\<`GraphQLDirective`\>

***

### getDirectives()

```ts
getDirectives(): readonly GraphQLDirective[];
```

Defined in: node\_modules/graphql/type/schema.d.ts:133

#### Returns

readonly `GraphQLDirective`[]

***

### getImplementations()

```ts
getImplementations(interfaceType): {
  interfaces: readonly GraphQLInterfaceType[];
  objects: readonly GraphQLObjectType<any, any>[];
};
```

Defined in: node\_modules/graphql/type/schema.d.ts:125

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `interfaceType` | `GraphQLInterfaceType` |

#### Returns

```ts
{
  interfaces: readonly GraphQLInterfaceType[];
  objects: readonly GraphQLObjectType<any, any>[];
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `interfaces` | readonly `GraphQLInterfaceType`[] | node\_modules/graphql/type/schema.d.ts:127 |
| `objects` | readonly [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>[] | node\_modules/graphql/type/schema.d.ts:126 |

***

### getMutationType()

```ts
getMutationType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:117

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

***

### getPossibleTypes()

```ts
getPossibleTypes(abstractType): readonly GraphQLObjectType<any, any>[];
```

Defined in: node\_modules/graphql/type/schema.d.ts:122

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `abstractType` | `GraphQLAbstractType` |

#### Returns

readonly [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>[]

***

### getQueryType()

```ts
getQueryType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:116

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

***

### getRootType()

```ts
getRootType(operation): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:119

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `operation` | `OperationTypeNode` |

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

***

### getSubscriptionType()

```ts
getSubscriptionType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:118

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

***

### getType()

```ts
getType(name): GraphQLNamedType | undefined;
```

Defined in: node\_modules/graphql/type/schema.d.ts:121

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`GraphQLNamedType` \| `undefined`

***

### getTypeMap()

```ts
getTypeMap(): TypeMap;
```

Defined in: node\_modules/graphql/type/schema.d.ts:120

#### Returns

`TypeMap`

***

### isSubType()

```ts
isSubType(abstractType, maybeSubType): boolean;
```

Defined in: node\_modules/graphql/type/schema.d.ts:129

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `abstractType` | `GraphQLAbstractType` |
| `maybeSubType` | \| `GraphQLInterfaceType` \| [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\> |

#### Returns

`boolean`

***

### toConfig()

```ts
toConfig(): GraphQLSchemaNormalizedConfig;
```

Defined in: node\_modules/graphql/type/schema.d.ts:135

#### Returns

`GraphQLSchemaNormalizedConfig`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="__validationerrors"></a> `__validationErrors` | `Maybe`\<readonly `GraphQLError`[]\> | node\_modules/graphql/type/schema.d.ts:106 |
| <a id="astnode"></a> `astNode` | `Maybe`\<`SchemaDefinitionNode`\> | node\_modules/graphql/type/schema.d.ts:104 |
| <a id="description"></a> `description` | `Maybe`\<`string`\> | node\_modules/graphql/type/schema.d.ts:102 |
| <a id="extensionastnodes"></a> `extensionASTNodes` | readonly `SchemaExtensionNode`[] | node\_modules/graphql/type/schema.d.ts:105 |
| <a id="extensions"></a> `extensions` | `Readonly`\<`GraphQLSchemaExtensions`\> | node\_modules/graphql/type/schema.d.ts:103 |
