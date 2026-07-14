# AGENTS.md

**Audience: coding agents** (loaded every turn). Keep this file lean — target ~15–30 lines after tailoring. Humans: onboarding, maps, and next steps live in `HARNESS.md` only.

> Cross-tool static context for Cursor, Codex, Claude Code, and Google Antigravity 2.0. Antigravity also loads `GEMINI.md` — keep that thin; rules live here.

## Project

- **What this is:** <one-line description>
- **Stack:** unknown
- **Package manager:** <npm / pnpm / uv / pip / cargo / go ...>

## Commands

- **Install:** `(none)` | **Build:** `(none)` | **Test:** `(none)` | **Lint:** `(none)` | **Run:** `(none)`

## Verification (run before saying done)

- **Full check:** `./scripts/check.sh` (or `scripts\check.ps1` on Windows)
- **Tests only:** `(none)` | **Lint:** `(none)`

## Conventions

- Match existing style; surgical edits only; minimum code for the request.

## Hard rules

- No hardcoded secrets — use environment variables.
- No direct commits to `main`; no force-push on shared branches.
- Failing test before bug fix; keep the repro in the suite.
- Tests/evals before implementation for non-trivial work.
- No production data via MCP; dev/obfuscated data, read-only where possible.
- New rules: add one line here + record why in `harness/decisions/` (see ADR-0001 for MCP).

## Workflow

1. Think first; ask if ambiguous.
2. **Read** `harness/PROGRESS.md` at session start; **update** it before ending.
3. **Spec:** small/scoped change → `specs/micro-spec.md`; new feature/API → `specs/feature-template.spec.md`.
4. Implement; run verification (below).
5. Small, reviewable diffs.

## Skills

Load from `.agents/skills/` when the task matches:

| Skill | Tier | Use for |
|-------|------|---------|
| `code-review` | read-only | PR/diff review |
| `changelog-draft` | draft-only | CHANGELOG drafts (human commits) |
| `run-tests` | action-allowed (narrow) | run test command only, no code edits |
| `harness-audit` | read-only | audit harness completeness before autonomous runs |

Human docs: `HARNESS.md`. Completion: `harness/COMPLETION-CHECKLIST.md`. Validator: `python harness/scripts/validate_harness.py`. Rule history: `harness/CHANGELOG.md`, `harness/decisions/`.
