Create a new API route in Next.js App Router following project conventions.

## Arguments
$ARGUMENTS — description of the route to create (e.g. "POST /api/journal to save a dream entry")

## Steps

1. Read `CLAUDE.md` to understand project conventions.

2. Determine the correct path under `/app/api/` based on the request.

3. Create the `route.ts` file with this base structure:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  // fields as needed
})

export async function POST(req: NextRequest) {
  // 1. Auth check (if applicable)
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Premium check (if applicable)
  if (!session.user.isPremium) {
    return NextResponse.json({ error: 'Premium required' }, { status: 403 })
  }

  // 3. Validate body
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 4. Business logic
  try {
    // ...
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[ROUTE_NAME]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

4. Adapt the structure for the HTTP method (GET uses `searchParams`, no body).

5. If the route needs i18n error messages, use `getTranslations()`.

6. Verify no sensitive data is exposed in error responses.

## Conventions
- Always validate with `zod` before accessing data
- Always do auth check first, then premium check
- Return `{ error: string }` on errors, `{ data: T }` on success
- Log errors with prefix `[ROUTE_NAME]` for easier debugging
- Use `auth()` from `@/lib/auth` (NextAuth v5) — never `getServerSession(authOptions)`
