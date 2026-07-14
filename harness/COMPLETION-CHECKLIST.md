# Harness completion checklist

Use this after `setup-harness` scaffold. Goal: the harness is **ready for agentic work**, not merely present on disk.

**Tier:** see `harness/TIER.md` (`lite` | `standard` | `strict`).

**Three layers (use all that apply to your tier):**

| Layer  | Artifact                                     | When                                           |
| ------ | -------------------------------------------- | ---------------------------------------------- |
| Human  | This checklist                               | First completion + after major harness changes |
| Script | `python harness/scripts/validate_harness.py` | Every harness change; CI gate (strict)         |
| Agent  | `harness-audit` skill (read-only)            | Before trusting autonomous agent runs          |

---

## Phase A — Structure (must pass script with no blockers)

### All tiers

- [ ] **`AGENTS.md` tailored** — no placeholders; **Verification** section references `scripts/check.*`
- [ ] **`scripts/check.sh` / `check.ps1`** run once by hand (or document N/A for empty greenfield)
- [ ] **`harness/TIER.md`** reflects chosen tier

### Standard + strict

- [ ] **`GEMINI.md` / `CLAUDE.md` reviewed** — thin pointers to `AGENTS.md`
- [ ] **Commands verified** — install, build, test, lint each run successfully once by hand
- [ ] **`harness/PROGRESS.md`** present; agent workflow mentions read/update each session
- [ ] **`evalset.json` has real cases** — ≥2 (standard) or ≥3 (strict) non-`example_*` cases
- [ ] **At least one real spec** in `specs/` (or `000-starter-smoke.spec.md` from `--seed-first-task`)
- [ ] **Skills index synced** — every folder under `.agents/skills/` appears in `AGENTS.md`
- [ ] **`policies.yaml` version** set (bump when roles/tools/approval lists change)
- [ ] **Env pins** — `.python-version`, `.nvmrc`, or manifest (`pyproject.toml` / `package.json`)

### Strict only

- [ ] **`.github/workflows/harness-check.yml`** present
- [ ] **`.pre-commit-config.yaml`** — run `pre-commit install`
- [ ] **`.devcontainer/devcontainer.json`** reviewed for stack
- [ ] **PR template** at `.github/pull_request_template.md`

Run:

```bash
python harness/scripts/validate_harness.py
# strict CI / pre-commit:
python harness/scripts/validate_harness.py --strict
```

Fix all **BLOCKERS** before Phase B.

---

## Phase B — Operational (agent can run safely)

### Standard + strict

- [ ] **Bootstrap** — `./scripts/bootstrap.sh` succeeded once after clone
- [ ] **Sandbox enabled** — see `guardrails/NOTES.md`
- [ ] **MCP wired** (if used) — complete `mcp/CHECKLIST.md`
- [ ] **Smoke task** — one small task from a real spec; agent completes without violating hard rules
- [ ] **Eval smoke** — at least one eval case passes (check script or rubric)
- [ ] **`run-tests` skill** — agent can invoke test command only (no source edits)
- [ ] **PROGRESS updated** — agent left `harness/PROGRESS.md` in a usable state after smoke task

### Lite

- [ ] **Smoke check** — agent ran `./scripts/check.sh` or documented why N/A

---

## Phase C — Sustainable (harness evolves without rot)

### Standard + strict

- [ ] **ADR for each hard rule** — new lines in `AGENTS.md` → ADR in `harness/decisions/`
- [ ] **`harness/CHANGELOG.md`** updated when rules/policies/skills change
- [ ] **Skill tiers correct** — read-only / draft-only / action-allowed match permissions
- [ ] **Promotions documented** — action-allowed skills have eval evidence + ADR
- [ ] **Periodic audit** — re-run validator + `harness-audit` monthly or before releases

---

## Definition of done

| Tier     | Done when |
|----------|-----------|
| **lite** | validator exits 0; check script runs; one agent task completed |
| **standard** | lite + eval smoke + PROGRESS handoff + `harness-audit` no blockers |
| **strict** | standard + pre-commit + CI green on a PR |

Optional CI (strict mode — fail on warnings too):

```bash
python harness/scripts/validate_harness.py --strict
```

---

## Quick reference

| Question              | Where to look                           |
| --------------------- | --------------------------------------- |
| Which tier?           | `harness/TIER.md`                       |
| What was scaffolded?  | `HARNESS.md`                            |
| Agent rules (lean)    | `AGENTS.md`                             |
| Session handoff       | `harness/PROGRESS.md`                   |
| Unified verification  | `scripts/check.sh`                      |
| MCP connection        | `mcp/CHECKLIST.md`                      |
| Why a rule exists     | `harness/decisions/`                    |
| Audit harness quality | `.agents/skills/harness-audit/SKILL.md` |
