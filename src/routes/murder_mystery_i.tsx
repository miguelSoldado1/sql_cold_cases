import { HeaderBreadcrumb, HeaderDescription, HeaderWrapper } from "@/components/challenge-header";
import { SchemaVisualizer } from "@/components/schema-visualiser";
import { SolutionInput } from "@/components/solution-input";
import { SqlQuery, SqlQueryDescription, SqlQueryHeader, SqlQueryTitle } from "@/components/sql-query";
import { useDatabase } from "@/hooks/use-database";
import { initialEdges, initialNodes } from "@/schema/murder_mystery";
import { createFileRoute } from "@tanstack/react-router";
import type { Solution } from "@/types";

const TITLE = "SQL Murder Mystery I";

function MurderMysteryI() {
  const db = useDatabase("/database/murder_mystery.db");

  return (
    <section className="space-y-12">
      <HeaderWrapper>
        <HeaderBreadcrumb>{TITLE}</HeaderBreadcrumb>
        <h1 className="sr-only">{TITLE}</h1>
        <HeaderDescription>
          A crime has taken place and the detective needs your help. The detective gave you the crime scene report, but you
          somehow lost it. You vaguely remember that the <strong>crime was a murder</strong> that occurred sometime on
          <strong> Jan.15, 2018</strong> and that <strong>it took place in SQL City</strong>. Start by retrieving the
          corresponding crime scene report from the police department's database. Below is the schema diagram for this
          database.
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
    solution: "jeremy bowers",
    text: "Congrats, you found the murderer! But wait, there's more... If you think you're up for a challenge, try querying the interview transcript of the murderer to find the real villain behind this crime. If you feel especially confident in your SQL skills, try to complete this final step with no more than 2 queries. Enter your new suspect in the solution field to check your answer.",
    final: false,
  },
  {
    solution: "miranda priestly",
    text: "Congrats, you found the brains behind the murder! Everyone in SQL City hails you as the greatest SQL detective of all time. Time to break out the champagne!",
    final: true,
  },
];

export const Route = createFileRoute("/murder_mystery_i")({
  component: MurderMysteryI,
  beforeLoad: () => {
    document.title = TITLE;
  },
});
