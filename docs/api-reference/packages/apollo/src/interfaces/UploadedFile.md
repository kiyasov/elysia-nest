# Interface: UploadedFile

Defined in: [packages/apollo/src/upload.ts:52](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L52)

Represents an uploaded file in a GraphQL multipart request.
Provides access to file metadata and streaming capabilities.

## Example

```typescript
const resolve = async (_, { file }: { file: Promise<UploadedFile> }) => {
  const upload = await file;
  const stream = upload.stream;
  // Process stream...
};
```

## Methods

### arrayBuffer()

```ts
arrayBuffer(): Promise<ArrayBuffer>;
```

Defined in: [packages/apollo/src/upload.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L66)

Reads the entire file into an ArrayBuffer.

#### Returns

`Promise`\<`ArrayBuffer`\>

***

### blob()

```ts
blob(): Promise<Blob>;
```

Defined in: [packages/apollo/src/upload.ts:64](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L64)

Returns the file as a Blob.

#### Returns

`Promise`\<`Blob`\>

***

### text()

```ts
text(): Promise<string>;
```

Defined in: [packages/apollo/src/upload.ts:68](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L68)

Reads the entire file as UTF-8 text.

#### Returns

`Promise`\<`string`\>

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="fieldname"></a> `fieldName` | `readonly` | `string` | The form field name for this file upload. | [packages/apollo/src/upload.ts:54](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L54) |
| <a id="filename"></a> `filename` | `readonly` | `string` | The original filename provided by the client. | [packages/apollo/src/upload.ts:56](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L56) |
| <a id="mimetype"></a> `mimetype` | `readonly` | `string` | The MIME type of the file (e.g., 'image/jpeg', 'application/pdf'). | [packages/apollo/src/upload.ts:58](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L58) |
| <a id="size"></a> `size` | `readonly` | `number` | The file size in bytes. | [packages/apollo/src/upload.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L60) |
| <a id="stream"></a> `stream` | `readonly` | `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\> | A readable stream of the file contents. Native Web Streams API. | [packages/apollo/src/upload.ts:62](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L62) |
