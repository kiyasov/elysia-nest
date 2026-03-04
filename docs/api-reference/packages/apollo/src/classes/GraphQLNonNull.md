# Class: GraphQLNonNull\<T\>

Defined in: node\_modules/graphql/type/definition.d.ts:206

Non-Null Type Wrapper

A non-null is a wrapping type which points to another type.
Non-null types enforce that their values are never null and can ensure
an error is raised if this ever occurs during a request. It is useful for
fields which you can make a strong guarantee on non-nullability, for example
usually the id field of a database row will never be null.

Example:

```ts
const RowType = new GraphQLObjectType({
  name: 'Row',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
  })
})
```
Note: the enforcement of non-nullability occurs within the executor.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `GraphQLNullableType` |

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:209

##### Returns

`string`

## Constructors

### Constructor

```ts
new GraphQLNonNull<T>(ofType): GraphQLNonNull<T>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:208

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ofType` | `T` |

#### Returns

`GraphQLNonNull`\<`T`\>

## Methods

### toJSON()

```ts
toJSON(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:211

#### Returns

`string`

***

### toString()

```ts
toString(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:210

#### Returns

`string`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="oftype"></a> `ofType` | `readonly` | `T` | node\_modules/graphql/type/definition.d.ts:207 |
