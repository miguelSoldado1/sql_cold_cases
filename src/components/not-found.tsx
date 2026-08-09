import { NOT_FOUND_ACTION, NOT_FOUND_DESCRIPTION, NOT_FOUND_HEADING, NOT_FOUND_LABEL } from "@/challenges";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <section className="relative mx-auto flex min-h-[65vh] max-w-3xl items-center overflow-hidden py-16">
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,28vw,18rem)] font-black leading-none text-muted"
      >
        404
      </div>
      <div className="relative max-w-xl">
        <p className="mb-8 inline-flex border-y border-foreground/20 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {NOT_FOUND_LABEL}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{NOT_FOUND_HEADING}</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">{NOT_FOUND_DESCRIPTION}</p>
        <Button asChild className="mt-8">
          <Link to="/">{NOT_FOUND_ACTION}</Link>
        </Button>
      </div>
    </section>
  );
}
