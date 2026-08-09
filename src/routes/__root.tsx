import { Footer } from "@/components/footer";
import { SeoMetadata } from "@/components/seo-metadata";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

function Root() {
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
});
