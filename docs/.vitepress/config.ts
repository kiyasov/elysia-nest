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
  ],

  // Inject per-page canonical URL and dynamic og:title
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
