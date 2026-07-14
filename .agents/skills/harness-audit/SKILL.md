---
name: harness-audit
description: Audit an agentic-engineering harness for completeness and quality (AGENTS.md, evals, specs, skills, guardrails). Use when the user asks to audit, validate, or review the harness, check harness completion, or before trusting autonomous agent runs. Do NOT use for modifying application code or implementing features.
---

# harness-audit

Read-only tier: inspects the harness and reports gaps. Must not modify files, commit, or run destructive commands.

## Workflow

1. **Run structural validation first** (from project root):

   ```bash
   python harness/scripts/validate_harness.py
   ```

   Include the full script output in your report. If blockers exist, list them as 🔴 Critical before semantic review.

2. **Read harness artifacts** (do not skip):
   - `harness/TIER.md` — lite | standard | strict
   - `AGENTS.md` — lean? placeholders gone? Verification section? hard rules actionable?
   - `GEMINI.md`, `CLAUDE.md` (standard+) — thin pointers to `AGENTS.md`?
   - `HARNESS.md`, `CONTRIBUTING.md`, `harness/COMPLETION-CHECKLIST.md` — onboarding complete?
   - `harness/PROGRESS.md` (standard+) — session handoff sections present?
   - `scripts/check.sh`, `scripts/bootstrap.sh` (standard+) — exist and match AGENTS.md commands?
   - `evals/evalset.json` — real cases, strong rubrics, negative cases?
   - `specs/*.md` — at least one tailored spec with clear definition of done?
   - `guardrails/policies.yaml` + `guardrails/NOTES.md` — version, HITL, sandbox notes
   - `.agents/skills/*/SKILL.md` — tiers match permissions; index synced in `AGENTS.md`
   - `mcp/mcp.json`, `mcp/mcp_config.antigravity.example.json` — if servers configured, was `mcp/CHECKLIST.md` followed? Antigravity uses `.agents/mcp_config.json`

3. **Score semantic quality** using the rubric below (script cannot judge these).

4. **Output** in the format below. End with explicit **Phase readiness**: A / B / C from `harness/COMPLETION-CHECKLIST.md`.

## Semantic rubric

| Area | Blocker if | Warning if |
|------|------------|------------|
| **AGENTS.md** | Placeholders, missing commands, missing Verification section | Too long, vague conventions |
| **PROGRESS.md** | Missing when tier is standard/strict | Empty after real multi-session work |
| **Check scripts** | Missing `scripts/check.*` or not referenced in AGENTS.md | Commands in check script don't match AGENTS.md |
| **Env / bootstrap** | Strict tier with no manifest or version pin | Bootstrap not run or documented |
| **GEMINI.md** | Duplicates full AGENTS.md or long procedural blocks | Missing when team uses Antigravity |
| **Specs** | No tailored spec for imminent work | Scenarios lack error/edge cases |
| **Evals** | Below tier minimum real cases, rubric not measurable | No negative (wrong-skill) case |
| **Skills** | Tier allows more than skill permits | Missing domain skill for core workflow |
| **Guardrails** | No `version`, production deploy without HITL | Sandbox not documented as enabled |
| **MCP** | Secrets in JSON, prod data paths | Servers configured but checklist not evidenced |
| **Strict CI** | Strict tier missing CI or pre-commit | CI doesn't run validate + check |

## Output format

```
**Harness audit summary:** <one paragraph>

STRUCTURAL (validate_harness.py):
<paste or summarize script result>

SEMANTIC FINDINGS:
- 🔴 Blocker: <must fix before autonomous agent work>
- 🟡 Warning: <should fix before Phase C / strict CI>
- 🟢 Pass: <what is in good shape>

PHASE READINESS:
- Phase A (structure): pass | fail — <reason>
- Phase B (operational): pass | fail | not assessed — <reason>
- Phase C (sustainable): pass | fail | not assessed — <reason>

NEXT ACTIONS (ordered):
1. ...
2. ...
```

When no blockers and Phase A+B criteria are met, state: **Harness ready for controlled agentic work** (not "fully autonomous forever").

## Golden cases (skill eval calibration)

Use these when testing whether this skill fires and reports correctly:

| Input | Expected |
|-------|----------|
| "Audit my harness" | Runs validate script, reads AGENTS.md + evalset, outputs format above |
| "Is AGENTS.md good?" | Narrow review of AGENTS.md only; still mentions validate script |
| "Implement login feature" | **Do not use this skill** — wrong trigger |

## Graduating this skill

Stays **read-only**. To auto-apply harness fixes, create a separate draft-only skill (e.g. `harness-fix-draft`) with its own evals; never auto-edit `policies.yaml` or `AGENTS.md` hard rules without human approval.
