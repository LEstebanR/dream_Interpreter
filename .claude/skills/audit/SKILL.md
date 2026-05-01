---
name: audit
description: >-
  Scans the entire project and creates Linear issues (Oniricapp project, Lesteban
  team) for improvements found in UI, UX, security, testing, accessibility,
  performance, and code quality. Run periodically to keep the backlog updated
  with real, actionable improvement opportunities.
---

## Goal

Audit the full project and log each improvement found as a Linear issue. Do not change any code — only read, analyze, and create issues.

---

## Step 1 — Project context

Read `CLAUDE.md` to understand the stack, conventions, and what NOT to do. This is essential to avoid creating issues about intentional decisions.

---

## Step 2 — Code exploration

Use the **Explore** agent (subagent_type: "Explore") to deeply analyze the project. Ask it to read all files in these paths and report concrete problems per category with exact file references:

- `/app/[locale]/` — all pages and layouts
- `/app/api/` — all API routes
- `/components/` — all components
- `/lib/` — auth, prisma, stripe, email, utils
- `/messages/en.json` and `/messages/es.json` — i18n coverage
- `/prisma/schema.prisma` — data model
- `/proxy.ts` — auth guard and locale routing
- `/types/` — type extensions
- `next.config.ts`, `package.json`, `tsconfig.json`

---

## Step 3 — Audit categories

The Explore agent must evaluate each area against these criteria:

### [UI] User interface
- Missing empty states
- Missing or inconsistent loading states (skeletons/spinners)
- Incomplete visual feedback after user actions
- Typography, spacing, or color inconsistencies across pages
- Forms without required field indication
- Vague or wrong-language error messages

### [UX] User experience
- Flows with too many steps or unnecessary friction
- Missing confirmation before destructive actions
- Missing clear success states after completing actions
- Confusing or unexpected redirects
- Missing onboarding for new users
- Hard-to-discover functionality

### [a11y] Accessibility
- Images without descriptive `alt` attribute
- Buttons/icons without `aria-label`
- Missing semantic roles (`role`, `aria-*`)
- Forms without associated `<label>` or `htmlFor`
- Insufficient text contrast
- Interactive elements unreachable by keyboard
- Missing `focus-visible` on interactive elements

### [Security] Security
- API inputs without Zod validation
- Missing ownership verification (user accessing another user's resources)
- Sensitive data exposed in API responses (passwords, tokens, etc.)
- Missing HTTP security headers (CSP, X-Frame-Options, etc.)
- Tokens or secrets that could leak to the client
- Missing rate limiting on sensitive endpoints (login, register, etc.)
- Missing token expiration or rotation

### [Test] Testing
- Critical flows without tests (auth, payments, dream interpretation)
- Complex business logic without unit test coverage
- API routes without integration tests
- Complete absence of tests in the project (report if so)

### [Perf] Performance
- Images without `next/image` or without defined dimensions
- Unnecessary Client Components (could be Server Components)
- DB queries without pagination on potentially large lists
- Missing indexes on frequently queried fields in `schema.prisma`
- Heavy library imports without lazy loading
- Data waterfalls in Server Components that could be parallelized

### [Code] Code quality
- Logic duplication that should be extracted
- Weak TypeScript types (`any`, `as unknown as`, unsafe casts)
- Environment variables without startup validation
- Incomplete or silent error handling (empty `catch` blocks, unlogged errors)
- TODO/FIXME comments without an associated issue
- Hardcoded constants that should be env vars or config

---

## Step 4 — Get Linear context before creating issues

Before creating any issue, run these calls to get the correct IDs:

1. `mcp__linear-server__list_issue_labels` with `team: "Lesteban"` — to know available labels
2. `mcp__linear-server__list_issue_statuses` with `team: "Lesteban"` — to get the "Backlog" state
3. `mcp__linear-server__list_issues` filtered by the Oniricapp project — to avoid duplicating existing issues

---

## Step 5 — Create issues in Linear

For each problem found, create an issue with `mcp__linear-server__save_issue`:

```
team:        "Lesteban"
project:     "Oniricapp"
state:       "Backlog"
title:       "[Category] Concise description of the problem"
description: (see format below)
priority:    1=Urgent | 2=High | 3=Normal | 4=Low
labels:      most appropriate label from available ones
```

### Description format (Markdown)

```markdown
## Problem

Clear description of the problem and why it matters.

## Location

- File: `path/to/file.tsx` (approximate line if applicable)

## Suggested solution

Concise description of how to fix it, with a code example if useful.
```

### Priority criteria

| Priority | Criteria |
|----------|----------|
| Urgent (1) | Real security risk, data loss, blocks users |
| High (2) | Impacts conversion, retention, or user trust |
| Normal (3) | Notable quality or experience improvement |
| Low (4) | Nice to have, minor technical debt |

---

## Step 6 — Rules

- **Minimum 10 issues, maximum 25** — focus on the most impactful ones
- **Do not duplicate** issues already in the Linear backlog
- **Do not create issues about intentional decisions** documented in CLAUDE.md
- **Be specific** — each issue must reference the exact affected file
- **One problem per issue** — do not group multiple problems into one

---

## Step 7 — Final summary

When done, show a table with all created issues:

| Linear ID | Title | Category | Priority |
|-----------|-------|----------|----------|
| LES-XX    | ...   | [UI]     | High     |
