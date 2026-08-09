# Contributing to SQL Cold Cases

Thanks for contributing. Start with the setup and project overview in [README.md](README.md).

## Development workflow

1. Create a focused branch from `main`.
2. Make the smallest coherent change needed.
3. Add or update tests for behavioral changes.
4. Run the relevant checks locally.
5. Open a pull request describing the change and how it was verified.

Keep pull requests focused and link related issues when applicable. Preserve the existing TypeScript and React style instead of introducing unrelated refactors.

## Puzzle changes

A puzzle spans its database records, route copy, accepted solutions, schema visualization, tests, and solution walkthrough. Update every affected artifact together.

When designing a clue chain:

- Make the full set of clues resolve to exactly one intended person.
- Include plausible decoys that are eliminated by later clues.
- Ensure every clue maps to visible database fields.
- Avoid hidden assumptions in tests or solution queries.
- Check counts after joins for accidental row multiplication.
- Keep encoded dates and timestamps understandable to players.

Related challenges currently share themed databases, so inspect existing records before adding IDs, names, or story events. Avoid collisions with other puzzles and confirm that new decoys do not invalidate an existing solution.

## Required checks

Run the full verification suite before submitting puzzle or application changes:

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

For database changes, run the intended SQL directly against the affected `.db` file and verify that each step returns the expected unique answer.

Complete solution walkthroughs belong in `docs/solutions.md`, not in player-facing route introductions or the README.
