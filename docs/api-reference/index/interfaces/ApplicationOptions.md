# Interface: ApplicationOptions

Defined in: [packages/core/src/core/application.factory.ts:23](https://github.com/nestelia/nestelia/blob/main/packages/core/src/core/application.factory.ts#L23)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="gen"></a> `gen?` | `boolean` \| `GenOptions` | Auto-run `nestelia-gen` before the application starts. Pass `true` to use defaults, or an object to configure output path / tsconfig. **Example** `const app = await createElysiaApplication(AppModule, { gen: true }); const app = await createElysiaApplication(AppModule, { gen: { output: "src/schema.ts" } });` | [packages/core/src/core/application.factory.ts:36](https://github.com/nestelia/nestelia/blob/main/packages/core/src/core/application.factory.ts#L36) |
| <a id="logger"></a> `logger?` | \| `false` \| [`LoggerService`](LoggerService.md) \| (`"error"` \| `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"fatal"`)[] | Override the default logger. Pass `false` to disable logging entirely, or an array of LogLevel to filter. | [packages/core/src/core/application.factory.ts:25](https://github.com/nestelia/nestelia/blob/main/packages/core/src/core/application.factory.ts#L25) |
