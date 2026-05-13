---
name: dev-issue
description: >-
  Full development workflow for a Linear issue: asks which issue to work on,
  updates develop, creates the branch, implements the changes, commits, pushes,
  and opens a PR. Orchestrates /branch, /commit, and /pr skills internally.
---

## Goal

Take a Linear issue from backlog to pull request in a single workflow, following
all project conventions.

---

## Step 1 — Identify the issue

If the user passed an issue ID as an argument (e.g. `/dev-issue LES-42`), use it.
Otherwise, ask the user: "Which Linear issue do you want to develop? (e.g. LES-42)"

Once you have the ID, fetch the full issue with `mcp__linear-server__get_issue`.
Read and internalize:
- Title and description
- Acceptance criteria (if present)
- Priority and any linked comments
- `gitBranchName` field — you will use this exact string as the branch name

---

## Step 2 — Create the branch

Invoke the **branch** skill (`/branch`) passing the issue ID, or follow its steps
directly:

```bash
git checkout develop
git pull origin develop
git checkout -b {gitBranchName}
```

Confirm to the user which branch was created.

---

## Step 3 — Implement the issue

Read `CLAUDE.md` fully before writing any code.

Then implement the changes required by the issue:

- Follow all conventions documented in CLAUDE.md (naming, auth, i18n, Prisma,
  Zod validation, error responses, etc.)
- Prefer editing existing files over creating new ones
- Do not add code, abstractions, or error handling beyond what the issue requires
- Write no comments unless the WHY is non-obvious
- Run `bun run build` (or `bun run typecheck` if available) after implementation
  to catch type errors before committing

If the issue is ambiguous, ask the user for clarification before starting.

---

## Step 4 — Commit

Invoke the **commit** skill (`/commit`) to stage and commit all changes.

The commit message must follow the project format:
```
type(scope): short description — LES-{N}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Valid types: `fix`, `feat`, `security`, `perf`, `refactor`, `chore`, `docs`,
`ui`, `db`.

---

## Step 5 — Push and open a PR

Invoke the **pr** skill (`/pr`) to push the branch and create the pull request.

The PR must:
- Target `develop`
- Title format: `type(scope): short description — LES-{N}` (max 72 chars)
- Body sections: **What changes?**, **Modified files**, **Acceptance criteria**,
  **Linear** (`Closes LES-{N}`)

---

## Step 6 — Confirm

Return the PR URL to the user and summarize what was implemented.
