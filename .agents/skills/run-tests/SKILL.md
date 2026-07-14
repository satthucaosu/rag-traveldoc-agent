---
name: run-tests
description: Run the project's test suite and report results without modifying source code. Use when the user asks to run tests, verify CI locally, or check if tests pass after a change. Do NOT use for fixing failing tests, refactoring, or editing implementation files.
---

# run-tests

**Action-allowed tier (narrow):** this skill may execute the test command and read output. It must **not** edit source files, install new dependencies, or change test files to make failures pass.

## Workflow

1. Read test command from `AGENTS.md` (Commands → Test). If missing, ask once.
2. Run the test command in the project root. Capture stdout/stderr and exit code.
3. Summarize: passed / failed / skipped counts; list failing test names with the first relevant error line each.
4. If tests fail, report only — do not attempt fixes unless the user explicitly switches tasks.

## Allowed actions

- Run the documented test / lint commands
- Read test output and related log files
- Suggest which failing tests map to which recent changes (read-only analysis)

## Forbidden actions

- Edit `.py`, `.ts`, `.js`, or other implementation files
- Edit test files to weaken assertions or delete cases
- `git commit`, `git push`, deploy, or MCP tools that mutate external state

## Output format

```
Test run: <command>
Exit code: <n>
Summary: <passed> passed, <failed> failed, <skipped> skipped

Failures:
- <test_name>: <first error line>
```

## Graduating broader action

This skill is intentionally narrow. Skills that fix code or commit results need wider action-allowed evals and policy entries in `guardrails/policies.yaml`.
