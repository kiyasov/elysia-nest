# Variable: GraphQLUpload

```ts
const GraphQLUpload: GraphQLScalarType<Promise<UploadedFile>, never>;
```

Defined in: [packages/apollo/src/upload.ts:121](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L121)

GraphQL scalar type for handling file uploads.
Implements the GraphQL multipart request specification.

## Example

```typescript
@ObjectType()
class Mutation {
  @Mutation(() => Boolean)
  async uploadFile(@Arg('file', () => GraphQLUpload) file: Promise<UploadedFile>) {
    const upload = await file;
    // Process upload...
    return true;
  }
}
```
