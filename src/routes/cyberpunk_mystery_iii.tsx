import { getChallenge } from "@/challenges";
import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/cyberpunk_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const { title: TITLE } = getChallenge("/cyberpunk_mystery_iii");

function CyberpunkMysteryIII() {
  const db = useDatabase("/database/cyberpunk_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          The Mirror Array in Neo-Tokyo was hijacked during a blackout, and the case file is missing the key specifics. You
          remember that the incident was a <strong>breach</strong> that occurred on <strong>March 12, 2147</strong> and that
          it took place in <strong>Sector 6</strong>. Start by retrieving the incident report to recover the details, then
          use device telemetry, implant records, and interrogation logs to identify the runner, the insider, and the
          executive sponsor.
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
          <SqlQueryTitle>Find who hijacked the Mirror Array</SqlQueryTitle>
          <SqlQueryDescription>
            Trace the runner, then use the interrogation logs to identify the insider and the executive sponsor.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SolutionInput solutions={solutions} />
    </section>
  );
}

const solutions: Solution[] = [
  {
    solution: "nyx arclight",
    text: "Nice work. Now check Nyx Arclight’s interrogation logs to find the insider who paid for the breach.",
    final: false,
  },
  {
    solution: "keira voss",
    text: "Good catch. Keira Voss was the insider. Next, read her interrogation notes to uncover who funded the operation.",
    final: false,
  },
  {
    solution: "dr. solene korr",
    text: "Case closed. Dr. Solene Korr funded the Mirror Array breach and orchestrated the overwrite.",
    final: true,
  },
];

export const Route = createFileRoute("/cyberpunk_mystery_iii")({ component: CyberpunkMysteryIII });
