# SQL Cold Cases

SQL Cold Cases is an interactive puzzle app for practicing SQL investigations. Players inspect a schema, query a SQLite database in the browser, and follow evidence through a series of suspects until they solve each case.

The app is built with React, TypeScript, Vite, TanStack Router, `sql.js`, React Flow, and Vitest.

## Features

- Browser-based SQL editor and query runner
- Interactive schema visualizations
- Seven mystery challenges across three themed databases
- Multi-step investigations with clue-driven decoys
- Automated tests for every intended solution chain

## Getting started

Requirements:

- Node.js 18 or later
- pnpm

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Verification

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

## Project structure

```text
src/
  challenges.ts    Shared puzzle routes and SEO metadata
  components/       Shared challenge and UI components
  hooks/            SQLite database loading
  routes/           Puzzle routes and accepted answers
  schema/           Schema visualization metadata
  test/             Puzzle validation tests
public/database/    SQLite databases loaded by the app
docs/solutions.md   Complete puzzle walkthroughs and spoilers
```

The databases are static `.db` files loaded in the browser through `src/hooks/use-database.ts`. Related challenges may share the same themed database.

## Adding or changing a challenge

Puzzle behavior is spread across several artifacts that must remain synchronized:

1. Add the puzzle title, route, and description to `src/challenges.ts`.
2. Add or update the relevant database in `public/database/`.
3. Update its visualization metadata in `src/schema/` when the schema changes.
4. Add or update the route in `src/routes/`.
5. Add deterministic solution-path tests in `src/test/`.
6. Update the walkthrough in `docs/solutions.md`.

Production builds generate route-specific HTML metadata, `sitemap.xml`, and `robots.txt` from `src/challenges.ts` automatically. On Vercel, canonical and social URLs use `VERCEL_PROJECT_PRODUCTION_URL`; local builds fall back to `sql.cold-cases.xyz`.

Each complete clue set should produce one intended answer, while partial queries may still encounter plausible decoys. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [AGENTS.md](AGENTS.md) for repository working conventions.

## Acknowledgments

This project was inspired by the original [SQL Murder Mystery](https://mystery.knightlab.com/).

## License

See [LICENSE](LICENSE).
