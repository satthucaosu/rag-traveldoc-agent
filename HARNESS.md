# Harness (human guide)

**Audience: developers and tech leads** — not loaded by agents every turn. Operational rules agents need live in `AGENTS.md` only.

`Agent = Model + Harness`. This document explains what was scaffolded, how to onboard, and how to evolve the harness over time.

---

## Harness tiers

Choose at scaffold time (`--tier`). Recorded in `harness/TIER.md`.

| Tier | Best for | Scaffolds |
|------|----------|-----------|
| **lite** | Solo spike, hackathon | `AGENTS.md`, micro-spec, `scripts/check.*`, validator |
| **standard** | Team default | lite + skills, evals, guardrails, `PROGRESS.md`, bootstrap, env pins, onboarding |
| **strict** | Production / regulated | standard + CI workflow, pre-commit, devcontainer, PR template |

```bash
python scripts/scaffold_harness.py --target . --tier lite
python scripts/scaffold_harness.py --target . --tier standard --seed-first-task
python scripts/scaffold_harness.py --target . --tier strict --seed-first-task
```

---

## How to use this harness (before, during, after a project)

The harness turns ad-hoc AI prompting into a shared **factory**: specs define what to build, evals define what “correct” means, skills encode repeatable workflows, and guardrails block unsafe actions. Your role shifts from typing code to **architecting specs, reviewing outcomes, and evolving the harness**.

| Phase | What the harness gives you | What you and the team should do |
|-------|---------------------------|--------------------------------|
| **Before** | Common rules (`AGENTS.md`), spec templates, eval scaffold, validator, audit skill | Run `setup-harness` → tailor `AGENTS.md` → write first spec + real eval cases → `python harness/scripts/validate_harness.py` → `harness-audit` → enable sandbox / MCP checklist if needed |
| **During** | Spec-driven builds, feedback loop (code → test/eval → fix), tiered skills, hard rules + ADRs when the agent misbehaves | Per task: spec in `specs/` → eval cases → point the agent at the spec → review PR (`code-review` skill) → add hard rules + ADR only when something repeats |
| **After** | Reusable harness, audit trail (`harness/decisions/`), regression evals, portable patterns for the next project | Ship spec as done → add production bugs to evals → periodic `validate_harness.py` + `harness-audit` → retro on `harness/CHANGELOG.md` → scaffold harness into new repos |

**Harness complete** (ready for controlled agentic work): validator exits with no blockers, `harness-audit` reports no blockers, and at least one real task passed eval. This is not “fully autonomous forever” — humans still own ambiguous requirements, architecture trade-offs, merges to `main`, and high-stakes actions (deploy, DB migrations) per `guardrails/policies.yaml`.

**Three check layers** (use throughout all phases): human checklist → `harness/COMPLETION-CHECKLIST.md` · structural gate → `harness/scripts/validate_harness.py` · semantic review → `harness-audit` skill.

---

## Agent vs human docs

| File | Who reads it | Purpose |
|------|----------------|---------|
| `AGENTS.md` | Agent, every session (all tools) | Stack, commands, verification, hard rules, workflow, skills index |
| `GEMINI.md` | Antigravity always-loaded layer | Thin pointer to `AGENTS.md`; Antigravity-only rules only |
| `CLAUDE.md` | Claude Code always-loaded layer | Thin pointer to `AGENTS.md`; Claude-only rules only |
| `HARNESS.md` | Humans | Map, onboarding, tiers, MCP checklist, ADR process |
| `CONTRIBUTING.md` | Humans | PR workflow, spec-first, agent collaboration norms |
| `docs/onboarding.md` | Humans | 15-minute team onboarding |
| `harness/PROGRESS.md` | Agent + humans | Session handoff: done / in progress / blocked |
| `harness/TIER.md` | Everyone | lite / standard / strict for this repo |
| `harness/CHANGELOG.md` | Humans | History of harness/rule changes |
| `harness/decisions/` | Humans | Short ADRs — why each rule exists |

Do not duplicate long explanations in `AGENTS.md`; link here instead.

## What was scaffolded

| Artifact | Path | Role |
|----------|------|------|
| Agent rules | `AGENTS.md` | Static context (always loaded; auto-tailored from stack) |
| Tool pointers | `GEMINI.md`, `CLAUDE.md` | Thin always-loaded layers |
| Team docs | `HARNESS.md`, `CONTRIBUTING.md`, `docs/onboarding.md` | Human onboarding and PR norms |
| Session state | `harness/PROGRESS.md` | Multi-session task continuity |
| Verification | `scripts/check.sh`, `scripts/check.ps1` | Unified test/lint/build gate |
| Environment | `scripts/bootstrap.*`, `.python-version`, `.nvmrc` | Reproducible first-run setup |
| Specs | `specs/micro-spec.md`, `specs/feature-template.spec.md` | Light vs full spec-driven dev |
| Skills | `.agents/skills/` | Procedural memory (starter tiers + harness-audit) |
| Evals | `evals/` | What "correct" means |
| Guardrails | `guardrails/` | Policies, sandbox, HITL |
| Harness history | `harness/CHANGELOG.md`, `harness/decisions/` | Versioning and ADRs |
| Completion | `harness/COMPLETION-CHECKLIST.md` | Phase A/B/C human checklist |
| Validator | `harness/scripts/validate_harness.py` | Structural harness gate (CI-friendly) |
| Tools | `mcp/` | MCP templates + connection checklist |
| Strict extras | `.github/workflows/harness-check.yml`, `.pre-commit-config.yaml`, `.devcontainer/` | CI gate, local hooks, reproducible dev env |

## Five-subsystem coverage

| Subsystem | Artifacts |
|-----------|-----------|
| Instructions | `AGENTS.md`, specs, skills |
| Tools | MCP config, shell via check/bootstrap scripts |
| Environment | bootstrap scripts, version pins, devcontainer (strict) |
| State | `harness/PROGRESS.md` |
| Feedback | `scripts/check.*`, evals, validator, CI (strict) |

## Antigravity 2.0

| Step | Action |
|------|--------|
| Install skill globally | `setup-harness/install.ps1` or `install.sh` → `~/.gemini/config/skills/setup-harness/` |
| Scaffold project | `python scripts/scaffold_harness.py --target <root> --tier standard` |
| MCP | Copy `mcp/mcp_config.antigravity.example.json` → `.agents/mcp_config.json`; use `serverUrl` for HTTP |
| Verify | Ask Antigravity: "What skills are available?"; run `validate_harness.py` |

Full paths and troubleshooting: setup-harness `references/antigravity.md` (or `references/antigravity.md` in the installed skill folder).

## Specs: which template?

| Situation | Template |
|-----------|----------|
| Bugfix, typo, local refactor, ≤3 files | `specs/micro-spec.md` |
| New feature, API, schema, multi-module | `specs/feature-template.spec.md` |

Micro-spec avoids overhead that makes people skip specs entirely.

## Starter skills (three tiers)

| Skill | Tier | Can do | Cannot do |
|-------|------|--------|-----------|
| `code-review` | Read-only | Analyze PR/diff, report issues | Modify code, commit |
| `changelog-draft` | Draft-only | Write CHANGELOG draft | Commit, tag, release |
| `run-tests` | Action-allowed (narrow) | Run test command, report | Edit source or tests |
| `harness-audit` | Read-only | Audit harness completeness | Modify harness or app code |

Copy these patterns when adding domain skills. Promote tiers only with evals (see `evals/README.md`).

## Graduation ladder

- **Read-only:** fetch/query/describe; 90% trigger accuracy.
- **Draft-only:** produce content for human review; 20+ golden cases.
- **Action-allowed:** irreversible ops; adversarial evals, pass^k, human sign-off.

## Completing the harness (three layers)

| Layer | What | Command / trigger |
|-------|------|-------------------|
| Human | `harness/COMPLETION-CHECKLIST.md` | Phase A → B → C |
| Script | `harness/scripts/validate_harness.py` | `python harness/scripts/validate_harness.py` |
| Agent | `harness-audit` skill | "Audit my harness" |

**Definition of done:** script exits 0 (no blockers), `harness-audit` reports no blockers, one real task passed eval.

## Onboarding checklist (quick start)

1. **Run scaffold** — `python scripts/scaffold_harness.py --target . --tier standard --seed-first-task`
2. **Bootstrap env** — `./scripts/bootstrap.sh` (standard/strict)
3. **Pick a spec template** — micro vs full for your first task
4. **Add eval cases** in `evals/evalset.json` before generating code (or use `--seed-first-task`)
5. **Run validator** — `python harness/scripts/validate_harness.py`; fix blockers
5. **Enable sandbox** — see `guardrails/NOTES.md`.
6. **Connect MCP** — follow `mcp/CHECKLIST.md` (Inspector + smoke test).
7. **Audit** — invoke `harness-audit` skill before autonomous agent runs.
8. **When the agent misbehaves** — add a hard rule in `AGENTS.md` + ADR in `harness/decisions/` + line in `harness/CHANGELOG.md`; bump `guardrails/policies.yaml` `version` if policies change.

Full phases: `harness/COMPLETION-CHECKLIST.md`.

## MCP quick path

1. Edit `mcp/mcp.json` or `mcp/mcp_config.antigravity.example.json` (then copy to tool-specific path — see `mcp/README.md`).
2. Work through `mcp/CHECKLIST.md` (Inspector, list tools, one read-only call).
3. Record sensitive integrations in `harness/decisions/`.

## Deeper reference

The `setup-harness` skill includes `references/` on harness anatomy, spec-driven dev, skills & MCP, security & evaluation, and **Antigravity 2.0** (`references/antigravity.md`).
