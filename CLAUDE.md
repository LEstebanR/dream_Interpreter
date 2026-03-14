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
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | React 19 + TailwindCSS 4 + shadcn/ui + Radix UI + Framer Motion |
| Base de datos | Prisma ORM + PostgreSQL (Neon serverless) |
| Auth | NextAuth v5 (Auth.js) + Prisma adapter |
| Pagos | Stripe (suscripciones recurrentes) |
| IA | OpenRouter API (fetch directo, sin Vercel AI SDK) |
| i18n | next-intl v4 (EN / ES) |
| Deploy | Vercel |
| Analytics | Vercel Analytics |
| Rate limiting | Upstash Redis (para usuarios free/anónimos) |

---

## Estructura del proyecto

```
/app
  layout.tsx              # root layout mínimo (pass-through)
  page.tsx                # redirect al locale por defecto
  /[locale]               # routing de i18n (next-intl)
    layout.tsx            # Server Component — fonts, providers, metadata
    page.tsx              # Server Component — título, ícono, <DreamSection />
    /journal              # diario de sueños (solo premium) — pendiente
    /sign-in              # pendiente
    /sign-up              # pendiente
    /profile              # pendiente
    /billing              # pendiente
    /pricing              # pendiente
  /api
    /interpret            # POST — interpretar sueño (con fallback de modelos)
    /journal              # CRUD entradas del diario — pendiente
    /stripe               # pendiente
    /auth/[...nextauth]   # pendiente
/components
  dream-section.tsx       # Client island — estado interpretación + TextBox
  text-box.tsx            # Client island — input + llamada a API
  /ui
    header.tsx            # Server Component
    footer.tsx            # Server Component
    locale-switcher.tsx   # Client island — toggle EN/ES con Framer Motion
    animated-heart.tsx    # Client island — corazón palpitante
    # shadcn/ui components...
/i18n
  routing.ts              # defineRouting — locales: ['es', 'en']
  navigation.ts           # createNavigation (Link, useRouter, usePathname)
  request.ts              # getRequestConfig — carga mensajes por locale
/messages
  en.json                 # textos en inglés
  es.json                 # textos en español
/lib
  utils.ts                # cn(), etc.
middleware.ts             # next-intl locale routing
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
| Anónimo | `nvidia/nemotron-3-nano-30b-a3b:free` | 3 (por IP) | ✗ |
| Free (registrado) | `nvidia/nemotron-3-nano-30b-a3b:free` | 5 | ✗ |
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

## Package manager

Usar siempre **bun** para instalar dependencias y ejecutar scripts:
```bash
bun add <paquete>
bun add -d <paquete>   # devDependency
bun run <script>
```
Nunca usar `npm`, `yarn` o `pnpm`.

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
  : 'nvidia/nemotron-3-nano-30b-a3b:free'
```

### Fallback de modelos OpenRouter
Los modelos gratuitos se dan de baja sin previo aviso. Siempre usar un array de fallback:
```ts
const FREE_MODELS = [
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'stepfun/step-3.5-flash:free',
  'arcee-ai/trinity-large-preview:free',
];
// Reintentar recursivamente solo en 404; otros errores lanzar directo
```

### SSR — Server Components con Client Islands
Mantener la mayor parte del árbol como Server Components. Solo marcar `"use client"` en el componente más pequeño posible:
- `header.tsx` → Server Component que importa `<LocaleSwitcher />` (client)
- `footer.tsx` → Server Component que importa `<AnimatedHeart />` (client)
- `page.tsx` → Server Component que importa `<DreamSection />` (client)

### next-intl sin plugin (workaround @swc/core)
El plugin `createNextIntlPlugin` falla en bun porque el `@swc/core` anidado no tiene binarios nativos. Usar alias manual en `next.config.ts`:
```ts
turbopack: { resolveAlias: { 'next-intl/config': './i18n/request.ts' } },
webpack(config) {
  config.resolve.alias['next-intl/config'] = path.resolve('./i18n/request.ts');
  return config;
},
```

### Animaciones de texto generado por IA
No usar typewriter carácter por carácter (dificulta la lectura). Usar reveal palabra por palabra con CSS transitions:
```tsx
// 60ms por palabra, fade + blur + translateY en cada span
setInterval(() => setVisibleCount(c => c + 1), 60)
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
- No usar `react-type-animation` — da mala UX para textos largos (carácter por carácter obliga al ojo a seguir el cursor); usar `WordReveal` propio
- No usar `createNextIntlPlugin` — falla con bun por binarios nativos de `@swc/core`; usar alias manual en `next.config.ts`
- No asumir que un modelo gratuito de OpenRouter sigue disponible — siempre definir fallbacks
