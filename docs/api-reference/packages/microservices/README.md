# packages/microservices

## Classes

| Class | Description |
| ------ | ------ |
| [BaseServer](classes/BaseServer.md) | Abstract base class for all built-in transport servers. |
| [ClientFactory](classes/ClientFactory.md) | Factory that creates the correct [ClientProxy](classes/ClientProxy.md) implementation for the given transport configuration. |
| [ClientProxy](classes/ClientProxy.md) | Abstract base class for all microservice client proxies. |
| [ElysiaNestApplication](classes/ElysiaNestApplication.md) | Top-level application class that ties together an Elysia HTTP server and one or more microservice transport servers. |
| [RabbitMQClient](classes/RabbitMQClient.md) | Client proxy that communicates over RabbitMQ (AMQP via amqplib). |
| [RabbitMQServer](classes/RabbitMQServer.md) | Transport server that uses RabbitMQ (AMQP via amqplib). |
| [RedisClient](classes/RedisClient.md) | Client proxy that communicates over Redis Pub/Sub. |
| [RedisServer](classes/RedisServer.md) | Transport server that uses Redis Pub/Sub for message passing. |
| [ServerFactory](classes/ServerFactory.md) | Factory that instantiates the correct transport server based on the provided [MicroserviceOptions](type-aliases/MicroserviceOptions.md). |
| [TcpClient](classes/TcpClient.md) | Client proxy that communicates over raw TCP with newline-delimited JSON framing. |
| [TcpServer](classes/TcpServer.md) | Transport server that uses raw TCP sockets with newline-delimited JSON framing for request-response and fire-and-forget communication. |

## Functions

| Function | Description |
| ------ | ------ |
| [Catch](functions/Catch.md) | Marks an exception filter class and declares which exception types it handles. Omitting arguments causes the filter to catch **all** exceptions. |
| [Client](functions/Client.md) | Marks a class property for automatic [ClientProxy](classes/ClientProxy.md) injection. The injected client is created using `config` and is ready to use after the application starts. |
| [createElysiaNestApplication](functions/createElysiaNestApplication.md) | Creates a bare [ElysiaNestApplication](classes/ElysiaNestApplication.md) that wraps an already-configured Elysia instance. |
| [createElysiaNestApplicationWithControllers](functions/createElysiaNestApplicationWithControllers.md) | Creates a new [ElysiaNestApplication](classes/ElysiaNestApplication.md) with a set of controllers pre-registered for pattern handler scanning. |
| [EventPattern](functions/EventPattern.md) | Marks a controller method as a **fire-and-forget** event handler. The method is called when a publisher emits an event matching `pattern`. No response is sent back to the publisher. |
| [MessageCtx](functions/MessageCtx.md) | Injects the microservice execution context into a method parameter. The context contains transport information and the matched pattern. |
| [MessagePattern](functions/MessagePattern.md) | Marks a controller method as a **request-response** message handler. The method is called when a client sends a message matching `pattern` and it is expected to return a response. |
| [Payload](functions/Payload.md) | Extracts the message payload (or a nested property of it) and injects it as a method parameter. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CustomTransportStrategy](interfaces/CustomTransportStrategy.md) | Interface that custom transport strategies must implement. Pass an object conforming to this interface to connectMicroservice to use a transport not provided by this package. |
| [EventPatternMetadata](interfaces/EventPatternMetadata.md) | Shape of metadata stored by the [EventPattern](functions/EventPattern.md) decorator. |
| [IncomingEvent](interfaces/IncomingEvent.md) | An incoming event packet (fire-and-forget pattern). |
| [IncomingRequest](interfaces/IncomingRequest.md) | An incoming request packet (request-response pattern). |
| [MessagePatternMetadata](interfaces/MessagePatternMetadata.md) | Shape of metadata stored by the [MessagePattern](functions/MessagePattern.md) decorator. |
| [MicroserviceConfiguration](interfaces/MicroserviceConfiguration.md) | Base configuration shared by all built-in transport strategies. |
| [MicroserviceContext](interfaces/MicroserviceContext.md) | Contextual information injected via the [MessageCtx](functions/MessageCtx.md) decorator. |
| [MicroserviceExceptionContext](interfaces/MicroserviceExceptionContext.md) | Contextual information passed to exception filters when an error occurs inside a microservice message or event handler. |
| [MicroserviceServerInfo](interfaces/MicroserviceServerInfo.md) | Metadata stored per connected microservice. |
| [OutgoingRequest](interfaces/OutgoingRequest.md) | An outgoing request packet sent by a [ClientProxy](classes/ClientProxy.md). |
| [OutgoingResponse](interfaces/OutgoingResponse.md) | An outgoing response packet (request-response pattern). |
| [PatternHandler](interfaces/PatternHandler.md) | Metadata describing a registered pattern handler. |
| [RabbitMQOptions](interfaces/RabbitMQOptions.md) | Connection options for the RabbitMQ (amqplib) transport. |
| [RedisOptions](interfaces/RedisOptions.md) | Connection options for the Redis (ioredis) transport. |
| [Server](interfaces/Server.md) | Contract that every built-in transport server must satisfy. Custom transports only need to implement [CustomTransportStrategy](interfaces/CustomTransportStrategy.md). |
| [ServerFactoryInterface](interfaces/ServerFactoryInterface.md) | Factory interface for creating transport servers. |
| [TcpOptions](interfaces/TcpOptions.md) | Connection options for the TCP transport. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [MessageHandler](type-aliases/MessageHandler.md) | Function signature for pattern handlers registered on a [Server](interfaces/Server.md). |
| [MicroserviceModuleMetadata](type-aliases/MicroserviceModuleMetadata.md) | Subset of module options relevant to microservice modules. |
| [MicroserviceOptions](type-aliases/MicroserviceOptions.md) | Union type accepted by connectMicroservice. |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [Transport](enumerations/Transport.md) | Available transport strategies for microservice connections. |

## Variables

| Variable | Description |
| ------ | ------ |
| [CATCH\_EXCEPTIONS\_METADATA](variables/CATCH_EXCEPTIONS_METADATA.md) | Metadata key for the [Catch](functions/Catch.md) decorator. Must match the key used in `src/exceptions/catch.decorator.ts`. |
| [CLIENT\_PROXY\_METADATA](variables/CLIENT_PROXY_METADATA.md) | Metadata key for the [Client](functions/Client.md) property decorator. |
| [EVENT\_PATTERN\_METADATA](variables/EVENT_PATTERN_METADATA.md) | Metadata key for the [EventPattern](functions/EventPattern.md) decorator. |
| [MESSAGE\_DATA\_METADATA](variables/MESSAGE_DATA_METADATA.md) | Metadata key for the [Payload](functions/Payload.md) parameter decorator. |
| [MESSAGE\_PATTERN\_CTX\_METADATA](variables/MESSAGE_PATTERN_CTX_METADATA.md) | Metadata key for the [MessageCtx](functions/MessageCtx.md) parameter decorator. |
| [MESSAGE\_PATTERN\_METADATA](variables/MESSAGE_PATTERN_METADATA.md) | Metadata key for the [MessagePattern](functions/MessagePattern.md) decorator. |
| [MICROSERVICE\_METADATA](variables/MICROSERVICE_METADATA.md) | Metadata key used to register a class as a microservice module. |

## References

### ExceptionContext

Re-exports [ExceptionContext](../../index/interfaces/ExceptionContext.md)

***

### ExceptionFilter

Re-exports [ExceptionFilter](../../index/interfaces/ExceptionFilter.md)
