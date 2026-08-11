import { useEffect } from "react";
import { Footer } from "@/components/footer";
import { NotFound } from "@/components/not-found";
import { SeoMetadata } from "@/components/seo-metadata";
import { initializeAnalytics } from "@/lib/analytics";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

function Root() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <>
      <SeoMetadata />
      <main className="mx-auto flex-1 p-4 md:w-4/5 md:p-6">
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

