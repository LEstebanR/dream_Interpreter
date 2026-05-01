Create or modify a Prisma model and generate the corresponding migration.

## Arguments
$ARGUMENTS — description of the change (e.g. "add mood field to DreamEntry")

## Steps

1. Read the current schema at `prisma/schema.prisma`.

2. Apply the requested change to the schema. Project conventions:
   - IDs: `id String @id @default(cuid())`
   - Timestamps: `createdAt DateTime @default(now())` / `updatedAt DateTime @updatedAt`
   - Relations: always define both sides (`@relation`)
   - Optional fields for production migrations: mark with `?` if existing data is present

3. Verify models follow the existing pattern:
   ```prisma
   model DreamEntry {
     id             String   @id @default(cuid())
     userId         String
     user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
     title          String
     dreamText      String   @db.Text
     interpretation String   @db.Text
     mood           String?
     tags           String[]
     createdAt      DateTime @default(now())
     updatedAt      DateTime @updatedAt
   }
   ```

4. Run the migration in development:
   ```bash
   bun run prisma migrate dev --name <descriptive-name-in-kebab-case>
   ```

5. If migration errors occur, analyze the message and adjust the schema. Never force with `--force` without understanding the error.

6. Regenerate the Prisma client if not done automatically:
   ```bash
   bun run prisma generate
   ```

## Rules
- Never manually edit files inside `prisma/migrations/`
- If removing a field, first mark it optional (`?`), then remove it in a separate commit
- Migration names must be descriptive in **English** (e.g. `add_mood_to_dream_entry`)
- `DATABASE_URL` must point to the development DB, not production
