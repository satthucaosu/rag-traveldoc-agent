---
name: changelog-draft
description: Draft CHANGELOG.md entries from recent commits or a described change set for human review. Use when the user asks to update the changelog, summarize release notes, or document what changed. Do NOT use for committing, tagging releases, or publishing without explicit human approval.
---

# changelog-draft

**Draft-only tier:** this skill may write or propose changelog text. It must **not** commit, push, tag, or publish. A human reviews and applies the draft.

## Workflow

1. Identify the change set: `git log --oneline <base>..HEAD`, a PR diff, or the user's description.
2. Read `CHANGELOG.md` (or create a draft section if the file is missing) to match existing format.
3. Draft entries grouped by type: Added, Changed, Fixed, Removed, Security (as applicable).
4. Present the draft to the human. Do not run `git commit`, `git push`, or release commands.

## Output format

```markdown
## [Unreleased] — draft for review

### Added
- ...

### Fixed
- ...
```

End with: **Review this draft before committing.** Suggest the exact file edit or paste location.

## What this skill must not do

- Commit or stage files
- Create git tags or GitHub releases
- Modify code outside `CHANGELOG.md` unless the user explicitly asks

## Graduating this skill

To allow auto-commit of changelog entries, promote to **action-allowed** with adversarial evals, HITL on first N runs, and an entry in `harness/decisions/`.
