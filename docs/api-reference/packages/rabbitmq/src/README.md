# packages/rabbitmq/src

## Classes

| Class | Description |
| ------ | ------ |
| [AmqpConnection](classes/AmqpConnection.md) | - |
| [AmqpConnectionManager](classes/AmqpConnectionManager.md) | - |
| [ChannelNotAvailableError](classes/ChannelNotAvailableError.md) | - |
| [ConnectionNotAvailableError](classes/ConnectionNotAvailableError.md) | - |
| [Nack](classes/Nack.md) | - |
| [NullMessageError](classes/NullMessageError.md) | - |
| [RabbitMQExplorer](classes/RabbitMQExplorer.md) | - |
| [RabbitMQModule](classes/RabbitMQModule.md) | - |
| [RpcTimeoutError](classes/RpcTimeoutError.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [getHandlerForLegacyBehavior](functions/getHandlerForLegacyBehavior.md) | - |
| [InjectRabbitMQ](functions/InjectRabbitMQ.md) | - |
| [InjectRabbitMQChannel](functions/InjectRabbitMQChannel.md) | - |
| [InjectRabbitMQConnection](functions/InjectRabbitMQConnection.md) | - |
| [isRabbitContext](functions/isRabbitContext.md) | - |
| [matchesRoutingKey](functions/matchesRoutingKey.md) | - |
| [RabbitHandler](functions/RabbitHandler.md) | - |
| [RabbitHeader](functions/RabbitHeader.md) | - |
| [RabbitPayload](functions/RabbitPayload.md) | - |
| [RabbitRequest](functions/RabbitRequest.md) | - |
| [RabbitRPC](functions/RabbitRPC.md) | - |
| [RabbitSubscribe](functions/RabbitSubscribe.md) | - |
| [resolveHandlerConfigs](functions/resolveHandlerConfigs.md) | Resolves the list of per-registration handler configs for a given handler. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BatchOptions](interfaces/BatchOptions.md) | - |
| [ConnectionInitOptions](interfaces/ConnectionInitOptions.md) | - |
| [CorrelationMessage](interfaces/CorrelationMessage.md) | - |
| [MessageHandlerOptions](interfaces/MessageHandlerOptions.md) | - |
| [MessageOptions](interfaces/MessageOptions.md) | - |
| [QueueOptions](interfaces/QueueOptions.md) | - |
| [RabbitHandlerConfig](interfaces/RabbitHandlerConfig.md) | - |
| [RabbitMQChannelConfig](interfaces/RabbitMQChannelConfig.md) | - |
| [RabbitMQConfig](interfaces/RabbitMQConfig.md) | - |
| [RabbitMQExchangeBindingConfig](interfaces/RabbitMQExchangeBindingConfig.md) | - |
| [RabbitMQExchangeConfig](interfaces/RabbitMQExchangeConfig.md) | - |
| [RabbitMQModuleOptions](interfaces/RabbitMQModuleOptions.md) | - |
| [RabbitMQQueueConfig](interfaces/RabbitMQQueueConfig.md) | - |
| [RabbitSubscribeBinding](interfaces/RabbitSubscribeBinding.md) | - |
| [RequestOptions](interfaces/RequestOptions.md) | - |
| [SubscriptionResult](interfaces/SubscriptionResult.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AssertQueueErrorHandler](type-aliases/AssertQueueErrorHandler.md) | - |
| [BaseConsumerHandler](type-aliases/BaseConsumerHandler.md) | - |
| [BatchMessageErrorHandler](type-aliases/BatchMessageErrorHandler.md) | - |
| [BatchSubscriberHandler](type-aliases/BatchSubscriberHandler.md) | - |
| [ConsumeOptions](type-aliases/ConsumeOptions.md) | - |
| [ConsumerHandler](type-aliases/ConsumerHandler.md) | - |
| [ConsumerTag](type-aliases/ConsumerTag.md) | - |
| [LegacyMessageErrorHandler](type-aliases/LegacyMessageErrorHandler.md) | - |
| [MessageDeserializer](type-aliases/MessageDeserializer.md) | - |
| [MessageErrorHandler](type-aliases/MessageErrorHandler.md) | - |
| [MessageSerializer](type-aliases/MessageSerializer.md) | - |
| [RabbitHandlerType](type-aliases/RabbitHandlerType.md) | - |
| [RabbitMQChannels](type-aliases/RabbitMQChannels.md) | - |
| [RabbitMQHandlers](type-aliases/RabbitMQHandlers.md) | - |
| [RabbitMQUriConfig](type-aliases/RabbitMQUriConfig.md) | - |
| [RpcResponse](type-aliases/RpcResponse.md) | - |
| [RpcSubscriberHandler](type-aliases/RpcSubscriberHandler.md) | - |
| [SubscribeResponse](type-aliases/SubscribeResponse.md) | - |
| [SubscriberHandler](type-aliases/SubscriberHandler.md) | - |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [MessageHandlerErrorBehavior](enumerations/MessageHandlerErrorBehavior.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [ackErrorHandler](variables/ackErrorHandler.md) | - |
| [defaultAssertQueueErrorHandler](variables/defaultAssertQueueErrorHandler.md) | - |
| [defaultNackErrorHandler](variables/defaultNackErrorHandler.md) | - |
| [forceDeleteAssertQueueErrorHandler](variables/forceDeleteAssertQueueErrorHandler.md) | - |
| [PRECONDITION\_FAILED\_CODE](variables/PRECONDITION_FAILED_CODE.md) | - |
| [RABBIT\_CONFIG\_TOKEN](variables/RABBIT_CONFIG_TOKEN.md) | - |
| [RABBIT\_CONTEXT\_TYPE\_KEY](variables/RABBIT_CONTEXT_TYPE_KEY.md) | - |
| [RABBIT\_HANDLER](variables/RABBIT_HANDLER.md) | - |
| [RABBIT\_HEADER\_METADATA](variables/RABBIT_HEADER_METADATA.md) | - |
| [RABBIT\_PAYLOAD\_METADATA](variables/RABBIT_PAYLOAD_METADATA.md) | - |
| [RABBIT\_REQUEST\_METADATA](variables/RABBIT_REQUEST_METADATA.md) | - |
| [requeueErrorHandler](variables/requeueErrorHandler.md) | - |
