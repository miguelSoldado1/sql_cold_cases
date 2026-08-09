import fs from "node:fs";
import path from "path";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
  getIndexablePages,
  getPageMetadata,
  getSocialImageUrl,
  NOT_FOUND_ACTION,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HEADING,
} from "./src/challenges";
import type { Plugin, ResolvedConfig } from "vite";

const fallbackProductionHost = "sql.cold-cases.xyz";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || fallbackProductionHost;
const siteUrl = `https://${productionHost}`;
const indexablePages = getIndexablePages(siteUrl);
const socialImageUrl = getSocialImageUrl(siteUrl);

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceHeadTag(html: string, pattern: RegExp, replacement: string, tagName: string) {
  if (!pattern.test(html)) {
    throw new Error(`Unable to find ${tagName} in the built HTML template`);
  }

  return html.replace(pattern, replacement);
}

function renderPageShell(template: string, page: (typeof indexablePages)[number]) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonicalUrl = escapeHtml(page.canonicalUrl);
  const robots = escapeHtml(page.robots);
  const escapedSocialImageUrl = escapeHtml(socialImageUrl);

  const replacements: Array<[RegExp, string, string]> = [
    [/<title>.*?<\/title>/, `<title>${title}</title>`, "title"],
    [/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`, "description"],
    [/<link\s+rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`, "canonical link"],
    [/<meta\s+name="robots"[^>]*\/>/, `<meta name="robots" content="${robots}" />`, "robots metadata"],
    [/<meta\s+property="og:title"[^>]*\/>/, `<meta property="og:title" content="${title}" />`, "Open Graph title"],
    [
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${description}" />`,
      "Open Graph description",
    ],
    [/<meta\s+property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`, "Open Graph URL"],
    [
      /<meta\s+property="og:image"[^>]*\/>/,
      `<meta property="og:image" content="${escapedSocialImageUrl}" />`,
      "Open Graph image",
    ],
    [/<meta\s+name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${title}" />`, "Twitter title"],
    [
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${description}" />`,
      "Twitter description",
    ],
    [
      /<meta\s+name="twitter:image"[^>]*\/>/,
      `<meta name="twitter:image" content="${escapedSocialImageUrl}" />`,
      "Twitter image",
    ],
  ];

  return replacements.reduce(
    (html, [pattern, replacement, tagName]) => replaceHeadTag(html, pattern, replacement, tagName),
    template
  );
}

function renderNotFoundShell(template: string) {
  const notFoundPage = getPageMetadata("/404", siteUrl);
  const pageShell = renderPageShell(template, notFoundPage);
  const rootPattern = /<div id="root"><\/div>/;

  if (!rootPattern.test(pageShell)) {
    throw new Error("Unable to find the app root in the built HTML template");
  }

  const staticContent = `<div id="root">
      <main class="mx-auto flex-1 p-4 md:w-4/5 md:p-6">
        <section class="space-y-4 py-8">
          <h1 class="text-2xl font-semibold md:text-3xl">${escapeHtml(NOT_FOUND_HEADING)}</h1>
          <p>${escapeHtml(NOT_FOUND_DESCRIPTION)}</p>
          <a class="inline-block text-primary underline hover:text-muted-foreground" href="/">${escapeHtml(NOT_FOUND_ACTION)}</a>
        </section>
      </main>
    </div>`;

  return pageShell.replace(rootPattern, staticContent);
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderSitemap() {
  const urls = indexablePages.map((page) => `  <url>\n    <loc>${escapeXml(page.canonicalUrl)}</loc>\n  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function staticSeoPages(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "static-seo-pages",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", escapeHtml(siteUrl));
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestPath = request.url?.split("?", 1)[0];

        if (requestPath === "/sitemap.xml") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/xml; charset=utf-8");
          response.end(renderSitemap());
          return;
        }

        if (requestPath === "/robots.txt") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end(renderRobots());
          return;
        }

        next();
      });
    },
    closeBundle() {
      if (config.command !== "build") return;

      const outputDirectory = path.resolve(config.root, config.build.outDir);
      const indexPath = path.join(outputDirectory, "index.html");
      const template = fs.readFileSync(indexPath, "utf8");

      for (const page of indexablePages) {
        const outputPath = page.path === "/" ? indexPath : path.join(outputDirectory, `${page.path.slice(1)}.html`);
        fs.writeFileSync(outputPath, renderPageShell(template, page));
      }

      fs.writeFileSync(path.join(outputDirectory, "404.html"), renderNotFoundShell(template));
      fs.writeFileSync(path.join(outputDirectory, "sitemap.xml"), renderSitemap());
      fs.writeFileSync(path.join(outputDirectory, "robots.txt"), renderRobots());
    },
  };
}

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), staticSeoPages()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
