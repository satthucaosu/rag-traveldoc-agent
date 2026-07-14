# Harness changelog

Human-maintained log of changes to **agent rules and guardrails** (`AGENTS.md`, `guardrails/policies.yaml`, harness skills). Not the application release changelog — see project `CHANGELOG.md` for that.

Format: [Keep a Changelog](https://keepachangelog.com/). Link ADRs in `decisions/` when the *why* matters more than one line.

## [Unreleased]

### Added
- Initial harness scaffold (setup-harness)
- `harness/COMPLETION-CHECKLIST.md`, `harness/scripts/validate_harness.py`, `harness-audit` skill
- Antigravity 2.0 support: `GEMINI.md`, `mcp/mcp_config.antigravity.example.json`, `references/antigravity.md`, install to `~/.gemini/config/skills/`

### Changed
- (none yet)

## How to record a change

1. **Small tweak** — one line here under Added/Changed/Removed.
2. **New hard rule or policy change** — add a short ADR in `harness/decisions/` (copy `0000-template.md`), then one line here linking it: `See decisions/0003-no-frontend-secrets.md`.
3. **Bump** `version` in `guardrails/policies.yaml` when roles, blocked tools, or approval lists change.
