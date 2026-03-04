import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  title: "@kiyasov/elysia-nest",
  description: "A modular, decorator-driven framework built on top of Elysia and Bun",
  base: "/elysia-nest/",
  ignoreDeadLinks: true,

  head: [
    ["link", { rel: "icon", href: "/elysia-nest/favicon.svg" }],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  ],

  themeConfig: {
    logo: {
      light: "/logo/light.svg",
      dark: "/logo/dark.svg",
    },

    // SVG logo already contains "elysia-nest" text — hide the duplicate title
    siteTitle: false,

    nav: [
      { text: "Documentation", link: "/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      {
        text: "GitHub",
        link: "https://github.com/kiyasov/elysia-nest",
      },
    ],

    sidebar: {
      "/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/introduction" },
            { text: "Installation", link: "/getting-started/installation" },
            { text: "Quick Start", link: "/getting-started/quick-start" },
          ],
        },
        {
          text: "Core Concepts",
          items: [
            { text: "Modules", link: "/core-concepts/modules" },
            { text: "Controllers", link: "/core-concepts/controllers" },
            { text: "Bootstrap", link: "/core-concepts/bootstrap" },
          ],
        },
        {
          text: "Features",
          items: [
            {
              text: "HTTP Decorators",
              link: "/features/http-decorators",
            },
            {
              text: "Parameter Decorators",
              link: "/features/parameter-decorators",
            },
            {
              text: "Dependency Injection",
              link: "/features/dependency-injection",
            },
            {
              text: "Lifecycle Hooks",
              link: "/features/lifecycle-hooks",
            },
            { text: "Middleware", link: "/features/middleware" },
            {
              text: "Exception Handling",
              link: "/features/exception-handling",
            },
            { text: "Guards", link: "/features/guards" },
            { text: "Interceptors", link: "/features/interceptors" },
            { text: "Pipes", link: "/features/pipes" },
          ],
        },
        {
          text: "Packages",
          items: [
            { text: "Overview", link: "/packages/overview" },
            { text: "Scheduler", link: "/packages/scheduler" },
            { text: "Microservices", link: "/packages/microservices" },
            { text: "Apollo / GraphQL", link: "/packages/apollo" },
            { text: "Passport", link: "/packages/passport" },
            { text: "Testing", link: "/packages/testing" },
            { text: "Cache", link: "/packages/cache" },
            { text: "RabbitMQ", link: "/packages/rabbitmq" },
            { text: "GraphQL PubSub", link: "/packages/graphql-pubsub" },
          ],
        },
        {
          text: "Advanced",
          items: [
            {
              text: "Custom Providers",
              link: "/advanced/custom-providers",
            },
            { text: "Forward References", link: "/advanced/forward-ref" },
            { text: "Container API", link: "/advanced/container-api" },
            { text: "Swagger", link: "/advanced/swagger" },
          ],
        },
      ],

      "/api-reference/": [
        {
          text: "Overview",
          items: [{ text: "Index", link: "/api-reference/index/README" }],
        },
        {
          text: "Decorators",
          items: [
            {
              text: "Module",
              link: "/api-reference/index/functions/Module",
            },
            {
              text: "Controller",
              link: "/api-reference/index/functions/Controller",
            },
            {
              text: "Global",
              link: "/api-reference/index/functions/Global",
            },
            {
              text: "Injectable",
              link: "/api-reference/index/functions/Injectable",
            },
            {
              text: "Inject",
              link: "/api-reference/index/functions/Inject",
            },
            {
              text: "Optional",
              link: "/api-reference/index/functions/Optional",
            },
            {
              text: "Catch",
              link: "/api-reference/index/functions/Catch",
            },
            {
              text: "Header",
              link: "/api-reference/index/functions/Header",
            },
            {
              text: "HttpCode",
              link: "/api-reference/index/functions/HttpCode",
            },
            {
              text: "Middleware",
              link: "/api-reference/index/functions/Middleware",
            },
            {
              text: "Schema",
              link: "/api-reference/index/functions/Schema",
            },
            {
              text: "SetMetadata",
              link: "/api-reference/index/functions/SetMetadata",
            },
            {
              text: "UseGuards",
              link: "/api-reference/index/functions/UseGuards",
            },
            {
              text: "UseInterceptors",
              link: "/api-reference/index/functions/UseInterceptors",
            },
            {
              text: "applyDecorators",
              link: "/api-reference/index/functions/applyDecorators",
            },
            {
              text: "createParamDecorator",
              link: "/api-reference/index/functions/createParamDecorator",
            },
          ],
        },
        {
          text: "HTTP Methods",
          items: [
            { text: "Get", link: "/api-reference/index/variables/Get" },
            { text: "Post", link: "/api-reference/index/variables/Post" },
            { text: "Put", link: "/api-reference/index/variables/Put" },
            {
              text: "Patch",
              link: "/api-reference/index/variables/Patch",
            },
            {
              text: "Delete",
              link: "/api-reference/index/variables/Delete",
            },
            { text: "All", link: "/api-reference/index/variables/All" },
            { text: "Head", link: "/api-reference/index/variables/Head" },
            {
              text: "Options",
              link: "/api-reference/index/variables/Options",
            },
          ],
        },
        {
          text: "Parameter Decorators",
          items: [
            { text: "Body", link: "/api-reference/index/variables/Body" },
            {
              text: "Param",
              link: "/api-reference/index/variables/Param",
            },
            {
              text: "Query",
              link: "/api-reference/index/variables/Query",
            },
            {
              text: "Headers",
              link: "/api-reference/index/variables/Headers",
            },
            { text: "Req", link: "/api-reference/index/variables/Req" },
            {
              text: "Request",
              link: "/api-reference/index/variables/Request",
            },
            { text: "Res", link: "/api-reference/index/variables/Res" },
            {
              text: "Response",
              link: "/api-reference/index/variables/Response",
            },
            { text: "Ip", link: "/api-reference/index/variables/Ip" },
            { text: "Ctx", link: "/api-reference/index/variables/Ctx" },
            {
              text: "Session",
              link: "/api-reference/index/variables/Session",
            },
          ],
        },
        {
          text: "Exceptions",
          items: [
            {
              text: "HttpException",
              link: "/api-reference/index/classes/HttpException",
            },
            {
              text: "BadRequestException",
              link: "/api-reference/index/classes/BadRequestException",
            },
            {
              text: "ForbiddenException",
              link: "/api-reference/index/classes/ForbiddenException",
            },
            {
              text: "NotFoundException",
              link: "/api-reference/index/classes/NotFoundException",
            },
            {
              text: "UnauthorizedException",
              link: "/api-reference/index/classes/UnauthorizedException",
            },
          ],
        },
        {
          text: "Classes",
          items: [
            {
              text: "Logger",
              link: "/api-reference/index/classes/Logger",
            },
            {
              text: "ConsoleLogger",
              link: "/api-reference/index/classes/ConsoleLogger",
            },
            {
              text: "ModuleRef",
              link: "/api-reference/index/classes/ModuleRef",
            },
            {
              text: "Reflector",
              link: "/api-reference/index/classes/Reflector",
            },
            {
              text: "Container",
              link: "/api-reference/index/classes/Container",
            },
            {
              text: "HttpAdapterHost",
              link: "/api-reference/index/classes/HttpAdapterHost",
            },
            {
              text: "StreamableFile",
              link: "/api-reference/index/classes/StreamableFile",
            },
            {
              text: "ConfigurableModuleBuilder",
              link: "/api-reference/index/classes/ConfigurableModuleBuilder",
            },
          ],
        },
        {
          text: "Interfaces",
          items: [
            {
              text: "CanActivate",
              link: "/api-reference/index/interfaces/CanActivate",
            },
            {
              text: "ExceptionFilter",
              link: "/api-reference/index/interfaces/ExceptionFilter",
            },
            {
              text: "PipeTransform",
              link: "/api-reference/index/interfaces/PipeTransform",
            },
            {
              text: "NestInterceptor",
              link: "/api-reference/index/interfaces/NestInterceptor",
            },
            {
              text: "CallHandler",
              link: "/api-reference/index/interfaces/CallHandler",
            },
            {
              text: "ExecutionContext",
              link: "/api-reference/index/interfaces/ExecutionContext",
            },
            {
              text: "ElysiaNestMiddleware",
              link: "/api-reference/index/interfaces/ElysiaNestMiddleware",
            },
            {
              text: "ModuleMetadata",
              link: "/api-reference/index/interfaces/ModuleMetadata",
            },
            {
              text: "DynamicModule",
              link: "/api-reference/index/interfaces/DynamicModule",
            },
            {
              text: "OnModuleInit",
              link: "/api-reference/index/interfaces/OnModuleInit",
            },
            {
              text: "OnApplicationBootstrap",
              link: "/api-reference/index/interfaces/OnApplicationBootstrap",
            },
            {
              text: "OnModuleDestroy",
              link: "/api-reference/index/interfaces/OnModuleDestroy",
            },
            {
              text: "BeforeApplicationShutdown",
              link: "/api-reference/index/interfaces/BeforeApplicationShutdown",
            },
          ],
        },
        {
          text: "Enumerations",
          items: [
            {
              text: "HttpStatus",
              link: "/api-reference/index/enumerations/HttpStatus",
            },
            {
              text: "Scope",
              link: "/api-reference/index/enumerations/Scope",
            },
          ],
        },
        {
          text: "Application",
          items: [
            {
              text: "createElysiaApplication",
              link: "/api-reference/index/functions/createElysiaApplication",
            },
            {
              text: "createElysiaPlugin",
              link: "/api-reference/index/functions/createElysiaPlugin",
            },
            {
              text: "addGlobalExceptionFilter",
              link: "/api-reference/index/functions/addGlobalExceptionFilter",
            },
            {
              text: "forwardRef",
              link: "/api-reference/index/functions/forwardRef",
            },
          ],
        },
        {
          text: "Scheduler",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/scheduler/src/README",
            },
            {
              text: "ScheduleModule",
              link: "/api-reference/packages/scheduler/src/classes/ScheduleModule",
            },
            {
              text: "SchedulerRegistry",
              link: "/api-reference/packages/scheduler/src/classes/SchedulerRegistry",
            },
            {
              text: "CronExpressions",
              link: "/api-reference/packages/scheduler/src/classes/CronExpressions",
            },
            {
              text: "@Cron",
              link: "/api-reference/packages/scheduler/src/functions/Cron",
            },
            {
              text: "@Interval",
              link: "/api-reference/packages/scheduler/src/functions/Interval",
            },
            {
              text: "@Timeout",
              link: "/api-reference/packages/scheduler/src/functions/Timeout",
            },
            {
              text: "@ScheduleAt",
              link: "/api-reference/packages/scheduler/src/functions/ScheduleAt",
            },
          ],
        },
        {
          text: "Microservices",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/microservices/README",
            },
            {
              text: "ElysiaNestApplication",
              link: "/api-reference/packages/microservices/classes/ElysiaNestApplication",
            },
            {
              text: "ClientProxy",
              link: "/api-reference/packages/microservices/classes/ClientProxy",
            },
            {
              text: "BaseServer",
              link: "/api-reference/packages/microservices/classes/BaseServer",
            },
            {
              text: "TcpClient",
              link: "/api-reference/packages/microservices/classes/TcpClient",
            },
            {
              text: "TcpServer",
              link: "/api-reference/packages/microservices/classes/TcpServer",
            },
            {
              text: "RedisClient",
              link: "/api-reference/packages/microservices/classes/RedisClient",
            },
            {
              text: "RedisServer",
              link: "/api-reference/packages/microservices/classes/RedisServer",
            },
            {
              text: "Transport",
              link: "/api-reference/packages/microservices/enumerations/Transport",
            },
          ],
        },
        {
          text: "Apollo / GraphQL",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/apollo/src/README",
            },
            {
              text: "GraphQLModule",
              link: "/api-reference/packages/apollo/src/classes/GraphQLModule",
            },
            {
              text: "@Resolver",
              link: "/api-reference/packages/apollo/src/functions/Resolver",
            },
            {
              text: "@Query",
              link: "/api-reference/packages/apollo/src/functions/Query",
            },
            {
              text: "@Mutation",
              link: "/api-reference/packages/apollo/src/functions/Mutation",
            },
            {
              text: "@Subscription",
              link: "/api-reference/packages/apollo/src/functions/Subscription",
            },
            {
              text: "@ObjectType",
              link: "/api-reference/packages/apollo/src/functions/ObjectType",
            },
            {
              text: "@Field",
              link: "/api-reference/packages/apollo/src/functions/Field",
            },
            {
              text: "@Args",
              link: "/api-reference/packages/apollo/src/functions/Args",
            },
          ],
        },
        {
          text: "Passport",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/passport/src/README",
            },
            {
              text: "AuthGuard",
              link: "/api-reference/packages/passport/src/functions/AuthGuard",
            },
            {
              text: "PassportStrategy",
              link: "/api-reference/packages/passport/src/functions/PassportStrategy",
            },
          ],
        },
        {
          text: "Cache",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/cache/src/README",
            },
            {
              text: "CacheModule",
              link: "/api-reference/packages/cache/src/classes/CacheModule",
            },
            {
              text: "Cache",
              link: "/api-reference/packages/cache/src/classes/Cache",
            },
            {
              text: "CacheInterceptor",
              link: "/api-reference/packages/cache/src/classes/CacheInterceptor",
            },
            {
              text: "@CacheKey",
              link: "/api-reference/packages/cache/src/functions/CacheKey",
            },
            {
              text: "@CacheTTL",
              link: "/api-reference/packages/cache/src/functions/CacheTTL",
            },
          ],
        },
        {
          text: "RabbitMQ",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/rabbitmq/src/README",
            },
            {
              text: "RabbitMQModule",
              link: "/api-reference/packages/rabbitmq/src/classes/RabbitMQModule",
            },
            {
              text: "AmqpConnection",
              link: "/api-reference/packages/rabbitmq/src/classes/AmqpConnection",
            },
            {
              text: "@RabbitSubscribe",
              link: "/api-reference/packages/rabbitmq/src/functions/RabbitSubscribe",
            },
            {
              text: "@RabbitRPC",
              link: "/api-reference/packages/rabbitmq/src/functions/RabbitRPC",
            },
          ],
        },
        {
          text: "GraphQL PubSub",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/graphql-pubsub/src/README",
            },
            {
              text: "GraphQLPubSubModule",
              link: "/api-reference/packages/graphql-pubsub/src/classes/GraphQLPubSubModule",
            },
            {
              text: "RedisPubSub",
              link: "/api-reference/packages/graphql-pubsub/src/classes/RedisPubSub",
            },
          ],
        },
        {
          text: "Testing",
          items: [
            {
              text: "README",
              link: "/api-reference/packages/testing/src/README",
            },
            {
              text: "Test",
              link: "/api-reference/packages/testing/src/classes/Test",
            },
            {
              text: "TestingModule",
              link: "/api-reference/packages/testing/src/classes/TestingModule",
            },
            {
              text: "TestingModuleBuilder",
              link: "/api-reference/packages/testing/src/classes/TestingModuleBuilder",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/kiyasov/elysia-nest" }],

    footer: {
      message: "Released under the MIT License.",
    },

    editLink: {
      pattern: "https://github.com/kiyasov/elysia-nest/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    search: {
      provider: "local",
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(
            new URL("./theme/navbar-search.vue", import.meta.url)
          ),
        },
      ],
    },
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
});
