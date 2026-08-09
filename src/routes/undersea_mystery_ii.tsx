import { getChallenge } from "@/challenges";
import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/undersea_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const { title: TITLE } = getChallenge("/undersea_mystery_ii");

function UnderseaMysteryII() {
  const db = useDatabase("/database/undersea_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          Deep Horizon Station experienced catastrophic life support failure, and you&apos;ve been handed an incomplete case
          file. You vaguely remember that the incident was a <strong>sabotage</strong> that occurred on{" "}
          <strong>August 25, 2091</strong> in <strong>Module D-7</strong>. Start by retrieving the incident report from the
          station&apos;s database. The report mentions two witnesses who were present during the critical window. Find them,
          interview them, and follow the evidence chain to identify both the perpetrator and the mastermind behind the
          sabotage.
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
          <SqlQueryTitle>Find the witnesses and trace the evidence</SqlQueryTitle>
          <SqlQueryDescription>
            The incident report describes two witnesses. Find them first, then use their testimonies to identify the
            perpetrator, and finally uncover the mastermind who authorized the sabotage.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SolutionInput solutions={solutions} />
    </section>
  );
}

const solutions: Solution[] = [
  {
    solution: "kira voss",
    text: "You found the first witness. Now find the second witness - a Systems Engineer in Module E-2 who filed exactly 2 diagnostic reports for Module D-7 on August 25, 2091.",
    final: false,
  },
  {
    solution: "ren nakamura",
    text: "Both witnesses identified. Check their interrogation transcripts to piece together clues about the perpetrator - a Senior Tech who bypassed safety systems.",
    final: false,
  },
  {
    solution: "felix crane",
    text: "You identified the perpetrator. Now check Felix's interrogation transcript to find the mastermind - the Station Director who authorized all the overrides.",
    final: false,
  },
  {
    solution: "dr. iris kane",
    text: "Excellent work! You've uncovered the full conspiracy. Dr. Iris Kane authorized the overrides that enabled Felix Crane to sabotage the life support systems, as witnessed by Kira Voss and Ren Nakamura.",
    final: true,
  },
];

export const Route = createFileRoute("/undersea_mystery_ii")({ component: UnderseaMysteryII });
