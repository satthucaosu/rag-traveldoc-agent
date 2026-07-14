# Guardrails

Guardrails are deterministic constraints that make unsafe actions impossible, rather than prose the model may ignore. Write software, not rules.

## Sandboxing

Run dynamically generated or untrusted code in an ephemeral, network-isolated sandbox that resets state between runs, so a bad script's blast radius is contained.

- Cursor / Antigravity 2.0 / Antigravity IDE: enable terminal sandboxing in Settings → Agent / terminal sandbox.
- Antigravity CLI: same harness files; global skills at `~/.gemini/config/skills/`; MCP at `~/.gemini/config/mcp_config.json` or project `.agents/mcp_config.json`.
- Gemini CLI: containerize the workspace (e.g. `export GEMINI_SANDBOX=docker` with a custom sandbox Dockerfile).
- General: low-privilege containers, no access to secrets / production manifests, file-tree allowlists (deny-by-default).

## Supply chain

- Source dependencies only from vetted or internal registries; pin versions.
- Beware slopsquatting: LLMs hallucinate package names and attackers publish malware under them. Verify every new dependency exists before installing.
- In CI, run SAST + SCA and verify SBOM/signatures before artifacts reach production.

## Human-in-the-loop (HITL)

Require explicit human sign-off for high-stakes actions: deploying to production, modifying database schemas, financial transactions, IAM changes (see `require_human_approval` in `policies.yaml`). For these, present a plain-English "Vibe Diff" of what the generated action will actually do before approval — avoid blind approve/deny fatigue.

## Policy server

`policies.yaml` declares the rules. Wire a policy server into the agent's tool-call pipeline to enforce them: structural gate (role/env) -> semantic gate (LLM checks intent/content) -> execute. Keep governance logic separate from execution logic.

## Context hygiene

Mask PII and inject placeholders (`[[VARIABLE_NAME]]`) resolved at runtime from state/env, so the agent never sees or hardcodes real secrets. Sanitize all tool arguments before execution to prevent prompt-injection and context-hallucination leaks.

## Harness change history

When you change `policies.yaml` or add hard rules in `AGENTS.md`:

1. Bump `version` in `policies.yaml` (if policy content changed).
2. Add a short ADR in `harness/decisions/` (copy `0000-template.md`).
3. Log the change in `harness/CHANGELOG.md`.

This keeps rules from piling up without documented rationale.

## Level up

For the full picture (7-pillar security architecture, Red/Blue/Green teaming, observability, intent-drift circuit breakers), see the setup-harness skill's `references/security-and-eval.md`.
