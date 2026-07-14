# Evals

Tests verify the deterministic parts (a function returns the right value). Evals verify the non-deterministic parts (did the agent take the right trajectory, choose the right tools, produce output that meets the bar). You need both — without evals, the practice is vibe coding regardless of how good the prompts are.

## Evaluation-Driven Development (EDD)

Write eval cases in `evalset.json` **before** generating implementation code. Each case fixes a clear functional spec: input, expected tool calls, expected output, and a rubric. Drafting 3 cases (2 positive, 1 negative) up front surfaces description ambiguity and trajectory errors early.

## What to evaluate (seven dimensions)

1. Intent satisfaction — did it build what the user *meant*?
2. Functional correctness — build/run/tests pass.
3. Visual & behavioural correctness — for UI, judge the rendered artifact.
4. Cost & efficiency — tokens, latency, tool-call and correction counts.
5. Code quality & convention matching.
6. Trajectory quality — sensible reasoning path and tool choices.
7. Self-repair — recovers from failure instead of compounding it.

## How to run

- Functional dims (2, 5): run the project's build/test/lint in CI — the cheapest signal.
- Judgment dims (1, 5, 6): LLM-as-judge against the rubric. Swap reference/actual positions to remove ordering bias; calibrate to ~90% agreement with human ratings.
- UI dim (3): Playwright + screenshot diff; a multimodal judge on the screenshot.
- Internal dims (6, 7): inspect OpenTelemetry trajectory traces.

## Graduation tiers

A skill/agent earns trust by tier:
- **Read-only:** LLM-as-judge; 90% trigger accuracy.
- **Draft-only:** golden dataset of 20+ cases; human approval.
- **Action-allowed:** adversarial red-teaming; sustained success across runs (pass^k); no rollbacks; human sign-off.

Never evaluate a skill purely in isolation — co-load 5-15 skills to catch token-budget and regression failures.

## Harness meta-evals

The `harness-audit` skill (read-only) reviews harness quality. Structural checks run via:

```bash
python harness/scripts/validate_harness.py
```

Golden trigger cases for `harness-audit` live in `.agents/skills/harness-audit/SKILL.md`. Add project-specific harness eval cases to `evalset.json` when you promote autonomous workflows.
