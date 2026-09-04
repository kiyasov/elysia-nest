# Abstract Class: BaseServer

Defined in: [packages/microservices/src/transports/server.ts:20](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L20)

Abstract base class for all built-in transport servers.

Maintains two separate handler registries:
- `messageHandlers` – request-response handlers (registered via [MessagePattern](../functions/MessagePattern.md)).
- `eventHandlers`   – fire-and-forget handlers  (registered via [EventPattern](../functions/EventPattern.md)).

The unified [addHandler](#addhandler) method routes to `messageHandlers` for backward
compatibility with code that does not distinguish between the two.

## Extends

- `EventEmitter`

## Extended by

- [`RabbitMQServer`](RabbitMQServer.md)
- [`RedisServer`](RedisServer.md)
- [`TcpServer`](TcpServer.md)

## Implements

- [`Server`](../interfaces/Server.md)

## Constructors

### Constructor

```ts
new BaseServer(options?): BaseServer;
```

Defined in: node\_modules/@types/node/events.d.ts:54

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `EventEmitterOptions` |

#### Returns

`BaseServer`

#### Inherited from

```ts
EventEmitter.constructor
```

## Methods

### \[captureRejectionSymbol\]()?

```ts
optional [captureRejectionSymbol](
   error, 
   event, 
   ...args
): void;
```

Defined in: node\_modules/@types/node/events.d.ts:87

The `Symbol.for('nodejs.rejection')` method is called in case a
promise rejection happens when emitting an event and
`captureRejections` is enabled on the emitter.
It is possible to use `events.captureRejectionSymbol` in
place of `Symbol.for('nodejs.rejection')`.

```js
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `Error` |
| `event` | `string` \| `symbol` |
| ...`args` | `any`[] |

#### Returns

`void`

#### Since

v13.4.0, v12.16.0

#### Inherited from

```ts
EventEmitter.[captureRejectionSymbol]
```

***

### addEventHandler()

```ts
addEventHandler(pattern, callback): void;
```

Defined in: [packages/microservices/src/transports/server.ts:50](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L50)

Registers `callback` as a fire-and-forget event handler for `pattern`.
The handler's return value is ignored.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `callback` | [`MessageHandler`](../type-aliases/MessageHandler.md) |

#### Returns

`void`

***

### addHandler()

```ts
addHandler(pattern, callback): void;
```

Defined in: [packages/microservices/src/transports/server.ts:33](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L33)

Registers `callback` as a request-response handler for `pattern`.
Equivalent to [addMessageHandler](#addmessagehandler).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `callback` | [`MessageHandler`](../type-aliases/MessageHandler.md) |

#### Returns

`void`

#### Implementation of

[`Server`](../interfaces/Server.md).[`addHandler`](../interfaces/Server.md#addhandler)

***

### addListener()

```ts
addListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:92

Alias for `emitter.on(eventName, listener)`.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`) => `void` |

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
EventEmitter.addListener
```

***

### addMessageHandler()

```ts
addMessageHandler(pattern, callback): void;
```

Defined in: [packages/microservices/src/transports/server.ts:42](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L42)

Registers `callback` as a request-response handler for `pattern`.
The handler is expected to return a value that will be sent back to
the caller.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `callback` | [`MessageHandler`](../type-aliases/MessageHandler.md) |

#### Returns

`void`

***

### cleanup()

```ts
protected cleanup(): void;
```

Defined in: [packages/microservices/src/transports/server.ts:89](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L89)

Removes all EventEmitter listeners and clears both handler maps.
Subclasses should call this in their `close()` implementation to
prevent memory leaks.

#### Returns

`void`

***

### close()

```ts
abstract close(): void;
```

Defined in: [packages/microservices/src/transports/server.ts:61](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L61)

Shut down the transport and release all resources.

#### Returns

`void`

#### Implementation of

[`Server`](../interfaces/Server.md).[`close`](../interfaces/Server.md#close)

***

### emit()

```ts
emit<E>(eventName, ...args): boolean;
```

Defined in: node\_modules/@types/node/events.d.ts:134

Synchronously calls each of the listeners registered for the event named
`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| ...`args` | `any`[] |

#### Returns

`boolean`

#### Since

v0.1.26

#### Inherited from

```ts
EventEmitter.emit
```

***

### emitError()

```ts
protected emitError(error): void;
```

Defined in: [packages/microservices/src/transports/server.ts:76](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L76)

Safely surfaces a transport-level error.

Node's EventEmitter throws `ERR_UNHANDLED_ERROR` when `"error"` is
emitted with no registered listener, which would crash the whole process
on a routine `ECONNRESET`, Redis blip, or malformed frame. This helper only
re-emits when a listener is attached; otherwise it logs the error so it is
never silently swallowed and never crashes the process.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`void`

***

### emitEvent()

```ts
abstract emitEvent<T>(pattern, data): void;
```

Defined in: [packages/microservices/src/transports/server.ts:59](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L59)

Publish a fire-and-forget event.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |

#### Returns

`void`

#### Implementation of

[`Server`](../interfaces/Server.md).[`emitEvent`](../interfaces/Server.md#emitevent)

***

### eventNames()

```ts
eventNames(): (string | symbol)[];
```

Defined in: node\_modules/@types/node/events.d.ts:154

Returns an array listing the events for which the emitter has registered
listeners.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

#### Since

v6.0.0

#### Inherited from

```ts
EventEmitter.eventNames
```

***

### getMaxListeners()

```ts
getMaxListeners(): number;
```

Defined in: node\_modules/@types/node/events.d.ts:161

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to
`events.defaultMaxListeners`.

#### Returns

`number`

#### Since

v1.0.0

#### Inherited from

```ts
EventEmitter.getMaxListeners
```

***

### handleEvent()

```ts
protected handleEvent<T>(
   pattern, 
   data, 
   ctx
): unknown;
```

Defined in: [packages/microservices/src/transports/server.ts:116](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L116)

Dispatches an incoming event to the matching event handler and returns the
handler's result so transports can `await` it before acknowledging the
message. Silently ignores events without a registered handler.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |
| `ctx` | `Record`\<`string`, `unknown`\> |

#### Returns

`unknown`

***

### handleMessage()

```ts
protected handleMessage<T, R>(
   pattern, 
   data, 
   ctx
): unknown;
```

Defined in: [packages/microservices/src/transports/server.ts:99](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L99)

Dispatches an incoming request to the matching message handler.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |
| `R` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |
| `ctx` | `Record`\<`string`, `unknown`\> |

#### Returns

`unknown`

#### Throws

When no handler is registered for `pattern`.

***

### listen()

```ts
abstract listen(callback?): void | Promise<void>;
```

Defined in: [packages/microservices/src/transports/server.ts:63](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L63)

Start the transport server.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback?` | (`err?`) => `void` | Called when the server is ready or has failed. |

#### Returns

`void` \| `Promise`\<`void`\>

#### Implementation of

[`Server`](../interfaces/Server.md).[`listen`](../interfaces/Server.md#listen)

***

### listenerCount()

```ts
listenerCount<E>(eventName, listener?): number;
```

Defined in: node\_modules/@types/node/events.d.ts:170

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | (...`args`) => `void` | The event handler function |

#### Returns

`number`

#### Since

v3.2.0

#### Inherited from

```ts
EventEmitter.listenerCount
```

***

### listeners()

```ts
listeners<E>(eventName): (...args) => void[];
```

Defined in: node\_modules/@types/node/events.d.ts:186

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

#### Returns

(...`args`) => `void`[]

#### Since

v0.1.26

#### Inherited from

```ts
EventEmitter.listeners
```

***

### off()

```ts
off<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:191

Alias for `emitter.removeListener()`.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`) => `void` |

#### Returns

`this`

#### Since

v10.0.0

#### Inherited from

```ts
EventEmitter.off
```

***

### on()

```ts
on<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:225

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`) => `void` | The callback function |

#### Returns

`this`

#### Since

v0.1.101

#### Inherited from

```ts
EventEmitter.on
```

***

### once()

```ts
once<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:256

Adds a **one-time** `listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`) => `void` | The callback function |

#### Returns

`this`

#### Since

v0.3.0

#### Inherited from

```ts
EventEmitter.once
```

***

### prependListener()

```ts
prependListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:275

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`) => `void` | The callback function |

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

```ts
EventEmitter.prependListener
```

***

### prependOnceListener()

```ts
prependOnceListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:292

Adds a **one-time** `listener` function for the event named `eventName` to the
_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`) => `void` | The callback function |

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

```ts
EventEmitter.prependOnceListener
```

***

### rawListeners()

```ts
rawListeners<E>(eventName): (...args) => void[];
```

Defined in: node\_modules/@types/node/events.d.ts:326

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

#### Returns

(...`args`) => `void`[]

#### Since

v9.4.0

#### Inherited from

```ts
EventEmitter.rawListeners
```

***

### removeAllListeners()

```ts
removeAllListeners<E>(eventName?): this;
```

Defined in: node\_modules/@types/node/events.d.ts:338

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName?` | `string` \| `symbol` |

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
EventEmitter.removeAllListeners
```

***

### removeListener()

```ts
removeListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:425

Removes the specified `listener` from the listener array for the event named
`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any
`removeListener()` or `removeAllListeners()` calls _after_ emitting and
_before_ the last listener finishes execution will not remove them from
`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indexes of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`
listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`) => `void` |

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
EventEmitter.removeListener
```

***

### sendMessage()

```ts
abstract sendMessage<T>(pattern, data): Promise<unknown>;
```

Defined in: [packages/microservices/src/transports/server.ts:54](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L54)

Send a request and wait for the response.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`Server`](../interfaces/Server.md).[`sendMessage`](../interfaces/Server.md#sendmessage)

***

### setMaxListeners()

```ts
setMaxListeners(n): this;
```

Defined in: node\_modules/@types/node/events.d.ts:436

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to
`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |

#### Returns

`this`

#### Since

v0.3.5

#### Inherited from

```ts
EventEmitter.setMaxListeners
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="eventhandlers"></a> `eventHandlers` | `readonly` | `Map`\<`string`, [`MessageHandler`](../type-aliases/MessageHandler.md)\> | Handlers for fire-and-forget event patterns. | [packages/microservices/src/transports/server.ts:27](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L27) |
| <a id="messagehandlers"></a> `messageHandlers` | `readonly` | `Map`\<`string`, [`MessageHandler`](../type-aliases/MessageHandler.md)\> | Handlers for request-response patterns. | [packages/microservices/src/transports/server.ts:25](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/transports/server.ts#L25) |
