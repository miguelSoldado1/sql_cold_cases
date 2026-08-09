# Repository guidance

These instructions apply to the entire repository.

## Project overview

SQL Cold Cases is a client-side React and TypeScript puzzle app. TanStack Router provides file-based routes, `sql.js` loads the SQLite databases in the browser, and Vitest validates each investigation path.

Important locations:

- `src/routes/`: puzzle pages and accepted solutions.
- `src/schema/`: schema visualizations shown to players.
- `src/test/`: puzzle validation tests.
- `public/database/`: SQLite databases used by the puzzles.
- `docs/solutions.md`: spoiler-heavy clue and query walkthroughs.

## Working conventions

- Follow the existing TypeScript, React, and route patterns.
- Preserve unrelated changes in the worktree.
- Treat the SQLite files, player-facing clues, accepted solutions, tests, and `docs/solutions.md` as one synchronized puzzle definition.
- When a puzzle changes, verify every clue against the actual database rather than relying only on an existing solution query.
- Do not introduce a new database or table unless the requested puzzle design requires it. Existing themes share databases.
- Keep spoilers out of the README, route introductions, and other player-facing overview material.

## Puzzle invariants

- Applying every clue in a solution step must identify exactly one intended person.
- Add plausible decoys so a naive single-filter query is insufficient, but ensure the complete clue set remains deterministic.
- Every clue must be SQL-addressable through visible tables and columns.
- Tests must use only information available to the player.
- Tests must encode every material clue, including dates, counts, locations, and requirements such as matching both of two signatures.
- Prefer `COUNT(DISTINCT ...)` when joins can multiply rows.
- Keep clue text plain and direct. Explain encoded integer dates or timestamps when they may be unclear.

## Verification

Use the smallest relevant check while iterating, then run the full suite before handoff when puzzle behavior changes:

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

For database changes, also run the intended queries directly against the affected `.db` file and confirm both uniqueness and relevant decoy behavior.
