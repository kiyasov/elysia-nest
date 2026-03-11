import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import pkg from "../../package.json";
import { enLocale, ruLocale, zhLocale, jaLocale, ptLocale, koLocale, esLocale } from "./locales";

const SITE_URL  = "https://nestelia.dev";
const SITE_DESC = "A modular, decorator-driven framework built on top of Elysia and Bun";
const OG_IMAGE  = `${SITE_URL}/og.png`;

export default defineConfig({
  title: "Nestelia",
  titleTemplate: ":title | Nestelia",
  description: SITE_DESC,
  base: "/",
  ignoreDeadLinks: true,

  sitemap: { hostname: SITE_URL },

  head: [
    // Favicon
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],

    // Fonts
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" }],

    // Open Graph
    ["meta", { property: "og:type",        content: "website" }],
    ["meta", { property: "og:site_name",   content: "Nestelia" }],
    ["meta", { property: "og:url",         content: SITE_URL }],
    ["meta", { property: "og:title",       content: "Nestelia" }],
    ["meta", { property: "og:description", content: SITE_DESC }],
    ["meta", { property: "og:image",       content: OG_IMAGE }],

    // Twitter / X
    ["meta", { name: "twitter:card",        content: "summary_large_image" }],
    ["meta", { name: "twitter:title",       content: "Nestelia" }],
    ["meta", { name: "twitter:description", content: SITE_DESC }],
    ["meta", { name: "twitter:image",       content: OG_IMAGE }],

    // JSON-LD structured data
    ["script", { type: "application/ld+json" }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Nestelia",
      "description": SITE_DESC,
      "url": SITE_URL,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "programmingLanguage": "TypeScript",
      "license": "https://opensource.org/licenses/MIT",
      "codeRepository": "https://github.com/kiyasov/nestelia",
      "documentation": `${SITE_URL}/introduction`,
      "keywords": [
        "elysia", "bun", "typescript", "framework", "dependency injection",
        "decorators", "nestjs", "modules", "controllers", "graphql", "microservices"
      ],
    })],
  ],

  // Inject per-page canonical URL, dynamic og:title, and hreflang alternates
  transformPageData(pageData) {
    const canonical = `${SITE_URL}/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: canonical }],
      ["meta", { property: "og:url",   content: canonical }],
      ["meta", { property: "og:title", content: pageData.title ? `${pageData.title} | Nestelia` : "Nestelia" }],
    );

    // hreflang alternate links for multilingual SEO
    const localePrefixes: Array<{ lang: string; prefix: string }> = [
      { lang: "en",    prefix: ""    },
      { lang: "zh-CN", prefix: "zh/" },
      { lang: "ru",    prefix: "ru/" },
      { lang: "ja",    prefix: "ja/" },
      { lang: "pt-BR", prefix: "pt/" },
      { lang: "ko",    prefix: "ko/" },
      { lang: "es",    prefix: "es/" },
    ];

    // Strip any locale prefix to get the base path
    let basePath = pageData.relativePath;
    for (const { prefix } of localePrefixes.filter(l => l.prefix)) {
      if (basePath.startsWith(prefix)) {
        basePath = basePath.slice(prefix.length);
        break;
      }
    }
    basePath = basePath.replace(/index\.md$/, "").replace(/\.md$/, "");

    for (const { lang, prefix } of localePrefixes) {
      const href = `${SITE_URL}/${prefix}${basePath}`.replace(/\/$/, "") || SITE_URL;
      pageData.frontmatter.head.push(["link", { rel: "alternate", hreflang: lang, href }]);
    }
    // x-default points to the English version
    const defaultHref = `${SITE_URL}/${basePath}`.replace(/\/$/, "") || SITE_URL;
    pageData.frontmatter.head.push(["link", { rel: "alternate", hreflang: "x-default", href: defaultHref }]);
  },

  locales: {
    root: enLocale,
    zh:   zhLocale,
    ru:   ruLocale,
    ja:   jaLocale,
    pt:   ptLocale,
    ko:   koLocale,
    es:   esLocale,
  },

  themeConfig: {
    logo: {
      light: "/logo/light.svg",
      dark:  "/logo/dark.svg",
    },
    siteTitle: false,
    socialLinks: [{ icon: "github", link: "https://github.com/kiyasov/nestelia" }],
    search: { provider: "local" },
  },

  vite: {
    define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
    plugins: [tailwindcss()],
    resolve: {
      alias: [{
        find: /^.*\/VPNavBarSearch\.vue$/,
        replacement: fileURLToPath(new URL("./theme/navbar-search.vue", import.meta.url)),
      }],
    },
  },

  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
  },
});
