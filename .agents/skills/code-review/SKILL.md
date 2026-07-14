---
name: code-review
description: Review a pull request or diff for security, logic, readability, and edge cases following this project's standards. Use when reviewing a PR, examining a diff, or when the user asks for a code review. Do NOT use for generating new features or fixing bugs.
---

# code-review

Read-only tier: this skill inspects and reports. It must not modify code, commit, or merge.

## Workflow

1. Get the change. For a GitHub PR: `gh pr view <PR_NUMBER> --json title,body,files` and `gh pr diff <PR_NUMBER>`. Otherwise review the provided diff or staged changes (`git diff --staged`).
2. Read the related files first to understand context before judging the diff.
3. Review against the criteria below.
4. Output in the format below.

## Review criteria

1. **Critical vulnerabilities** — hardcoded secrets/API keys, SQL injection, XSS, broken or frontend-only authentication, missing default-deny access control, unmasked PII in logs.
2. **Logic & efficiency** — off-by-one errors, infinite loops, redundant API calls, wrong assumptions about business logic.
3. **Hallucinated dependencies** — verify every imported package actually exists and is pinned; flag suspicious/typosquatted names.
4. **Readability** — naming, oversized "mega-functions," dead code.
5. **Edge cases** — null/empty input, network failure, concurrency, error handling.
6. **Tests** — do changes include tests? Could a passing test have been gamed (deleted/mocked)?

## Output format

```
**Description:** What this PR does, in detail.

ISSUES:
- 🔴 Critical: <stop-ship issues>
- 🟡 Warning: <code smells or style issues>
- 🟢 Best practice: <specific lines to refactor>
- 💡 Quick win: <one-sentence biggest improvement>
```

When there are no issues, return the description followed by `LGTM`.

## Graduating this skill

This is the read-only starting tier. Compare with `changelog-draft` (draft-only) and `run-tests` (narrow action-allowed) in the same skills folder. To post PR comments or approve merges, promote through eval tiers and record the change in `harness/decisions/`.
