# Enumeration: HttpStatus

Defined in: [packages/core/src/enums/http-status.enum.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L29)

Standard HTTP status codes.

Used to indicate the result of HTTP request processing.
Codes are grouped into categories:
- 1xx: Informational
- 2xx: Success
- 3xx: Redirection
- 4xx: Client Error
- 5xx: Server Error

## Example

```typescript
@Get()
findAll() {
  return HttpStatus.OK; // 200
}

@Post()
create() {
  return HttpStatus.CREATED; // 201
}
```

## See

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

## Public Api

## Enumeration Members

### ACCEPTED

```ts
ACCEPTED: 202;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L51)

The request has been accepted for processing but not yet completed

***

### AMBIGUOUS

```ts
AMBIGUOUS: 300;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:67](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L67)

Multiple response options available, client must choose

***

### BAD\_GATEWAY

```ts
BAD_GATEWAY: 502;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:168](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L168)

Bad response from upstream server

***

### BAD\_REQUEST

```ts
BAD_REQUEST: 400;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:89](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L89)

The server cannot understand the request due to malformed syntax

***

### CONFLICT

```ts
CONFLICT: 409;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L116)

There is a conflict with the current state of the resource

***

### CONTINUE

```ts
CONTINUE: 100;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L32)

The server has received the initial part of the request and the client may continue sending

***

### CREATED

```ts
CREATED: 201;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:48](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L48)

The resource has been created successfully (typically after POST or PUT)

***

### EARLYHINTS

```ts
EARLYHINTS: 103;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:41](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L41)

Preliminary response with headers that the client may use

***

### EXPECTATION\_FAILED

```ts
EXPECTATION_FAILED: 417;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:140](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L140)

The expectation given in the Expect header cannot be met

***

### FAILED\_DEPENDENCY

```ts
FAILED_DEPENDENCY: 424;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:152](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L152)

Error due to failure of a previous request (WebDAV)

***

### FORBIDDEN

```ts
FORBIDDEN: 403;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:98](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L98)

Access is forbidden (no rights to the resource)

***

### FOUND

```ts
FOUND: 302;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:73](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L73)

The resource is temporarily available at a different URL

***

### GATEWAY\_TIMEOUT

```ts
GATEWAY_TIMEOUT: 504;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:174](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L174)

The upstream server did not respond in time

***

### GONE

```ts
GONE: 410;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:119](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L119)

The resource has been removed and is no longer available

***

### HTTP\_VERSION\_NOT\_SUPPORTED

```ts
HTTP_VERSION_NOT_SUPPORTED: 505;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:177](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L177)

The HTTP version is not supported by the server

***

### I\_AM\_A\_TEAPOT

```ts
I_AM_A_TEAPOT: 418;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:143](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L143)

I'm a teapot (Easter Egg from RFC 2324)

***

### INTERNAL\_SERVER\_ERROR

```ts
INTERNAL_SERVER_ERROR: 500;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:162](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L162)

Internal server error

***

### LENGTH\_REQUIRED

```ts
LENGTH_REQUIRED: 411;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:122](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L122)

Content-Length header is required

***

### METHOD\_NOT\_ALLOWED

```ts
METHOD_NOT_ALLOWED: 405;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:104](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L104)

The HTTP method is not allowed for this resource

***

### MISDIRECTED

```ts
MISDIRECTED: 421;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:146](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L146)

The request was directed to a server that cannot produce a response

***

### MOVED\_PERMANENTLY

```ts
MOVED_PERMANENTLY: 301;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:70](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L70)

The resource has been moved permanently to a new URL

***

### NO\_CONTENT

```ts
NO_CONTENT: 204;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:57](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L57)

The request succeeded but the response body is empty

***

### NON\_AUTHORITATIVE\_INFORMATION

```ts
NON_AUTHORITATIVE_INFORMATION: 203;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:54](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L54)

The information comes from a third-party source

***

### NOT\_ACCEPTABLE

```ts
NOT_ACCEPTABLE: 406;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L107)

The server cannot produce a response in the requested format

***

### NOT\_FOUND

```ts
NOT_FOUND: 404;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:101](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L101)

The resource could not be found

***

### NOT\_IMPLEMENTED

```ts
NOT_IMPLEMENTED: 501;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:165](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L165)

The server does not support the functionality required to fulfill the request

***

### NOT\_MODIFIED

```ts
NOT_MODIFIED: 304;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:79](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L79)

The resource has not changed since the last request (caching)

***

### OK

```ts
OK: 200;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:45](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L45)

The request has succeeded

***

### PARTIAL\_CONTENT

```ts
PARTIAL_CONTENT: 206;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L63)

The server is returning only part of the resource (for range requests)

***

### PAYLOAD\_TOO\_LARGE

```ts
PAYLOAD_TOO_LARGE: 413;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:128](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L128)

The request payload is too large

***

### PAYMENT\_REQUIRED

```ts
PAYMENT_REQUIRED: 402;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:95](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L95)

Payment required (reserved for future use)

***

### PERMANENT\_REDIRECT

```ts
PERMANENT_REDIRECT: 308;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:85](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L85)

The resource has been moved permanently to a new URL (do not change request method)

***

### PRECONDITION\_FAILED

```ts
PRECONDITION_FAILED: 412;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:125](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L125)

A precondition given in the headers is not met

***

### PRECONDITION\_REQUIRED

```ts
PRECONDITION_REQUIRED: 428;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:155](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L155)

The server requires conditional headers

***

### PROCESSING

```ts
PROCESSING: 102;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L38)

The server is processing the request but no response is available yet (WebDAV)

***

### PROXY\_AUTHENTICATION\_REQUIRED

```ts
PROXY_AUTHENTICATION_REQUIRED: 407;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:110](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L110)

Authentication through proxy is required

***

### REQUEST\_TIMEOUT

```ts
REQUEST_TIMEOUT: 408;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:113](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L113)

The server timed out waiting for the request

***

### REQUESTED\_RANGE\_NOT\_SATISFIABLE

```ts
REQUESTED_RANGE_NOT_SATISFIABLE: 416;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:137](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L137)

The requested range cannot be returned

***

### RESET\_CONTENT

```ts
RESET_CONTENT: 205;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L60)

The client should reset the document (e.g., clear form)

***

### SEE\_OTHER

```ts
SEE_OTHER: 303;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:76](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L76)

The client should retrieve the resource via GET from another URL

***

### SERVICE\_UNAVAILABLE

```ts
SERVICE_UNAVAILABLE: 503;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:171](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L171)

The server is temporarily unavailable (overload or maintenance)

***

### SWITCHING\_PROTOCOLS

```ts
SWITCHING_PROTOCOLS: 101;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L35)

The server agrees to switch protocols (e.g., to WebSocket)

***

### TEMPORARY\_REDIRECT

```ts
TEMPORARY_REDIRECT: 307;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:82](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L82)

The resource is temporarily available at a different URL (do not change request method)

***

### TOO\_MANY\_REQUESTS

```ts
TOO_MANY_REQUESTS: 429;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:158](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L158)

Too many requests (rate limiting)

***

### UNAUTHORIZED

```ts
UNAUTHORIZED: 401;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:92](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L92)

Authentication is required (not authorized)

***

### UNPROCESSABLE\_ENTITY

```ts
UNPROCESSABLE_ENTITY: 422;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:149](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L149)

Semantic error in the request (cannot be processed)

***

### UNSUPPORTED\_MEDIA\_TYPE

```ts
UNSUPPORTED_MEDIA_TYPE: 415;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:134](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L134)

The request media format is not supported by the server

***

### URI\_TOO\_LONG

```ts
URI_TOO_LONG: 414;
```

Defined in: [packages/core/src/enums/http-status.enum.ts:131](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/enums/http-status.enum.ts#L131)

The request URL is too long
