import { useEffect } from "react";
import { getPageMetadata, getSocialImageUrl } from "@/challenges";
import { useRouterState } from "@tanstack/react-router";

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

export function SeoMetadata() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const canonicalUrl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;

    if (!canonicalUrl) {
      throw new Error("Missing canonical URL metadata");
    }

    const siteUrl = new URL(canonicalUrl).origin;
    const metadata = getPageMetadata(pathname, siteUrl);
    const socialImageUrl = getSocialImageUrl(siteUrl);

    document.title = metadata.title;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", metadata.canonicalUrl);

    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[name="robots"]', metadata.robots);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[property="og:url"]', metadata.canonicalUrl);
    setMetaContent('meta[property="og:image"]', socialImageUrl);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
    setMetaContent('meta[name="twitter:image"]', socialImageUrl);
  }, [pathname]);

  return null;
}
