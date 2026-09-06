# Roadmap posterior al Skill-Driven Delta Audit

**Fecha:** 6 de septiembre de 2026  
**Fuente:** [`AUDIT.md`](./AUDIT.md)  
**Estado:** Hitos 1–2 completados; Hitos 3–4 pendientes

## Principios de orden

1. Cerrar primero la actualización de skills para que los siguientes cambios sean reproducibles.
2. Corregir semántica antes de volver a optimizar el mismo componente; el DOM final es la base que debe medirse.
3. Añadir cada guardrail dentro del hito que protege, no crear una fase de testing separada y sobredimensionada.
4. Mantener el diseño, la arquitectura feature-first, HeroUI y los catálogos actuales salvo evidencia nueva.

## Resumen de hitos

| Orden | Hito                                            | Prioridad | Estado     | Findings                               | Resultado verificable                                                       |
| ----: | ----------------------------------------------- | --------- | ---------- | -------------------------------------- | --------------------------------------------------------------------------- |
|     1 | Cerrar la actualización y precedencia de skills | P2        | COMPLETADO | `SKILL-001`                            | Lock, directorios y referencias internas coinciden.                         |
|     2 | Corregir el contrato accesible del marquee      | P2        | COMPLETADO | `A11Y-002`, parte de `TEST-002`        | Una única colección accesible de botones; copias visuales fuera de AT/foco. |
|     3 | Cerrar LCP y presupuesto de ruta inicial        | P2        | PENDIENTE  | `PERF-001`, `PERF-002`, `BASELINE-001` | LCP medido contra objetivo y presupuesto de JS inicial automatizado.        |
|     4 | Hacer fiel el resumen de lint                   | P3        | PENDIENTE  | `GATE-001`                             | `test:all` informa warnings reales o lint falla con ellos.                  |

No hay hitos P0, P1 ni P4 nuevos. `DEPLOY-001` queda invalidado por la aclaración del usuario. Los findings `CONFIRMED`, `DOC-001` y `SKILL-CONFLICT-001` no generan trabajo adicional.

## Hito 1 — Cerrar la actualización y precedencia de skills

- **Prioridad:** P2
- **Estado:** COMPLETADO (6 de septiembre de 2026)
- **Objetivo:** hacer determinista el catálogo que se usará en los siguientes hitos.
- **Áreas:** `.agents/skills/`, `skills-lock.json` y reglas locales de uso.
- **Secuencia:**
  1. decidir el conjunto final de las 14 skills presentes;
  2. retirar del lock las tres entradas sin directorio o restaurarlas si su eliminación no era intencional;
  3. reparar el enlace de medición de `web-quality-audit`;
  4. resolver explícitamente los prerrequisitos ausentes de TypeScript, sin inventar skills fantasma;
  5. documentar precedencia: `AGENTS.md` y contratos del proyecto → evidencia medida → skills específicas → reglas genéricas;
  6. validar automáticamente que cada entrada del lock y cada referencia requerida existe.
- **Tests/comprobaciones:** script/check no destructivo de rutas; matriz pequeña de prompts positivos/negativos para comprobar triggers solapados.
- **Criterios de aceptación:** lock y disco enumeran el mismo catálogo; cero links requeridos rotos; cada overlap tiene owner/precedencia; `find-skills` no se activa en auditorías ordinarias.
- **Riesgo:** bajo; no toca producto.
- **No incluye:** fusionar contenido de terceros, instalar skills adicionales por conveniencia ni cambiar reglas de producto.
- **Cierre y validación:** el catálogo final contiene 14 skills tanto en disco como en `skills-lock.json`; se retiraron las tres entradas obsoletas. `web-quality-audit` enlaza únicamente guías instaladas y `typescript-best-practices` quedó autocontenida, sin prerrequisitos fantasma. `AGENTS.md` define la precedencia de reglas. El nuevo `pnpm check:skills` valida catálogo, frontmatter y enlaces locales, y se ejecuta desde `test:all` y CI. La matriz de aplicabilidad permanece en `docs/AUDIT.md`. El validador Python genérico de `skill-creator` no pudo arrancar porque el runtime no incluye PyYAML; el check Node del repositorio cubrió las invariantes requeridas sin añadir una dependencia. `pnpm test:all` terminó con 97 tests superados y el nuevo gate verde.

## Hito 2 — Corregir el contrato accesible del marquee

- **Prioridad:** P2
- **Estado:** COMPLETADO (6 de septiembre de 2026)
- **Dependencia:** Hito 1
- **Objetivo:** preservar la experiencia visual/clicable sin duplicar controles para teclado o tecnología asistiva.
- **Áreas:** `random-item-marquee.tsx`, `ui/marquee/` y `e2e/planner/marquee.spec.ts`.
- **Secuencia:**
  1. convertir los 16 targets primarios en botones con nombre accesible;
  2. hacer que las copias sean réplicas visuales fuera del árbol accesible y no enfocables;
  3. preservar, si sigue siendo requisito, la selección por puntero en copias mediante una superficie no semántica;
  4. mantener pausa hover/focus y `prefers-reduced-motion`;
  5. sustituir en Playwright la expectativa de `link` por el contrato final de roles, foco y selección.
- **Tests/comprobaciones:** keyboard journey, árbol/roles accesibles dirigidos, click primario y de copia, reduced motion, 390 px sin overflow. Añadir axe solo como smoke pequeño si no introduce ruido.
- **Criterios de aceptación:** exactamente 16 acciones de selección accesibles; ninguna copia aparece como control o entra en tab; todos los botones tienen nombre; click y teclado seleccionan objetivo; no cambia la estética.
- **Riesgo:** medio por la interacción entre semántica, duplicación animada y requisito de click en copias.
- **No incluye:** retirar el marquee, cambiar los 16 items aleatorios o rediseñar el empty state.
- **Cierre y validación:** las 16 acciones primarias son botones nativos con nombre accesible. Las copias animadas permanecen clicables por puntero, pero sus grupos están fuera del árbol accesible mediante `aria-hidden`, sus botones usan `tabIndex=-1` y el puntero no les transfiere el foco. El contrato E2E comprueba el recuento de roles, nombres, ausencia de links, foco, selección primaria y de copia, y movimiento reducido. `pnpm test:all` terminó con 98 tests superados (83 unitarios y 15 E2E), además de formato, tipos y build en verde.

## Hito 3 — Cerrar LCP y presupuesto de ruta inicial

- **Prioridad:** P2
- **Dependencia:** Hito 2, para medir el DOM definitivo
- **Objetivo:** sacar al marquee decorativo del camino crítico o justificar conscientemente su coste, y detectar regresiones de bundle.
- **Áreas:** estrategia de carga de imágenes del marquee, ruta Planner, build/reporting y `README-STRUCTURE.md`.
- **Secuencia:**
  1. conservar el perfil de laboratorio de esta auditoría como baseline provisional;
  2. hacer determinista el recurso crítico o diferir imágenes decorativas hasta después del contenido principal;
  3. ejecutar al menos tres cargas frías por variante y comparar mediana, no una sola traza;
  4. comprobar que CLS, interacción del marquee y reduced motion no empeoran;
  5. establecer un presupuesto de JS inicial gzip a partir de 177,32 kB, con margen explícito y mensaje accionable;
  6. actualizar el baseline fechado en `README-STRUCTURE.md`.
- **Tests/comprobaciones:** build de producción, tres trazas móviles con perfil idéntico, smoke funcional y gate de tamaño. Los tests E2E normales siguen en Vite dev; no se mezclan con benchmarks.
- **Criterios de aceptación:** mediana LCP local ≤2.500 ms con el perfil declarado, o excepción documentada con evidencia y siguiente umbral; ningún asset aleatorio cambia el resultado de forma material; presupuesto de entry detecta una regresión real sin perseguir el warning raw de Vite.
- **Riesgo:** medio; optimizar imágenes puede alterar la percepción del estado vacío.
- **No incluye:** `manualChunks` cosmético, deep imports no soportados de HeroUI, sustitución del design system ni virtualización adicional.

## Hito 4 — Hacer fiel el resumen de lint

- **Prioridad:** P3
- **Dependencia:** puede ejecutarse después de los P2; no bloquea producto.
- **Objetivo:** que el gate agregado no afirme “0 problems” si ESLint ha reportado warnings.
- **Áreas:** `scripts/test-all.mjs`, script `lint` y el warning puntual de `supply-modal.tsx`.
- **Secuencia:**
  1. elegir política: warnings visibles o `--max-warnings=0`;
  2. adaptar el parser/resumen para contar errores y warnings con exit 0 o distinto de cero;
  3. eliminar la dependencia innecesaria `items` del `useMemo`;
  4. añadir un test mínimo del parser si se conserva lógica propia.
- **Tests/comprobaciones:** salida simulada con 0/1 warnings y ejecución real de `pnpm lint` + `pnpm test:all`.
- **Criterios de aceptación:** resumen y salida de ESLint coinciden; el repositorio queda sin warning conocido; un warning futuro es visible o falla según la política elegida.
- **Riesgo:** bajo.

## Próximo hito exacto

El siguiente hito es **Hito 3 — Cerrar LCP y presupuesto de ruta inicial**. La primera acción es reproducir el baseline móvil con el DOM definitivo y el mismo perfil de laboratorio antes de cambiar la estrategia de carga de las imágenes decorativas.

## Definición de terminado del roadmap

El roadmap queda cerrado cuando:

- el catálogo de skills es autoconsistente y reproducible;
- el marquee ofrece un único conjunto accesible de acciones sin perder su interacción visual;
- LCP y bundle tienen baseline, objetivo y guardrail explícitos;
- `test:all` representa fielmente warnings y errores;
- `pnpm test:all` y las comprobaciones específicas de performance pasan con evidencia fresca;
- ningún catálogo protegido ha sido modificado.
