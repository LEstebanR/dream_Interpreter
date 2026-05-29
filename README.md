# Oniric — Dream Interpreter

App web de interpretación de sueños con IA. Usuarios anónimos pueden interpretar sueños gratis; usuarios premium tienen acceso al diario de sueños, modelo IA superior e interpretaciones ilimitadas.

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **UI:** React 19 + TailwindCSS 4 + shadcn/ui + Framer Motion
- **Base de datos:** Prisma ORM + PostgreSQL (Neon serverless)
- **Auth:** NextAuth v5 (Auth.js) + Prisma adapter
- **Pagos:** Stripe (suscripciones recurrentes)
- **IA:** OpenRouter API
- **i18n:** next-intl v4 (EN / ES)
- **Deploy:** Vercel

---

## Setup local

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd dream_Interpreter
```

### 2. Instalar dependencias

Usar siempre **bun**:

```bash
bun install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con los valores correspondientes (ver sección de Variables de entorno abajo).

### 4. Configurar base de datos

```bash
bunx prisma generate
bunx prisma db push
```

### 5. Ejecutar en desarrollo

```bash
bun run dev
```

La app estará disponible en `http://localhost:3000`.

---

## Variables de entorno

### OpenRouter (IA)

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `OPENROUTER_API_KEY` | API key para los modelos de IA | [openrouter.ai/keys](https://openrouter.ai/keys) |

### App

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | URL pública de la app | `https://www.oniricapp.com` |

### Base de datos

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | [neon.tech](https://neon.tech) → crear proyecto → copiar connection string |

### Auth (NextAuth v5)

| Variable | Descripción | Cómo generarla |
|----------|-------------|----------------|
| `NEXTAUTH_SECRET` | Secret para firmar tokens | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL base de la app | `http://localhost:3000` en local |
| `GOOGLE_CLIENT_ID` | ID de la app OAuth de Google | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Secret de la app OAuth de Google | Mismo panel que el anterior |

**Configurar Google OAuth:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crear credenciales → OAuth 2.0 Client IDs
3. Tipo: Web application
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Stripe (pagos)

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `STRIPE_SECRET_KEY` | Secret key de Stripe | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key de Stripe | Mismo panel que el anterior |
| `STRIPE_WEBHOOK_SECRET` | Secret para verificar webhooks | [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) |

**Webhooks en local:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Rate limiting (Upstash Redis)

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `UPSTASH_REDIS_REST_URL` | URL del endpoint REST de Redis | [console.upstash.com](https://console.upstash.com) → crear database |
| `UPSTASH_REDIS_REST_TOKEN` | Token de autenticación REST | Mismo panel que el anterior |

---

## Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Configurar todas las variables de entorno en **Settings → Environment Variables**
3. En producción, `NEXTAUTH_URL` debe ser la URL pública (ej. `https://www.oniricapp.com`)
4. Para los webhooks de Stripe en producción, crear un endpoint apuntando a `https://www.oniricapp.com/api/stripe/webhook`

---

## Scripts disponibles

```bash
bun run dev         # servidor de desarrollo
bun run build       # build de producción
bun run start       # servidor de producción
bun run lint        # linting
bunx prisma studio  # interfaz visual de la base de datos
```
