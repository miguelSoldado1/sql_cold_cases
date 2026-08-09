import { NOT_FOUND_ACTION, NOT_FOUND_DESCRIPTION, NOT_FOUND_HEADING } from "@/challenges";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <section className="space-y-4 py-8">
      <h1 className="text-2xl font-semibold md:text-3xl">{NOT_FOUND_HEADING}</h1>
      <p>{NOT_FOUND_DESCRIPTION}</p>
      <Link to="/" className="inline-block text-primary underline hover:text-muted-foreground">
        {NOT_FOUND_ACTION}
      </Link>
    </section>
  );
}
