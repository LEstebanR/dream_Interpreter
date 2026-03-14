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
    layout.tsx            # Server Component — fonts, providers, metadata, AuthSessionProvider
    page.tsx              # Server Component — título, ícono, <DreamSection />
    /sign-in              # página de login
    /sign-up              # página de registro
    /journal              # diario de sueños (solo premium) — pendiente
    /profile              # pendiente
    /billing              # pendiente
    /pricing              # pendiente
  /api
    /interpret            # POST — interpretar sueño (con fallback de modelos)
    /auth
      /[...nextauth]      # handlers NextAuth v5
      /register           # POST — registro con email/password
    /journal              # CRUD entradas del diario — pendiente
    /stripe               # pendiente
/components
  dream-section.tsx       # Client island — estado interpretación + TextBox
  text-box.tsx            # Client island — input + llamada a API
  /auth
    sign-in-form.tsx      # Client island — formulario login + Google OAuth
    sign-up-form.tsx      # Client island — formulario registro
  /providers
    session-provider.tsx  # Client wrapper de SessionProvider (next-auth/react)
  /ui
    header.tsx            # Server Component (fixed, con UserInfo + AuthButtons)
    footer.tsx            # Server Component
    auth-buttons.tsx      # Client island — sign-in/sign-up/sign-out
    user-info.tsx         # Client island — avatar + nombre cuando hay sesión
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
  auth.ts                 # NextAuth v5 config — exporta { handlers, signIn, signOut, auth }
  prisma.ts               # Singleton PrismaClient
  utils.ts                # cn(), etc.
/prisma
  schema.prisma           # modelos: User, Account, Session, VerificationToken, DreamEntry
/types
  next-auth.d.ts          # extensiones de tipos: session.user.id, session.user.isPremium
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
# IA
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_URL=

# Base de datos
DATABASE_URL=                    # PostgreSQL (Neon)

# Auth (NextAuth v5 usa AUTH_SECRET, no NEXTAUTH_SECRET)
AUTH_SECRET=                     # openssl rand -base64 32
# AUTH_URL solo necesaria fuera de Vercel; en Vercel se auto-detecta

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Rate limiting
UPSTASH_REDIS_REST_URL=
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
- **Auth guard**: usar `auth()` de `@/lib/auth` en Server Components/API routes (NextAuth v5). En Client Components usar `useSession()` de `next-auth/react`
- **i18n**: nunca hardcodear texto visible al usuario — usar `useTranslations()` o `getTranslations()`
- **Estilos**: TailwindCSS inline, no CSS modules. Usar `cn()` de `lib/utils.ts` para clases condicionales
- **Prisma**: importar siempre desde `@/lib/prisma` (singleton), nunca instanciar `new PrismaClient()` directo
- **Errores en API**: responder con `{ error: string }` y el código HTTP correcto

---

## Patrones importantes

### Proteger ruta premium (API)
```ts
// NextAuth v5: usar auth() directamente, no getServerSession(authOptions)
const session = await auth()
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
- `header.tsx` → Server Component que importa `<UserInfo />`, `<AuthButtons />`, `<LocaleSwitcher />` (todos client)
- `footer.tsx` → Server Component que importa `<AnimatedHeart />` (client)
- `page.tsx` → Server Component que importa `<DreamSection />` (client)

### Layout body — estructura correcta
```tsx
// Usar flex + min-h-screen + pt-12 (NO grid + min-h-dvh que causa layout shift en Chrome)
<body className="flex flex-col min-h-screen pt-12">
  <AuthSessionProvider>
    <NextIntlClientProvider messages={messages}>
      <Header />  {/* position: fixed, top-0, left-0, right-0, h-12 */}
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  </AuthSessionProvider>
</body>
```

### Header fijo — por qué `fixed` y no `sticky`
`sticky` dentro de un grid con `min-h-dvh` causa layout shift en Chrome al hacer soft navigation (ej. cambio de locale con Framer Motion). Usar `position: fixed` + `pt-12` en body como compensación. `min-h-dvh` cambia dinámicamente en Chrome; usar `min-h-screen` (100vh) es más estable.

### Google OAuth — imágenes de avatar
Agregar `lh3.googleusercontent.com` a `images.remotePatterns` en `next.config.ts`:
```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
},
```

### Prisma en Vercel — siempre generar el cliente
Vercel cachea `node_modules`, por lo que el Prisma Client puede quedar desactualizado. Agregar al build script:
```json
"build": "prisma generate && next build"
```

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
- No usar `getServerSession(authOptions)` — es la API de NextAuth v4; en v5 usar `auth()` de `@/lib/auth`
- No usar `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — NextAuth v5 usa `AUTH_SECRET`; `AUTH_URL` solo necesaria fuera de Vercel
- No usar `grid min-h-dvh` en el body layout — causa layout shift en Chrome al cambiar locale; usar `flex flex-col min-h-screen`
- No usar `sticky` en el header si el body es grid — usar `fixed` con `pt-12` en body como compensación
