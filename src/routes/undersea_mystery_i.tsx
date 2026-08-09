import { getChallenge } from "@/challenges";
import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/undersea_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const { title: TITLE } = getChallenge("/undersea_mystery_i");

function UnderseaMysteryI() {
  const db = useDatabase("/database/undersea_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          A replacement pump never arrived, and the station is humming a worried tune after an alleged <strong>theft</strong>
          {"."} Begin by locating the incident report dated <strong>July 18, 2091</strong>. Once you have the report, follow its
          clues through the access logs, work orders, interrogation logs, and override approvals to identify the onsite actor,
          the Logistics Tech who submitted the manifest edit, and the Senior Engineer who signed off on the overrides. Pay
          close attention to timestamps and change notes; they reveal the chain of responsibility and the small inconsistencies
          that point to the real culprit.
        </HeaderDescription>
        <SchemaVisualizer initialNodes={initialNodes} initialEdges={initialEdges} />
      </HeaderWrapper>
      <SqlQuery db={db} defaultValue="SELECT name FROM sqlite_master WHERE type = 'table'">
        <SqlQueryHeader>
          <SqlQueryTitle>Run this query to find the names of the tables in this database</SqlQueryTitle>
          <SqlQueryDescription>
            This command is specific to SQLite. For other databases, you&apos;ll have to learn their specific syntax.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SqlQuery db={db} defaultValue="SELECT sql FROM sqlite_master WHERE name = 'incident_report'">
        <SqlQueryHeader>
          <SqlQueryTitle>Find the structure of the `incident_report` table</SqlQueryTitle>
          <SqlQueryDescription>
            This command is specific to SQLite. For other databases, you&apos;ll have to learn their specific syntax.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SqlQuery db={db}>
        <SqlQueryHeader>
          <SqlQueryTitle>Find who swapped the cargo label</SqlQueryTitle>
          <SqlQueryDescription>
            Follow the direct clues to uncover the cargo handler, the logistics tech who edited the manifest, and the senior
            engineer who approved the overrides.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SolutionInput solutions={solutions} />
    </section>
  );
}

const solutions: Solution[] = [
  {
    solution: "mira alcott",
    text: "Good start. Now use Mira's interrogation transcript to find the Logistics Tech in Module C-1 who filed the manifest edit for the shipment.",
    final: false,
  },
  {
    solution: "jonas pike",
    text: "You found the handler. Next, use Jonas's transcript to identify the Senior Engineer who approved two expedite overrides for Intake Bay A that week.",
    final: false,
  },
  {
    solution: "avery holt",
    text: "Case closed. The cargo mislabel was ordered from above, and you traced the approvals back to Avery Holt.",
    final: true,
  },
];

export const Route = createFileRoute("/undersea_mystery_i")({ component: UnderseaMysteryI });
