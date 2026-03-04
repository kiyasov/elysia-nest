# packages/rabbitmq/src

## Classes

| Class | Description |
| ------ | ------ |
| [AmqpConnection](classes/AmqpConnection.md) | RabbitMQ connection class for publishing and consuming messages This is the main class for RabbitMQ operations |
| [Nack](classes/Nack.md) | Nack (Negative Acknowledgment) class for RabbitMQ message handling Used in |
| [RabbitMQModule](classes/RabbitMQModule.md) | RabbitMQ module for @@kiyasov/elysia-nest Provides RabbitMQ integration with decorators for messaging |

## Functions

| Function | Description |
| ------ | ------ |
| [InjectRabbitMQ](functions/InjectRabbitMQ.md) | Inject RabbitMQ connection |
| [InjectRabbitMQChannel](functions/InjectRabbitMQChannel.md) | Inject RabbitMQ channel |
| [InjectRabbitMQConnection](functions/InjectRabbitMQConnection.md) | Inject RabbitMQ connection name Useful when multiple connections are configured |
| [isRabbitContext](functions/isRabbitContext.md) | Check if the current execution context is a RabbitMQ context Useful for guards and interceptors that need to handle RabbitMQ differently |
| [RabbitBatch](functions/RabbitBatch.md) | Decorator to mark a method for batch processing |
| [RabbitConnection](functions/RabbitConnection.md) | Decorator for connection-aware handlers Useful when using multiple RabbitMQ connections |
| [RabbitDLQ](functions/RabbitDLQ.md) | Decorator to configure dead letter queue behavior |
| [RabbitErrorHandler](functions/RabbitErrorHandler.md) | Decorator for consumer error handlers |
| [RabbitHandler](functions/RabbitHandler.md) | Decorator to mark a class as a RabbitMQ handler Scans the class for |
| [RabbitInterceptor](functions/RabbitInterceptor.md) | Decorator for message interceptors/transformers |
| [RabbitPayload](functions/RabbitPayload.md) | Parameter decorator to extract the message payload In @@kiyasov/elysia-nest/rabbitmq this extracts the actual message content |
| [RabbitPriority](functions/RabbitPriority.md) | Decorator to configure message priority |
| [RabbitQueueArguments](functions/RabbitQueueArguments.md) | Decorator to configure queue arguments |
| [RabbitRetry](functions/RabbitRetry.md) | Decorator to configure retry behavior for a specific handler |
| [RabbitRPC](functions/RabbitRPC.md) | Decorator for RabbitMQ RPC handlers |
| [RabbitSubscribe](functions/RabbitSubscribe.md) | Decorator to subscribe to RabbitMQ messages |
| [RabbitTTL](functions/RabbitTTL.md) | Decorator to set message TTL |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ConnectionInitOptions](interfaces/ConnectionInitOptions.md) | Connection initialization options |
| [RabbitMQChannelConfig](interfaces/RabbitMQChannelConfig.md) | Channel configuration |
| [RabbitMQConfig](interfaces/RabbitMQConfig.md) | RabbitMQ connection configuration |
| [RabbitMQConnectionConfig](interfaces/RabbitMQConnectionConfig.md) | RabbitMQ connection configuration (single URL) |
| [RabbitMQExchangeConfig](interfaces/RabbitMQExchangeConfig.md) | Exchange configuration |
| [RabbitMQMessage](interfaces/RabbitMQMessage.md) | Message wrapper interface |
| [RabbitMQModuleOptions](interfaces/RabbitMQModuleOptions.md) | RabbitMQ connection configuration |
| [RabbitMQPublishOptions](interfaces/RabbitMQPublishOptions.md) | Publisher options |
| [RabbitMQQueueBinding](interfaces/RabbitMQQueueBinding.md) | Queue binding configuration |
| [RabbitMQQueueConfig](interfaces/RabbitMQQueueConfig.md) | Queue configuration |
| [RabbitRPCOptions](interfaces/RabbitRPCOptions.md) | RPC handler options for |
| [RabbitSubscribeOptions](interfaces/RabbitSubscribeOptions.md) | Message handler options for |
| [RequestOptions](interfaces/RequestOptions.md) | RPC Request options for AmqpConnection.request() |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [MessageHandlerErrorBehavior](type-aliases/MessageHandlerErrorBehavior.md) | Error behavior for message handlers |
| [RabbitMQDeserializer](type-aliases/RabbitMQDeserializer.md) | Deserializer function type for custom message deserialization |
| [RabbitMQExchangeType](type-aliases/RabbitMQExchangeType.md) | RabbitMQ exchange types |
| [RabbitMQSerializer](type-aliases/RabbitMQSerializer.md) | Serializer function type for custom message serialization |

## Variables

| Variable | Description |
| ------ | ------ |
| [RABBIT\_CONTEXT\_TYPE\_KEY](variables/RABBIT_CONTEXT_TYPE_KEY.md) | Context type key for RabbitMQ execution contexts Used for interceptors, guards, and filters |
| [RABBIT\_PAYLOAD\_METADATA](variables/RABBIT_PAYLOAD_METADATA.md) | - |
| [RABBIT\_RPC\_METADATA](variables/RABBIT_RPC_METADATA.md) | - |
| [RABBIT\_SUBSCRIBE\_METADATA](variables/RABBIT_SUBSCRIBE_METADATA.md) | - |
| [RABBITMQ\_CONFIG](variables/RABBITMQ_CONFIG.md) | - |
| [RABBITMQ\_CONNECTION](variables/RABBITMQ_CONNECTION.md) | - |
| [~~RabbitMQService~~](variables/RabbitMQService.md) | Alias for AmqpConnection for backward compatibility |
