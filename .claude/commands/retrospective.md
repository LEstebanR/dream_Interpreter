Evalúa el último cambio realizado en el proyecto y actualiza CLAUDE.md y las skills si se aprendió algo relevante.

## Qué hace esta skill

Analiza el diff del último commit (o cambios actuales), extrae aprendizajes sobre patrones, convenciones y decisiones tomadas, y actualiza la documentación viva del proyecto para que futuros contextos de Claude sean más precisos.

## Pasos

1. **Obtén contexto del último cambio** (ejecutar en paralelo):
   - `git log --oneline -1` — commit más reciente
   - `git diff HEAD~1 HEAD` — diff completo del último commit
   - `git diff HEAD` — cambios no commiteados (si los hay)

2. **Lee los archivos de documentación actuales** (en paralelo):
   - `CLAUDE.md`
   - `.claude/commands/` — lista todos los archivos de skills

3. **Analiza el cambio y responde estas preguntas:**
   - ¿Se estableció algún patrón nuevo que no está en CLAUDE.md?
   - ¿Se tomó una decisión de arquitectura importante?
   - ¿Se descubrió una limitación o gotcha de alguna librería?
   - ¿Alguna convención existente en CLAUDE.md quedó desactualizada?
   - ¿Alguna skill necesita reflejar el nuevo patrón?
   - ¿Se agregó una nueva dependencia que debería documentarse?

4. **Actualiza CLAUDE.md** si hay algo nuevo que agregar o corregir:
   - Nuevos patrones de código
   - Decisiones de arquitectura tomadas
   - Gotchas o cosas a evitar descubiertas en la práctica
   - Nuevas variables de entorno
   - Cambios en la estructura de carpetas

5. **Actualiza skills relevantes** en `.claude/commands/` si el cambio afecta el flujo de trabajo documentado allí.

6. **Presenta un resumen** con este formato:

---
### Retrospectiva: `<mensaje del commit>`

**Qué se hizo:**
<descripción breve>

**Aprendizajes:**
- <aprendizaje 1>
- <aprendizaje 2>

**Archivos de documentación actualizados:**
- `CLAUDE.md` — <qué sección y por qué>
- `.claude/commands/<skill>.md` — <qué cambió> (si aplica)

**Sin cambios en documentación porque:**
<razón si no se actualizó nada>
---

## Cuándo actualizar qué

| Situación | Acción |
|-----------|--------|
| Se usó un patrón nuevo para auth/premium | Actualizar sección "Patrones importantes" en CLAUDE.md |
| Se agregó una dependencia nueva | Actualizar tabla de Stack en CLAUDE.md |
| Se cambió estructura de carpetas | Actualizar sección "Estructura del proyecto" |
| Se descubrió algo que NO hacer | Agregar a sección "Qué NO hacer" |
| Se cambió cómo se crean API routes | Actualizar `new-api-route.md` |
| Se cambió el schema de Prisma | Actualizar sección "Modelos de BD" y `db-migrate.md` |
| Se cambió el flujo de commits | Actualizar `commit.md` |
