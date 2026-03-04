# index

## Classes

| Class | Description |
| ------ | ------ |
| [BadRequestException](classes/BadRequestException.md) | Exception for 400 Bad Request errors |
| [ConfigurableModuleBuilder](classes/ConfigurableModuleBuilder.md) | Factory that lets you create configurable modules and provides a way to reduce the majority of dynamic module boilerplate. |
| [ConsoleLogger](classes/ConsoleLogger.md) | - |
| [Container](classes/Container.md) | - |
| [FileValidationError](classes/FileValidationError.md) | - |
| [ForbiddenException](classes/ForbiddenException.md) | Exception for 403 Forbidden errors |
| [HttpAdapterHost](classes/HttpAdapterHost.md) | Host class for accessing the HTTP adapter. Used to abstract the underlying HTTP server. |
| [HttpException](classes/HttpException.md) | Base class for HTTP exceptions |
| [Injector](classes/Injector.md) | - |
| [InstanceWrapper](classes/InstanceWrapper.md) | - |
| [InternalServerErrorException](classes/InternalServerErrorException.md) | Exception for 500 Internal Server Error errors |
| [LifecycleManager](classes/LifecycleManager.md) | Class to manage lifecycle hooks across the application |
| [Logger](classes/Logger.md) | - |
| [ModuleRef](classes/ModuleRef.md) | ModuleRef provides a way to access providers within a module. It is automatically injected by the framework and allows retrieving providers dynamically at runtime. |
| [NotFoundException](classes/NotFoundException.md) | Exception for 404 Not Found errors |
| [Reflector](classes/Reflector.md) | Helper class for retrieving metadata from classes and methods using reflect-metadata. |
| [StreamableFile](classes/StreamableFile.md) | Streamable file class for handling file streams |
| [UnauthorizedException](classes/UnauthorizedException.md) | Exception for 401 Unauthorized errors |

## Functions

| Function | Description |
| ------ | ------ |
| [addGlobalExceptionFilter](functions/addGlobalExceptionFilter.md) | - |
| [applyDecorators](functions/applyDecorators.md) | Applies multiple decorators to a target (class, method, or property). Useful for composing multiple decorators into a single one. |
| [Catch](functions/Catch.md) | Decorator that marks a class as an exception filter. The decorated class must implement the `ExceptionFilter` interface. |
| [Controller](functions/Controller.md) | Controller decorator that defines a controller with a route prefix. |
| [createElysiaApplication](functions/createElysiaApplication.md) | Creates an Elysia-Nest application with microservices support. |
| [createElysiaPlugin](functions/createElysiaPlugin.md) | Helper function to create the Elysia plugin from module metadata. |
| [createLoggerOptionsProvider](functions/createLoggerOptionsProvider.md) | Factory to create logger options provider with custom options |
| [createParamDecorator](functions/createParamDecorator.md) | - |
| [forwardRef](functions/forwardRef.md) | - |
| [getCatchExceptionsMetadata](functions/getCatchExceptionsMetadata.md) | Get the exception types that a filter catches |
| [getElysiaHooksMetadata](functions/getElysiaHooksMetadata.md) | Get all Elysia lifecycle hooks metadata for a controller |
| [getEventEmitter](functions/getEventEmitter.md) | - |
| [getLifecycleManager](functions/getLifecycleManager.md) | Get the global lifecycle manager instance |
| [Global](functions/Global.md) | Marks a module as global, meaning its providers can be accessed from any other module without explicitly importing it. |
| [Header](functions/Header.md) | Decorator that sets HTTP headers for the response. |
| [Headers](functions/Headers.md) | - |
| [HttpCode](functions/HttpCode.md) | Decorator that sets the HTTP status code for the response. |
| [Inject](functions/Inject.md) | - |
| [Injectable](functions/Injectable.md) | - |
| [isCatchFilter](functions/isCatchFilter.md) | Check if a class is marked as an exception filter |
| [isClassMiddleware](functions/isClassMiddleware.md) | - |
| [isClassProvider](functions/isClassProvider.md) | - |
| [isCustomProvider](functions/isCustomProvider.md) | - |
| [isExistingProvider](functions/isExistingProvider.md) | - |
| [isFactoryProvider](functions/isFactoryProvider.md) | - |
| [isForwardRef](functions/isForwardRef.md) | - |
| [isFunction](functions/isFunction.md) | Check if value is a function |
| [isLogLevelEnabled](functions/isLogLevelEnabled.md) | - |
| [isNil](functions/isNil.md) | Check if value is nil (null or undefined) |
| [isObject](functions/isObject.md) | Check if value is an object |
| [isString](functions/isString.md) | Check if value is a string |
| [isTypeProvider](functions/isTypeProvider.md) | - |
| [isUndefined](functions/isUndefined.md) | Check if value is undefined |
| [isValidationError](functions/isValidationError.md) | - |
| [isValueProvider](functions/isValueProvider.md) | - |
| [Middleware](functions/Middleware.md) | Marks a class as middleware. Implies `@Injectable()`. |
| [Module](functions/Module.md) | Module decorator that creates an Elysia plugin from the module configuration. |
| [Optional](functions/Optional.md) | - |
| [parseValidationError](functions/parseValidationError.md) | - |
| [processParameters](functions/processParameters.md) | Extract and validate parameters based on metadata |
| [Schema](functions/Schema.md) | - |
| [SetMetadata](functions/SetMetadata.md) | Decorator that assigns metadata to the class using the specified key. |
| [UseGuards](functions/UseGuards.md) | Decorator that binds guards to the scope of the controller or method, depending on its context. |
| [UseInterceptors](functions/UseInterceptors.md) | Decorator that binds interceptors to the scope of the controller or method, depending on its context. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BaseProvider](interfaces/BaseProvider.md) | - |
| [BeforeApplicationShutdown](interfaces/BeforeApplicationShutdown.md) | Interface for lifecycle hooks called before the application is closed This method is called after all OnModuleDestroy hooks have been called |
| [CallHandler](interfaces/CallHandler.md) | Call handler interface for interceptors |
| [CanActivate](interfaces/CanActivate.md) | Interface for guards |
| [ClassProvider](interfaces/ClassProvider.md) | - |
| [ConfigurableModuleAsyncOptions](interfaces/ConfigurableModuleAsyncOptions.md) | Interface that represents the module async options object Factory method name varies depending on the "FactoryClassMethodKey" type argument. |
| [ConfigurableModuleBuilderOptions](interfaces/ConfigurableModuleBuilderOptions.md) | - |
| [ConfigurableModuleHost](interfaces/ConfigurableModuleHost.md) | Configurable module host. See properties for more details |
| [ConsoleLoggerOptions](interfaces/ConsoleLoggerOptions.md) | - |
| [ContextId](interfaces/ContextId.md) | - |
| [ControllerMetadata](interfaces/ControllerMetadata.md) | Controller metadata type |
| [DynamicModule](interfaces/DynamicModule.md) | Dynamic module configuration |
| [ElysiaHookMetadata](interfaces/ElysiaHookMetadata.md) | Metadata for Elysia lifecycle hooks |
| [ElysiaNestMiddleware](interfaces/ElysiaNestMiddleware.md) | Interface for class-based middleware. Instances will be resolved from the DI container. |
| [EventEmitter](interfaces/EventEmitter.md) | - |
| [ExceptionContext](interfaces/ExceptionContext.md) | Context for exception filters |
| [ExceptionFilter](interfaces/ExceptionFilter.md) | Interface for exception filters |
| [ExceptionFilterMetadata](interfaces/ExceptionFilterMetadata.md) | - |
| [ExecutionContext](interfaces/ExecutionContext.md) | Execution context interface providing access to the request/response and handler information |
| [ExistingProvider](interfaces/ExistingProvider.md) | - |
| [FactoryProvider](interfaces/FactoryProvider.md) | - |
| [FileValidationOptions](interfaces/FileValidationOptions.md) | - |
| [ForwardReference](interfaces/ForwardReference.md) | - |
| [GetOptions](interfaces/GetOptions.md) | Options for ModuleRef.get() method |
| [HttpAdapter](interfaces/HttpAdapter.md) | Interface for HTTP adapter - abstracts HTTP server operations |
| [HttpArgumentsHost](interfaces/HttpArgumentsHost.md) | HTTP context interface for request/response access |
| [InjectableOptions](interfaces/InjectableOptions.md) | - |
| [InstancePerContext](interfaces/InstancePerContext.md) | - |
| [Interceptor](interfaces/Interceptor.md) | Interface for request interceptors |
| [InterceptorMetadata](interfaces/InterceptorMetadata.md) | - |
| [LoggerOptions](interfaces/LoggerOptions.md) | - |
| [LoggerService](interfaces/LoggerService.md) | - |
| [ModuleMetadata](interfaces/ModuleMetadata.md) | - |
| [ModuleOptions](interfaces/ModuleOptions.md) | - |
| [NestInterceptor](interfaces/NestInterceptor.md) | Elysia-Nest interceptor interface |
| [OnApplicationBootstrap](interfaces/OnApplicationBootstrap.md) | Interface for lifecycle hooks called when the application is bootstrapped This method is called after all modules have been initialized |
| [OnApplicationShutdown](interfaces/OnApplicationShutdown.md) | Interface for lifecycle hooks called when the application is shutting down This method is called when all connections are closed and the application is about to exit |
| [OnModuleDestroy](interfaces/OnModuleDestroy.md) | Interface for lifecycle hooks called before a module is destroyed This method is called when the application is shutting down |
| [OnModuleInit](interfaces/OnModuleInit.md) | Interface for lifecycle hooks called when a module is initialized This method is called once all the modules are instantiated but before the application is fully started |
| [ParamInfo](interfaces/ParamInfo.md) | - |
| [ParamMetadata](interfaces/ParamMetadata.md) | - |
| [PipeMetadata](interfaces/PipeMetadata.md) | Metadata for pipes |
| [PipeTransform](interfaces/PipeTransform.md) | Interface for pipes |
| [RequestContext](interfaces/RequestContext.md) | - |
| [ResponseInterceptor](interfaces/ResponseInterceptor.md) | Interface for response interceptors |
| [RouteMetadata](interfaces/RouteMetadata.md) | - |
| [RouteSchemaOptions](interfaces/RouteSchemaOptions.md) | - |
| [RpcArgumentsHost](interfaces/RpcArgumentsHost.md) | RPC context interface |
| [ScopeOptions](interfaces/ScopeOptions.md) | - |
| [Type](interfaces/Type.md) | - |
| [ValidationErrorDetails](interfaces/ValidationErrorDetails.md) | - |
| [ValueProvider](interfaces/ValueProvider.md) | - |
| [WsArgumentsHost](interfaces/WsArgumentsHost.md) | WebSocket context interface |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ConfigurableModuleCls](type-aliases/ConfigurableModuleCls.md) | Class that represents a blueprint/prototype for a configurable Nest module. This class provides static methods for constructing dynamic modules. Their names can be controlled through the "MethodKey" type argument. |
| [ConfigurableModuleOptionsFactory](type-aliases/ConfigurableModuleOptionsFactory.md) | Interface that must be implemented by the module options factory class. Method key varies depending on the "FactoryClassMethodKey" type argument. |
| [ElysiaHookName](type-aliases/ElysiaHookName.md) | Type for Elysia lifecycle hook names |
| [FunctionalMiddleware](type-aliases/FunctionalMiddleware.md) | Functional middleware type. Directly an Elysia handler or a similar function. |
| [~~GuardContext~~](type-aliases/GuardContext.md) | - |
| [InjectionToken](type-aliases/InjectionToken.md) | - |
| [LogLevel](type-aliases/LogLevel.md) | - |
| [MiddlewareType](type-aliases/MiddlewareType.md) | Represents either a class type that implements ElysiaNestMiddleware or a functional middleware. |
| [OptionalFactoryDependency](type-aliases/OptionalFactoryDependency.md) | - |
| [Provider](type-aliases/Provider.md) | - |
| [ProviderToken](type-aliases/ProviderToken.md) | - |
| [TypeProvider](type-aliases/TypeProvider.md) | - |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [HttpStatus](enumerations/HttpStatus.md) | Standard HTTP status codes. |
| [Scope](enumerations/Scope.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [All](variables/All.md) | - |
| [APP\_FILTER](variables/APP_FILTER.md) | Injection token for exception filters Use this token to provide a global exception filter |
| [APP\_FILTERS\_METADATA](variables/APP_FILTERS_METADATA.md) | - |
| [Body](variables/Body.md) | - |
| [CATCH\_EXCEPTIONS\_METADATA](variables/CATCH_EXCEPTIONS_METADATA.md) | Metadata key for storing caught exception types |
| [CATCH\_WATERMARK](variables/CATCH_WATERMARK.md) | Metadata key for marking a class as an exception filter |
| [Ctx](variables/Ctx.md) | - |
| [Delete](variables/Delete.md) | - |
| [DIContainer](variables/DIContainer.md) | - |
| [ELYSIA\_HOOKS\_METADATA](variables/ELYSIA_HOOKS_METADATA.md) | - |
| [ElysiaContext](variables/ElysiaContext.md) | - |
| [EVENT\_LISTENER\_METADATA](variables/EVENT_LISTENER_METADATA.md) | - |
| [EXCEPTION\_FILTER\_METADATA](variables/EXCEPTION_FILTER_METADATA.md) | - |
| [File](variables/File.md) | - |
| [Files](variables/Files.md) | - |
| [Form](variables/Form.md) | - |
| [Get](variables/Get.md) | - |
| [GLOBAL\_MODULE\_METADATA](variables/GLOBAL_MODULE_METADATA.md) | - |
| [GUARDS\_METADATA](variables/GUARDS_METADATA.md) | - |
| [Head](variables/Head.md) | - |
| [HEADERS\_METADATA](variables/HEADERS_METADATA.md) | - |
| [HTTP\_CODE\_METADATA](variables/HTTP_CODE_METADATA.md) | - |
| [INJECT\_METADATA](variables/INJECT_METADATA.md) | - |
| [INJECTABLE\_METADATA](variables/INJECTABLE_METADATA.md) | - |
| [INTERCEPTORS\_METADATA](variables/INTERCEPTORS_METADATA.md) | - |
| [Ip](variables/Ip.md) | - |
| [LOG\_LEVELS](variables/LOG_LEVELS.md) | - |
| [LOGGER\_OPTIONS](variables/LOGGER_OPTIONS.md) | - |
| [LoggerOptionsProvider](variables/LoggerOptionsProvider.md) | Default logger options provider |
| [MODULE\_METADATA](variables/MODULE_METADATA.md) | - |
| [OnAfterHandle](variables/OnAfterHandle.md) | Hook called after request handler |
| [OnAfterResponse](variables/OnAfterResponse.md) | Hook called after response is sent |
| [OnBeforeHandle](variables/OnBeforeHandle.md) | Hook called before request handler |
| [OnError](variables/OnError.md) | Hook called when error occurs |
| [OnMapResponse](variables/OnMapResponse.md) | Hook called to map response |
| [OnParse](variables/OnParse.md) | Hook called to parse request body |
| [OnRequest](variables/OnRequest.md) | Hook called when new request is received |
| [OnTransform](variables/OnTransform.md) | Hook called to transform parsed body |
| [OPTIONAL\_METADATA](variables/OPTIONAL_METADATA.md) | - |
| [Options](variables/Options.md) | - |
| [Param](variables/Param.md) | - |
| [PARAMS\_METADATA](variables/PARAMS_METADATA.md) | - |
| [Patch](variables/Patch.md) | - |
| [PIPES\_METADATA](variables/PIPES_METADATA.md) | - |
| [Post](variables/Post.md) | - |
| [Put](variables/Put.md) | - |
| [Query](variables/Query.md) | - |
| [Req](variables/Req.md) | - |
| [Request](variables/Request.md) | - |
| [Res](variables/Res.md) | - |
| [Response](variables/Response.md) | - |
| [RESPONSE\_INTERCEPTORS\_METADATA](variables/RESPONSE_INTERCEPTORS_METADATA.md) | - |
| [ROUTE\_METADATA](variables/ROUTE_METADATA.md) | - |
| [ROUTE\_PREFIX\_METADATA](variables/ROUTE_PREFIX_METADATA.md) | - |
| [ROUTE\_SCHEMA\_METADATA](variables/ROUTE_SCHEMA_METADATA.md) | - |
| [SCHEDULED\_JOB\_METADATA](variables/SCHEDULED_JOB_METADATA.md) | - |
| [Session](variables/Session.md) | - |
| [STATIC\_CONTEXT](variables/STATIC_CONTEXT.md) | - |
