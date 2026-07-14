#!/usr/bin/env python3
"""Structural validator for an agentic-engineering harness.

Tier-aware: reads harness/TIER.md (lite | standard | strict) and applies
matching required files and checks.

Usage:
    python harness/scripts/validate_harness.py
    python harness/scripts/validate_harness.py --target /path/to/project
    python harness/scripts/validate_harness.py --strict
    python harness/scripts/validate_harness.py --tier standard
    python harness/scripts/validate_harness.py --json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]

TIERS = ("lite", "standard", "strict")
TIER_RANK = {"lite": 0, "standard": 1, "strict": 2}


class Severity(str, Enum):
    BLOCKER = "blocker"
    WARNING = "warning"
    PASS = "pass"


@dataclass
class Finding:
    severity: Severity
    check_id: str
    message: str


@dataclass
class Report:
    findings: list[Finding] = field(default_factory=list)
    tier: str = "standard"

    def add(self, severity: Severity, check_id: str, message: str) -> None:
        self.findings.append(Finding(severity, check_id, message))

    @property
    def blockers(self) -> list[Finding]:
        return [f for f in self.findings if f.severity == Severity.BLOCKER]

    @property
    def warnings(self) -> list[Finding]:
        return [f for f in self.findings if f.severity == Severity.WARNING]

    @property
    def passes(self) -> list[Finding]:
        return [f for f in self.findings if f.severity == Severity.PASS]

    def exit_code(self, strict: bool) -> int:
        if self.blockers:
            return 1
        if strict and self.warnings:
            return 1
        return 0


REQUIRED_BY_TIER: dict[str, list[str]] = {
    "lite": [
        "AGENTS.md",
        "specs/micro-spec.md",
        "harness/TIER.md",
        "harness/scripts/validate_harness.py",
        "scripts/check.sh",
        "scripts/check.ps1",
    ],
    "standard": [
        "AGENTS.md",
        "GEMINI.md",
        "CLAUDE.md",
        "HARNESS.md",
        "CONTRIBUTING.md",
        "docs/onboarding.md",
        "harness/TIER.md",
        "harness/PROGRESS.md",
        "harness/COMPLETION-CHECKLIST.md",
        "harness/CHANGELOG.md",
        "harness/scripts/validate_harness.py",
        "harness/decisions/0000-template.md",
        "evals/evalset.json",
        "evals/README.md",
        "guardrails/policies.yaml",
        "guardrails/NOTES.md",
        "specs/micro-spec.md",
        "specs/feature-template.spec.md",
        "scripts/check.sh",
        "scripts/check.ps1",
        "scripts/bootstrap.sh",
        "scripts/bootstrap.ps1",
        "mcp/mcp.json",
        "mcp/README.md",
        "mcp/CHECKLIST.md",
    ],
    "strict": [
        ".github/workflows/harness-check.yml",
        ".github/pull_request_template.md",
        ".pre-commit-config.yaml",
        ".devcontainer/devcontainer.json",
    ],
}

TEMPLATE_SPECS = {"micro-spec.md", "feature-template.spec.md"}

PLACEHOLDER_RE = re.compile(r"<[^<>]{1,120}>")

KNOWN_AGENTS_PLACEHOLDERS = (
    "<one-line description>",
    "<languages, frameworks, versions>",
    "<npm / pnpm / uv / pip / cargo / go ...>",
    "<cmd>",
)


def tier_includes(selected: str, minimum: str) -> bool:
    return TIER_RANK[selected] >= TIER_RANK[minimum]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def detect_tier(root: Path, override: str | None) -> str:
    if override and override in TIERS:
        return override
    tier_path = root / "harness/TIER.md"
    if tier_path.is_file():
        for line in read_text(tier_path).splitlines():
            stripped = line.strip()
            if stripped.startswith("tier:"):
                value = stripped.split(":", 1)[1].strip()
                if value in TIERS:
                    return value
    return "standard"


def required_files_for_tier(tier: str) -> list[str]:
    files = list(REQUIRED_BY_TIER["lite"])
    if tier_includes(tier, "standard"):
        for f in REQUIRED_BY_TIER["standard"]:
            if f not in files:
                files.append(f)
    if tier_includes(tier, "strict"):
        for f in REQUIRED_BY_TIER["strict"]:
            if f not in files:
                files.append(f)
    return files


def check_required_files(root: Path, tier: str, report: Report) -> None:
    for rel in required_files_for_tier(tier):
        path = root / rel
        if path.is_file():
            report.add(Severity.PASS, "files.present", f"Found {rel}")
        else:
            report.add(Severity.BLOCKER, "files.missing", f"Missing required file ({tier}): {rel}")


def check_agents_md(root: Path, report: Report) -> None:
    path = root / "AGENTS.md"
    if not path.is_file():
        return

    text = read_text(path)
    lines = [ln for ln in text.splitlines() if ln.strip()]

    for placeholder in KNOWN_AGENTS_PLACEHOLDERS:
        if placeholder in text:
            report.add(
                Severity.BLOCKER,
                "agents.placeholders",
                f"AGENTS.md still contains scaffold placeholder: {placeholder}",
            )

    other_placeholders = [
        m.group(0)
        for m in PLACEHOLDER_RE.finditer(text)
        if m.group(0) not in KNOWN_AGENTS_PLACEHOLDERS
    ]
    for ph in sorted(set(other_placeholders)):
        report.add(
            Severity.WARNING,
            "agents.placeholders.unknown",
            f"AGENTS.md may contain unfilled placeholder: {ph}",
        )

    if len(lines) > 50:
        report.add(
            Severity.WARNING,
            "agents.length",
            f"AGENTS.md is {len(lines)} non-empty lines (target ~15–30; >50 adds context rot)",
        )
    else:
        report.add(Severity.PASS, "agents.length", f"AGENTS.md length OK ({len(lines)} lines)")

    for section in ("## Commands", "## Hard rules", "## Verification"):
        if section not in text:
            report.add(Severity.BLOCKER, "agents.sections", f"AGENTS.md missing section: {section}")

    if "scripts/check" not in text and "./scripts/check.sh" not in text:
        report.add(
            Severity.WARNING,
            "agents.verification",
            "AGENTS.md Verification section should reference scripts/check.sh",
        )
    else:
        report.add(Severity.PASS, "agents.verification", "AGENTS.md references unified check script")


def check_progress_md(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    path = root / "harness/PROGRESS.md"
    if not path.is_file():
        return
    text = read_text(path)
    if "Current task" not in text or "Next session" not in text:
        report.add(Severity.WARNING, "progress.sections", "PROGRESS.md missing expected sections")
    else:
        report.add(Severity.PASS, "progress.sections", "PROGRESS.md has session handoff sections")


def check_env_pins(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    pins = [
        root / ".python-version",
        root / ".nvmrc",
        root / ".node-version",
        root / "pyproject.toml",
        root / "package.json",
        root / "go.mod",
        root / "Cargo.toml",
    ]
    if any(p.is_file() for p in pins):
        report.add(Severity.PASS, "env.pins", "Environment is pinned or self-describing in repo")
    else:
        report.add(
            Severity.WARNING,
            "env.pins",
            "No env pin (.python-version, .nvmrc) or manifest found — add pins or document in AGENTS.md",
        )


def check_check_scripts(root: Path, report: Report) -> None:
    for rel in ("scripts/check.sh", "scripts/check.ps1"):
        path = root / rel
        if path.is_file():
            report.add(Severity.PASS, "check.script", f"Found {rel}")
        else:
            report.add(Severity.BLOCKER, "check.script", f"Missing unified verification script: {rel}")


def load_evalset(root: Path, tier: str, report: Report) -> dict[str, Any] | None:
    if not tier_includes(tier, "standard"):
        return None
    path = root / "evals/evalset.json"
    if not path.is_file():
        return None
    try:
        data = json.loads(read_text(path))
    except json.JSONDecodeError as exc:
        report.add(Severity.BLOCKER, "evals.json", f"evalset.json is invalid JSON: {exc}")
        return None

    if not isinstance(data, dict):
        report.add(Severity.BLOCKER, "evals.schema", "evalset.json root must be an object")
        return None

    cases = data.get("cases")
    if not isinstance(cases, list):
        report.add(Severity.BLOCKER, "evals.schema", "evalset.json must have a 'cases' array")
        return None

    if len(cases) == 0:
        report.add(Severity.BLOCKER, "evals.empty", "evalset.json has no cases")
        return data

    real_cases = []
    for i, case in enumerate(cases):
        if not isinstance(case, dict):
            report.add(Severity.BLOCKER, "evals.schema", f"cases[{i}] must be an object")
            continue
        case_id = str(case.get("case_id", ""))
        if case_id.startswith("example_"):
            report.add(
                Severity.WARNING,
                "evals.example",
                f"Case {case_id!r} looks like scaffold template — replace with a real case",
            )
        else:
            real_cases.append(case_id)

        for field_name in ("input", "rubric"):
            val = case.get(field_name)
            if isinstance(val, str) and PLACEHOLDER_RE.search(val):
                report.add(
                    Severity.WARNING,
                    "evals.placeholders",
                    f"Case {case_id!r} field {field_name!r} contains placeholder text",
                )
            if field_name == "rubric" and isinstance(val, list):
                for item in val:
                    if isinstance(item, str) and PLACEHOLDER_RE.search(item):
                        report.add(
                            Severity.WARNING,
                            "evals.placeholders",
                            f"Case {case_id!r} rubric item contains placeholder text",
                        )

    min_cases = 2 if tier == "standard" else 3
    if len(real_cases) < min_cases:
        report.add(
            Severity.BLOCKER,
            "evals.count",
            f"Need at least {min_cases} non-example cases for tier {tier}; found {len(real_cases)}",
        )
    else:
        report.add(Severity.PASS, "evals.count", f"Found {len(real_cases)} tailored eval case(s)")

    return data


def check_specs(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    specs_dir = root / "specs"
    if not specs_dir.is_dir():
        report.add(Severity.BLOCKER, "specs.dir", "Missing specs/ directory")
        return

    real_specs = []
    for path in sorted(specs_dir.glob("*.md")):
        if path.name in TEMPLATE_SPECS:
            continue
        text = read_text(path)
        if PLACEHOLDER_RE.search(text):
            report.add(
                Severity.WARNING,
                "specs.placeholders",
                f"{path.name} still contains placeholder markers — finish tailoring",
            )
        else:
            real_specs.append(path.name)

    if real_specs:
        report.add(Severity.PASS, "specs.real", f"Found tailored spec(s): {', '.join(real_specs)}")
    else:
        report.add(
            Severity.WARNING,
            "specs.missing",
            "No tailored spec besides templates — add one in specs/ or run scaffold with --seed-first-task",
        )


def check_policies(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    path = root / "guardrails/policies.yaml"
    if not path.is_file():
        return

    text = read_text(path)
    if yaml is not None:
        try:
            data = yaml.safe_load(text)
        except yaml.YAMLError as exc:
            report.add(Severity.BLOCKER, "policies.yaml", f"policies.yaml parse error: {exc}")
            return
        if not isinstance(data, dict):
            report.add(Severity.BLOCKER, "policies.schema", "policies.yaml root must be a mapping")
            return
        version = data.get("version")
        if not version or str(version).strip() in ("", "0.0.0"):
            report.add(Severity.BLOCKER, "policies.version", "policies.yaml must set a non-empty version")
        else:
            report.add(Severity.PASS, "policies.version", f"policies.yaml version: {version}")
    else:
        if re.search(r'^version:\s*["\']?.+["\']?\s*$', text, re.MULTILINE):
            report.add(Severity.PASS, "policies.version", "policies.yaml has version (PyYAML not installed)")
        else:
            report.add(
                Severity.BLOCKER,
                "policies.version",
                "policies.yaml must include version: (install PyYAML for deeper checks)",
            )


def discover_skills(root: Path) -> list[str]:
    skills_root = root / ".agents/skills"
    if not skills_root.is_dir():
        return []
    return sorted(
        p.name for p in skills_root.iterdir() if p.is_dir() and (p / "SKILL.md").is_file()
    )


def check_skills_sync(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    skills = discover_skills(root)
    if not skills:
        report.add(Severity.BLOCKER, "skills.missing", "No skills under .agents/skills/")
        return

    agents_path = root / "AGENTS.md"
    agents_text = read_text(agents_path) if agents_path.is_file() else ""

    for name in skills:
        if name not in agents_text:
            report.add(
                Severity.WARNING,
                "skills.index",
                f"Skill {name!r} exists but is not mentioned in AGENTS.md skills table",
            )
        else:
            report.add(Severity.PASS, "skills.index", f"Skill {name!r} indexed in AGENTS.md")

    required_starter = {"code-review", "changelog-draft", "run-tests", "harness-audit"}
    missing_starter = required_starter - set(skills)
    for name in sorted(missing_starter):
        report.add(Severity.BLOCKER, "skills.starter", f"Missing starter skill: {name}")


def check_strict_extras(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "strict"):
        return
    ci = root / ".github/workflows/harness-check.yml"
    if ci.is_file():
        text = read_text(ci)
        if "validate_harness.py" in text and "check.sh" in text:
            report.add(Severity.PASS, "strict.ci", "CI workflow runs harness + project checks")
        else:
            report.add(Severity.WARNING, "strict.ci", "CI workflow should run validate_harness.py and check.sh")
    precommit = root / ".pre-commit-config.yaml"
    if precommit.is_file():
        report.add(Severity.PASS, "strict.precommit", "pre-commit config present")


def check_gemini_md(root: Path, tier: str, report: Report) -> None:
    if not tier_includes(tier, "standard"):
        return
    path = root / "GEMINI.md"
    if not path.is_file():
        return

    text = read_text(path)
    lines = [ln for ln in text.splitlines() if ln.strip()]

    if "AGENTS.md" not in text:
        report.add(
            Severity.WARNING,
            "gemini.agents_link",
            "GEMINI.md should reference AGENTS.md as the cross-tool source of truth",
        )
    else:
        report.add(Severity.PASS, "gemini.agents_link", "GEMINI.md references AGENTS.md")

    if len(lines) > 40:
        report.add(
            Severity.WARNING,
            "gemini.length",
            f"GEMINI.md is {len(lines)} non-empty lines (keep thin; move rules to AGENTS.md or skills)",
        )
    else:
        report.add(Severity.PASS, "gemini.length", f"GEMINI.md length OK ({len(lines)} lines)")


def validate(root: Path, tier_override: str | None) -> Report:
    tier = detect_tier(root, tier_override)
    report = Report(tier=tier)
    report.add(Severity.PASS, "tier.detected", f"Harness tier: {tier}")

    check_required_files(root, tier, report)
    check_agents_md(root, report)
    check_check_scripts(root, report)
    check_progress_md(root, tier, report)
    check_env_pins(root, tier, report)
    check_gemini_md(root, tier, report)
    load_evalset(root, tier, report)
    check_specs(root, tier, report)
    check_policies(root, tier, report)
    check_skills_sync(root, tier, report)
    check_strict_extras(root, tier, report)
    return report


def format_text_report(report: Report, root: Path) -> str:
    lines = [
        "HARNESS VALIDATION REPORT",
        "=========================",
        f"Target: {root.resolve()}",
        f"Tier:   {report.tier}",
        "",
    ]

    def section(title: str, items: list[Finding]) -> None:
        lines.append(f"{title} ({len(items)}):")
        if not items:
            lines.append("  (none)")
        for f in items:
            lines.append(f"  [{f.check_id}] {f.message}")
        lines.append("")

    section("BLOCKERS", report.blockers)
    section("WARNINGS", report.warnings)
    section("PASS", report.passes)

    if report.blockers:
        lines.append("Result: FAIL — fix blockers, then re-run.")
        lines.append("Next: harness/COMPLETION-CHECKLIST.md Phase A")
    elif report.warnings:
        lines.append("Result: PASS with warnings — OK for Phase B; fix warnings before strict CI.")
    else:
        lines.append("Result: PASS — run harness-audit skill for semantic review (Phase B).")

    return "\n".join(lines)


def format_json_report(report: Report, root: Path) -> str:
    payload = {
        "target": str(root.resolve()),
        "tier": report.tier,
        "blockers": [{"id": f.check_id, "message": f.message} for f in report.blockers],
        "warnings": [{"id": f.check_id, "message": f.message} for f in report.warnings],
        "passes": [{"id": f.check_id, "message": f.message} for f in report.passes],
        "ok": len(report.blockers) == 0,
    }
    return json.dumps(payload, indent=2)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--target",
        default=".",
        help="Project root containing the harness (default: current directory).",
    )
    parser.add_argument(
        "--tier",
        choices=TIERS,
        default=None,
        help="Override tier detection from harness/TIER.md",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 on warnings as well as blockers (for CI).",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON instead of text.",
    )
    args = parser.parse_args(argv)

    root = Path(args.target).expanduser().resolve()
    if not root.is_dir():
        print(f"error: not a directory: {root}", file=sys.stderr)
        return 2

    report = validate(root, args.tier)
    if args.json:
        print(format_json_report(report, root))
    else:
        print(format_text_report(report, root))

    return report.exit_code(strict=args.strict)


if __name__ == "__main__":
    raise SystemExit(main())
