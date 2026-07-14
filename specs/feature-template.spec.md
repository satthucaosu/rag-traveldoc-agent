# Spec: <feature name>

Status: draft | Owner: <name> | Last updated: <date>

**When to use this template:** new features, APIs, schemas, or multi-module work. For small scoped changes (bugfix, local refactor, ≤3 files), use `micro-spec.md` instead.

This spec is the source of truth for `<feature name>`. The agent builds from this, not from a vibe. Narrative in Markdown; structured config in flat YAML.

## Background (the why)

<Why this feature exists, who it is for, and the problem it solves. Give the agent enough to think forward about the steps it will need.>

## Requirements

- <functional requirement 1>
- <functional requirement 2>
- <non-functional requirement: performance, security, accessibility ...>

## Technical design

### Data model / schema

```yaml
# Keep nesting flat; YAML for structured/nested config (parses more reliably than JSON/XML).
entity:
  name: <Entity>
  fields:
    - { name: id, type: string, required: true }
    - { name: <field>, type: <type>, required: <true|false> }
```

### API contract

```yaml
endpoint:
  method: <GET|POST|PUT|DELETE>
  path: /<path>
  request: { <field>: <type> }
  response: { <field>: <type> }
  errors: [ { status: 400, when: <condition> }, { status: 401, when: <condition> } ]
```

### Dependencies

- <library> @ <pinned version>  # always pin versions; do not trust the model's default

## Scenarios (BDD / Gherkin)

State -> Action -> Outcome. Cover the happy path, errors, and edge cases.

```gherkin
Feature: <feature name>

  Scenario: <happy path name>
    Given <initial state>
    When <action>
    Then <expected outcome>

  Scenario: <error case name>
    Given <initial state>
    When <invalid action>
    Then <expected error / graceful failure>

  Scenario: <edge case name>
    Given <boundary state, e.g. empty input / null / network failure>
    When <action>
    Then <expected outcome>
```

## Acceptance criteria

- [ ] All scenarios above have passing tests.
- [ ] Build, test, and lint are green.
- [ ] No secrets, no frontend-only auth, errors handled.
