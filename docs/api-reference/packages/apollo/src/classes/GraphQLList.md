# Class: GraphQLList\<T\>

Defined in: node\_modules/graphql/type/definition.d.ts:178

List Type Wrapper

A list is a wrapping type which points to another type.
Lists are often created within the context of defining the fields of
an object type.

Example:

```ts
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    parents: { type: new GraphQLList(PersonType) },
    children: { type: new GraphQLList(PersonType) },
  })
})
```

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `GraphQLType` |

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:181

##### Returns

`string`

## Constructors

### Constructor

```ts
new GraphQLList<T>(ofType): GraphQLList<T>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:180

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ofType` | `T` |

#### Returns

`GraphQLList`\<`T`\>

## Methods

### toJSON()

```ts
toJSON(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:183

#### Returns

`string`

***

### toString()

```ts
toString(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:182

#### Returns

`string`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="oftype"></a> `ofType` | `readonly` | `T` | node\_modules/graphql/type/definition.d.ts:179 |
