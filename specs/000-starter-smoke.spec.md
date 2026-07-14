# Micro-spec: Harness smoke task

Status: draft | Owner: team | Last updated: 2026-07-14

## Goal

Prove the harness works: agent reads `AGENTS.md`, runs `./scripts/check.sh`, and updates `harness/PROGRESS.md`.

## Scope

- **Files / areas:** `harness/PROGRESS.md`, `README.md` (optional one-line note)
- **Out of scope:** application feature work

## Definition of done

- [ ] `./scripts/check.sh` passes (or documents why checks are N/A)
- [ ] `harness/PROGRESS.md` updated with outcome
- [ ] No hard rules violated
