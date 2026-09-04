# Class: GraphQLSchema

Defined in: node\_modules/graphql/type/schema.d.ts:151

Schema Definition

A Schema is created by supplying the root types of each type of operation,
query and mutation (optional). A schema definition is then supplied to the
validator and executor.

## Examples

```ts
const MyAppQueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    greeting: { type: GraphQLString },
  },
});

const MyAppMutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    setGreeting: { type: GraphQLString },
  },
});

const MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType,
  mutation: MyAppMutationRootType,
});
```

When the schema is constructed, by default only the types that are reachable
by traversing the root types are included, other types must be explicitly
referenced.

```ts
const characterInterface = new GraphQLInterfaceType({
  name: 'Character',
  fields: {
    name: { type: GraphQLString },
  },
});

const humanType = new GraphQLObjectType({
  name: 'Human',
  interfaces: [characterInterface],
  fields: {
    name: { type: GraphQLString },
  },
});

const droidType = new GraphQLObjectType({
  name: 'Droid',
  interfaces: [characterInterface],
  fields: {
    name: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hero: { type: characterInterface },
    },
  }),
  // Since this schema references only the `Character` interface it's
  // necessary to explicitly list the types that implement it if
  // you want them to be included in the final schema.
  types: [humanType, droidType],
});
```

If an array of `directives` are provided to GraphQLSchema, that will be the
exact list of directives represented and allowed. If `directives` is not
provided then a default set of the specified directives (e.g. `@include` and
`@skip`) will be used. If you wish to provide *additional* directives to
these specified directives, you must explicitly declare them.

```ts
const MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType,
  directives: specifiedDirectives.concat([myCustomDirective]),
});
```

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/schema.d.ts:270

Returns the value used by `Object.prototype.toString`.

##### Returns

`string`

The built-in string tag for this object.

## Constructors

### Constructor

```ts
new GraphQLSchema(config): GraphQLSchema;
```

Defined in: node\_modules/graphql/type/schema.d.ts:265

Creates a GraphQLSchema instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `Readonly`\<`GraphQLSchemaConfig`\> | Configuration describing this object. |

#### Returns

`GraphQLSchema`

#### Examples

```ts
// Create a schema with the required query root.
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    greeting: {
      type: GraphQLString,
      resolve: () => 'Hello',
    },
  },
});

const schema = new GraphQLSchema({
  description: 'The application schema.',
  query: Query,
});

schema.getQueryType(); // => Query
schema.description; // => 'The application schema.'
```

```ts
// This variant configures every schema option, including directives and extensions.
import { DirectiveLocation, parse } from 'graphql/language';
import {
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: { greeting: { type: GraphQLString } },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: { setGreeting: { type: GraphQLString } },
});
const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: { greetingChanged: { type: GraphQLString } },
});
const AuditEvent = new GraphQLObjectType({
  name: 'AuditEvent',
  fields: { message: { type: GraphQLString } },
});
const authDirective = new GraphQLDirective({
  name: 'auth',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: { required: { type: GraphQLBoolean } },
});
const schemaDocument = parse(`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  extend schema @auth
`);

const schema = new GraphQLSchema({
  description: 'Operations exposed by the application.',
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
  types: [AuditEvent],
  directives: [authDirective],
  extensions: { owner: 'platform' },
  astNode: schemaDocument.definitions[0],
  extensionASTNodes: [ schemaDocument.definitions[1] ],
  assumeValid: true,
});

schema.getMutationType(); // => Mutation
schema.getSubscriptionType(); // => Subscription
schema.getType('AuditEvent'); // => AuditEvent
schema.getDirective('auth'); // => authDirective
schema.extensions; // => { owner: 'platform' }
```

## Methods

### getDirective()

```ts
getDirective(name): Maybe<GraphQLDirective>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:563

Returns the current directive definition.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The GraphQL name to look up. |

#### Returns

`Maybe`\<`GraphQLDirective`\>

The current directive definition, if known.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  directive @upper on FIELD_DEFINITION

  type Query {
    greeting: String @upper
  }
`);

schema.getDirective('upper')?.name; // => 'upper'
schema.getDirective('missing'); // => undefined
```

***

### getDirectives()

```ts
getDirectives(): readonly GraphQLDirective[];
```

Defined in: node\_modules/graphql/type/schema.d.ts:542

Returns directives available in this schema.

#### Returns

readonly `GraphQLDirective`[]

Directives available in this schema.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  directive @upper on FIELD_DEFINITION

  type Query {
    greeting: String @upper
  }
`);

schema.getDirectives().map((directive) => directive.name); // => ['include', 'skip', 'deprecated', 'specifiedBy', 'oneOf', 'upper']
```

***

### getImplementations()

```ts
getImplementations(interfaceType): {
  interfaces: readonly GraphQLInterfaceType[];
  objects: readonly GraphQLObjectType<any, any>[];
};
```

Defined in: node\_modules/graphql/type/schema.d.ts:479

Returns objects and interfaces that implement an interface type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `interfaceType` | `GraphQLInterfaceType` | Interface type to inspect. |

#### Returns

```ts
{
  interfaces: readonly GraphQLInterfaceType[];
  objects: readonly GraphQLObjectType<any, any>[];
}
```

Object and interface implementations of the interface.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `interfaces` | readonly `GraphQLInterfaceType`[] | node\_modules/graphql/type/schema.d.ts:481 |
| `objects` | readonly [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>[] | node\_modules/graphql/type/schema.d.ts:480 |

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertInterfaceType } from 'graphql/type';

const schema = buildSchema(`
  interface Resource {
    url: String!
  }

  interface Image implements Resource {
    url: String!
    width: Int
  }

  type Photo implements Resource & Image {
    url: String!
    width: Int
  }

  type Query {
    resource: Resource
  }
`);

const Resource = assertInterfaceType(schema.getType('Resource'));
const implementations = schema.getImplementations(Resource);

implementations.interfaces.map((type) => type.name); // => ['Image']
implementations.objects.map((type) => type.name); // => ['Photo']
```

***

### getMutationType()

```ts
getMutationType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:308

Returns the root object type for mutation operations.

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

The mutation root type, if this schema defines one.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type Query {
    greeting: String
  }

  type Mutation {
    setGreeting(value: String!): String
  }
`);

schema.getMutationType()?.name; // => 'Mutation'
```

***

### getPossibleTypes()

```ts
getPossibleTypes(abstractType): readonly GraphQLObjectType<any, any>[];
```

Defined in: node\_modules/graphql/type/schema.d.ts:440

Returns object types that may be returned for an abstract type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `abstractType` | `GraphQLAbstractType` | Interface or union type to inspect. |

#### Returns

readonly [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>[]

Object types that may satisfy the abstract type.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertInterfaceType, assertUnionType } from 'graphql/type';

const schema = buildSchema(`
  interface Node {
    id: ID!
  }

  type User implements Node {
    id: ID!
  }

  type Organization implements Node {
    id: ID!
  }

  union SearchResult = User | Organization

  type Query {
    node: Node
    search: [SearchResult]
  }
`);

const Node = assertInterfaceType(schema.getType('Node'));
const SearchResult = assertUnionType(schema.getType('SearchResult'));

schema.getPossibleTypes(Node).map((type) => type.name); // => ['User', 'Organization']
schema.getPossibleTypes(SearchResult).map((type) => type.name); // => ['User', 'Organization']
```

***

### getQueryType()

```ts
getQueryType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:287

Returns the root object type for query operations.

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

The query root type, if this schema defines one.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type Query {
    greeting: String
  }
`);

schema.getQueryType()?.name; // => 'Query'
```

***

### getRootType()

```ts
getRootType(operation): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:354

Returns the root object type for the requested operation kind.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `operation` | `OperationTypeNode` | Operation kind to resolve. |

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

The root object type for the operation kind, if this schema defines one.

#### Example

```ts
import { OperationTypeNode } from 'graphql/language';
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type Query {
    greeting: String
  }

  type Mutation {
    setGreeting(value: String!): String
  }
`);

schema.getRootType(OperationTypeNode.QUERY)?.name; // => 'Query'
schema.getRootType(OperationTypeNode.MUTATION)?.name; // => 'Mutation'
schema.getRootType(OperationTypeNode.SUBSCRIPTION); // => undefined
```

***

### getSubscriptionType()

```ts
getSubscriptionType(): Maybe<GraphQLObjectType<any, any>>;
```

Defined in: node\_modules/graphql/type/schema.d.ts:329

Returns the root object type for subscription operations.

#### Returns

`Maybe`\<[`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\>\>

The subscription root type, if this schema defines one.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type Query {
    greeting: String
  }

  type Subscription {
    greetings: String
  }
`);

schema.getSubscriptionType()?.name; // => 'Subscription'
```

***

### getType()

```ts
getType(name): GraphQLNamedType | undefined;
```

Defined in: node\_modules/graphql/type/schema.d.ts:402

Returns the named type with the provided name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The GraphQL name to look up. |

#### Returns

`GraphQLNamedType` \| `undefined`

The named schema type, if one exists.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type User {
    name: String
  }

  type Query {
    viewer: User
  }
`);

schema.getType('User')?.toString(); // => 'User'
schema.getType('Missing'); // => undefined
```

***

### getTypeMap()

```ts
getTypeMap(): TypeMap;
```

Defined in: node\_modules/graphql/type/schema.d.ts:379

Returns all named types known to this schema.

#### Returns

`TypeMap`

A map of schema types keyed by type name.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';

const schema = buildSchema(`
  type User {
    name: String
  }

  type Query {
    viewer: User
  }
`);

const typeMap = schema.getTypeMap();

typeMap.User.name; // => 'User'
typeMap.Query.name; // => 'Query'
typeMap.String.name; // => 'String'
```

***

### isSubType()

```ts
isSubType(abstractType, maybeSubType): boolean;
```

Defined in: node\_modules/graphql/type/schema.d.ts:520

Returns whether one type is a possible runtime subtype of an abstract type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `abstractType` | `GraphQLAbstractType` | Interface or union type to inspect. |
| `maybeSubType` | \| `GraphQLInterfaceType` \| [`GraphQLObjectType`](GraphQLObjectType.md)\<`any`, `any`\> | Object or interface type to test as a possible subtype. |

#### Returns

`boolean`

True when the subtype may satisfy the abstract type.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertInterfaceType, assertObjectType } from 'graphql/type';

const schema = buildSchema(`
  interface Node {
    id: ID!
  }

  type User implements Node {
    id: ID!
  }

  type Review {
    body: String
  }

  type Query {
    node: Node
    review: Review
  }
`);

const Node = assertInterfaceType(schema.getType('Node'));
const User = assertObjectType(schema.getType('User'));
const Review = assertObjectType(schema.getType('Review'));

schema.isSubType(Node, User); // => true
schema.isSubType(Node, Review); // => false
```

***

### toConfig()

```ts
toConfig(): GraphQLSchemaNormalizedConfig;
```

Defined in: node\_modules/graphql/type/schema.d.ts:588

Returns a normalized configuration object for this object.

The returned config preserves the original `assumeValid` flag so the schema
can be recreated with the same validation behavior.

#### Returns

`GraphQLSchemaNormalizedConfig`

A configuration object that can be used to recreate this object.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { GraphQLSchema } from 'graphql/type';

const schema = buildSchema(`
  type Query {
    greeting: String
  }
`);

const config = schema.toConfig();
const schemaCopy = new GraphQLSchema(config);

config.query?.name; // => 'Query'
schemaCopy.getQueryType()?.name; // => 'Query'
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="__validationerrors"></a> `__validationErrors` | `Maybe`\<readonly `GraphQLError`[]\> | **`Internal`** Cached schema validation errors, if validation has already run. | node\_modules/graphql/type/schema.d.ts:164 |
| <a id="astnode"></a> `astNode` | `Maybe`\<`SchemaDefinitionNode`\> | AST node from which this schema element was built, if available. | node\_modules/graphql/type/schema.d.ts:157 |
| <a id="description"></a> `description` | `Maybe`\<`string`\> | Human-readable description for this schema element, if provided. | node\_modules/graphql/type/schema.d.ts:153 |
| <a id="extensionastnodes"></a> `extensionASTNodes` | readonly `SchemaExtensionNode`[] | AST extension nodes applied to this schema element. | node\_modules/graphql/type/schema.d.ts:159 |
| <a id="extensions"></a> `extensions` | `Readonly`\<`GraphQLSchemaExtensions`\> | Custom extension fields reserved for users. | node\_modules/graphql/type/schema.d.ts:155 |
