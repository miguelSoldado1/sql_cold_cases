import { getChallenge } from "@/challenges";
import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/cyberpunk_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const { title: TITLE } = getChallenge("/cyberpunk_mystery_i");

function CyberpunkMystery() {
  const db = useDatabase("/database/cyberpunk_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          In the neon-lit sprawl of Neo-Tokyo, a high-tech heist has shaken the corporate elite. The AI Core has been stolen
          from the secure vault on February 20, 2147. Dive into the database to uncover the hacker, the insider, and the
          mastermind behind this cyberpunk conspiracy. Below is the schema diagram for this database.
        </HeaderDescription>
        <SchemaVisualizer initialNodes={initialNodes} initialEdges={initialEdges} />
      </HeaderWrapper>
      <SqlQuery db={db} defaultValue="SELECT name FROM sqlite_master WHERE type = 'table'">
        <SqlQueryHeader>
          <SqlQueryTitle>Run this query to find the names of the tables in this database</SqlQueryTitle>
          <SqlQueryDescription>
            This command is specific to SQLite. For other databases, you'll have to learn their specific syntax.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SqlQuery db={db} defaultValue="SELECT sql FROM sqlite_master WHERE name = 'incident_report'">
        <SqlQueryHeader>
          <SqlQueryTitle>Find the structure of the `incident_report` table</SqlQueryTitle>
          <SqlQueryDescription>
            This command is specific to SQLite. For other databases, you'll have to learn their specific syntax.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SqlQuery db={db}>
        <SqlQueryHeader>
          <SqlQueryTitle>Find who stole the AI Core</SqlQueryTitle>
          <SqlQueryDescription>When you think you know the answer, go to the next section.</SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SolutionInput solutions={solutions} />
    </section>
  );
}

const solutions: Solution[] = [
  {
    solution: "jax nova",
    text: "Congrats, you found the hacker! But wait, there's more... If you think you're up for a challenge, try querying the interrogation transcripts to find the insider who helped. If you feel especially confident in your SQL skills, try to complete this final step with no more than 2 queries.",
    final: false,
  },
  {
    solution: "lira kane",
    text: "Congrats, you found the insider! But the mystery continues... There's still the executive mastermind. Keep digging through the data.",
    final: false,
  },
  {
    solution: "dr. vex",
    text: "Congrats, you found the executive mastermind behind the AI Core theft! Everyone in Neo-Tokyo hails you as the greatest cyber detective of all time. Time to break out the synth-whiskey!",
    final: true,
  },
];

export const Route = createFileRoute("/cyberpunk_mystery_i")({ component: CyberpunkMystery });
