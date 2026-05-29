Create a git commit following this project's conventions.

## Steps

1. Run in parallel:
   - `git status` to see modified files
   - `git diff HEAD` to see all staged and unstaged changes
   - `git log --oneline -5` to match the recent commit style

2. Analyze the changes and determine the type:
   - `feat`: new feature or functionality
   - `fix`: bug fix
   - `security`: security improvement
   - `ui`: interface or style changes
   - `refactor`: reorganization without behavior change
   - `db`: Prisma schema changes or migrations
   - `i18n`: translation or internationalization changes
   - `auth`: authentication-related changes
   - `payments`: Stripe-related changes
   - `chore`: deps, config, tooling
   - `perf`: performance improvement

3. Commit message format:
   ```
   <type>(<optional scope>): <concise description in imperative mood>

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```

4. Stage the relevant files (exclude `.env*`, credential files) and create the commit.

5. Run `git status` to confirm the commit succeeded.

## Rules
- Message in **English**, imperative mood, no trailing period
- Max 72 characters on the first line
- If the commit resolves a Linear issue, append ` — LES-N` to the description
- Never include `.env`, `.env.local`, or credential files
- Never use `--no-verify`
- If `prisma/schema.prisma` changed, mention the affected models in the scope
