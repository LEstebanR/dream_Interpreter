Crea o modifica un modelo de Prisma y genera la migración correspondiente.

## Argumentos
$ARGUMENTS — descripción del cambio (ej: "agregar campo mood a DreamEntry")

## Pasos

1. Lee el schema actual en `prisma/schema.prisma`.

2. Aplica el cambio solicitado al schema. Convenciones del proyecto:
   - IDs: `id String @id @default(cuid())`
   - Timestamps: `createdAt DateTime @default(now())` / `updatedAt DateTime @updatedAt`
   - Relaciones: siempre definir ambos lados (`@relation`)
   - Campos opcionales para migraciones en producción: marcar con `?` si hay datos existentes

3. Verifica que los modelos sigan el patrón existente:
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

4. Ejecuta la migración en desarrollo:
   ```bash
   npx prisma migrate dev --name <nombre-descriptivo-en-kebab-case>
   ```

5. Si hay errores de migración, analiza el mensaje y ajusta el schema. No forzar con `--force` sin entender el error.

6. Regenera el cliente Prisma si no se hizo automáticamente:
   ```bash
   npx prisma generate
   ```

7. Verifica el resultado con:
   ```bash
   npx prisma studio
   ```

## Reglas
- Nunca editar archivos dentro de `prisma/migrations/` manualmente
- Si se elimina un campo, primero marcarlo como opcional (`?`), luego en otro commit eliminarlo
- Los nombres de migración deben ser descriptivos en inglés (ej: `add_mood_to_dream_entry`)
- `DATABASE_URL` debe apuntar a la BD de desarrollo, no producción
