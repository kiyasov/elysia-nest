# Function: processMultipartRequest()

```ts
function processMultipartRequest(body): Promise<Record<string, unknown>>;
```

Defined in: [packages/apollo/src/upload.ts:232](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/upload.ts#L232)

Processes a GraphQL multipart request per the
[GraphQL multipart request spec](https://github.com/jaydenseric/graphql-multipart-request-spec).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | `MultipartBody` | The multipart request body. |

## Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

Operations object with uploaded files injected.

## Throws

Error if 'operations' field is missing.
