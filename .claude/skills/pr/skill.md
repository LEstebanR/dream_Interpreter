---
name: pr
description: >-
  Creates a GitHub Pull Request targeting develop, with a standardized title
  and description linked to the corresponding Linear issue.
---

## Prerequisites

- Changes must be committed on the current branch (use `/commit` if not).
- The branch must follow the convention `leramirezca/les-{N}-{slug}` (use `/branch` if not).

## Step 1 — Gather context

Run in parallel:
- `git log develop..HEAD --oneline` to see the PR commits
- `git diff develop...HEAD --stat` to see changed files
- `mcp__linear-server__get_issue` with the issue ID (extracted from branch name: `les-{N}` → `LES-{N}`)

## Step 2 — PR title

Format: `type(scope): short description — LES-{N}`

Valid types:
- `fix` — bug fix
- `feat` — new feature
- `security` — security improvement
- `perf` — performance
- `refactor` — refactoring without behavior change
- `chore` — maintenance (deps, config, etc.)
- `docs` — documentation
- `ui` — interface or style changes
- `db` — schema or migration changes

The scope is the code area: `auth`, `api`, `ui`, `journal`, `billing`, `i18n`, `db`, etc.

Example: `security(auth): increase minimum password length to 8 — LES-121`

Max 72 characters.

## Step 3 — PR body

```markdown
## What changes?

{1-3 concise bullets describing the changes}

## Modified files

{List key files with a one-line description each}

## Acceptance criteria

{Copy acceptance criteria from the Linear issue if present,
or draft them from the issue description}

## Linear

Closes LES-{N}
```

## Step 4 — Create the PR

```bash
git push -u origin {current-branch}
gh pr create \
  --base develop \
  --title "{title}" \
  --body "$(cat <<'EOF'
{full body}
EOF
)"
```

Return the PR URL to the user.
