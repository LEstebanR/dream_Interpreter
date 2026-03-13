# Dream Interpreter — CLAUDE.md

Contexto del proyecto para Claude Code. Léelo completo antes de tocar código.

## Descripción

App web de interpretación de sueños con IA. Usuarios anónimos pueden interpretar sueños gratis (modelo básico, limitado). Usuarios premium tienen acceso al diario de sueños, modelo IA superior e interpretaciones ilimitadas.

**URL producción:** configurada en `NEXT_PUBLIC_APP_URL`
**Linear:** https://linear.app/lesteban/project/dream-interpreter-mvp-7db6ffb3f537

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | React 19 + TailwindCSS 4 + shadcn/ui + Radix UI |
| Base de datos | Prisma ORM + PostgreSQL (Neon serverless) |
| Auth | NextAuth v5 (Auth.js) + Prisma adapter |
| Pagos | Stripe (suscripciones recurrentes) |
| IA | OpenRouter API (Vercel AI SDK) |
| i18n | next-intl (EN / ES) |
| Deploy | Vercel |
| Analytics | Vercel Analytics |
| Rate limiting | Upstash Redis (para usuarios free/anónimos) |

---

## Estructura del proyecto

```
/app
  /[locale]               # routing de i18n (next-intl)
    layout.tsx
    page.tsx              # pantalla principal de interpretación
    /journal              # diario de sueños (solo premium)
    /sign-in
    /sign-up
    /profile
    /billing
    /pricing
  /api
    /interpret            # POST — interpretar sueño
    /journal              # CRUD entradas del diario
    /stripe
      /checkout           # crear Checkout Session
      /portal             # Customer Portal Session
      /webhook            # webhook de Stripe
    /auth/[...nextauth]   # NextAuth handler
/components
  /ui                     # shadcn/ui components
/lib
  prisma.ts               # Prisma client singleton
  auth.ts                 # NextAuth config
  stripe.ts               # Stripe client
  utils.ts                # cn(), etc.
/messages
  en.json                 # textos en inglés
  es.json                 # textos en español
/prisma
  schema.prisma
  migrations/
```

---

## Modelos de base de datos (Prisma)

```prisma
User          — id, email, name, image, isPremium, stripeCustomerId, stripeSubscriptionId
DreamEntry    — id, userId, title, dreamText, interpretation, mood, tags[], createdAt
Account       — NextAuth OAuth accounts
Session       — NextAuth sessions
```

---

## Tiers de usuarios

| Tier | Modelo IA | Interpretaciones/día | Diario |
|------|-----------|----------------------|--------|
| Anónimo | `qwen/qwen3-14b:free` | 3 (por IP) | ✗ |
| Free (registrado) | `qwen/qwen3-14b:free` | 5 | ✗ |
| Premium | `anthropic/claude-3.5-haiku` o mejor vía OpenRouter | Ilimitado | ✓ |

La selección de modelo ocurre en `/api/interpret/route.ts` leyendo `session.user.isPremium`.

---

## Variables de entorno

```env
# Existentes
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_URL=

# Nuevas (MVP)
DATABASE_URL=                    # PostgreSQL (Neon)
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=          # rate limiting
UPSTASH_REDIS_REST_TOKEN=
```

Nunca hardcodear valores. Siempre leer desde `process.env`.

---

## Convenciones de código

- **Componentes**: PascalCase, un componente por archivo
- **API routes**: siempre validar con `zod` antes de procesar
- **Auth guard**: usar `getServerSession()` en server components / API routes para verificar premium
- **i18n**: nunca hardcodear texto visible al usuario — usar `useTranslations()` o `getTranslations()`
- **Estilos**: TailwindCSS inline, no CSS modules. Usar `cn()` de `lib/utils.ts` para clases condicionales
- **Prisma**: importar siempre desde `@/lib/prisma` (singleton), nunca instanciar `new PrismaClient()` directo
- **Errores en API**: responder con `{ error: string }` y el código HTTP correcto

---

## Patrones importantes

### Proteger ruta premium (API)
```ts
const session = await getServerSession(authOptions)
if (!session?.user?.isPremium) {
  return NextResponse.json({ error: 'Premium required' }, { status: 403 })
}
```

### Selección de modelo por tier
```ts
const model = session?.user?.isPremium
  ? 'anthropic/claude-3.5-haiku'
  : 'qwen/qwen3-14b:free'
```

### Webhook de Stripe — siempre verificar firma
```ts
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
```

---

## Qué NO hacer

- No crear `new PrismaClient()` fuera de `lib/prisma.ts`
- No hardcodear textos en la UI (usar i18n)
- No bypassear la verificación de firma en el webhook de Stripe
- No exponer el `STRIPE_SECRET_KEY` al cliente
- No usar `useEffect` para fetching — preferir Server Components o React Query
- No mezclar lógica de negocio dentro de componentes UI
