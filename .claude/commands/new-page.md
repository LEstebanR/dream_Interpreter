Create a new page in Next.js App Router following project conventions.

## Arguments
$ARGUMENTS — description of the page (e.g. "dream journal page at /journal")

## Steps

1. Read `CLAUDE.md` and review existing pages in `/app/[locale]/` to understand the pattern.

2. Determine the page type:
   - **Public**: accessible without auth
   - **Authenticated**: requires login (redirect to `/sign-in` if no session)
   - **Premium**: requires active subscription (show upgrade CTA if free)

3. Create the file at `/app/[locale]/<route>/page.tsx` with this structure:

```tsx
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PageName({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // For protected pages:
  const session = await auth()
  if (!session) redirect(`/${locale}/sign-in`)
  // For premium: if (!session.user.isPremium) → show upgrade CTA

  const t = await getTranslations('SectionName')

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      {/* content */}
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'SectionName' })
  return { title: t('pageTitle') }
}
```

4. If the page needs server data, fetch it directly in the Server Component (no useEffect).

5. Add the required translation keys to `messages/es.json` and `messages/en.json`.

6. If the route is new, update header navigation if needed.

## Conventions
- Prefer Server Components — use Client Components only when interactivity is required
- Never hardcode visible text (use `useTranslations` / `getTranslations`)
- The base layout already includes header and footer — do not duplicate them
- TailwindCSS inline classes, no CSS modules
- Loading states use `loading.tsx` in the same folder
- Use `auth()` from `@/lib/auth` (NextAuth v5)
