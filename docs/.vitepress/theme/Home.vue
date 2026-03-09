<script setup lang="ts">
import { ref } from 'vue'

declare const __PKG_VERSION__: string

const copied = ref(false)
const version = __PKG_VERSION__

async function copyInstall() {
  await navigator.clipboard.writeText('bun add nestelia')
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function hl(code: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.split('\n').map(line => {
    const ci = line.indexOf('//')
    let src = ci >= 0 ? line.substring(0, ci) : line
    const comment = ci >= 0 ? line.substring(ci) : ''

    // Token-based approach: replace matches with \x00N\x00 placeholders first,
    // then swap all placeholders for HTML at the end — prevents regex from
    // accidentally matching inside already-inserted HTML attributes.
    const slots: string[] = []
    const tok = (cls: string, text: string) => {
      const id = `\x00${slots.length}\x00`
      slots.push(`<i class="${cls}">${text}</i>`)
      return id
    }

    src = src.replace(/'[^']*'/g,  m => tok('hs', m))
    src = src.replace(/@\w+/g,     m => tok('hd', m))
    src = src.replace(
      /\b(import|export|from|class|const|let|return|async|await|new|private|public|this|void|extends)\b/g,
      m => tok('hk', m),
    )
    src = src.replace(/\b([A-Z][A-Za-z0-9]+)\b/g, m => tok('ht', m))

    src = src.replace(/\x00(\d+)\x00/g, (_, i) => slots[+i])

    return src + (comment ? `<i class="hc">${comment}</i>` : '')
  }).join('\n')
}


const packages = [
  {
    name: 'Scheduler',
    import: 'nestelia/scheduler',
    emoji: '⏰',
    desc: '@Cron, @Interval, @Timeout — task scheduling powered by node-cron.',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    link: '/nestelia/packages/scheduler',
  },
  {
    name: 'Microservices',
    import: 'nestelia/microservices',
    emoji: '🔗',
    desc: 'TCP and Redis transports with @MessagePattern and @EventPattern.',
    gradient: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    link: '/nestelia/packages/microservices',
  },
  {
    name: 'Apollo / GraphQL',
    import: 'nestelia/apollo',
    emoji: '◈',
    desc: 'Code-first GraphQL with @Resolver, @Query, @Mutation, @Subscription.',
    gradient: 'linear-gradient(135deg, #e879f9, #6366f1)',
    link: '/nestelia/packages/apollo',
  },
  {
    name: 'Passport',
    import: 'nestelia/passport',
    emoji: '🛂',
    desc: 'AuthGuard and PassportStrategy — drop-in authentication strategies.',
    gradient: 'linear-gradient(135deg, #22c55e, #06b6d4)',
    link: '/nestelia/packages/passport',
  },
  {
    name: 'Cache',
    import: 'nestelia/cache',
    emoji: '⚡',
    desc: 'CacheModule with @CacheKey, @CacheTTL and pluggable cache stores.',
    gradient: 'linear-gradient(135deg, #2dd4bf, #60a5fa)',
    link: '/nestelia/packages/cache',
  },
  {
    name: 'RabbitMQ',
    import: 'nestelia/rabbitmq',
    emoji: '🐇',
    desc: '@RabbitSubscribe and @RabbitRPC over AMQP via amqplib.',
    gradient: 'linear-gradient(135deg, #fb923c, #f43f5e)',
    link: '/nestelia/packages/rabbitmq',
  },
  {
    name: 'Testing',
    import: 'nestelia/testing',
    emoji: '🧪',
    desc: 'Test.createTestingModule — isolated module testing with mock providers.',
    gradient: 'linear-gradient(135deg, #818cf8, #e879f9)',
    link: '/nestelia/packages/testing',
  },
  {
    name: 'GraphQL PubSub',
    import: 'nestelia/graphql-pubsub',
    emoji: '📡',
    desc: 'Redis-backed PubSub for real-time GraphQL subscriptions.',
    gradient: 'linear-gradient(135deg, #c084fc, #fb7185)',
    link: '/nestelia/packages/graphql-pubsub',
  },
]

const showcase = [
  {
    title: 'Decorator-driven Routing',
    paragraphs: [
      '@Controller, @Get, @Post, @Body and more — a clean, declarative decorator API running natively on Elysia.',
      'Nestelia maps each decorated route directly to an Elysia handler, giving you full type inference and schema validation at the framework layer.',
    ],
    filename: 'users.controller.ts',
    code: hl(`import { Controller, Get, Post, Body } from 'nestelia'
import { CreateUserDto } from './dto'

@Controller('/users')
export class UsersController {

  @Get()
  findAll() {
    return { users: [] }
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return dto
  }
}`),
  },
  {
    title: 'Dependency Injection',
    paragraphs: [
      'Constructor-based DI with singleton, transient, and request scopes powered by reflect-metadata.',
      'Mark any class with @Injectable() and declare it as a provider — nestelia resolves the full dependency graph automatically at bootstrap.',
    ],
    filename: 'users.service.ts',
    code: hl(`import { Injectable } from 'nestelia'

@Injectable()
export class UsersService {
  private users: User[] = []

  async findAll(): Promise<User[]> {
    return this.users
  }

  async create(dto: CreateUserDto): Promise<User> {
    this.users.push(dto)
    return dto
  }
}`),
  },
  {
    title: 'Modular Architecture',
    paragraphs: [
      'Encapsulate controllers, providers, and imports into cohesive, reusable modules with a clear, explicit structure.',
      'One call to createElysiaApplication wires up the entire dependency graph and returns a ready Elysia instance.',
    ],
    filename: 'main.ts',
    code: hl(`import 'reflect-metadata'
import { createElysiaApplication } from 'nestelia'
import { AppModule } from './app.module'

const app = await createElysiaApplication(AppModule)

app.listen(3000)
// Listening on http://localhost:3000`),
  },
]
</script>

<template>
  <div class="home">

    <!-- ─────────────────────── Hero ─────────────────────────── -->
    <section class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="hero-orb"  aria-hidden="true" />

      <div class="hero-body">

        <!-- Eyebrow pill -->
        <a
          class="hero-pill"
          href="https://github.com/kiyasov/nestelia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="pill-dot" />
          v{{ version }} released
          <span class="pill-sep">·</span>
          View on GitHub
          <span class="pill-arrow">↗</span>
        </a>

        <!-- Main title -->
        <h1 class="hero-title">nestelia</h1>

        <!-- Tagline -->
        <p class="hero-tagline">
          Modular framework for Elysia and Bun.<br>
          Decorators · DI · Modules · Elysia speed.
        </p>

        <!-- CTAs -->
        <div class="hero-ctas">
          <a class="cta-primary" href="/nestelia/introduction">Get Started</a>
          <a class="cta-ghost"  href="/nestelia/getting-started/quick-start">Quick Start →</a>
        </div>

        <!-- Install command -->
        <button
          class="install"
          :aria-label="copied ? 'Copied!' : 'Copy install command'"
          @click="copyInstall"
        >
          <span class="install-prompt">$</span>
          <code class="install-text">bun add nestelia</code>
          <span class="install-badge">{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>

      </div>
    </section>

    <!-- ─────────────────────── Showcase ────────────────────── -->
    <section class="showcase">
      <div class="showcase-inner">
        <div
          v-for="(item, i) in showcase"
          :key="item.title"
          class="showcase-item"
        >
          <!-- Timeline column -->
          <div class="s-timeline" aria-hidden="true">
            <div class="s-dot" />
            <div v-if="i < showcase.length - 1" class="s-line" />
          </div>

          <!-- Content: text + code -->
          <div class="s-content">
            <div class="s-text">
              <h2 class="s-title">{{ item.title }}</h2>
              <p v-for="p in item.paragraphs" :key="p" class="s-para">{{ p }}</p>
            </div>

            <div class="s-code-wrap">
              <div class="s-code-header">
                <span class="s-code-dot" style="background:#ff5f57" />
                <span class="s-code-dot" style="background:#febc2e" />
                <span class="s-code-dot" style="background:#28c840" />
                <span class="s-code-filename">{{ item.filename }}</span>
              </div>
              <pre class="s-pre"><code v-html="item.code" /></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────── Packages ────────────────────── -->
    <section class="pkg-section">
      <div class="pkg-inner">
        <div class="section-header">
          <h2 class="section-title">Ecosystem</h2>
          <p class="section-sub">Optional packages — install only what you need.</p>
        </div>
        <div class="pkg-grid">
          <a
            v-for="p in packages"
            :key="p.name"
            class="pkg-card"
            :href="p.link"
          >
            <div class="pkg-icon" :style="{ background: p.gradient }">{{ p.emoji }}</div>
            <div class="pkg-body">
              <div class="pkg-top">
                <span class="pkg-name">{{ p.name }}</span>
                <code class="pkg-import">{{ p.import }}</code>
              </div>
              <p class="pkg-desc">{{ p.desc }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── Wrapper ───────────────────────────────────────────────── */
.home {
  width: 100%;
}

/* ── Hero ──────────────────────────────────────────────────── */
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 108px 24px 96px;
  overflow: hidden;
  text-align: center;
}

/* Dot grid texture */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(124, 58, 237, 0.07) 1px,
    transparent 0
  );
  background-size: 28px 28px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
}

/* Glow orb */
.hero-orb {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    rgba(124, 58, 237, 0.11) 0%,
    rgba(240, 98, 146, 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.dark .hero-orb {
  background: radial-gradient(
    ellipse at center,
    rgba(124, 58, 237, 0.2) 0%,
    rgba(240, 98, 146, 0.08) 40%,
    transparent 70%
  );
}

.hero-body {
  position: relative;
  z-index: 1;
  max-width: 740px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* Eyebrow pill */
.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.hero-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  flex-shrink: 0;
}
.pill-sep { opacity: 0.35; }
.pill-arrow { font-size: 12px; }

/* Main title */
.hero-title {
  font-size: clamp(64px, 13vw, 108px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, #7c3aed 0%, #f06292 55%, #fb923c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Tagline */
.hero-tagline {
  font-size: 18px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 520px;
}

/* CTA row */
.hero-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none !important;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.cta-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(240, 98, 146, 0.35);
}

.cta-ghost {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1) !important;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none !important;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.cta-ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  background: var(--vp-c-brand-soft);
}

/* Install box */
.install {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font-size: 14px;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s;
}
.install:hover {
  border-color: var(--vp-c-brand-1);
}

.install-prompt {
  color: var(--vp-c-text-3);
  font-family: 'Geist Mono', ui-monospace, monospace;
  user-select: none;
}
.install-text {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: none;
  padding: 0;
  border-radius: 0;
}
.install-badge {
  font-size: 11.5px;
  padding: 2px 9px;
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  margin-left: 4px;
  user-select: none;
  transition: color 0.2s;
}

/* ── Showcase ──────────────────────────────────────────────── */
.showcase {
  padding: 0 24px 100px;
}

.showcase-inner {
  max-width: 1040px;
  margin: 0 auto;
}

.showcase-item {
  display: flex;
  gap: 32px;
}

/* Timeline */
.s-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 7px;
}

.s-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.showcase-item:hover .s-dot {
  border-color: var(--vp-c-brand-1);
}

.s-line {
  flex: 1;
  width: 1px;
  margin-top: 10px;
  background: linear-gradient(to bottom, var(--vp-c-divider) 80%, transparent);
  min-height: 48px;
}

/* Content grid */
.s-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 40px;
  align-items: start;
  padding-bottom: 72px;
}

/* Text */
.s-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
  line-height: 1.3;
}

.s-para {
  font-size: 15px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}
.s-para:last-child { margin-bottom: 0; }

/* Code block */
.s-code-wrap {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f6f8fa;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
}
.dark .s-code-wrap {
  border-color: rgba(255, 255, 255, 0.07);
  background: #16131f;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
}

.s-code-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .s-code-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.s-code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.s-code-filename {
  margin-left: 8px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
}
.dark .s-code-filename {
  color: rgba(255, 255, 255, 0.35);
}

.s-pre {
  margin: 0;
  padding: 20px 22px;
  overflow-x: auto;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.75;
  color: #24292f;
  background: none;
  border-radius: 0;
}
.dark .s-pre {
  color: #c9c1e8;
}

/* Syntax highlight tokens */
.s-pre :deep(i) { font-style: normal; }
.s-pre :deep(.hk) { color: #8250df; } /* keywords */
.s-pre :deep(.hs) { color: #116329; } /* strings  */
.s-pre :deep(.hd) { color: #cf222e; } /* decorators */
.s-pre :deep(.ht) { color: #0550ae; } /* types    */
.s-pre :deep(.hc) { color: #6e7781; } /* comments */
.dark .s-pre :deep(.hk) { color: #c084fc; }
.dark .s-pre :deep(.hs) { color: #86efac; }
.dark .s-pre :deep(.hd) { color: #f472b6; }
.dark .s-pre :deep(.ht) { color: #93c5fd; }
.dark .s-pre :deep(.hc) { color: #4b5563; }

/* Responsive */
@media (max-width: 768px) {
  .s-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 48px;
  }
}
@media (max-width: 600px) {
  .hero-title   { font-size: 56px; }
  .hero-tagline { font-size: 16px; }
  .showcase-item { gap: 16px; }
  .s-timeline { display: none; }
}


/* ── Packages ──────────────────────────────────────────────── */
.pkg-section {
  padding: 0 24px 100px;
}

.pkg-inner {
  max-width: 1040px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.section-sub {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.pkg-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 640px) {
  .pkg-grid { grid-template-columns: 1fr; }
}

.pkg-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: border-color 0.2s, background 0.2s, transform 0.18s;
}
.pkg-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transform: translateY(-1px);
}

.pkg-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.pkg-body {
  flex: 1;
  min-width: 0;
}

.pkg-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.pkg-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.pkg-import {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11.5px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 1px 7px;
  border-radius: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pkg-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>
