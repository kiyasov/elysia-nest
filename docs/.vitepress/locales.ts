import { arSection, docSection } from "./sidebar-helpers";

// ── API reference sidebar (shared, language-agnostic) ─────────────────────────

export const apiSidebar = [
  arSection("Overview", [["Index", "index/README"]]),
  arSection("Decorators", [
    ["Module",               "index/functions/Module"],
    ["Controller",           "index/functions/Controller"],
    ["Global",               "index/functions/Global"],
    ["Injectable",           "index/functions/Injectable"],
    ["Inject",               "index/functions/Inject"],
    ["Optional",             "index/functions/Optional"],
    ["Catch",                "index/functions/Catch"],
    ["Header",               "index/functions/Header"],
    ["HttpCode",             "index/functions/HttpCode"],
    ["Middleware",           "index/functions/Middleware"],
    ["Schema",               "index/functions/Schema"],
    ["SetMetadata",          "index/functions/SetMetadata"],
    ["UseGuards",            "index/functions/UseGuards"],
    ["UseInterceptors",      "index/functions/UseInterceptors"],
    ["applyDecorators",      "index/functions/applyDecorators"],
    ["createParamDecorator", "index/functions/createParamDecorator"],
  ]),
  arSection("HTTP Methods", [
    ["Get",     "index/variables/Get"],
    ["Post",    "index/variables/Post"],
    ["Put",     "index/variables/Put"],
    ["Patch",   "index/variables/Patch"],
    ["Delete",  "index/variables/Delete"],
    ["All",     "index/variables/All"],
    ["Head",    "index/variables/Head"],
    ["Options", "index/variables/Options"],
  ]),
  arSection("Parameter Decorators", [
    ["Body",     "index/variables/Body"],
    ["Param",    "index/variables/Param"],
    ["Query",    "index/variables/Query"],
    ["Headers",  "index/variables/Headers"],
    ["Req",      "index/variables/Req"],
    ["Request",  "index/variables/Request"],
    ["Res",      "index/variables/Res"],
    ["Response", "index/variables/Response"],
    ["Ip",       "index/variables/Ip"],
    ["Ctx",      "index/variables/Ctx"],
    ["Session",  "index/variables/Session"],
  ]),
  arSection("Exceptions", [
    ["HttpException",         "index/classes/HttpException"],
    ["BadRequestException",   "index/classes/BadRequestException"],
    ["ForbiddenException",    "index/classes/ForbiddenException"],
    ["NotFoundException",     "index/classes/NotFoundException"],
    ["UnauthorizedException", "index/classes/UnauthorizedException"],
  ]),
  arSection("Classes", [
    ["Logger",                    "index/classes/Logger"],
    ["ConsoleLogger",             "index/classes/ConsoleLogger"],
    ["ModuleRef",                 "index/classes/ModuleRef"],
    ["Reflector",                 "index/classes/Reflector"],
    ["Container",                 "index/classes/Container"],
    ["HttpAdapterHost",           "index/classes/HttpAdapterHost"],
    ["StreamableFile",            "index/classes/StreamableFile"],
    ["ConfigurableModuleBuilder", "index/classes/ConfigurableModuleBuilder"],
  ]),
  arSection("Interfaces", [
    ["CanActivate",               "index/interfaces/CanActivate"],
    ["ExceptionFilter",           "index/interfaces/ExceptionFilter"],
    ["PipeTransform",             "index/interfaces/PipeTransform"],
    ["NestInterceptor",           "index/interfaces/NestInterceptor"],
    ["CallHandler",               "index/interfaces/CallHandler"],
    ["ExecutionContext",          "index/interfaces/ExecutionContext"],
    ["ElysiaNestMiddleware",      "index/interfaces/ElysiaNestMiddleware"],
    ["ModuleMetadata",            "index/interfaces/ModuleMetadata"],
    ["DynamicModule",             "index/interfaces/DynamicModule"],
    ["OnModuleInit",              "index/interfaces/OnModuleInit"],
    ["OnApplicationBootstrap",    "index/interfaces/OnApplicationBootstrap"],
    ["OnModuleDestroy",           "index/interfaces/OnModuleDestroy"],
    ["BeforeApplicationShutdown", "index/interfaces/BeforeApplicationShutdown"],
  ]),
  arSection("Enumerations", [
    ["HttpStatus", "index/enumerations/HttpStatus"],
    ["Scope",      "index/enumerations/Scope"],
  ]),
  arSection("Application", [
    ["createElysiaApplication",  "index/functions/createElysiaApplication"],
    ["createElysiaPlugin",       "index/functions/createElysiaPlugin"],
    ["addGlobalExceptionFilter", "index/functions/addGlobalExceptionFilter"],
    ["forwardRef",               "index/functions/forwardRef"],
  ]),
  arSection("Scheduler", [
    ["README",            "packages/scheduler/src/README"],
    ["ScheduleModule",    "packages/scheduler/src/classes/ScheduleModule"],
    ["SchedulerRegistry", "packages/scheduler/src/classes/SchedulerRegistry"],
    ["CronExpressions",   "packages/scheduler/src/classes/CronExpressions"],
    ["@Cron",             "packages/scheduler/src/functions/Cron"],
    ["@Interval",         "packages/scheduler/src/functions/Interval"],
    ["@Timeout",          "packages/scheduler/src/functions/Timeout"],
    ["@ScheduleAt",       "packages/scheduler/src/functions/ScheduleAt"],
  ]),
  arSection("Microservices", [
    ["README",                "packages/microservices/README"],
    ["ElysiaNestApplication", "packages/microservices/classes/ElysiaNestApplication"],
    ["ClientProxy",           "packages/microservices/classes/ClientProxy"],
    ["BaseServer",            "packages/microservices/classes/BaseServer"],
    ["TcpClient",             "packages/microservices/classes/TcpClient"],
    ["TcpServer",             "packages/microservices/classes/TcpServer"],
    ["RedisClient",           "packages/microservices/classes/RedisClient"],
    ["RedisServer",           "packages/microservices/classes/RedisServer"],
    ["Transport",             "packages/microservices/enumerations/Transport"],
  ]),
  arSection("Apollo / GraphQL", [
    ["README",        "packages/apollo/src/README"],
    ["GraphQLModule", "packages/apollo/src/classes/GraphQLModule"],
    ["@Resolver",     "packages/apollo/src/functions/Resolver"],
    ["@Query",        "packages/apollo/src/functions/Query"],
    ["@Mutation",     "packages/apollo/src/functions/Mutation"],
    ["@Subscription", "packages/apollo/src/functions/Subscription"],
    ["@ObjectType",   "packages/apollo/src/functions/ObjectType"],
    ["@Field",        "packages/apollo/src/functions/Field"],
    ["@Args",         "packages/apollo/src/functions/Args"],
  ]),
  arSection("Passport", [
    ["README",           "packages/passport/src/README"],
    ["AuthGuard",        "packages/passport/src/functions/AuthGuard"],
    ["PassportStrategy", "packages/passport/src/functions/PassportStrategy"],
  ]),
  arSection("Cache", [
    ["README",           "packages/cache/src/README"],
    ["CacheModule",      "packages/cache/src/classes/CacheModule"],
    ["Cache",            "packages/cache/src/classes/Cache"],
    ["CacheInterceptor", "packages/cache/src/classes/CacheInterceptor"],
    ["@CacheKey",        "packages/cache/src/functions/CacheKey"],
    ["@CacheTTL",        "packages/cache/src/functions/CacheTTL"],
  ]),
  arSection("RabbitMQ", [
    ["README",           "packages/rabbitmq/src/README"],
    ["RabbitMQModule",   "packages/rabbitmq/src/classes/RabbitMQModule"],
    ["AmqpConnection",   "packages/rabbitmq/src/classes/AmqpConnection"],
    ["@RabbitSubscribe", "packages/rabbitmq/src/functions/RabbitSubscribe"],
    ["@RabbitRPC",       "packages/rabbitmq/src/functions/RabbitRPC"],
  ]),
  arSection("GraphQL PubSub", [
    ["README",              "packages/graphql-pubsub/src/README"],
    ["GraphQLPubSubModule", "packages/graphql-pubsub/src/classes/GraphQLPubSubModule"],
    ["RedisPubSub",         "packages/graphql-pubsub/src/classes/RedisPubSub"],
  ]),
  arSection("Testing", [
    ["README",               "packages/testing/src/README"],
    ["Test",                 "packages/testing/src/classes/Test"],
    ["TestingModule",        "packages/testing/src/classes/TestingModule"],
    ["TestingModuleBuilder", "packages/testing/src/classes/TestingModuleBuilder"],
  ]),
];

// ── English locale ────────────────────────────────────────────────────────────

const enDocs = [
  docSection("Getting Started", [
    ["Introduction", "introduction"],
    ["Installation", "getting-started/installation"],
    ["Quick Start",  "getting-started/quick-start"],
  ]),
  docSection("Core Concepts", [
    ["Modules",      "core-concepts/modules"],
    ["Controllers",  "core-concepts/controllers"],
    ["Bootstrap",    "core-concepts/bootstrap"],
  ]),
  docSection("Features", [
    ["HTTP Decorators",      "features/http-decorators"],
    ["Parameter Decorators", "features/parameter-decorators"],
    ["Dependency Injection", "features/dependency-injection"],
    ["Lifecycle Hooks",      "features/lifecycle-hooks"],
    ["Middleware",           "features/middleware"],
    ["Exception Handling",   "features/exception-handling"],
    ["Guards",               "features/guards"],
    ["Interceptors",         "features/interceptors"],
    ["Pipes",                "features/pipes"],
  ]),
  docSection("Packages", [
    ["Overview",         "packages/overview"],
    ["Scheduler",        "packages/scheduler"],
    ["Microservices",    "packages/microservices"],
    ["Apollo / GraphQL", "packages/apollo"],
    ["Passport",         "packages/passport"],
    ["Testing",          "packages/testing"],
    ["Cache",            "packages/cache"],
    ["RabbitMQ",         "packages/rabbitmq"],
    ["GraphQL PubSub",   "packages/graphql-pubsub"],
  ]),
  docSection("Advanced", [
    ["Custom Providers",   "advanced/custom-providers"],
    ["Forward References", "advanced/forward-ref"],
    ["Container API",      "advanced/container-api"],
    ["Swagger",            "advanced/swagger"],
  ]),
];

export const enLocale = {
  label: "English",
  lang: "en-US",
  themeConfig: {
    nav: [
      { text: "Documentation", link: "/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/": enDocs, "/api-reference/": apiSidebar },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: { message: "Released under the MIT License." },
  },
};

// ── Russian locale ────────────────────────────────────────────────────────────

const ruDocs = [
  docSection("Начало работы", [
    ["Введение",      "introduction"],
    ["Установка",     "getting-started/installation"],
    ["Быстрый старт", "getting-started/quick-start"],
  ], "/ru"),
  docSection("Основные концепции", [
    ["Модули",      "core-concepts/modules"],
    ["Контроллеры", "core-concepts/controllers"],
    ["Bootstrap",   "core-concepts/bootstrap"],
  ], "/ru"),
  docSection("Возможности", [
    ["HTTP Декораторы",        "features/http-decorators"],
    ["Декораторы параметров",  "features/parameter-decorators"],
    ["Внедрение зависимостей", "features/dependency-injection"],
    ["Lifecycle Hooks",        "features/lifecycle-hooks"],
    ["Middleware",             "features/middleware"],
    ["Обработка исключений",   "features/exception-handling"],
    ["Guards",                 "features/guards"],
    ["Interceptors",           "features/interceptors"],
    ["Pipes",                  "features/pipes"],
  ], "/ru"),
  docSection("Пакеты", [
    ["Обзор",            "packages/overview"],
    ["Scheduler",        "packages/scheduler"],
    ["Microservices",    "packages/microservices"],
    ["Apollo / GraphQL", "packages/apollo"],
    ["Passport",         "packages/passport"],
    ["Testing",          "packages/testing"],
    ["Cache",            "packages/cache"],
    ["RabbitMQ",         "packages/rabbitmq"],
    ["GraphQL PubSub",   "packages/graphql-pubsub"],
  ], "/ru"),
  docSection("Продвинутые темы", [
    ["Пользовательские провайдеры", "advanced/custom-providers"],
    ["Forward References",          "advanced/forward-ref"],
    ["Container API",               "advanced/container-api"],
    ["Swagger",                     "advanced/swagger"],
  ], "/ru"),
];

// ── Chinese locale ────────────────────────────────────────────────────────────

const zhDocs = [
  docSection("入门", [
    ["介绍",      "introduction"],
    ["安装",      "getting-started/installation"],
    ["快速开始",  "getting-started/quick-start"],
  ], "/zh"),
  docSection("核心概念", [
    ["模块",      "core-concepts/modules"],
    ["控制器",    "core-concepts/controllers"],
    ["Bootstrap", "core-concepts/bootstrap"],
  ], "/zh"),
  docSection("功能特性", [
    ["HTTP 装饰器",  "features/http-decorators"],
    ["参数装饰器",   "features/parameter-decorators"],
    ["依赖注入",     "features/dependency-injection"],
    ["生命周期钩子", "features/lifecycle-hooks"],
    ["中间件",       "features/middleware"],
    ["异常处理",     "features/exception-handling"],
    ["守卫",         "features/guards"],
    ["拦截器",       "features/interceptors"],
    ["管道",         "features/pipes"],
  ], "/zh"),
  docSection("扩展包", [
    ["概览",           "packages/overview"],
    ["Scheduler",      "packages/scheduler"],
    ["Microservices",  "packages/microservices"],
    ["Apollo / GraphQL","packages/apollo"],
    ["Passport",       "packages/passport"],
    ["Testing",        "packages/testing"],
    ["Cache",          "packages/cache"],
    ["RabbitMQ",       "packages/rabbitmq"],
    ["GraphQL PubSub", "packages/graphql-pubsub"],
  ], "/zh"),
  docSection("进阶", [
    ["自定义提供者",  "advanced/custom-providers"],
    ["前向引用",      "advanced/forward-ref"],
    ["Container API", "advanced/container-api"],
    ["Swagger",       "advanced/swagger"],
  ], "/zh"),
];

export const zhLocale = {
  label: "简体中文",
  lang: "zh-CN",
  link: "/zh/",
  themeConfig: {
    nav: [
      { text: "文档",         link: "/zh/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/zh/": zhDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
    footer: { message: "基于 MIT 许可证发布。" },
  },
};

// ── Japanese locale ───────────────────────────────────────────────────────────

const jaDocs = [
  docSection("はじめに", [
    ["紹介",          "introduction"],
    ["インストール",   "getting-started/installation"],
    ["クイックスタート","getting-started/quick-start"],
  ], "/ja"),
  docSection("コアコンセプト", [
    ["モジュール",     "core-concepts/modules"],
    ["コントローラー", "core-concepts/controllers"],
    ["Bootstrap",     "core-concepts/bootstrap"],
  ], "/ja"),
  docSection("機能", [
    ["HTTP デコレーター",  "features/http-decorators"],
    ["パラメーターデコレーター","features/parameter-decorators"],
    ["依存性の注入",       "features/dependency-injection"],
    ["ライフサイクルフック","features/lifecycle-hooks"],
    ["ミドルウェア",       "features/middleware"],
    ["例外処理",           "features/exception-handling"],
    ["ガード",             "features/guards"],
    ["インターセプター",   "features/interceptors"],
    ["パイプ",             "features/pipes"],
  ], "/ja"),
  docSection("パッケージ", [
    ["概要",           "packages/overview"],
    ["Scheduler",      "packages/scheduler"],
    ["Microservices",  "packages/microservices"],
    ["Apollo / GraphQL","packages/apollo"],
    ["Passport",       "packages/passport"],
    ["Testing",        "packages/testing"],
    ["Cache",          "packages/cache"],
    ["RabbitMQ",       "packages/rabbitmq"],
    ["GraphQL PubSub", "packages/graphql-pubsub"],
  ], "/ja"),
  docSection("応用", [
    ["カスタムプロバイダー","advanced/custom-providers"],
    ["前方参照",            "advanced/forward-ref"],
    ["Container API",       "advanced/container-api"],
    ["Swagger",             "advanced/swagger"],
  ], "/ja"),
];

export const jaLocale = {
  label: "日本語",
  lang: "ja-JP",
  link: "/ja/",
  themeConfig: {
    nav: [
      { text: "ドキュメント",  link: "/ja/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/ja/": jaDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "GitHub で編集する",
    },
    footer: { message: "MIT ライセンスの下で公開されています。" },
  },
};

// ── Portuguese (BR) locale ────────────────────────────────────────────────────

const ptDocs = [
  docSection("Primeiros Passos", [
    ["Introdução",    "introduction"],
    ["Instalação",    "getting-started/installation"],
    ["Início Rápido", "getting-started/quick-start"],
  ], "/pt"),
  docSection("Conceitos Principais", [
    ["Módulos",      "core-concepts/modules"],
    ["Controladores","core-concepts/controllers"],
    ["Bootstrap",    "core-concepts/bootstrap"],
  ], "/pt"),
  docSection("Funcionalidades", [
    ["Decoradores HTTP",       "features/http-decorators"],
    ["Decoradores de Parâmetro","features/parameter-decorators"],
    ["Injeção de Dependência", "features/dependency-injection"],
    ["Hooks de Ciclo de Vida", "features/lifecycle-hooks"],
    ["Middleware",             "features/middleware"],
    ["Tratamento de Exceções", "features/exception-handling"],
    ["Guards",                 "features/guards"],
    ["Interceptors",           "features/interceptors"],
    ["Pipes",                  "features/pipes"],
  ], "/pt"),
  docSection("Pacotes", [
    ["Visão Geral",    "packages/overview"],
    ["Scheduler",      "packages/scheduler"],
    ["Microservices",  "packages/microservices"],
    ["Apollo / GraphQL","packages/apollo"],
    ["Passport",       "packages/passport"],
    ["Testing",        "packages/testing"],
    ["Cache",          "packages/cache"],
    ["RabbitMQ",       "packages/rabbitmq"],
    ["GraphQL PubSub", "packages/graphql-pubsub"],
  ], "/pt"),
  docSection("Avançado", [
    ["Provedores Customizados","advanced/custom-providers"],
    ["Referências Circulares", "advanced/forward-ref"],
    ["Container API",          "advanced/container-api"],
    ["Swagger",                "advanced/swagger"],
  ], "/pt"),
];

export const ptLocale = {
  label: "Português (BR)",
  lang: "pt-BR",
  link: "/pt/",
  themeConfig: {
    nav: [
      { text: "Documentação",  link: "/pt/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/pt/": ptDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "Editar esta página no GitHub",
    },
    footer: { message: "Lançado sob a licença MIT." },
  },
};

// ── Korean locale ─────────────────────────────────────────────────────────────

const koDocs = [
  docSection("시작하기", [
    ["소개",      "introduction"],
    ["설치",      "getting-started/installation"],
    ["빠른 시작", "getting-started/quick-start"],
  ], "/ko"),
  docSection("핵심 개념", [
    ["모듈",      "core-concepts/modules"],
    ["컨트롤러",  "core-concepts/controllers"],
    ["Bootstrap", "core-concepts/bootstrap"],
  ], "/ko"),
  docSection("기능", [
    ["HTTP 데코레이터",   "features/http-decorators"],
    ["파라미터 데코레이터","features/parameter-decorators"],
    ["의존성 주입",        "features/dependency-injection"],
    ["라이프사이클 훅",    "features/lifecycle-hooks"],
    ["미들웨어",           "features/middleware"],
    ["예외 처리",          "features/exception-handling"],
    ["가드",               "features/guards"],
    ["인터셉터",           "features/interceptors"],
    ["파이프",             "features/pipes"],
  ], "/ko"),
  docSection("패키지", [
    ["개요",           "packages/overview"],
    ["Scheduler",      "packages/scheduler"],
    ["Microservices",  "packages/microservices"],
    ["Apollo / GraphQL","packages/apollo"],
    ["Passport",       "packages/passport"],
    ["Testing",        "packages/testing"],
    ["Cache",          "packages/cache"],
    ["RabbitMQ",       "packages/rabbitmq"],
    ["GraphQL PubSub", "packages/graphql-pubsub"],
  ], "/ko"),
  docSection("고급", [
    ["커스텀 프로바이더","advanced/custom-providers"],
    ["순환 참조",        "advanced/forward-ref"],
    ["Container API",    "advanced/container-api"],
    ["Swagger",          "advanced/swagger"],
  ], "/ko"),
];

export const koLocale = {
  label: "한국어",
  lang: "ko-KR",
  link: "/ko/",
  themeConfig: {
    nav: [
      { text: "문서",          link: "/ko/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/ko/": koDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "GitHub에서 이 페이지 편집",
    },
    footer: { message: "MIT 라이선스로 배포됩니다." },
  },
};

// ── Spanish locale ────────────────────────────────────────────────────────────

const esDocs = [
  docSection("Introducción", [
    ["Introducción",   "introduction"],
    ["Instalación",    "getting-started/installation"],
    ["Inicio Rápido",  "getting-started/quick-start"],
  ], "/es"),
  docSection("Conceptos Principales", [
    ["Módulos",       "core-concepts/modules"],
    ["Controladores", "core-concepts/controllers"],
    ["Bootstrap",     "core-concepts/bootstrap"],
  ], "/es"),
  docSection("Características", [
    ["Decoradores HTTP",        "features/http-decorators"],
    ["Decoradores de Parámetro","features/parameter-decorators"],
    ["Inyección de Dependencias","features/dependency-injection"],
    ["Hooks de Ciclo de Vida",  "features/lifecycle-hooks"],
    ["Middleware",              "features/middleware"],
    ["Manejo de Excepciones",   "features/exception-handling"],
    ["Guards",                  "features/guards"],
    ["Interceptors",            "features/interceptors"],
    ["Pipes",                   "features/pipes"],
  ], "/es"),
  docSection("Paquetes", [
    ["Resumen",        "packages/overview"],
    ["Scheduler",      "packages/scheduler"],
    ["Microservices",  "packages/microservices"],
    ["Apollo / GraphQL","packages/apollo"],
    ["Passport",       "packages/passport"],
    ["Testing",        "packages/testing"],
    ["Cache",          "packages/cache"],
    ["RabbitMQ",       "packages/rabbitmq"],
    ["GraphQL PubSub", "packages/graphql-pubsub"],
  ], "/es"),
  docSection("Avanzado", [
    ["Proveedores Personalizados","advanced/custom-providers"],
    ["Referencias Circulares",    "advanced/forward-ref"],
    ["Container API",             "advanced/container-api"],
    ["Swagger",                   "advanced/swagger"],
  ], "/es"),
];

export const esLocale = {
  label: "Español",
  lang: "es",
  link: "/es/",
  themeConfig: {
    nav: [
      { text: "Documentación", link: "/es/introduction" },
      { text: "API Reference",  link: "/api-reference/index/README" },
      { text: "GitHub",         link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/es/": esDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "Editar esta página en GitHub",
    },
    footer: { message: "Publicado bajo la licencia MIT." },
  },
};

export const ruLocale = {
  label: "Русский",
  lang: "ru-RU",
  link: "/ru/",
  themeConfig: {
    nav: [
      { text: "Документация", link: "/ru/introduction" },
      { text: "API Reference", link: "/api-reference/index/README" },
      { text: "GitHub",        link: "https://github.com/kiyasov/nestelia" },
    ],
    sidebar: { "/ru/": ruDocs },
    editLink: {
      pattern: "https://github.com/kiyasov/nestelia/edit/main/docs/:path",
      text: "Редактировать на GitHub",
    },
    footer: { message: "Распространяется по лицензии MIT." },
  },
};
