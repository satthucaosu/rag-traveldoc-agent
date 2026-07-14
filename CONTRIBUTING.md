# Contributing

This project uses an **agentic harness** so humans and coding agents share the same rules, specs, and verification loop.

## Before you start

1. Read **`HARNESS.md`** (humans) or **`AGENTS.md`** (agents).
2. Run **`./scripts/bootstrap.sh`** once after clone (standard/strict), or install deps per `AGENTS.md`.
3. Pick a spec template in **`specs/`** — micro-spec for small work, feature template for larger changes.

## Workflow

1. **Spec** — write or update a spec in `specs/` before non-trivial implementation.
2. **Evals** — add or update cases in `evals/evalset.json` when behavior should be regression-tested.
3. **Implement** — match existing style; keep diffs small and reviewable.
4. **Verify** — run `./scripts/check.sh` (or `scripts\check.ps1` on Windows) before opening a PR.
5. **Progress** — agents update `harness/PROGRESS.md` each session; humans clear blockers promptly.

## Pull requests

- Link the spec: `specs/<file>.md`
- Confirm verification: paste `./scripts/check.sh` result or CI link
- Note risk: breaking changes, migrations, new dependencies
- Use the PR template (strict tier: `.github/pull_request_template.md`)

## When the agent misbehaves

1. Add one **hard rule** line to `AGENTS.md`.
2. Record **why** in `harness/decisions/` (ADR).
3. Log in `harness/CHANGELOG.md`.
4. Add an **eval case** if the failure should not recur.

## Harness tiers

See `harness/TIER.md` for which tier this repo was scaffolded with (`lite` | `standard` | `strict`).
