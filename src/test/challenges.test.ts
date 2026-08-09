import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { challenges, getIndexablePages, getPageMetadata, getSocialImageUrl, NOT_FOUND_DESCRIPTION } from "../challenges";

const SITE_URL = "https://example.com";
const indexablePages = getIndexablePages(SITE_URL);

describe("challenge metadata", () => {
  it("has one manifest entry for every puzzle route", () => {
    const routeDirectory = path.resolve(__dirname, "../routes");
    const puzzleRoutes = fs
      .readdirSync(routeDirectory)
      .filter((filename) => filename.endsWith(".tsx") && !["__root.tsx", "index.tsx"].includes(filename))
      .map((filename) => `/${filename.replace(/\.tsx$/, "")}`)
      .sort();
    const manifestRoutes = challenges.map((challenge) => challenge.href).sort();

    expect(manifestRoutes).toEqual(puzzleRoutes);
  });

  it("provides unique indexable metadata for the homepage and every puzzle", () => {
    expect(indexablePages).toHaveLength(challenges.length + 1);
    expect(new Set(indexablePages.map((page) => page.path)).size).toBe(indexablePages.length);
    expect(new Set(indexablePages.map((page) => page.title)).size).toBe(indexablePages.length);
    expect(new Set(indexablePages.map((page) => page.description)).size).toBe(indexablePages.length);

    for (const page of indexablePages) {
      expect(page.canonicalUrl).toBe(page.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.path}`);
      expect(page.description.length).toBeGreaterThanOrEqual(100);
      expect(page.robots).toBe("index, follow, max-image-preview:large");
    }
  });

  it("generates every absolute URL from the supplied site URL", () => {
    expect(indexablePages[0].canonicalUrl).toBe("https://example.com/");
    expect(indexablePages[1].canonicalUrl).toBe("https://example.com/murder_mystery_i");
    expect(getSocialImageUrl(SITE_URL)).toBe("https://example.com/web-app-manifest-512x512.png");
  });

  it("marks missing pages as non-indexable", () => {
    expect(getPageMetadata("/missing-case", SITE_URL)).toEqual({
      path: "/missing-case",
      title: "Page Not Found | SQL Cold Cases",
      description: NOT_FOUND_DESCRIPTION,
      canonicalUrl: "https://example.com/missing-case",
      robots: "noindex, nofollow",
    });
  });
});
