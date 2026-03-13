Crea un git commit siguiendo las convenciones de este proyecto.

## Pasos

1. Ejecuta en paralelo:
   - `git status` para ver archivos modificados
   - `git diff HEAD` para ver todos los cambios staged y unstaged
   - `git log --oneline -5` para ver el estilo de commits recientes

2. Analiza los cambios y determina el tipo:
   - `feat`: nueva feature o funcionalidad
   - `fix`: corrección de bug
   - `ui`: cambios de interfaz o estilos
   - `refactor`: reorganización sin cambiar comportamiento
   - `db`: cambios de schema Prisma o migraciones
   - `i18n`: cambios de traducciones o internacionalización
   - `auth`: cambios relacionados con autenticación
   - `payments`: cambios relacionados con Stripe
   - `chore`: deps, config, tooling

3. Formato del mensaje:
   ```
   <tipo>(<scope opcional>): <descripción concisa en infinitivo>

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```

4. Stagea los archivos relevantes (excluir `.env*`, archivos de credenciales) y crea el commit.

5. Ejecuta `git status` para confirmar que el commit fue exitoso.

## Reglas
- Descripción en español, imperativo, sin punto final
- Máximo 72 caracteres en la primera línea
- No incluir archivos `.env`, `.env.local`, ni credenciales
- No usar `--no-verify`
- Si hay cambios en `prisma/schema.prisma`, mencionar los modelos afectados en el scope
