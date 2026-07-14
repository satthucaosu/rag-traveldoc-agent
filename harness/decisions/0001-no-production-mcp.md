# ADR-0001: No production data via MCP

- **Status:** accepted
- **Date:** (set when you adopt this harness)
- **Harness version:** 1.0.0

## Context

MCP servers give agents broad reach into databases, filesystems, and APIs. Connecting to production data during development risks leaks, accidental writes, and prompt-injection exfiltration.

## Decision

Agents must not connect MCP tools to production data. Use development projects, obfuscated data, or read-only mode. Credentials only via environment variables.

## Consequences

- **AGENTS.md:** hard rule "Do not connect tools/MCP servers to production data…"
- **guardrails/policies.yaml:** semantic guideline on no exfiltration; environment blocks on destructive tools in `localhost`
- **Trade-offs:** Slower local setup; safer default for vibe-coded workflows

## Links

- harness/CHANGELOG.md: initial scaffold
