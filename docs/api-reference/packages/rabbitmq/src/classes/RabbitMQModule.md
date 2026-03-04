# Class: RabbitMQModule

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L35)

RabbitMQ module for @@kiyasov/elysia-nest
Provides RabbitMQ integration with decorators for messaging

## Example

```typescript
@Module({
  imports: [
    RabbitMQModule.forRoot({
      urls: ['amqp://localhost:5672'],
      queuePrefix: 'myapp',
    }),
  ],
})
export class AppModule {}
```

## Constructors

### Constructor

```ts
new RabbitMQModule(): RabbitMQModule;
```

#### Returns

`RabbitMQModule`

## Methods

### forFeature()

```ts
static forFeature(handlers): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:196](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L196)

Register a RabbitMQ feature module with specific handlers

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handlers` | `unknown`[] | Array of handler classes with @RabbitSubscribe/@RabbitRPC decorators |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

Dynamic module

***

### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:134](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L134)

Register RabbitMQ module with configuration

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) | RabbitMQ configuration options |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

Dynamic module

***

### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:162](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L162)

Register RabbitMQ module with async configuration

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `inject?`: ( \| [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md); \})[]; `isGlobal?`: `boolean`; `useFactory`: (...`args`) => \| [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) \| `Promise`\<[`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md)\>; \} |
| `options.inject?` | ( \| [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md); \})[] |
| `options.isGlobal?` | `boolean` |
| `options.useFactory` | (...`args`) => \| [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) \| `Promise`\<[`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md)\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

#### Example

```typescript
RabbitMQModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    urls: [configService.get('RABBITMQ_URL')],
    queuePrefix: configService.get('RABBITMQ_QUEUE_PREFIX'),
  }),
  inject: [ConfigService],
})
```
