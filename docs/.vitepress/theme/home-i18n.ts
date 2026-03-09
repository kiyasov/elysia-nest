import { useData } from "vitepress";
import { computed } from "vue";

// ── Translations ──────────────────────────────────────────────────────────────

const messages = {
  "en-US": {
    pill: { released: "released", github: "View on GitHub" },
    tagline: ["Modular framework for Elysia and Bun.", "Decorators · DI · Modules · Elysia speed."],
    cta: { start: "Get Started", quick: "Quick Start →" },
    links: { intro: "/introduction", quick: "/getting-started/quick-start" },
    copy: { idle: "Copy", done: "Copied!" },
    ecosystem: {
      title: "Ecosystem",
      sub: "Optional packages — install only what you need.",
    },
    packages: {
      Scheduler: "@Cron, @Interval, @Timeout — task scheduling powered by node-cron.",
      Microservices: "TCP and Redis transports with @MessagePattern and @EventPattern.",
      "Apollo / GraphQL": "Code-first GraphQL with @Resolver, @Query, @Mutation, @Subscription.",
      Passport: "AuthGuard and PassportStrategy — drop-in authentication strategies.",
      Cache: "CacheModule with @CacheKey, @CacheTTL and pluggable cache stores.",
      RabbitMQ: "@RabbitSubscribe and @RabbitRPC over AMQP via amqplib.",
      Testing: "Test.createTestingModule — isolated module testing with mock providers.",
      "GraphQL PubSub": "Redis-backed PubSub for real-time GraphQL subscriptions.",
    },
    showcase: [
      {
        title: "Decorator-driven Routing",
        paragraphs: [
          "@Controller, @Get, @Post, @Body and more — a clean, declarative decorator API running natively on Elysia.",
          "Nestelia maps each decorated route directly to an Elysia handler, giving you full type inference and schema validation at the framework layer.",
        ],
      },
      {
        title: "Dependency Injection",
        paragraphs: [
          "Constructor-based DI with singleton, transient, and request scopes powered by reflect-metadata.",
          "Mark any class with @Injectable() and declare it as a provider — nestelia resolves the full dependency graph automatically at bootstrap.",
        ],
      },
      {
        title: "Modular Architecture",
        paragraphs: [
          "Encapsulate controllers, providers, and imports into cohesive, reusable modules with a clear, explicit structure.",
          "One call to createElysiaApplication wires up the entire dependency graph and returns a ready Elysia instance.",
        ],
      },
    ],
  },

  "ru-RU": {
    pill: { released: "выпущена", github: "Смотреть на GitHub" },
    tagline: [
      "Модульный фреймворк для Elysia и Bun.",
      "Декораторы · DI · Модули · Скорость Elysia.",
    ],
    cta: { start: "Начать", quick: "Быстрый старт →" },
    links: { intro: "/ru/introduction", quick: "/ru/getting-started/quick-start" },
    copy: { idle: "Копировать", done: "Скопировано!" },
    ecosystem: {
      title: "Экосистема",
      sub: "Опциональные пакеты — устанавливайте только нужное.",
    },
    packages: {
      Scheduler: "@Cron, @Interval, @Timeout — планирование задач на базе node-cron.",
      Microservices: "Транспорты TCP и Redis с @MessagePattern и @EventPattern.",
      "Apollo / GraphQL": "Code-first GraphQL с @Resolver, @Query, @Mutation, @Subscription.",
      Passport: "AuthGuard и PassportStrategy — готовые стратегии аутентификации.",
      Cache: "CacheModule с @CacheKey, @CacheTTL и подключаемыми хранилищами.",
      RabbitMQ: "@RabbitSubscribe и @RabbitRPC через AMQP с amqplib.",
      Testing: "Test.createTestingModule — изолированное тестирование с mock-провайдерами.",
      "GraphQL PubSub": "Redis PubSub для real-time GraphQL subscriptions.",
    },
    showcase: [
      {
        title: "Маршрутизация на декораторах",
        paragraphs: [
          "@Controller, @Get, @Post, @Body и другие — декларативный API, работающий нативно на Elysia.",
          "nestelia напрямую связывает каждый декорированный маршрут с обработчиком Elysia, обеспечивая вывод типов и валидацию схем.",
        ],
      },
      {
        title: "Dependency Injection",
        paragraphs: [
          "Constructor-based DI с singleton, transient и request scope-ами на базе reflect-metadata.",
          "Пометьте класс @Injectable() и объявите его провайдером — nestelia автоматически разрешит весь граф зависимостей при старте.",
        ],
      },
      {
        title: "Модульная архитектура",
        paragraphs: [
          "Инкапсулируйте controllers, providers и imports в целостные переиспользуемые модули с явной структурой.",
          "Один вызов createElysiaApplication собирает весь граф зависимостей и возвращает готовый экземпляр Elysia.",
        ],
      },
    ],
  },

  "zh-CN": {
    pill: { released: "已发布", github: "在 GitHub 上查看" },
    tagline: [
      "基于 Elysia 和 Bun 的模块化框架。",
      "装饰器 · 依赖注入 · 模块化 · Elysia 速度。",
    ],
    cta: { start: "开始使用", quick: "快速开始 →" },
    links: { intro: "/zh/introduction", quick: "/zh/getting-started/quick-start" },
    copy: { idle: "复制", done: "已复制！" },
    ecosystem: {
      title: "生态系统",
      sub: "可选扩展包 — 按需安装。",
    },
    packages: {
      Scheduler: "@Cron、@Interval、@Timeout — 基于 node-cron 的任务调度。",
      Microservices: "TCP 和 Redis 传输，支持 @MessagePattern 和 @EventPattern。",
      "Apollo / GraphQL": "代码优先的 GraphQL，支持 @Resolver、@Query、@Mutation、@Subscription。",
      Passport: "AuthGuard 和 PassportStrategy — 开箱即用的身份验证策略。",
      Cache: "CacheModule，支持 @CacheKey、@CacheTTL 和可插拔缓存存储。",
      RabbitMQ: "通过 amqplib 支持 AMQP 的 @RabbitSubscribe 和 @RabbitRPC。",
      Testing: "Test.createTestingModule — 使用 mock 提供者进行隔离模块测试。",
      "GraphQL PubSub": "基于 Redis 的 PubSub，用于实时 GraphQL 订阅。",
    },
    showcase: [
      {
        title: "装饰器驱动路由",
        paragraphs: [
          "@Controller、@Get、@Post、@Body 等 — 简洁的声明式装饰器 API，原生运行于 Elysia 之上。",
          "nestelia 将每个装饰路由直接映射到 Elysia 处理器，在框架层提供完整的类型推断和模式验证。",
        ],
      },
      {
        title: "依赖注入",
        paragraphs: [
          "基于构造函数的依赖注入，通过 reflect-metadata 支持单例、瞬态和请求作用域。",
          "用 @Injectable() 标记任意类并声明为提供者 — nestelia 在启动时自动解析完整的依赖关系图。",
        ],
      },
      {
        title: "模块化架构",
        paragraphs: [
          "将控制器、提供者和导入封装到具有清晰显式结构的内聚可复用模块中。",
          "一次调用 createElysiaApplication 即可连接整个依赖关系图并返回就绪的 Elysia 实例。",
        ],
      },
    ],
  },

  "ja-JP": {
    pill: { released: "リリース済み", github: "GitHub で見る" },
    tagline: [
      "Elysia と Bun のためのモジュラーフレームワーク。",
      "デコレーター · DI · モジュール · Elysia の速度。",
    ],
    cta: { start: "はじめる", quick: "クイックスタート →" },
    links: { intro: "/ja/introduction", quick: "/ja/getting-started/quick-start" },
    copy: { idle: "コピー", done: "コピー済み！" },
    ecosystem: {
      title: "エコシステム",
      sub: "オプションパッケージ — 必要なものだけインストール。",
    },
    packages: {
      Scheduler: "@Cron、@Interval、@Timeout — node-cron によるタスクスケジューリング。",
      Microservices: "@MessagePattern と @EventPattern を使った TCP・Redis トランスポート。",
      "Apollo / GraphQL": "@Resolver、@Query、@Mutation、@Subscription によるコードファーストの GraphQL。",
      Passport: "AuthGuard と PassportStrategy — すぐに使える認証ストラテジー。",
      Cache: "@CacheKey、@CacheTTL とプラグイン可能なキャッシュストアを持つ CacheModule。",
      RabbitMQ: "amqplib 経由の AMQP で @RabbitSubscribe と @RabbitRPC。",
      Testing: "Test.createTestingModule — モックプロバイダーによる隔離テスト。",
      "GraphQL PubSub": "リアルタイム GraphQL サブスクリプション用の Redis バックエンド PubSub。",
    },
    showcase: [
      {
        title: "デコレーター駆動ルーティング",
        paragraphs: [
          "@Controller、@Get、@Post、@Body など — Elysia 上でネイティブに動作するクリーンな宣言的デコレーター API。",
          "nestelia は各デコレートされたルートを Elysia ハンドラーに直接マッピングし、フレームワーク層で型推論とスキーマバリデーションを提供します。",
        ],
      },
      {
        title: "依存性の注入",
        paragraphs: [
          "reflect-metadata によるシングルトン・トランジェント・リクエストスコープをサポートするコンストラクターベースの DI。",
          "@Injectable() でクラスをマークしプロバイダーとして宣言するだけ — nestelia が起動時に依存関係グラフ全体を自動解決します。",
        ],
      },
      {
        title: "モジュラーアーキテクチャ",
        paragraphs: [
          "コントローラー、プロバイダー、インポートを明確な構造を持つ凝集した再利用可能なモジュールにカプセル化。",
          "createElysiaApplication を一度呼び出すだけで依存関係グラフ全体が接続され、準備完了の Elysia インスタンスが返されます。",
        ],
      },
    ],
  },

  "pt-BR": {
    pill: { released: "lançado", github: "Ver no GitHub" },
    tagline: [
      "Framework modular para Elysia e Bun.",
      "Decoradores · DI · Módulos · Velocidade do Elysia.",
    ],
    cta: { start: "Começar", quick: "Início Rápido →" },
    links: { intro: "/pt/introduction", quick: "/pt/getting-started/quick-start" },
    copy: { idle: "Copiar", done: "Copiado!" },
    ecosystem: {
      title: "Ecossistema",
      sub: "Pacotes opcionais — instale apenas o que precisar.",
    },
    packages: {
      Scheduler: "@Cron, @Interval, @Timeout — agendamento de tarefas com node-cron.",
      Microservices: "Transportes TCP e Redis com @MessagePattern e @EventPattern.",
      "Apollo / GraphQL": "GraphQL code-first com @Resolver, @Query, @Mutation, @Subscription.",
      Passport: "AuthGuard e PassportStrategy — estratégias de autenticação prontas para uso.",
      Cache: "CacheModule com @CacheKey, @CacheTTL e stores de cache plugáveis.",
      RabbitMQ: "@RabbitSubscribe e @RabbitRPC sobre AMQP via amqplib.",
      Testing: "Test.createTestingModule — testes isolados com provedores mock.",
      "GraphQL PubSub": "PubSub com Redis para subscriptions GraphQL em tempo real.",
    },
    showcase: [
      {
        title: "Roteamento por Decoradores",
        paragraphs: [
          "@Controller, @Get, @Post, @Body e mais — uma API de decoradores limpa e declarativa rodando nativamente no Elysia.",
          "O nestelia mapeia cada rota decorada diretamente para um handler do Elysia, fornecendo inferência de tipos e validação de schema na camada do framework.",
        ],
      },
      {
        title: "Injeção de Dependência",
        paragraphs: [
          "DI baseado em construtor com escopos singleton, transient e request, alimentado por reflect-metadata.",
          "Marque qualquer classe com @Injectable() e declare-a como provider — o nestelia resolve o grafo de dependências completo automaticamente na inicialização.",
        ],
      },
      {
        title: "Arquitetura Modular",
        paragraphs: [
          "Encapsule controllers, providers e imports em módulos coesos e reutilizáveis com estrutura clara e explícita.",
          "Uma chamada para createElysiaApplication conecta todo o grafo de dependências e retorna uma instância Elysia pronta.",
        ],
      },
    ],
  },

  "ko-KR": {
    pill: { released: "출시됨", github: "GitHub에서 보기" },
    tagline: [
      "Elysia와 Bun을 위한 모듈형 프레임워크.",
      "데코레이터 · DI · 모듈 · Elysia 속도.",
    ],
    cta: { start: "시작하기", quick: "빠른 시작 →" },
    links: { intro: "/ko/introduction", quick: "/ko/getting-started/quick-start" },
    copy: { idle: "복사", done: "복사됨!" },
    ecosystem: {
      title: "에코시스템",
      sub: "선택적 패키지 — 필요한 것만 설치하세요.",
    },
    packages: {
      Scheduler: "@Cron, @Interval, @Timeout — node-cron 기반 작업 스케줄링.",
      Microservices: "@MessagePattern과 @EventPattern을 사용한 TCP 및 Redis 전송.",
      "Apollo / GraphQL": "@Resolver, @Query, @Mutation, @Subscription을 사용한 코드 우선 GraphQL.",
      Passport: "AuthGuard와 PassportStrategy — 바로 사용 가능한 인증 전략.",
      Cache: "@CacheKey, @CacheTTL과 플러그인 가능한 캐시 스토어를 갖춘 CacheModule.",
      RabbitMQ: "amqplib를 통한 AMQP 기반 @RabbitSubscribe와 @RabbitRPC.",
      Testing: "Test.createTestingModule — mock 프로바이더를 사용한 격리 테스트.",
      "GraphQL PubSub": "실시간 GraphQL 구독을 위한 Redis 기반 PubSub.",
    },
    showcase: [
      {
        title: "데코레이터 기반 라우팅",
        paragraphs: [
          "@Controller, @Get, @Post, @Body 등 — Elysia 위에서 네이티브로 실행되는 깔끔한 선언적 데코레이터 API.",
          "nestelia는 각 데코레이트된 라우트를 Elysia 핸들러에 직접 매핑하여 프레임워크 레이어에서 완전한 타입 추론과 스키마 검증을 제공합니다.",
        ],
      },
      {
        title: "의존성 주입",
        paragraphs: [
          "reflect-metadata로 구동되는 싱글톤, 일시적, 요청 스코프를 지원하는 생성자 기반 DI.",
          "@Injectable()로 클래스를 표시하고 프로바이더로 선언하면 — nestelia가 부트스트랩 시 전체 의존성 그래프를 자동으로 해결합니다.",
        ],
      },
      {
        title: "모듈형 아키텍처",
        paragraphs: [
          "컨트롤러, 프로바이더, 임포트를 명확하고 명시적인 구조를 가진 응집력 있고 재사용 가능한 모듈로 캡슐화.",
          "createElysiaApplication 한 번 호출로 전체 의존성 그래프를 연결하고 준비된 Elysia 인스턴스를 반환합니다.",
        ],
      },
    ],
  },

  "es": {
    pill: { released: "lanzado", github: "Ver en GitHub" },
    tagline: [
      "Framework modular para Elysia y Bun.",
      "Decoradores · DI · Módulos · Velocidad de Elysia.",
    ],
    cta: { start: "Comenzar", quick: "Inicio Rápido →" },
    links: { intro: "/es/introduction", quick: "/es/getting-started/quick-start" },
    copy: { idle: "Copiar", done: "¡Copiado!" },
    ecosystem: {
      title: "Ecosistema",
      sub: "Paquetes opcionales — instala solo lo que necesitas.",
    },
    packages: {
      Scheduler: "@Cron, @Interval, @Timeout — programación de tareas con node-cron.",
      Microservices: "Transportes TCP y Redis con @MessagePattern y @EventPattern.",
      "Apollo / GraphQL": "GraphQL code-first con @Resolver, @Query, @Mutation, @Subscription.",
      Passport: "AuthGuard y PassportStrategy — estrategias de autenticación listas para usar.",
      Cache: "CacheModule con @CacheKey, @CacheTTL y stores de caché conectables.",
      RabbitMQ: "@RabbitSubscribe y @RabbitRPC sobre AMQP via amqplib.",
      Testing: "Test.createTestingModule — pruebas aisladas con proveedores mock.",
      "GraphQL PubSub": "PubSub respaldado por Redis para subscripciones GraphQL en tiempo real.",
    },
    showcase: [
      {
        title: "Enrutamiento por Decoradores",
        paragraphs: [
          "@Controller, @Get, @Post, @Body y más — una API de decoradores limpia y declarativa que corre nativamente en Elysia.",
          "nestelia mapea cada ruta decorada directamente a un handler de Elysia, dando inferencia de tipos completa y validación de esquemas en la capa del framework.",
        ],
      },
      {
        title: "Inyección de Dependencias",
        paragraphs: [
          "DI basado en constructor con alcances singleton, transient y request, impulsado por reflect-metadata.",
          "Marca cualquier clase con @Injectable() y declárala como provider — nestelia resuelve el grafo de dependencias completo automáticamente al arrancar.",
        ],
      },
      {
        title: "Arquitectura Modular",
        paragraphs: [
          "Encapsula controladores, proveedores e importaciones en módulos cohesivos y reutilizables con una estructura clara y explícita.",
          "Una llamada a createElysiaApplication conecta todo el grafo de dependencias y devuelve una instancia Elysia lista para usar.",
        ],
      },
    ],
  },
} as const;

type Messages = (typeof messages)["en-US"];

// ── Composable ────────────────────────────────────────────────────────────────

export function useHomeI18n() {
  const { lang } = useData();
  return computed(
    () => (messages[lang.value as keyof typeof messages] ?? messages["en-US"]) as Messages,
  );
}
