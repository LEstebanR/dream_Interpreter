Crea un nuevo API route en Next.js App Router siguiendo las convenciones del proyecto.

## Argumentos
$ARGUMENTS — descripción de la ruta a crear (ej: "POST /api/journal para guardar entrada del diario")

## Pasos

1. Lee `CLAUDE.md` para entender las convenciones del proyecto.

2. Determina la ruta correcta dentro de `/app/api/` según lo solicitado.

3. Crea el archivo `route.ts` con esta estructura base:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación
const schema = z.object({
  // campos según la ruta
})

export async function POST(req: NextRequest) {
  // 1. Auth check (si aplica)
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Premium check (si aplica)
  if (!session.user.isPremium) {
    return NextResponse.json({ error: 'Premium required' }, { status: 403 })
  }

  // 3. Validar body
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // 4. Lógica de negocio
  try {
    // ...
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[ROUTE_NAME]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

4. Adapta la estructura según el método HTTP (GET no tiene body, usar `searchParams`).

5. Si la ruta requiere i18n, asegúrate de que el error message use `getTranslations()`.

6. Verifica que no se exponga información sensible en las respuestas de error.

## Convenciones
- Siempre validar con `zod` antes de acceder a los datos
- Siempre hacer auth check primero, luego premium check
- Responder `{ error: string }` en errores, `{ data: T }` en éxito
- Log de errores con prefijo `[NOMBRE_RUTA]` para facilitar debugging
