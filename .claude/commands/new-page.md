Crea una nueva página en Next.js App Router siguiendo las convenciones del proyecto.

## Argumentos
$ARGUMENTS — descripción de la página (ej: "página de diario de sueños en /journal")

## Pasos

1. Lee `CLAUDE.md` y revisa páginas existentes en `/app/[locale]/` para entender el patrón.

2. Determina si la página es:
   - **Pública**: accesible sin auth
   - **Autenticada**: requiere login (redirigir a `/sign-in` si no hay sesión)
   - **Premium**: requiere suscripción activa (mostrar upgrade CTA si es free)

3. Crea el archivo en `/app/[locale]/<ruta>/page.tsx` con esta estructura:

```tsx
import { getTranslations } from 'next-intl/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Para páginas protegidas:
export default async function PageName() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/sign-in')
  // Para premium: if (!session.user.isPremium) → mostrar upgrade CTA

  const t = await getTranslations('NombreDeLaSeccion')

  return (
    <main className="container mx-auto px-4 py-8">
      {/* contenido */}
    </main>
  )
}

export async function generateMetadata() {
  const t = await getTranslations('NombreDeLaSeccion')
  return {
    title: t('pageTitle'),
  }
}
```

4. Si la página necesita datos del servidor, haz el fetch directamente en el Server Component (no useEffect).

5. Agrega las claves de traducción necesarias a `messages/es.json` y `messages/en.json`.

6. Si la ruta es nueva, actualiza la navegación en el header si corresponde.

## Convenciones
- Preferir Server Components — usar Client Components solo cuando se necesite interactividad
- Nunca hardcodear texto visible al usuario (usar `useTranslations` / `getTranslations`)
- El layout base ya incluye header y footer — no duplicarlos
- Clases de TailwindCSS inline, sin CSS modules
- Los estados de loading se manejan con `loading.tsx` en la misma carpeta
