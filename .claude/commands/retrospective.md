Review the latest change and update CLAUDE.md and skills if something relevant was learned.

## What this skill does

Analyzes the diff of the latest commit (or current changes), extracts learnings about patterns, conventions, and decisions made, and updates the project's living documentation so future Claude contexts are more accurate.

## Steps

1. **Get context on the latest change** (run in parallel):
   - `git log --oneline -1` — most recent commit
   - `git diff HEAD~1 HEAD` — full diff of the last commit
   - `git diff HEAD` — uncommitted changes (if any)

2. **Read the current documentation files** (in parallel):
   - `CLAUDE.md`
   - `.claude/commands/` — list all skill files

3. **Analyze the change and answer these questions:**
   - Was a new pattern established that isn't in CLAUDE.md?
   - Was an important architectural decision made?
   - Was a library limitation or gotcha discovered?
   - Did any existing CLAUDE.md convention become outdated?
   - Does any skill need to reflect the new pattern?
   - Was a new dependency added that should be documented?

4. **Update CLAUDE.md** if there's something new to add or correct:
   - New code patterns
   - Architectural decisions made
   - Gotchas or things to avoid discovered in practice
   - New environment variables
   - Changes to the folder structure

5. **Update relevant skills** in `.claude/commands/` if the change affects the documented workflow.

6. **Present a summary** in this format:

---
### Retrospective: `<commit message>`

**What was done:**
<brief description>

**Learnings:**
- <learning 1>
- <learning 2>

**Documentation files updated:**
- `CLAUDE.md` — <which section and why>
- `.claude/commands/<skill>.md` — <what changed> (if applicable)

**No documentation changes because:**
<reason if nothing was updated>
---

## When to update what

| Situation | Action |
|-----------|--------|
| New auth/premium pattern used | Update "Patrones importantes" section in CLAUDE.md |
| New dependency added | Update Stack table in CLAUDE.md |
| Folder structure changed | Update "Estructura del proyecto" section |
| Something discovered that should NOT be done | Add to "Qué NO hacer" section |
| How API routes are created changed | Update `new-api-route.md` |
| Prisma schema changed | Update "Modelos de BD" and `db-migrate.md` |
| Commit flow changed | Update `commit.md` |
