# CLAUDE.md

**Audience: Claude Code** (always-loaded in this workspace). Keep this file **lean** — one screen or less.

Cross-tool rules, commands, verification, and the skills index live in **`AGENTS.md`**. Load that file for stack, build/test commands, hard rules, and workflow.

## Claude-only notes

- **Skills:** workspace skills in `.agents/skills/`; invoke by name when the task matches (see `AGENTS.md` skills table).
- **Session state:** read and update `harness/PROGRESS.md` each session (standard/strict tiers).
- **Harness guide (humans):** `HARNESS.md` — not loaded every agent turn.

Add lines here only for rules that apply to **every** Claude Code prompt in this repo and do not belong in `AGENTS.md`.
