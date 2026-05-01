---
name: pr
description: >-
  Crea un Pull Request en GitHub apuntando a develop, con título y descripción
  estandarizados, vinculado al issue de Linear correspondiente.
---

## Prerequisitos

- Los cambios deben estar commiteados en la rama actual (usa `/commit` si no).
- La rama debe seguir la convención `leramirezca/les-{N}-{slug}` (usa `/branch` si no).

## Paso 1 — Recopilar contexto

Ejecuta en paralelo:
- `git log develop..HEAD --oneline` para ver los commits del PR
- `git diff develop...HEAD --stat` para ver los archivos cambiados
- `mcp__linear-server__get_issue` con el ID del issue (extraído del nombre de la rama: `les-{N}` → `LES-{N}`)

## Paso 2 — Título del PR

Formato: `tipo(scope): descripción corta — LES-{N}`

Tipos válidos:
- `fix` — corrección de bug
- `feat` — nueva funcionalidad
- `security` — mejora de seguridad
- `perf` — rendimiento
- `refactor` — refactorización sin cambio de comportamiento
- `chore` — mantenimiento (deps, config, etc.)
- `docs` — documentación

El scope es el área del código: `auth`, `api`, `ui`, `journal`, `billing`, `i18n`, `db`, etc.

Ejemplo: `security(auth): aumentar longitud mínima de contraseña a 8 — LES-121`

Máximo 72 caracteres.

## Paso 3 — Cuerpo del PR

```markdown
## ¿Qué cambia?

{1-3 bullets concisos describiendo los cambios}

## Archivos modificados

{Lista los archivos clave con una línea de descripción cada uno}

## Criterio de aceptación

{Copia los criterios de aceptación del issue de Linear si los tiene,
o redáctalos a partir de la descripción del issue}

## Linear

Closes LES-{N}
```

## Paso 4 — Crear el PR

```bash
git push -u origin {rama-actual}
gh pr create \
  --base develop \
  --title "{título}" \
  --body "$(cat <<'EOF'
{cuerpo completo}
EOF
)"
```

Devuelve la URL del PR al usuario.
