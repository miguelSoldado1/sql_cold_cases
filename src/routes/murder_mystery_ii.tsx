import { getChallenge } from "@/challenges";
import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/murder_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const { title: TITLE } = getChallenge("/murder_mystery_ii");

function MurderMysteryII() {
  const db = useDatabase("/database/murder_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          Another crime has occurred and the detective needs your help once again. You've been handed a case file, but some
          crucial details are missing. You remember that the <strong>crime was a murder</strong> that occurred on
          <strong> Jan.14, 2018</strong> and that <strong>it took place in SQL City</strong>. The victim was found at the Get
          Fit Now gym, and witnesses were present during the incident. Start by retrieving the corresponding crime scene
          report from the police department's database.
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
      <SqlQuery db={db} defaultValue="SELECT sql FROM sqlite_master WHERE name = 'crime_scene_report'">
        <SqlQueryHeader>
          <SqlQueryTitle>Find the structure of the `crime_scene_report` table</SqlQueryTitle>
          <SqlQueryDescription>
            This command is specific to SQLite. For other databases, you'll have to learn their specific syntax.
          </SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SqlQuery db={db}>
        <SqlQueryHeader>
          <SqlQueryTitle>Find who committed the murder</SqlQueryTitle>
          <SqlQueryDescription>When you think you know the answer, go to the next section.</SqlQueryDescription>
        </SqlQueryHeader>
      </SqlQuery>
      <SolutionInput solutions={solutions} />
    </section>
  );
}

const solutions: Solution[] = [
  {
    solution: "derek johnson",
    text: "Well done! You've identified the murderer. But the case isn't over yet... For an extra challenge, examine the interview transcript of Derek Johnson to uncover the true mastermind. If you’re feeling ambitious, try to solve this final mystery in just two queries.",
    final: false,
  },
  {
    solution: "victoria stone",
    text: "Outstanding detective work! You've solved the case through methodical investigation. Victoria Stone was the mastermind who orchestrated Ryan Fletcher's murder using Derek Johnson as her accomplice. She exploited Derek's financial desperation, used her business connections to gather intelligence, and leveraged her gym membership to coordinate the crime. The SQL City Police Department commends your analytical skills!",
    final: true,
  },
];

export const Route = createFileRoute("/murder_mystery_ii")({ component: MurderMysteryII });
