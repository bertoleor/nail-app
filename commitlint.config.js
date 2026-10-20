{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci"]
    ],
    "scope-enum": [
      2,
      "always",
      ["calculator", "agenda", "a11y", "auth", "ui", "api", "deps", "config"]
    ],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 100]
  }
}
