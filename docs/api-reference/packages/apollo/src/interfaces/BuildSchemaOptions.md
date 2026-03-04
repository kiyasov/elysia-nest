# Interface: BuildSchemaOptions

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L61)

Options for building the GraphQL schema.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="addnewlineatend"></a> `addNewlineAtEnd?` | `boolean` | Add newline at end of generated schema file. | [packages/apollo/src/interfaces/apollo-options.interface.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L77) |
| <a id="datescalarmode"></a> `dateScalarMode?` | [`DateScalarMode`](../type-aliases/DateScalarMode.md) | Date scalar mode (ISO string or timestamp). | [packages/apollo/src/interfaces/apollo-options.interface.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L63) |
| <a id="directives"></a> `directives?` | `GraphQLDirective`[] | Custom directives to include. | [packages/apollo/src/interfaces/apollo-options.interface.ts:73](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L73) |
| <a id="noduplicatedfields"></a> `noDuplicatedFields?` | `boolean` | Prevent duplicate field definitions. | [packages/apollo/src/interfaces/apollo-options.interface.ts:75](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L75) |
| <a id="numberscalarmode"></a> `numberScalarMode?` | [`NumberScalarMode`](../type-aliases/NumberScalarMode.md) | Number scalar mode (float or integer). | [packages/apollo/src/interfaces/apollo-options.interface.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L65) |
| <a id="orphanedtypes"></a> `orphanedTypes?` | (`object` \| `Constructor`)[] | Types that are not directly referenced but should be included. | [packages/apollo/src/interfaces/apollo-options.interface.ts:69](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L69) |
| <a id="scalarsmap"></a> `scalarsMap?` | [`ScalarsTypeMap`](ScalarsTypeMap.md)[] | Custom scalar type mappings. | [packages/apollo/src/interfaces/apollo-options.interface.ts:67](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L67) |
| <a id="skipcheck"></a> `skipCheck?` | `boolean` | Skip schema validation. | [packages/apollo/src/interfaces/apollo-options.interface.ts:71](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L71) |
