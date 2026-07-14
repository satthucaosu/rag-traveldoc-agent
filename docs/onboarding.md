# Team onboarding (~15 minutes)

Welcome. This repo is set up for **humans + coding agents** to work from the same playbook.

## 1. Read the map (5 min)

| Doc | Who | Purpose |
|-----|-----|---------|
| `HARNESS.md` | You | What was scaffolded, phases, checklists |
| `AGENTS.md` | Agents | Stack, commands, rules — keep lean |
| `CONTRIBUTING.md` | Everyone | PR workflow, spec-first habit |
| `harness/TIER.md` | Everyone | lite / standard / strict for this repo |

## 2. Set up locally (5 min)

```bash
./scripts/bootstrap.sh    # standard/strict — install + smoke check
# or manually: see Install in AGENTS.md, then ./scripts/check.sh
```

## 3. First task with an agent (5 min)

1. Copy `specs/micro-spec.md` → `specs/my-first-task.spec.md` and fill Goal + Definition of done.
2. Point the agent at the spec and `AGENTS.md`.
3. Agent runs `./scripts/check.sh` and updates `harness/PROGRESS.md`.
4. Run `python harness/scripts/validate_harness.py` — fix blockers.

## Strict tier extras

- `pre-commit install` after clone
- CI runs on push (`.github/workflows/harness-check.yml`)
- PRs use `.github/pull_request_template.md`

## Questions?

Run the **`harness-audit`** skill or see `harness/COMPLETION-CHECKLIST.md`.
