---
name: branch
description: >-
  Crea una rama git para un issue de Linear siguiendo la convención del
  proyecto: leramirezca/{issue-id-lowercase}-{slug}. Parte siempre desde
  develop actualizado.
---

## Convención de nombrado

El formato es exactamente el mismo que genera Linear en el campo `gitBranchName`:

```
leramirezca/{issue-id-lowercase}-{slug-del-titulo}
```

Ejemplos:
- `leramirezca/les-121-seguridad-aumentar-longitud-minima-de-contrasena-a-8`
- `leramirezca/les-99-security-validacion-zod-ausente-en-el-body-de-apiinterpret`

## Pasos

### 1. Obtener el nombre de rama desde Linear

Usa `mcp__linear-server__get_issue` con el ID del issue (ej. `LES-121`).
Lee el campo `gitBranchName` de la respuesta — ese es el nombre exacto a usar.
No generes el slug manualmente; confía en el campo de Linear.

### 2. Actualizar develop y crear la rama

```bash
git checkout develop
git pull origin develop
git checkout -b {gitBranchName}
```

### 3. Confirmar

Muestra al usuario en qué rama quedó y cuál es el issue que resolverá.
