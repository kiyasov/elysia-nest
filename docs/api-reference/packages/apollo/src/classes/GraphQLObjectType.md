# Class: GraphQLObjectType\<TSource, TContext\>

Defined in: node\_modules/graphql/type/definition.d.ts:1716

Object Type Definition

Almost all of the GraphQL types you define will be object types. Object types
have a name, but most importantly describe their fields.

## Examples

```ts
const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: { type: GraphQLString },
    number: { type: GraphQLInt },
    formatted: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.number + ' ' + obj.street
      }
    }
  }
});
```

When two types need to refer to each other, or a type needs to refer to
itself in a field, you can use a function expression (aka a closure or a
thunk) to supply the fields lazily.

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

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TSource` | `any` | Source object type passed to resolvers. |
| `TContext` | `any` | Context object type passed to resolvers. |

## Accessors

### \[toStringTag\]

#### Get Signature

```ts
get toStringTag: string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1836

Returns the value used by `Object.prototype.toString`.

##### Returns

`string`

The built-in string tag for this object.

## Constructors

### Constructor

```ts
new GraphQLObjectType<TSource, TContext>(config): GraphQLObjectType<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1831

Creates a GraphQLObjectType instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `Readonly`\<`GraphQLObjectTypeConfig`\<`TSource`, `TContext`\>\> | Configuration describing this object. |

#### Returns

`GraphQLObjectType`\<`TSource`, `TContext`\>

#### Examples

```ts
// Configure an object type with interfaces, fields, arguments, and metadata.
import { parse } from 'graphql/language';
import {
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';

const document = parse(`
  type User implements Node {
    id: ID!
    name(format: String = "short"): String
  }

  extend type User {
    displayName: String
  }
`);
const definition = document.definitions[0];
const nameField = definition.fields[1];
const formatArg = nameField.arguments[0];

const Node = new GraphQLInterfaceType({
  name: 'Node',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const User = new GraphQLObjectType({
  name: 'User',
  description: 'A registered user.',
  interfaces: [Node],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: {
      description: 'The formatted user name.',
      type: GraphQLString,
      args: {
        format: {
          description: 'Controls the name format.',
          type: GraphQLString,
          defaultValue: 'short',
          deprecationReason: 'Use locale instead.',
          extensions: { public: true },
          astNode: formatArg,
        },
      },
      resolve: (user, { format }) => {
        return format === 'long' ? user.fullName : user.name;
      },
      deprecationReason: 'Use displayName.',
      extensions: { cacheSeconds: 60 },
      astNode: nameField,
    },
  },
  isTypeOf: (value) => {
    return typeof value === 'object' && value != null && 'id' in value;
  },
  extensions: { entity: 'User' },
  astNode: definition,
  extensionASTNodes: [ document.definitions[1] ],
});

User.name; // => 'User'
User.getInterfaces(); // => [Node]
Object.keys(User.getFields()); // => ['id', 'name']
User.getFields().name.args[0].defaultValue; // => 'short'
User.extensions; // => { entity: 'User' }
```

```ts
// This variant configures a subscription field with subscribe and resolve functions.
import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    greeting: {
      type: GraphQLString,
      subscribe: async function* () {
        yield { greeting: 'Hello!' };
      },
      resolve: (event) => {
        return event.greeting;
      },
    },
  },
});

typeof Subscription.getFields().greeting.subscribe; // => 'function'
```

## Methods

### getFields()

```ts
getFields(): GraphQLFieldMap<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1863

Returns the fields defined by this type.

#### Returns

`GraphQLFieldMap`\<`TSource`, `TContext`\>

The fields keyed by field name.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertObjectType } from 'graphql/type';

const schema = buildSchema(`
  type User {
    id: ID!
    name: String
  }

  type Query {
    viewer: User
  }
`);

const User = assertObjectType(schema.getType('User'));
const fields = User.getFields();

Object.keys(fields); // => ['id', 'name']
String(fields.id.type); // => 'ID!'
```

***

### getInterfaces()

```ts
getInterfaces(): readonly GraphQLInterfaceType[];
```

Defined in: node\_modules/graphql/type/definition.d.ts:1891

Returns the interfaces implemented by this type.

#### Returns

readonly `GraphQLInterfaceType`[]

The implemented interfaces.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertObjectType } from 'graphql/type';

const schema = buildSchema(`
  interface Node {
    id: ID!
  }

  type User implements Node {
    id: ID!
  }

  type Query {
    viewer: User
  }
`);

const User = assertObjectType(schema.getType('User'));

User.getInterfaces().map((type) => type.name); // => ['Node']
```

***

### toConfig()

```ts
toConfig(): GraphQLObjectTypeNormalizedConfig<TSource, TContext>;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1913

Returns a normalized configuration object for this object.

#### Returns

`GraphQLObjectTypeNormalizedConfig`\<`TSource`, `TContext`\>

A configuration object that can be used to recreate this object.

#### Example

```ts
import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: { type: GraphQLString },
  },
});

const config = User.toConfig();
const UserCopy = new GraphQLObjectType(config);

config.fields.name.type; // => GraphQLString
UserCopy.getFields().name.type; // => GraphQLString
```

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1954

Returns the JSON representation used when this object is serialized.

#### Returns

`string`

The JSON-serializable representation.

#### Example

```ts
import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const User = new GraphQLObjectType({
  name: 'User',
  fields: { name: { type: GraphQLString } },
});

User.toJSON(); // => 'User'
JSON.stringify({ type: User }); // => '{"type":"User"}'
```

***

### toString()

```ts
toString(): string;
```

Defined in: node\_modules/graphql/type/definition.d.ts:1937

Returns the schema coordinate identifying this object type.

#### Returns

`string`

The schema coordinate for this object type.

#### Example

```ts
import { buildSchema } from 'graphql/utilities';
import { assertObjectType } from 'graphql/type';

const schema = buildSchema(`
  type User {
    name: String
  }

  type Query {
    viewer: User
  }
`);

const User = assertObjectType(schema.getType('User'));

User.toString(); // => 'User'
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="astnode"></a> `astNode` | `Maybe`\<`ObjectTypeDefinitionNode`\> | AST node from which this schema element was built, if available. | node\_modules/graphql/type/definition.d.ts:1726 |
| <a id="description"></a> `description` | `Maybe`\<`string`\> | Human-readable description for this schema element, if provided. | node\_modules/graphql/type/definition.d.ts:1720 |
| <a id="extensionastnodes"></a> `extensionASTNodes` | readonly `ObjectTypeExtensionNode`[] | AST extension nodes applied to this schema element. | node\_modules/graphql/type/definition.d.ts:1728 |
| <a id="extensions"></a> `extensions` | `Readonly`\<`GraphQLObjectTypeExtensions`\<`TSource`, `TContext`\>\> | Custom extension fields reserved for users. | node\_modules/graphql/type/definition.d.ts:1724 |
| <a id="istypeof"></a> `isTypeOf` | `Maybe`\<`GraphQLIsTypeOfFn`\<`TSource`, `TContext`\>\> | Predicate used to determine whether a runtime value belongs to this object type. | node\_modules/graphql/type/definition.d.ts:1722 |
| <a id="name"></a> `name` | `string` | The GraphQL name for this schema element. | node\_modules/graphql/type/definition.d.ts:1718 |
