# packages/apollo/src

## Classes

| Class | Description |
| ------ | ------ |
| [ApolloService](classes/ApolloService.md) | Service for managing Apollo Server instance and GraphQL operations. Handles schema resolution, server startup, context creation, and WebSocket subscriptions. |
| [ApolloShutdownService](classes/ApolloShutdownService.md) | Internal provider that shuts the Apollo Server down on application teardown. It disposes every live WebSocket connection (clearing their keep-alive intervals and init timers) and stops the ApolloServer's background machinery, preventing a per-restart leak. |
| [AuthenticationError](classes/AuthenticationError.md) | Error thrown when the user is not authenticated. |
| [Float](classes/Float.md) | Marker class for GraphQL Float scalar. Use with @Field(() => Float). |
| [ForbiddenError](classes/ForbiddenError.md) | Error thrown when the user is not authorized to access a resource. |
| [GraphQLList](classes/GraphQLList.md) | List Type Wrapper |
| [GraphQLModule](classes/GraphQLModule.md) | GraphQL module for nestelia backed by Apollo Server. Provides static and async configuration methods. |
| [GraphQLNonNull](classes/GraphQLNonNull.md) | Non-Null Type Wrapper |
| [GraphQLObjectType](classes/GraphQLObjectType.md) | Object Type Definition |
| [GraphQLSchema](classes/GraphQLSchema.md) | Schema Definition |
| [ID](classes/ID.md) | Marker class for GraphQL ID scalar. Use with @Field(() => ID). |
| [Int](classes/Int.md) | Marker class for GraphQL Int scalar. Use with @Field(() => Int). |
| [PageInfo](classes/PageInfo.md) | Standard Relay-style PageInfo object. Included in every Connection type. |
| [SchemaBuilder](classes/SchemaBuilder.md) | Builds a GraphQL schema from decorator metadata stored in [typeMetadataStorage](variables/typeMetadataStorage.md). Follows the code-first schema generation pattern. |
| [TypeMetadataStorage](classes/TypeMetadataStorage.md) | Global storage for GraphQL type metadata. Fields are stored separately from type declarations. globalThis ensures a single instance even with symlink-based module resolution. |
| [UserInputError](classes/UserInputError.md) | Error thrown when the user input is invalid. |
| [ValidationError](classes/ValidationError.md) | Error thrown when the user input does not pass validation. |

## Functions

| Function | Description |
| ------ | ------ |
| [Args](functions/Args.md) | Decorator for resolver arguments. |
| [ArgsType](functions/ArgsType.md) | ArgsType decorator for marking classes as GraphQL arguments DTOs. |
| [Context](functions/Context.md) | Decorator for the GraphQL context. Provides access to the GraphQL request context. |
| [createConnectionType](functions/createConnectionType.md) | Creates a Relay-style Connection type for a given node class. Fields: `edges`, `pageInfo`, `totalCount`. |
| [createEdgeType](functions/createEdgeType.md) | Creates a Relay-style Edge type for a given node class. Fields: `node`, `cursor`. |
| [createUnionType](functions/createUnionType.md) | createUnionType function for creating GraphQL union types. |
| [Directive](functions/Directive.md) | Decorator for GraphQL Directive. |
| [Enum](functions/Enum.md) | Decorator for GraphQL Enum. |
| [Field](functions/Field.md) | Decorator for a GraphQL field. |
| [HideField](functions/HideField.md) | Hides a field from the GraphQL schema. |
| [Info](functions/Info.md) | Decorator for GraphQL resolve info. Provides access to GraphQL request information (AST, field nodes, etc.). |
| [InputType](functions/InputType.md) | Decorator for GraphQL Input Type. |
| [InterfaceType](functions/InterfaceType.md) | Decorator for GraphQL Interface. |
| [Mutation](functions/Mutation.md) | Decorator for a GraphQL Mutation. |
| [ObjectType](functions/ObjectType.md) | Decorator for GraphQL Object Type. |
| [Paginated](functions/Paginated.md) | Creates a simple paginated response type for a given item class. Fields: `items`, `total`, `hasNextPage`, `hasPreviousPage`. |
| [Parent](functions/Parent.md) | Decorator for the parent/root value in a field resolver. Provides access to the parent object from the field resolver. |
| [processMultipartRequest](functions/processMultipartRequest.md) | Processes a GraphQL multipart request per the [GraphQL multipart request spec](https://github.com/jaydenseric/graphql-multipart-request-spec). |
| [Query](functions/Query.md) | Decorator for a GraphQL Query. |
| [registerEnumType](functions/registerEnumType.md) | registerEnumType function for registering enums with GraphQL schema. |
| [registerGraphQLRoutes](functions/registerGraphQLRoutes.md) | Route registration function. |
| [ResolveField](functions/ResolveField.md) | Decorator for a field resolver. Used to resolve individual fields of a type. |
| [Resolver](functions/Resolver.md) | Decorator for a GraphQL resolver class. |
| [ResolverReturnType](functions/ResolverReturnType.md) | Decorator to explicitly specify the return type of a field resolver. |
| [ReturnType](functions/ReturnType.md) | Decorator to explicitly specify the return type of a Query. |
| [Scalar](functions/Scalar.md) | Decorator for GraphQL Scalar. |
| [Subscription](functions/Subscription.md) | Decorator for a GraphQL Subscription. |
| [Union](functions/Union.md) | Decorator for GraphQL Union. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ApolloContext](interfaces/ApolloContext.md) | Elysia-specific GraphQL request context. |
| [ApolloOptions](interfaces/ApolloOptions.md) | Options for configuring the GraphQL / Apollo module. |
| [ArgMetadata](interfaces/ArgMetadata.md) | - |
| [ArgsMetadata](interfaces/ArgsMetadata.md) | - |
| [ArgsOptions](interfaces/ArgsOptions.md) | Options for an argument. |
| [BuildSchemaOptions](interfaces/BuildSchemaOptions.md) | Options for building the GraphQL schema. |
| [ContextMetadata](interfaces/ContextMetadata.md) | - |
| [CustomScalar](interfaces/CustomScalar.md) | Interface for custom scalars. |
| [DirectiveMetadata](interfaces/DirectiveMetadata.md) | - |
| [EnumMetadata](interfaces/EnumMetadata.md) | - |
| [FieldMetadata](interfaces/FieldMetadata.md) | - |
| [FieldResolverMetadata](interfaces/FieldResolverMetadata.md) | - |
| [FieldResolverOptions](interfaces/FieldResolverOptions.md) | Options for the |
| [GqlExecutionContext](interfaces/GqlExecutionContext.md) | Context accessor for GraphQL resolvers - mirrors the GqlExecutionContext API. |
| [GqlExecutionContextStatic](interfaces/GqlExecutionContextStatic.md) | Static interface for creating GqlExecutionContext instances. |
| [GraphQLContext](interfaces/GraphQLContext.md) | GraphQL context available in resolvers. |
| [GraphQLRuntimeContext](interfaces/GraphQLRuntimeContext.md) | Runtime context for GraphQL operations. |
| [GraphQLSubscriptionTransportWsOptions](interfaces/GraphQLSubscriptionTransportWsOptions.md) | Options for legacy subscriptions-transport-ws protocol. |
| [GraphQLWsContext](interfaces/GraphQLWsContext.md) | Context for GraphQL WebSocket connections. |
| [GraphQLWsSubscriptionsOptions](interfaces/GraphQLWsSubscriptionsOptions.md) | Options for GraphQL WebSocket subscriptions (graphql-ws protocol). |
| [InfoMetadata](interfaces/InfoMetadata.md) | - |
| [InputTypeMetadata](interfaces/InputTypeMetadata.md) | - |
| [InterfaceTypeMetadata](interfaces/InterfaceTypeMetadata.md) | - |
| [MutationMetadata](interfaces/MutationMetadata.md) | - |
| [MutationOptions](interfaces/MutationOptions.md) | Options for the |
| [ObjectTypeMetadata](interfaces/ObjectTypeMetadata.md) | - |
| [ParentMetadata](interfaces/ParentMetadata.md) | @Parent/Root metadata. |
| [QueryMetadata](interfaces/QueryMetadata.md) | - |
| [QueryOptions](interfaces/QueryOptions.md) | Options for the |
| [ResolverMetadata](interfaces/ResolverMetadata.md) | - |
| [ResolverOptions](interfaces/ResolverOptions.md) | Options for the |
| [ReturnTypeMetadata](interfaces/ReturnTypeMetadata.md) | - |
| [ScalarMetadata](interfaces/ScalarMetadata.md) | - |
| [ScalarsTypeMap](interfaces/ScalarsTypeMap.md) | Mapping between TypeScript types and GraphQL scalars. |
| [SubscriptionMetadata](interfaces/SubscriptionMetadata.md) | - |
| [SubscriptionOptions](interfaces/SubscriptionOptions.md) | Options for the |
| [UnionMetadata](interfaces/UnionMetadata.md) | - |
| [UploadedFile](interfaces/UploadedFile.md) | Represents an uploaded file in a GraphQL multipart request. Provides access to file metadata and streaming capabilities. |
| [UploadOptions](interfaces/UploadOptions.md) | Options for controlling file upload limits in a GraphQL multipart request. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [DateScalarMode](type-aliases/DateScalarMode.md) | Date scalar serialization mode. |
| [GqlContextType](type-aliases/GqlContextType.md) | Type identifier for GraphQL context type. |
| [NumberScalarMode](type-aliases/NumberScalarMode.md) | Number scalar serialization mode. |
| [ParamMetadata](type-aliases/ParamMetadata.md) | Union parameter metadata. |
| [ResolveFn](type-aliases/ResolveFn.md) | Resolve function type for subscriptions. |
| [SubscribeFn](type-aliases/SubscribeFn.md) | Subscribe function type for subscriptions. |
| [SubscriptionConfig](type-aliases/SubscriptionConfig.md) | Subscription configuration supporting multiple protocols. |

## Variables

| Variable | Description |
| ------ | ------ |
| [ARGS\_METADATA](variables/ARGS_METADATA.md) | Metadata key for |
| [CONTEXT\_METADATA](variables/CONTEXT_METADATA.md) | Metadata key for |
| [Ctx](variables/Ctx.md) | Alias for |
| [DIRECTIVE\_METADATA](variables/DIRECTIVE_METADATA.md) | Metadata key for |
| [ENUM\_METADATA](variables/ENUM_METADATA.md) | Metadata key for |
| [FIELD\_METADATA](variables/FIELD_METADATA.md) | Metadata key for |
| [FIELD\_RESOLVER\_METADATA](variables/FIELD_RESOLVER_METADATA.md) | Metadata key for |
| [GQL\_OPTIONS\_METADATA](variables/GQL_OPTIONS_METADATA.md) | Metadata key for GraphQL options. |
| [GqlExecutionContext](variables/GqlExecutionContext.md) | Utility for creating GraphQL execution contexts. Provides access to resolver arguments, context, and GraphQL-specific information. |
| [GraphQLBigInt](variables/GraphQLBigInt.md) | GraphQL scalar for JavaScript bigint values. Serialized as a string to avoid precision loss. |
| [GraphQLBoolean](variables/GraphQLBoolean.md) | The built-in `Boolean` scalar type. |
| [GraphQLDateTime](variables/GraphQLDateTime.md) | GraphQL scalar that serializes JS Date to/from ISO 8601 strings. |
| [GraphQLEmailAddress](variables/GraphQLEmailAddress.md) | GraphQL scalar for email address strings (basic RFC format validation). |
| [GraphQLFloat](variables/GraphQLFloat.md) | The built-in `Float` scalar type. |
| [GraphQLID](variables/GraphQLID.md) | The built-in `ID` scalar type. |
| [GraphQLInt](variables/GraphQLInt.md) | The built-in `Int` scalar type. |
| [GraphQLJSON](variables/GraphQLJSON.md) | GraphQL scalar that accepts any JSON-serializable value. |
| [GraphQLString](variables/GraphQLString.md) | The built-in `String` scalar type. |
| [GraphQLUpload](variables/GraphQLUpload.md) | GraphQL scalar type for handling file uploads. Implements the GraphQL multipart request specification. |
| [GraphQLURL](variables/GraphQLURL.md) | GraphQL scalar for validated URL strings. |
| [GraphQLUUID](variables/GraphQLUUID.md) | GraphQL scalar for UUID strings (any version, canonical lowercase format). |
| [HIDDEN\_FIELDS\_METADATA](variables/HIDDEN_FIELDS_METADATA.md) | Metadata key for hidden fields. |
| [INFO\_METADATA](variables/INFO_METADATA.md) | Metadata key for |
| [INPUT\_TYPE\_METADATA](variables/INPUT_TYPE_METADATA.md) | Metadata key for |
| [INTERFACE\_TYPE\_METADATA](variables/INTERFACE_TYPE_METADATA.md) | Metadata key for |
| [MUTATION\_METADATA](variables/MUTATION_METADATA.md) | Metadata key for |
| [OBJECT\_TYPE\_METADATA](variables/OBJECT_TYPE_METADATA.md) | Metadata key for |
| [PARENT\_METADATA](variables/PARENT_METADATA.md) | Metadata key for |
| [QUERY\_METADATA](variables/QUERY_METADATA.md) | Metadata key for |
| [RESOLVER\_METADATA](variables/RESOLVER_METADATA.md) | Metadata key for |
| [RETURN\_TYPE\_METADATA](variables/RETURN_TYPE_METADATA.md) | Metadata key for return type information. |
| [Root](variables/Root.md) | Alias for |
| [SCALAR\_METADATA](variables/SCALAR_METADATA.md) | Metadata key for |
| [SUBSCRIPTION\_METADATA](variables/SUBSCRIPTION_METADATA.md) | Metadata key for |
| [typeMetadataStorage](variables/typeMetadataStorage.md) | Global singleton instance of TypeMetadataStorage. Stored on globalThis to ensure a single instance across the application. |
| [UNION\_METADATA](variables/UNION_METADATA.md) | Metadata key for |

## References

### FieldResolver

Renames and re-exports [ResolveField](functions/ResolveField.md)
