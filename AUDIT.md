# Auditoría técnica de StarRupture Planner

**Fecha de cierre original:** 2 de septiembre de 2026  
**Fecha de reinicio del roadmap:** 4 de septiembre de 2026  
**Rama auditada originalmente:** `desing-base` (`de121b9`)  
**Baseline actual:** `master` (`first commit`)  
**Estado:** auditoría técnica conservada; roadmap reiniciado; Fases 1–2 completadas y validadas.

## 1. Executive Summary

StarRupture Planner tiene una base mejor de lo que su deuda visible sugiere. La lógica principal del Planner está separada en funciones puras, las páginas suelen limitarse a componer features, el estado calculado no se persiste innecesariamente, la tabla de Items ya está virtualizada y la rama actual incorpora un Base Designer bien dividido entre lógica, UI, persistencia y tests. No se recomienda sustituir esta arquitectura por capas enterprise, repositorios, DTOs ni validación runtime generalizada.

El proyecto todavía no es, sin embargo, una baseline fiable para seguir creciendo. Los riesgos principales son concretos:

1. los comandos documentados no son reproducibles con la versión de `pnpm` disponible porque el lockfile y `node_modules` proceden de pnpm 8.12.0 y el proyecto no fija versión de Node/pnpm;
2. la auditoría de dependencias devuelve 46 avisos, casi todos arrastrados por una dependencia `geist` usada únicamente para copiar dos fuentes, además de React Router 7.15.1 y el `dagre` antiguo;
3. existen dos bugs funcionales confirmados: el estado de supply admite `0` aunque las vistas aplican reglas diferentes, y el filtro por building pierde productores alternativos en 26 items;
4. la selección de suministros no es operable por teclado y sus controles no tienen nombres accesibles;
5. la navegación y la barra del Planner quedan recortadas en 390 px;
6. el estado vacío del Planner produce un LCP móvil medido de 4.827 ms, dominado por una imagen lazy de un marquee descubierta tarde;
7. Playwright está correctamente iniciado como WIP, pero hoy no puede ejecutar sus dos tests con el flujo documentado;
8. `AGENTS.md` no contiene la invariante más importante: los JSON de `src/shared/data` son de solo lectura.

No se detectaron P0, corrupción de datos, exposición de secretos, llamadas de red propias, autenticación mal planteada ni un motivo para una reescritura. El plan recomendado es estabilizar tooling y dependencias, corregir invariantes y accesibilidad bloqueante, cerrar límites arquitectónicos, optimizar la ruta inicial con medición y finalmente ampliar las pruebas y la documentación.

### Distribución de findings

| Prioridad | Cantidad | Lectura                                                         |
| --------- | -------: | --------------------------------------------------------------- |
| P0        |        0 | No hay fallo crítico que obligue a detener el producto.         |
| P1        |        9 | Baseline, bugs, accesibilidad operativa, responsive y LCP.      |
| P2        |       13 | Arquitectura, datos, bundle, cobertura, documentación y skills. |
| P3        |        2 | Tipado de React Flow y código muerto verificado.                |
| P4        |        2 | SEO básico y assets huérfanos.                                  |

## 2. Alcance, método y límites

Se realizaron las 16 pasadas solicitadas: discovery, Git, documentación, flujo de datos, arquitectura, estructura, duplicación, React/TypeScript, UI, tests, ejecución, bugs, rendimiento, accesibilidad/SEO, AGENTS/skills, preguntas y roadmap. Se inspeccionó el repositorio completo, no solo `src`.

La evaluación runtime se hizo sobre build de producción local mediante Chrome DevTools, en escritorio y en viewport móvil. Playwright CLI se inspeccionó y se intentó ejecutar, pero no se descargaron navegadores ni se alteró el entorno para forzar un resultado. Los valores de rendimiento son mediciones de laboratorio locales, no datos de usuarios reales.

La seguridad permanece fuera de alcance salvo el problema evidente de dependencias detectado por `pnpm audit --prod`. No se propone autenticación, sanitización general, schemas runtime, servicios, repositorios ni otras capas que no corresponden a esta SPA de datos locales.

## 3. Estado Git

### Baseline actual para reiniciar el roadmap

- `master` contiene un único commit raíz llamado `first commit`.
- El contenido funcional procede de `desing-base` (`de121b9`), previamente verificado por el usuario.
- Node `24.20.0`, pnpm `11.19.0`, lockfile v9 y el hoist de HeroUI forman parte del baseline, pero no cierran por sí solos el Hito 1.1.
- La presentación de HeroUI fue comprobada por el usuario tras reconstruir dependencias con pnpm 11.
- Todos los hitos se reabren y deberán implementarse, comprobarse y fusionarse de nuevo de forma aislada.
- Los remotos se mantienen fuera del alcance de esta reconstrucción local.

### Estado observado durante la auditoría original

- Working tree limpio antes de crear este documento.
- Rama actual: `desing-base`, sincronizada con `origin/desing-base` en `de121b9`.
- Rama principal detectada: `master`, sincronizada con `origin/master` en `ed52c04`.
- Merge-base: `ed52c049ab08224e9b2e3aa23d2c1a961e84c96d`.
- Divergencia `master...desing-base`: 0 commits exclusivos de `master`, 4 commits exclusivos de `desing-base`.
- Un único worktree: el directorio actual.
- No había staged, unstaged ni untracked al cerrar la investigación.

### Trabajo de la rama actual

La rama añade 57 archivos o modificaciones, con aproximadamente 3.225 inserciones y 32 eliminaciones. Los commits son `mejoras#1b` a `mejoras#1e`. La mayor parte corresponde a:

- Base Designer: canvas, catálogo, drag, colisiones, conexiones, historial, persistencia y tests;
- configuración y dos recorridos iniciales de Playwright;
- documentación asociada;
- un asset de teleporter.

Este conjunto se clasifica como `WIP_EXPECTED`, no como deuda heredada. Los findings sobre Base Designer y E2E distinguen esa procedencia. No se cambió de rama, no se creó worktree adicional y no se ejecutaron operaciones destructivas.

### Contexto histórico útil

El `roadmap.md` de `master` estaba completado y fue retirado en la rama actual. Sus decisiones previas se respetan en esta auditoría:

- los stores Zustand permanecen centralizados en `src/store`;
- la virtualización de Items fue una decisión medida, no un accidente;
- los colores de Flow ya se centralizaron;
- HeroUI ya se analizó parcialmente y no debe reemplazarse sin medición;
- el stutter de la primera visita a rutas lazy seguía como problema observado.

El tab interno `Buildings` del Planner apareció en `24f050b` usando exactamente el mismo componente que `Items` y sin comportamiento propio. La decisión de producto ha sido retirarlo por ahora, conservando la funcionalidad como futura.

## 4. Arquitectura detectada

La arquitectura real es **feature-first híbrida**:

```text
src/
├─ pages/          composición de rutas
├─ features/       planner, items, recipes, corporations, base-designer
├─ shared/         UI reutilizable, tipos, datos y utilidades
├─ store/          stores Zustand centralizados por convención del proyecto
├─ router/         rutas y carga lazy
├─ layouts/        shell de aplicación
└─ lib/            lógica realmente compartida entre features
```

La forma general es adecuada para el tamaño del producto. `pages` es delgado; la lógica compleja del Planner y Base Designer vive mayoritariamente en `lib`; y `shared/ui` ya ofrece una jerarquía razonable (`Flex`, `Grid`, `Panel`, `Page*`, `Typography`, `AssetImage`, `TreeList`). La corrección necesaria no es cambiar de paradigma, sino hacer cumplir sus límites y resolver excepciones concretas.

### Regla arquitectónica propuesta

1. Una página solo compone APIs públicas de features y componentes shared.
2. Dentro de una feature se usan imports directos, nunca su propio barrel.
3. Entre features se usa la API pública del `index.ts`; no se importan `lib/` internos de otra feature.
4. Los stores siguen físicamente en `src/store`, pero solo importan tipos o funciones puras del dominio propietario mediante rutas directas, nunca un barrel o UI.
5. `src/shared/data` expone un catálogo derivado ligero; los JSON permanecen intactos.
6. `src/shared` solo recibe código neutral reutilizado; `src/lib` se reserva para reglas de dominio compartidas entre dos o más features.

## 5. Estructura detectada

### Fortalezas

- Nombres de archivo mayoritariamente en kebab-case y componentes en PascalCase.
- Tests unitarios colocados junto a su propietario.
- Features grandes con subdominios explícitos (`planner/flow`, `base-designer/lib`, `base-designer/ui`).
- Componentes de layout compartido que evitan repetir geometría de páginas.
- Configuración de Flow separada de nodos y del builder.

### Desviaciones

- El router exporta simultáneamente configuración y metadata consumida por el layout, creando un ciclo.
- Hay imports internos a través del barrel propio de Planner.
- Items importa directamente un `lib` interno de Corporations.
- `items.store.ts` importa su tipo desde el barrel de Items, que vuelve a importar código dependiente del store.
- `pagedevui` y el lazy import de su página están en el grafo de producción aunque la ruta solo exista en desarrollo.
- Existen dos hogares compartidos (`src/lib` y `src/shared/utils`) cuya diferencia está documentada, pero debe mantenerse estricta para no convertirse en ambigüedad futura.

No se propone aplanar indiscriminadamente carpetas ni mover Base Designer dentro de `store`. La profundidad actual está justificada por responsabilidades reales.

## 6. Flujo de datos

El flujo principal observado es:

```text
JSON externo no editable por agentes
  → src/shared/data/index.ts (asociaciones de corporations)
  → data.store.ts (catálogo estático expuesto como Zustand)
  → hooks/providers de feature
  → transformaciones puras
  → vistas React / React Flow

Inputs del usuario
  → planner.store.ts (sessionStorage) / base-designer.store.ts (localStorage)
  → plan o diseño derivados
  → múltiples representaciones sincronizadas
```

La separación entre datos estáticos e inputs editables es conceptualmente correcta. La debilidad es que un catálogo que nunca cambia se trata como estado observable y, al mismo tiempo, Base Designer importa un JSON directamente. Esto genera dos patrones de acceso y varios índices locales. La solución propuesta es un módulo de catálogo simple y tipado, no una capa de repositorios.

## 7. Invariante de `src/shared/data`

Los siguientes cuatro JSON son **fuente externa local, versionada y de solo lectura para editores y agentes**. No pueden modificarse durante refactors, tests, optimizaciones, normalizaciones o correcciones:

| Archivo                            |  Bytes | SHA-256 observado                                                  |
| ---------------------------------- | -----: | ------------------------------------------------------------------ |
| `buildings_and_recipes.json`       | 61.497 | `01F6D5694700EB78678CCA9B7ED5AE04EA8297E7417E96EB24B41D401B91CBB1` |
| `buildings_construction_area.json` |    377 | `926DB5824FD134B0770C166A2D005F22FC286C765E44F95235E1B6C9AF5939AC` |
| `corporations_components.json`     | 26.730 | `195B686526CEBB1C2FBA819C1619F13D11246518539EEDD9EF095C01D7697649` |
| `items_catalog.json`               |  9.452 | `34F5DF54B841D97E10BCE5A7E39825AE780D4D44C4A45EEC8BEFAD438752DC68` |

Snapshot auditado:

- 104 items;
- 44 buildings;
- 130 recetas;
- 5 corporations;
- 4 registros de área de construcción;
- 23 buildings sin propiedad `recipes`;
- 26 items con más de un building productor;
- cero IDs duplicados y cero referencias de recetas/corporations rotas en las comprobaciones realizadas.

`buildings_construction_area.json` solo aporta medidas a `base_core`, `ore_excavator`, `smelter` y `solar_generator_v1`. Como `base_core` no es colocable desde el catálogo, 3 de 43 edificios colocables tienen medida respaldada por datos y 40 usan el fallback estimado `4×4`. Por decisión de producto, ese fallback se conserva, pero debe presentarse como estimación.

Esto no impide reemplazarlos deliberadamente cuando una actualización del juego aporte nuevos datos. Los hashes son evidencia de esta auditoría, no una invitación a duplicarlos ni a introducir validación runtime. Las transformaciones normales deben vivir alrededor de la fuente.

## 8. Tooling

### Stack

- Vite 7, React 19, TypeScript 5.9 y Tailwind 4.
- HeroUI como biblioteca de componentes.
- Zustand para estado editable.
- React Flow + Dagre para diagramas.
- TanStack Virtual para la tabla de Items.
- Vitest + Testing Library y Playwright.

### Configuración observada

- `package.json` no declara `packageManager` ni `engines`.
- `pnpm-lock.yaml` usa lockfile v6.
- `node_modules/.modules.yaml:1195` declara `pnpm@8.12.0`; el entorno auditado usa pnpm 11.19.0.
- Prettier se declara como fuente de verdad en `AGENTS.md:22`, pero no está instalado ni existe script `format`/`format:check`.
- No existe CI.
- `tsconfig.app.json:31` solo incluye `src`; `tsconfig.node.json:25` solo incluye `vite.config.ts`. Playwright, `e2e/` y su config no se type-checkean en `pnpm build`.
- La configuración Playwright sí tiene buenas bases: `baseURL`, `webServer`, paralelismo, retries solo en CI y evidencias solo en fallo/retry (`playwright.config.ts:3-31`).

## 9. Baseline de ejecución

| Comprobación                                 | Resultado            | Evidencia / interpretación                                                                                        |
| -------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm test` documentado                      | **FAIL de tooling**  | pnpm 11 intenta reconciliar una instalación de pnpm 8/lockfile v6 y no completa el flujo no interactivo.          |
| Vitest con binarios ya instalados            | **PASS**             | 16 archivos, 64 tests, aproximadamente 4,11 s.                                                                    |
| `pnpm lint` documentado                      | **FAIL de tooling**  | Misma incompatibilidad de package manager.                                                                        |
| ESLint con binarios ya instalados            | **PASS**             | Sin errores.                                                                                                      |
| `pnpm build` documentado                     | **FAIL de tooling**  | Misma incompatibilidad de package manager.                                                                        |
| TypeScript + Vite con binarios ya instalados | **PASS con warning** | 4.433 módulos; entry JS 687,02 kB minificado / 194,16 kB gzip; CSS 273,00 kB / 35,20 kB gzip.                     |
| Descubrimiento Playwright                    | **PASS**             | 2 tests descubiertos.                                                                                             |
| `pnpm test:e2e`                              | **FAIL de entorno**  | El `webServer` usa `pnpm dev`; al arrancar Vite aparte, falta el Chromium headless-shell esperado por Playwright. |
| `pnpm audit --prod`                          | **FAIL del gate**    | 46 avisos: 23 high, 19 moderate y 4 low.                                                                          |

Los PASS directos demuestran que el código compila y la suite unitaria actual está verde. No demuestran reproducibilidad desde un checkout limpio. La baseline oficial debe ser siempre el flujo documentado desde instalación limpia.

### Runtime medido

| Escenario                                   | Métrica       |       Resultado |
| ------------------------------------------- | ------------- | --------------: |
| Planner, desktop local sin throttling       | LCP           |          754 ms |
| Planner, 390×844, CPU ×4 y Slow 4G          | LCP           | 4.827 ms (poor) |
| Ambos escenarios                            | CLS           |               0 |
| Primera navegación Planner → Items, Fast 4G | INP observado |           17 ms |

En móvil, el elemento LCP fue `tube.webp`: se encoló alrededor de 3.882 ms, con prioridad baja y carga lazy. La cadena crítica llegó aproximadamente a 4.246 ms. Se midió además un forced reflow de 63 ms asociado a la lectura de `offsetWidth` del marquee (`src/features/planner/ui/marquee/index.tsx:16-31`). El problema es el descubrimiento tardío y el diseño del estado vacío, no una necesidad genérica de recomprimir todos los iconos.

## 10. Findings detallados

### DX-001 — El entorno no es reproducible desde los comandos oficiales

- **Prioridad:** P1
- **Categoría:** DX / CONFIG
- **Esfuerzo:** S
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** El repositorio exige pnpm, pero no fija su versión ni la de Node. El lockfile v6 y `node_modules` fueron generados por pnpm 8.12.0, mientras el entorno actual usa 11.19.0. Los comandos documentados intentan reconciliar/reinstalar el árbol y no llegan a ejecutar el check previsto en el contexto no interactivo.

**Evidencia.** `package.json:21-32` define scripts pero no `packageManager`; tampoco hay `engines`. `pnpm-lock.yaml:1` usa `lockfileVersion: '6.0'`. `node_modules/.modules.yaml:1195` registra pnpm 8.12.0. `README.md:62-70` y `AGENTS.md:7-18` presentan esos comandos como baseline suficiente.

**Impacto.** Un checkout limpio, CI o un agente puede obtener un resultado distinto al desarrollador actual. Todos los demás gates pierden credibilidad.

**Causa raíz.** Toolchain implícito y árbol instalado conservado desde una versión antigua.

**Solución propuesta.** Elegir una versión soportada de Node y pnpm, declararlas en `engines`/`packageManager`, regenerar una vez el lockfile con esa versión y documentar una instalación congelada. Añadir `format` y `format:check` con Prettier o retirar de `AGENTS.md` la afirmación de que es fuente de verdad.

**Dependencias.** Ninguna.

**Criterio de aceptación.** Desde un checkout limpio, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test` y `pnpm build` terminan sin prompts ni reescrituras del lockfile.

### DEP-001 — El árbol de producción arrastra dependencias obsoletas y 46 avisos

- **Prioridad:** P1
- **Categoría:** CONFIG
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `pnpm audit --prod` informa 23 avisos high, 19 moderate y 4 low. Veintiocho corresponden a `next` y otros once a sus transitivas (`postcss`, `nanoid`, `browserslist`, `sharp`, Babel), todos introducidos por `geist@1.7.1`. `geist` no participa en runtime: solo se usa para copiar dos WOFF2 ya versionados (`scripts/copy-geist-fonts.cjs:4-16`). También hay cinco avisos de `react-router@7.15.1` y dos de `lodash@4.17.23` mediante `dagre@0.8.5`.

**Evidencia.** Dependencias en `package.json:34-48`; script de fuentes en `package.json:26` y `scripts/copy-geist-fonts.cjs:4-16`; salida auditada de `pnpm audit --prod` el 2-09-2026.

**Impacto.** El gate de seguridad no puede estar verde y cada instalación incorpora una superficie innecesaria. La mayoría de avisos de Next/SSR/RSC no son explotables por esta SPA y `lodash.template` no se usa directamente, por lo que no se debe confundir conteo con riesgo remoto efectivo; aun así, el árbol es objetivamente evitable.

**Causa raíz.** Dependencia de runtime usada como herramienta de copia, paquete Dagre legado y React Router sin sus parches actuales.

**Solución propuesta.** Eliminar `geist` y conservar los WOFF2 ya versionados con su licencia/procedencia; eliminar `@heroicons/react` y `lucide` si la comprobación final confirma que siguen sin imports; mover `@types/dagre` a dev o, preferiblemente, migrar con tests de layout a `@dagrejs/dagre`, que mantiene tipos nativos; actualizar React Router dentro de la línea compatible y repetir auditoría/build/E2E.

**Dependencias.** DX-001 para que el lockfile sea estable.

**Criterio de aceptación.** `pnpm audit --prod` no contiene avisos evitables de `geist`, React Router ni Dagre; build y diagramas conservan comportamiento; el lockfile solo contiene dependencias realmente usadas.

### E2E-001 — Playwright existe, pero el flujo documentado no puede ejecutarse

- **Prioridad:** P1
- **Categoría:** E2E / DX
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** WIP_EXPECTED

**Problema.** Hay configuración y dos specs limpias, pero `pnpm test:e2e` depende de un `pnpm dev` que falla por DX-001. Al iniciar Vite directamente, Playwright falla antes del primer paso porque no está instalado el Chromium headless-shell requerido.

**Evidencia.** `playwright.config.ts:24-31`; comandos en `e2e/README.md:10-36`; dos tests en `e2e/smoke/navigation.spec.ts:3-27` y `e2e/base-designer/building-catalog.spec.ts:3-16`. La documentación oficial de Playwright exige instalar los binarios compatibles con la versión del paquete.

**Impacto.** La nueva suite no protege la rama WIP y un colaborador no sabe completar el setup.

**Causa raíz.** Playwright fue añadido durante el WIP sin cerrar instalación reproducible, typecheck y CI.

**Solución propuesta.** Añadir un script explícito `test:e2e:install` para Chromium, documentarlo, incluir config/specs en un tsconfig de tooling y ejecutar un smoke Chromium en CI. Mantener CLI como camino principal, sin dependencia de Playwright MCP.

**Dependencias.** DX-001.

**Criterio de aceptación.** En checkout limpio, instalación + comando documentado ejecutan los dos specs; un error produce trace/screenshot/video según la configuración y los tests son type-checkeados.

### AGENT-001 — `AGENTS.md` omite las invariantes que más deben proteger los agentes

- **Prioridad:** P1
- **Categoría:** AGENT / DOC
- **Esfuerzo:** XS
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `AGENTS.md` menciona dónde viven los datos, pero no prohíbe modificar los cuatro JSON. Tampoco define la frontera ligera de transformaciones, la regla de comentarios útiles ni el flujo humano → Playwright solicitado.

**Evidencia.** `AGENTS.md:3-30`; ausencia de la invariante en todo el archivo.

**Impacto.** Un agente puede normalizar, reordenar o usar los JSON como fixtures editables durante un refactor, violando el contrato fundamental del proyecto.

**Causa raíz.** La guía se actualizó con features y comandos, no con invariantes operativas.

**Solución propuesta.** Añadir una sección corta “Non-negotiable invariants”: JSON de solo lectura, adaptadores alrededor, stores centralizados, tests obligatorios según tipo de cambio, comentarios que expliquen decisiones y no líneas obvias. Evitar convertirla en una enciclopedia.

**Dependencias.** Ninguna.

**Criterio de aceptación.** Un agente que solo lea `AGENTS.md` puede responder dónde transformar datos, qué archivos no tocar y qué gates ejecutar.

### BUG-001 — Supply admite tres realidades incompatibles (`0`, `1` y ausencia)

- **Prioridad:** P1
- **Categoría:** BUG / DATA / REACT
- **Esfuerzo:** S
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `addSupplyItem` crea `{itemId: 0}` (`planner.store.ts:78-81`). `NumberInput` declara mínimo 1 (`supply-card.tsx:72-81`), el cálculo convierte toda entrada a mínimo 1 (`calculate-totals.ts:11-16`) y el Flow representa el valor bruto (`flow-nodes.ts:29-45`). Añadir un supply puede enseñar 1 en el control y `0.0/min` en un nodo; además se crea un nodo aunque el item no participe en el plan actual.

**Evidencia.** Las líneas anteriores y `planner.store.test.ts:63-70`, que hoy fija como correcto el estado `{ ceramics: 0 }`; `plan-to-flow.ts:32-36` genera nodos para todas las claves.

**Impacto.** Cálculo y representaciones dejan de compartir una fuente semántica. El usuario ve datos contradictorios y nodos huérfanos.

**Causa raíz.** La presencia de una clave se usa a la vez como “seleccionado” y como cantidad válida.

**Solución propuesta.** Aplicar la decisión confirmada: supply activo significa cantidad `>= 1`; cantidad `<= 0` significa ausencia. Crear con 1, normalizar al rehidratar estados antiguos y construir nodos solo para supply realmente consumido/conectado por el plan o definir explícitamente una sección de supply no utilizado fuera del grafo.

**Dependencias.** Ninguna.

**Criterio de aceptación.** Store, input, plan, TreeList y Flow muestran el mismo valor; nunca existe una clave con 0; un supply ajeno al target no crea un nodo sin conexión; tests cubren alta, decremento, rehidratación y cambio de target.

### BUG-002 — El filtro de Items pierde productores alternativos

- **Prioridad:** P1
- **Categoría:** BUG / DATA
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** El índice de filas conserva solo el primer building que produce cada item (`build-items-table-rows.ts:5-14`) y el filtro compara un único `buildingId` (`filter-items.ts:15-18`). Los datos contienen 26 items con dos buildings productores. El selector ofrece ambos edificios, por lo que escoger una variante alternativa puede devolver cero resultados falsos.

**Evidencia.** `src/features/items/lib/build-items-table-rows.ts:5-31`, `src/features/items/filter-items.ts:4-19`, `src/features/items/types/items.types.ts:10-13` y recuento derivado de los JSON.

**Impacto.** Resultado funcional incorrecto y filtro engañoso.

**Causa raíz.** El contrato de fila modela una relación uno-a-uno cuando el dominio es uno-a-muchos.

**Solución propuesta.** Según la decisión confirmada, modelar `producerBuildingIds`/productores como colección. Mantener un productor canónico solo para la celda visual si se desea, pero filtrar contra todos. Centralizar el índice por output para que Planner e Items compartan la misma regla.

**Dependencias.** DATA-001/DATA-002 pueden implementarse en el mismo hito, sin bloquear el bugfix.

**Criterio de aceptación.** Cada una de las 26 relaciones múltiples aparece al filtrar por cualquiera de sus buildings; test unitario específico para una pareja base/upgrade.

### A11Y-001 — El flujo de suministros no es operable de forma accesible

- **Prioridad:** P1
- **Categoría:** A11Y / UI
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** El modal presenta items como `<li>` con `onClick` (`supply-modal.tsx:63-84`), sin botón, tabulación ni manejo de teclado. Las cuatro acciones icon-only de cada card y el `NumberInput` no tienen nombre accesible (`supply-card.tsx:64-88`). El árbol de accesibilidad confirmó controles sin nombre y ausencia de los items como controles.

**Evidencia.** Archivos/líneas anteriores; snapshot de accesibilidad en runtime.

**Impacto.** Usuarios de teclado o lector de pantalla no pueden seleccionar ni ajustar supplies con seguridad.

**Causa raíz.** Contenedores visuales se convirtieron en controles sin adoptar semántica nativa; se confió en iconos visibles.

**Solución propuesta.** Usar `<button>` o `Button` dentro de cada `<li>`, mantener la lista semántica, añadir labels que incluyan item, dirección y salto (`Reduce Ceramics supply by 10`), y etiquetar el input. No añadir roles manuales cuando un botón nativo resuelve el contrato.

**Dependencias.** BUG-001 para fijar el mínimo.

**Criterio de aceptación.** Todo el flujo se completa con teclado; axe/Lighthouse no informa controles sin nombre; Playwright selecciona y edita un supply usando roles y nombres.

### UI-001 — La navegación y controles críticos se recortan en móvil

- **Prioridad:** P1
- **Categoría:** UI / RESPONSIVE
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** En 390×844 la barra de navegación mide aproximadamente 555 px y el shell oculta overflow (`root-layout.tsx:15-49`): parte de Corporations, My Base y GitHub queda fuera de alcance visual. En Planner, el grupo TargetItem (256 px) + rate (112 px) no puede partirse internamente (`planner-toolbar.tsx:8-16`, `target-item-select.tsx:13-20`, `target-rate-input.tsx:13-20`) y el extremo derecho queda recortado.

**Evidencia.** Medición y captura runtime a 390×844; clases/anchuras citadas.

**Impacto.** Rutas y control de producción dejan de ser utilizables en pantallas pequeñas.

**Causa raíz.** Navegación desktop sin estrategia responsive y overflow global oculto.

**Solución propuesta.** Sustituir el tablist de rutas por navegación responsive real: enlaces compactos/scroll con affordance o menú móvil accesible. Permitir que selector y rate se apilen o usen anchuras `minmax`. Probar 320, 390, 768 y desktop.

**Dependencias.** Ninguna; coordinar con A11Y-002.

**Criterio de aceptación.** Todas las rutas y controles son visibles/alcanzables sin scroll horizontal del viewport en 320 px y 390 px; navegación por teclado y URL siguen funcionando.

### PERF-001 — El estado vacío del Planner causa LCP móvil pobre

- **Prioridad:** P1
- **Categoría:** PERF / UI
- **Clasificación:** MEASURED
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** El LCP móvil de laboratorio es 4.827 ms. El candidato es un icono del marquee lazy y de prioridad baja, descubierto después de ejecutar JS. El marquee clona 16 links tantas veces como calcula tras leer layout (`random-item-marquee.tsx:18-31`, `marquee/index.tsx:16-52`), genera 386 elementos iniciales y una lectura forzada medida en 63 ms.

**Evidencia.** Trace de producción descrito en Baseline; `AssetImage` usa lazy por defecto (`asset-image.tsx:19-20,56-66`).

**Impacto.** La primera impresión en red/CPU móvil cruza el umbral “poor” de Core Web Vitals, aunque desktop sea rápido.

**Causa raíz.** Contenido decorativo/interactivo animado domina el LCP y solo se descubre tras hidratar, medir y resolver imágenes lazy.

**Solución propuesta.** Rediseñar el empty state para que el contenido principal sea estable y temprano. Renderizar una sola colección semántica, ocultar/inertizar clones si se conserva el loop, evitar medición síncrona, detener movimiento con reduced motion y cargar eager/high-priority solo el candidato visual realmente above-the-fold. Reperfilar antes de tocar el pipeline global de imágenes.

**Dependencias.** A11Y-002 para semántica de clones; PERF-002 para baseline de bundle.

**Criterio de aceptación.** LCP móvil de laboratorio <2.500 ms en el mismo perfil, CLS <0,1, sin forced reflow significativo del marquee y una sola copia tabbable de cada acción.

### BUG-003 — Las materias primas están soportadas por el motor, pero ocultas en una entrada

- **Prioridad:** P2
- **Categoría:** BUG / UI
- **Esfuerzo:** XS
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `TargetItemSelect` ofrece los 104 items (`target-item-select.tsx:7-26`) y una prueba runtime con `ore_calcium` generó un plan válido. Sin embargo, Items oculta el botón Planner cuando `type === 'raw'` (`items-table-cells.tsx:39-49`) y el estado vacío dice que se elija solo processed/component/ammunition (`page-planner.tsx:34-39`).

**Evidencia.** `src/features/planner/ui/target-item-select.tsx:7-26`, `src/features/items/ui/items-table/items-table-cells.tsx:39-49` y `src/pages/page-planner/page-planner.tsx:34-39`; ejecución directa del cálculo con `ore_calcium` completada durante la auditoría.

**Impacto.** Dos entradas a la misma capacidad contradicen el comportamiento real.

**Causa raíz.** Restricción UI histórica no reflejada en el motor ni en el selector principal.

**Solución propuesta.** Aplicar la decisión confirmada: permitir Planner para raw, actualizar copy y añadir un test de una materia prima.

**Dependencias.** Ninguna.

**Criterio de aceptación.** Un raw item puede abrirse desde Items, seleccionarse directamente y mostrar el mismo plan; copy y tests lo declaran explícitamente.

### UI-002 — El tab interno `Buildings` es una copia funcional de `Items`

- **Prioridad:** P2
- **Categoría:** UI / STRUCTURE
- **Esfuerzo:** XS
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `DIAGRAM_TABS` asigna tanto `items` como `buildings` a `ProductionItemsDiagram` (`flow/diagram/index.tsx:29-40`). No hay implementación, test o historia que justifique una diferencia actual.

**Evidencia.** `src/features/planner/ui/flow/diagram/index.tsx:29-40`; el historial sitúa la introducción del tab en `24f050b` y la búsqueda de consumidores no encuentra otro renderer específico de Buildings.

**Impacto.** Añade ruido, promete una vista que no existe y duplica navegación sin valor.

**Causa raíz.** Placeholder de una feature futura expuesto como terminado.

**Solución propuesta.** Por decisión confirmada, retirar únicamente el tab interno `Buildings` del Planner. No retirar la ruta principal “Buildings & Recipes”. Mantener la idea fuera del código productivo hasta definir su contrato.

**Dependencias.** Ninguna.

**Criterio de aceptación.** El Planner muestra Network graph, Tree list e Items; ninguna vista duplicada; navegación principal de recetas permanece.

### ARCH-001 — Router y layout forman un ciclo de módulos

- **Prioridad:** P2
- **Categoría:** ARCH
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `router.tsx` importa `RootLayout` (`router.tsx:1`) y `RootLayout` importa `productionRoutes` desde ese mismo módulo (`root-layout.tsx:1`).

**Evidencia.** `src/router/router.tsx:1` y `src/layouts/root-layout.tsx:1`; ambos imports forman un ciclo directo de dos módulos.

**Impacto.** El orden de inicialización queda acoplado, dificulta tests del shell y mezcla configuración React Router con metadata de navegación.

**Causa raíz.** Una exportación cómoda convirtió el router en fuente de dos responsabilidades.

**Solución propuesta.** Extraer metadata (`path`, label/icon) a `router/navigation.ts` o derivarla de una definición sin elementos React. Router y layout importan esa fuente; ninguno se importa mutuamente.

**Dependencias.** Coordinar con UI-001/A11Y-002, que cambiarán la navegación.

**Criterio de aceptación.** Grafo de imports acíclico entre `router` y `layouts`; tests unitarios pueden importar metadata sin cargar el router.

### ARCH-002 — Los límites públicos de features se incumplen y generan ciclos evitables

- **Prioridad:** P2
- **Categoría:** ARCH / STRUCTURE
- **Esfuerzo:** S
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** Tres archivos internos de Planner importan `usePlannerTarget` desde el barrel que los exporta (`target-item-select.tsx:5`, `target-rate-input.tsx:1`, `random-item-marquee.tsx:5`). `items.store.ts:1` importa un tipo desde el barrel de Items, que exporta hooks/componentes que vuelven al store. Items entra directamente en el `lib` privado de Corporations (`items-table-cells.tsx:2`), contradiciendo `README-STRUCTURE.md:32-35`.

**Evidencia.** `src/features/planner/ui/target-item-select.tsx:5`, `target-rate-input.tsx:1`, `random-item-marquee.tsx:5`, `src/store/items.store.ts:1`, `src/features/items/ui/items-table/items-table-cells.tsx:2` y `README-STRUCTURE.md:32-35`.

**Impacto.** Ciclos de inicialización/type graph, API pública ambigua y refactors que requieren conocer internals de otra feature.

**Causa raíz.** Uso uniforme de alias/barrels sin distinguir imports internos de externos.

**Solución propuesta.** Imports directos dentro de una feature; exportar `getCorporationLevelPath` desde la API pública de Corporations; importar el tipo de Items desde `features/items/types`; documentar y lintar la convención si una regla simple puede hacerlo sin plugin pesado.

**Dependencias.** ARCH-001 puede ejecutarse en el mismo bloque.

**Criterio de aceptación.** Ninguna feature se importa a sí misma por su barrel; no hay imports inter-feature a subcarpetas privadas; stores no importan barrels de UI.

### DATA-001 — Los tipos no representan fielmente la fuente externa

- **Prioridad:** P2
- **Categoría:** DATA / TS
- **Esfuerzo:** S
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `Building.recipes` es obligatorio (`building.type.ts:21-29`), pero 23 de 44 buildings no tienen esa propiedad. `CorporationsById` dice que sus claves son IDs (`corporations.type.ts:23-29`), mientras el JSON usa nombres visibles como `Future Health Solutions` (`corporations_components.json:1-4`). `Item.corporations` es opcional (`item.type.ts:5-10`), aunque el adapter siempre produce un array (`shared/data/index.ts:20-24`). Casts en el borde ocultan estas diferencias.

**Evidencia.** `src/features/recipes/types/building.type.ts:21-29`, `src/features/corporations/types/corporations.type.ts:23-29`, `src/features/items/types/item.type.ts:5-10`, `src/shared/data/index.ts:20-24` y conteo de las 44 entradas de `buildings_and_recipes.json` (23 sin `recipes`).

**Impacto.** TypeScript comunica invariantes falsas, obliga a `?? []` dispersos y puede permitir bugs durante nuevas transformaciones.

**Causa raíz.** Tipos escritos según el modelo deseado, no según las dos etapas reales: fuente JSON y modelo enriquecido.

**Solución propuesta.** Representar `recipes?` en el tipo de fuente o normalizarlo una sola vez a `[]`; renombrar el mapa de corporations por nombre o convertirlo explícitamente a un mapa por ID; definir un tipo enriquecido donde `corporations` sea obligatorio. Mantener uno o pocos casts auditables en el boundary; no añadir schemas runtime generales.

**Dependencias.** AGENT-001 para fijar el contrato.

**Criterio de aceptación.** Los tipos reflejan la etapa que describen; features no necesitan adivinar si `recipes`/`corporations` existen; no se modifica ningún JSON.

### DATA-002 — El catálogo estático tiene acceso e índices fragmentados

- **Prioridad:** P2
- **Categoría:** DATA / CENTRALIZATION
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** HIGH
- **Origen:** BASE

**Problema.** `data.store.ts:19-24` envuelve arrays estáticos en Zustand aunque nunca cambian durante la ejecución. La mayoría de features consume el store, pero Base Designer importa JSON directamente (`base-designer.store.ts:100`). Se reconstruyen mapas de items en distintas vistas y se repiten búsquedas `.find`; además, `NON_PRODUCING_TYPES` está duplicado exactamente en `items/ui/filters/building-select.tsx:8` y `planner/lib/building-variants.ts:3`.

**Evidencia.** `src/store/data.store.ts:19-24`, `src/store/base-designer.store.ts:100`, `src/features/items/ui/filters/building-select.tsx:8` y `src/features/planner/lib/building-variants.ts:3`; inventario de imports/definiciones realizado con `rg`.

**Impacto.** Dos patrones para la misma fuente, conocimiento de relaciones disperso y riesgo de que Items y Planner interpreten de forma distinta qué produce un building. Con 104 items el coste de CPU es pequeño: el impacto principal es mantenibilidad, no rendimiento.

**Causa raíz.** La centralización se aplicó como store de datos en vez de como catálogo derivado y reglas de dominio.

**Solución propuesta.** Crear un módulo ligero en `src/shared/data` que exporte arrays tipados de solo lectura e índices estables (`itemById`, `buildingById`, `buildingsByOutputItemId`, asociación de corporations). Extraer `isProductionBuilding` a una regla de dominio compartida. Retirar `useDataStore` gradualmente. No crear repository/service/cache dinámico.

**Dependencias.** DATA-001 y BUG-002.

**Criterio de aceptación.** Una única API documentada consume los JSON; las relaciones compartidas se calculan una vez; no hay duplicación de `NON_PRODUCING_TYPES`; componentes no se suscriben a estado que nunca cambia.

### ERROR-001 — Los errores de ruta se presentan como un 404 genérico

- **Prioridad:** P2
- **Categoría:** ARCH / UI
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** HIGH
- **Origen:** BASE

**Problema.** El mismo `errorElement={<NotFound />}` se usa para no-match y errores lanzados por loaders/render de la ruta (`router.tsx:58-63`). `NotFound` se monta fuera de `RootLayout`, carece de `<main>` y su “404” usa el `Typography` por defecto, que es `<p>` (`not-found.tsx:6-22`, `typography.tsx:25-40`).

**Evidencia.** `src/router/router.tsx:58-63`, `src/pages/not-found/not-found.tsx:6-22` y `src/shared/ui/typography/typography.tsx:25-40`; inspección del árbol de rutas confirma que el `errorElement` sustituye al shell.

**Impacto.** Un fallo real se oculta como navegación incorrecta, dificultando diagnóstico y degradando semántica.

**Causa raíz.** Error boundary y página 404 se trataron como el mismo estado.

**Solución propuesta.** Crear un error boundary de ruta mínimo que use `useRouteError`, distinga 404 de fallo inesperado y ofrezca reintento/volver. Mantener el shell y un único landmark principal. No implantar infraestructura global compleja.

**Dependencias.** ARCH-001 para dejar el árbol de rutas limpio.

**Criterio de aceptación.** URL inexistente muestra 404 semántico; error intencional de una ruta muestra mensaje de fallo distinto; ambos permiten volver y tienen heading/landmark correctos.

### A11Y-002 — La semántica global y varios nombres accesibles no coinciden con la UI

- **Prioridad:** P2
- **Categoría:** A11Y / UI
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** La navegación de rutas usa Tabs con callbacks en lugar de enlaces (`root-layout.tsx:23-41`), por lo que pierde semántica de navegación, copiar URL y abrir en pestaña. Lighthouse detectó un `ul` de Navbar con hijo `div` no válido. La marca es `h1` en todas las rutas (`root-layout.tsx:17-21`), causando dos H1 en páginas con título y ninguno propio en Items/Planner. El Autocomplete de target no tiene label (`target-item-select.tsx:13-20`). El nombre de enlaces de corporation no contiene literalmente el texto visible `L.n` (`items-table-cells.tsx:53-69`). Los chips de categoría midieron contraste 3,76:1. Los clones del marquee son todos tabbables. `TreeListNode` usa `div role=button` (`tree-list-node.tsx:24-34`) y el contenedor no expone semántica de árbol.

**Evidencia.** `src/layouts/root-layout.tsx:17-41`, `src/features/planner/ui/target-item-select.tsx:13-20`, `src/features/items/ui/items-table/items-table-cells.tsx:53-69` y `src/shared/ui/treelist/tree-list-node.tsx:24-34`; inspección DOM/Lighthouse de Planner, Items y Base Designer y medición de contraste 3,76:1.

**Impacto.** Navegación y estructura difíciles de entender con tecnologías asistivas; regresiones visibles en Lighthouse (92 en Planner, 94 en Items/Base Designer).

**Causa raíz.** Componentes visuales reutilizados fuera de su semántica y ARIA añadido después del contenido.

**Solución propuesta.** Usar `nav` + links reales para rutas; marca no-heading; un H1 por página; labels visibles u `aria-label` correctos; ajustar token de categoría; una copia interactiva del marquee; botón nativo en TreeList y, si se declara tree, implementar el patrón completo, o mantener lista expandible simple sin roles incompletos.

**Dependencias.** UI-001 y PERF-001 comparten shell/marquee.

**Criterio de aceptación.** Axe/Lighthouse sin estos fallos, un H1 por ruta, nombres accesibles contienen el label visible y toda navegación funciona con teclado y enlaces nativos.

### PERF-002 — El entry bundle es grande y carga CSS de React Flow globalmente

- **Prioridad:** P2
- **Categoría:** PERF / CONFIG
- **Clasificación:** MEASURED
- **Esfuerzo:** M
- **Riesgo:** MEDIUM
- **Confianza:** HIGH
- **Origen:** BASE

**Problema.** Vite avisa por un entry de 687,02 kB minificado / 194,16 kB gzip; CSS 273,00 kB / 35,20 kB gzip. El sourcemap de diagnóstico atribuye la mayoría a React DOM, React Router, HeroUI Theme/React Aria y utilidades de su ecosistema, no al código de negocio. `main.tsx:2-6` carga HeroUIProvider y CSS de React Flow para todas las rutas. Aunque `/dev/ui` solo se registra en DEV, su lazy import se declara fuera del condicional (`router.tsx:13,21-28`) y el build emitió un chunk de 56,45 kB.

**Evidencia.** Salida de `vite build` y análisis de sourcemap durante la auditoría; `src/main.tsx:2-6` y `src/router/router.tsx:13,21-28`; manifest de producción con chunk Dev UI de 56,45 kB.

**Impacto.** Mayor parse/compile y cadena crítica inicial, especialmente en móvil. El chunk DEV no se descarga inicialmente, pero aumenta artefacto y revela que el límite no se elimina.

**Causa raíz.** Dependencias visuales globales y límites lazy incompletos. Importar desde `@heroui/react` no es por sí solo la causa: el bundle contiene componentes realmente usados.

**Solución propuesta.** Mover CSS de React Flow a las rutas/features que lo necesitan, hacer que el import de Dev UI sea eliminable en producción y medir el coste del shell HeroUI. No añadir `manualChunks` para ocultar warnings ni reemplazar HeroUI masivamente. Establecer presupuestos de gzip y comparar cada cambio.

**Dependencias.** DX-001 para builds reproducibles; UI-001 puede cambiar el shell.

**Criterio de aceptación.** Build de producción no emite Dev UI; rutas sin Flow no solicitan su CSS; el entry gzip baja de forma medida y queda un budget automatizado sin regresión funcional.

### TEST-001 — Faltan unit tests justo en las fronteras donde aparecieron bugs

- **Prioridad:** P2
- **Categoría:** TEST / VITEST
- **Esfuerzo:** M
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** Los 64 tests existentes protegen bien cálculo del plan, associations, persistencia/colisiones/conexiones de Base Designer y stores. No hay test para `buildItemsTableRows`, productor múltiple, construcción de nodos/edges con supply no utilizado, árbol vs Flow, tipos/índices derivados o rutas de error. El test del store consolida actualmente el bug de supply a cero.

**Evidencia.** 16 archivos de Vitest; `planner.store.test.ts:63-70`; ausencia de tests junto a `build-items-table-rows.ts`, `flow-nodes.ts`, `plan-to-flow.ts` y `tree-build.ts`.

**Impacto.** Refactors en datos y representaciones pueden pasar con una vista correcta y otra rota.

**Causa raíz.** Cobertura creció por feature, pero no se revisó contra relaciones cross-view y casos one-to-many.

**Solución propuesta.** Añadir tests de comportamiento a las funciones puras y stores modificados por cada hito. Prioridad: supply invariant, todos los productores, raw target, plan→flow/tree y error parsing. No perseguir 100% ni duplicar E2E.

**Dependencias.** Las decisiones de producto ya están resueltas.

**Criterio de aceptación.** Cada bug P1/P2 tiene regresión roja antes del fix y verde después; los tests prueban outputs/estado, no clases internas.

### TEST-002 — Dos E2E smoke no cubren los recorridos críticos

- **Prioridad:** P2
- **Categoría:** E2E / TEST
- **Esfuerzo:** L
- **Riesgo:** MEDIUM
- **Confianza:** CONFIRMED
- **Origen:** WIP_EXPECTED

**Problema.** Un spec recorre rutas y otro filtra el catálogo. No se prueba crear un plan, cambiar rate/variant, añadir supply y verificar recalculo; abrir Planner desde Items/Corporations; deep-link a corporation; responsive móvil; ni colocar/mover/duplicar/deshacer/persistir en Base Designer.

**Evidencia.** `e2e/smoke/navigation.spec.ts:3-27` y `e2e/base-designer/building-catalog.spec.ts:3-16` son los únicos tests.

**Impacto.** Los puntos de integración más valiosos pueden romperse aunque Vitest esté verde.

**Causa raíz.** Suite recién creada y todavía en fase WIP.

**Solución propuesta.** Añadir recorridos cortos e independientes por valor, con roles/labels y web-first assertions. Mantener Chromium como gate rápido; añadir proyecto móvil para el shell y valorar Firefox/WebKit solo si existe necesidad real. No usar sleeps ni hacer un mega-test de toda la app.

**Dependencias.** E2E-001, BUG-001/002/003, UI-001 y A11Y-001.

**Criterio de aceptación.** Los recorridos críticos enumerados pasan local y CI, cada test crea su estado y no depende del orden.

### DOC-001 — La documentación y los comentarios no forman una guía fiable única

- **Prioridad:** P2
- **Categoría:** DOC / DX
- **Esfuerzo:** M
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** El README raíz explica el producto e instalación mínima, pero no toolchain, checks, arquitectura ni Playwright (`README.md:53-70`). `README-STRUCTURE.md:7` menciona `src/assets`, que no existe. Router indica `src/app/App.tsx` en vez de `src/App.tsx` (`src/router/README.md:9-10`). Base Designer afirma “in-game scale” (`page-base-designer.tsx:13`, `base-designer/README.md:3,48-49`) cuando 40/43 medidas son estimadas. Los comentarios de `SupplyCard` son largos, contienen errores tipográficos, dicen “dos botones” donde hay cuatro y justifican `memo` como “performance crítica” sin perfil (`supply-card.tsx:7-32`); en otros módulos hay comentarios que repiten la siguiente línea.

**Evidencia.** `README.md:53-70`, `README-STRUCTURE.md:7`, `src/router/README.md:9-10`, `src/pages/page-base-designer/page-base-designer.tsx:13`, `src/features/base-designer/README.md:3,48-49` y `src/features/planner/ui/supply-card.tsx:7-32`; cruce de footprints confirma 40/43 fallbacks estimados.

**Impacto.** Nuevos desarrolladores y agentes reciben instrucciones contradictorias o exageradas.

**Causa raíz.** Documentos actualizados por feature sin revisión cruzada y una política de “comentar” interpretada como volumen.

**Solución propuesta.** Convertir README raíz en onboarding completo; corregir docs locales; declarar estimaciones; mantener comentarios solo para responsabilidad, invariantes y decisiones no obvias; actualizar documentación en el mismo hito que cambia el contrato.

**Dependencias.** DX-001, DATA-002 y decisiones implementadas para no documentar un estado transitorio.

**Criterio de aceptación.** Un desarrollador puede instalar, ejecutar todos los gates, ubicar código/datos/tests y entender estimaciones sin consultar historia; búsqueda manual no encuentra rutas o afirmaciones obsoletas conocidas.

### SKILL-001 — El catálogo local de skills contiene solapamientos y reglas incompatibles con el proyecto

- **Prioridad:** P2
- **Categoría:** SKILL / AGENT
- **Esfuerzo:** M
- **Riesgo:** LOW
- **Confianza:** HIGH
- **Origen:** BASE

**Problema.** Hay seis skills y 148+ KB de referencias, además de `skill-creator` con 230 KB. `react-best-practices` contiene reglas categóricas como no usar nunca `useMemo`/`useCallback`, no usar casts y usar TanStack Query/stack Mastra, aunque esta app tiene datos locales y casts de boundary razonables. `vercel-composition-patterns` solapa estructura React y afirma de forma confusa que React 19 usa `use()` “en lugar de” `useContext`; su documento compilado incluye ejemplos poco alineados con esta web. `skill-creator` está orientada a Claude CLI/eval viewers/subagentes y no al desarrollo diario del producto. No existe skill ajustada al flujo Playwright del proyecto.

**Evidencia.** `.agents/skills/*`; tamaños auditados: find-skills 5,5 KB, interface-design 30,2 KB, react-best-practices 100,0 KB, skill-creator 230,6 KB, composition 50,3 KB, web-perf 8,4 KB.

**Impacto.** Más contexto no equivale a mejor guía: reglas absolutas pueden inducir refactors innecesarios o contradecir decisiones medidas.

**Causa raíz.** Skills copiadas como paquetes genéricos sin una fase de adaptación al repositorio.

**Solución propuesta.** Aplicar la clasificación detallada de la sección Skills: conservar lo útil, recortar/relajar React, fusionar composition, retirar skill-creator del repo y crear/adaptar una skill Playwright pequeña. No instalar el pack externo completo de forma automática.

**Dependencias.** E2E-001 y AGENT-001 para que la guía de proyecto sea fuente superior.

**Criterio de aceptación.** Cada skill tiene scope y trigger no solapados, ninguna regla contradice AGENTS/arquitectura, y la skill Playwright transforma escenarios humanos en specs usando los comandos del repo.

### TS-001 — Los nodos de Planner pierden el tipado que React Flow ya permite

- **Prioridad:** P3
- **Categoría:** TS / REACT
- **Esfuerzo:** S
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** Builders devuelven `Node[]` genérico (`flow-nodes.ts:19-25,62-68`) y los componentes reciben `NodeProps` sin parámetro para después hacer casts (`supply-node.tsx:7-8`, `production-node.tsx:7-9`, launcher equivalente). Base Designer demuestra el patrón correcto con unions de nodos y `NodeProps<BaseDesignerBuildingNode>`.

**Evidencia.** `src/features/planner/ui/flow/lib/flow-nodes.ts:19-25,62-68`, `supply-node.tsx:7-8`, `production-node.tsx:7-9` y los tipos/renderers equivalentes de `src/features/base-designer/`.

**Impacto.** Cambios en `data` pueden compilar aunque falten propiedades y los casts esconden el contrato entre builder y vista.

**Causa raíz.** Tipos del Planner anteriores al patrón tipado aplicado en Base Designer.

**Solución propuesta.** Definir unions discriminadas de nodos Planner y tipar builders, arrays y `NodeProps`. Mantener casts solo en el boundary JSON, no dentro de cada renderer.

**Dependencias.** DATA-001; conviene hacerlo al tocar Flow por BUG-001.

**Criterio de aceptación.** Cero casts `data as ...` en nodos Planner y un cambio incompatible de data falla en TypeScript.

### DEAD-001 — Hay exports y datos calculados sin consumidor

- **Prioridad:** P3
- **Categoría:** STRUCTURE / REACT
- **Esfuerzo:** XS
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `Stats` en `features/planner/types/planner.types.ts:1-5` no se usa. `useFlowFitEffect` está exportado pero no consumido (`flow-fit.ts:24-38`). `FlowBuildResult.stats` se devuelve (`build-production-flow.ts:18-40`) y el consumidor lo descarta (`use-flow-diagram.ts:29-37`). El `setTimeout` de `scheduleFlowFitView` tampoco devuelve cleanup (`flow-fit.ts:9-13`).

**Evidencia.** `src/features/planner/types/planner.types.ts:1-5`, `src/features/planner/ui/flow/flow-fit.ts:9-38`, `build-production-flow.ts:18-40` y `use-flow-diagram.ts:29-37`; búsquedas globales no encontraron consumidores adicionales.

**Impacto.** API aparente mayor que la real y caminos alternativos que confunden futuros cambios.

**Causa raíz.** Refactors incompletos sin pasada de eliminación final.

**Solución propuesta.** Eliminar símbolos confirmados o usar un único hook de fit si aporta cleanup; devolver solo nodes/edges. Verificar con `rg`, typecheck y tests.

**Dependencias.** TS-001 para evitar editar Flow dos veces.

**Criterio de aceptación.** No quedan exports sin consumidor identificados y el fit no ejecuta callbacks tras desmontaje.

### SEO-001 — La metadata pública mínima es incompleta

- **Prioridad:** P4
- **Categoría:** SEO / A11Y
- **Esfuerzo:** XS
- **Riesgo:** LOW
- **Confianza:** CONFIRMED
- **Origen:** BASE

**Problema.** `index.html:5` declara un JPG como `image/svg+xml`; solo existe title genérico y falta description. No hay `robots.txt`; la rewrite SPA de `vercel.json:1-3` devuelve HTML también para `/robots.txt`. No hay titles por ruta.

**Evidencia.** `index.html:5`, ausencia de `public/robots.txt`, `vercel.json:1-3` y respuesta HTML observada para `/robots.txt` en el servidor de producción local; Lighthouse SEO 83.

**Impacto.** Lighthouse SEO medido en 83 y previews/indexación menos claras. SEO no es crítico para la lógica del producto, por eso se mantiene P4.

**Causa raíz.** Head inicial de Vite no revisado tras convertir el proyecto en sitio público.

**Solución propuesta.** Corregir MIME, añadir description y robots explícito; definir title por ruta. Sitemap/canonical solo si se confirma una estrategia de indexación por rutas.

**Dependencias.** ARCH-001 facilita metadata por ruta.

**Criterio de aceptación.** `/robots.txt` devuelve texto válido, favicon tiene MIME correcto, cada ruta tiene title útil y Lighthouse no reporta estos fallos.

### ASSET-001 — Hay assets sin referencia actual, pero no deben borrarse a ciegas

- **Prioridad:** P4
- **Categoría:** ASSET
- **Esfuerzo:** S
- **Riesgo:** MEDIUM
- **Confianza:** HIGH
- **Origen:** BASE

**Problema.** Existen 178 WebP (2.322.090 bytes): 130 de items, 43 de buildings y 5 de corporations. Los 104 IDs actuales de items tienen icono; quedan 26 iconos de items sin entrada actual. Falta WebP para `zipline`, pero Base Designer tiene fallback explícito con Lucide (`building-icon.tsx:10-27`).

**Evidencia.** Inventario de `public/assets/icons/` cruzado con los IDs de los cuatro JSON y `src/features/base-designer/ui/building-icon.tsx:10-27`; conteos: 178 WebP, 104 items activos cubiertos y 26 iconos de item sin referencia actual.

**Impacto.** Pequeño coste de repo/deploy y posible confusión. Puede tratarse de datos de futuras versiones, por lo que el borrado automático tiene más riesgo que beneficio.

**Causa raíz.** Catálogo de assets más amplio que el snapshot JSON actual.

**Solución propuesta.** Generar un inventario de referenciados/huérfanos en un script de diagnóstico y documentar allowlist de assets futuros. Borrar solo con confirmación de procedencia. Mantener fallback de zipline.

**Dependencias.** DATA-002 para usar la misma fuente de IDs.

**Criterio de aceptación.** Informe reproducible de assets; cada huérfano está permitido o retirado conscientemente; todos los IDs activos tienen render válido.

## 11. Arquitectura

El veredicto es **mantener feature-first híbrida**. No hay evidencia que justifique migrar a Clean Architecture, DDD por capas, servicios o inyección de dependencias. Los problemas reales son los límites de importación (ARCH-001/002) y el modelado del catálogo (DATA-001/002).

El Planner tiene una separación sana entre:

- `ProductionPlanProvider` como frontera de cálculo compartido;
- `lib/production-plan` como lógica pura;
- `flow/plan-to-flow` como adapter de representación;
- diagramas como consumidores del mismo plan.

Base Designer también separa correctamente persistencia, operaciones del editor, colisión, conexión y UI. Su store de 259 líneas es grande, pero sus acciones pertenecen a una única máquina de estado coherente y ya delegan lógica a funciones puras; dividirlo ahora por tamaño aumentaría coordinación. Debe revisarse tras cerrar WIP, no trocearse preventivamente.

La convención de stores centralizados es una decisión consciente del proyecto. El objetivo no es moverlos a cada feature, sino evitar barrels/ciclos y distinguir estado mutable de catálogo estático.

## 12. Organización

La estructura física es predecible en la mayoría del repositorio. Los movimientos recomendados son pocos y motivados:

- separar metadata de navegación de la creación del router;
- exponer helpers inter-feature por el `index.ts` propietario;
- consolidar tipos/índices del catálogo bajo `shared/data`;
- eliminar el tab placeholder, exports muertos y el chunk DEV de producción;
- corregir documentación de rutas/assets sin renombrar masivamente carpetas.

No se recomienda:

- aplanar `planner/flow` o `base-designer/lib`;
- mover todos los tipos a una carpeta global;
- convertir `shared` en un mega-módulo;
- crear un `constants.ts`/`utils.ts` general;
- unificar todas las tablas, cards o accordions mediante APIs genéricas.

## 13. Centralización y duplicación

### Clasificación de duplicaciones

| Clase                      | Casos                                                                                      | Decisión                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| A — duplicación real       | `NON_PRODUCING_TYPES`; mapas por item repetidos; tabs Items/Buildings idénticos            | Centralizar regla/índice y retirar placeholder.                                                        |
| B — similitud accidental   | filtros/catálogos de Items y Base Designer; summaries de páginas                           | Mantener separados: dominios, datos y contratos distintos.                                             |
| C — variantes justificadas | nodos Production/Supply/Launcher; layouts de páginas; stores por feature                   | Conservar composición compartida existente (`node-parts`, `Page*`) sin forzar un componente universal. |
| D — abstracción prematura  | repositories para JSON, DTOs generales, schema runtime completo, mega-table o generic form | No crear.                                                                                              |

La centralización con mayor retorno es `DATA → catálogo/índices/reglas → features`. Debe contener solo datos derivados estables y queries compartidas reales. Las transformaciones propias de Planner o Base Designer permanecen en su feature.

## 14. Componentes

La jerarquía actual se aproxima al objetivo:

```text
HeroUI / HTML
  → shared/ui (layout, tipografía, imágenes, TreeList)
  → feature/ui
  → pages
```

`PageContainer`, `PageHeader`, `PageContent`, `Panel`, `Flex` y `Typography` aportan valor tangible. No son wrappers vacíos: fijan scroll boundaries, espaciado, superficies y contratos polimórficos. `AssetImage` reserva dimensiones y maneja loading/error; su fallback explícito de zipline también está bien ubicado.

Los problemas de componentes no son mega-componentes generalizados, sino controles visuales con semántica incompleta. `SupplyModal`, `SupplyCard`, navegación y TreeList deben resolverse con elementos nativos/primitivas ya instaladas. El modal monta hasta 104 imágenes; para este dataset acotado no se recomienda virtualizar hasta medir interacción real. `content-visibility` puede ser suficiente.

## 15. React

### Lo que está bien

- Selectores Zustand pequeños en lugar de suscripción al store completo.
- Estado derivado del plan calculado en provider/memos, no duplicado en el store.
- Persistencia limitada a inputs editables.
- `useMemo` se usa en operaciones con identidad estable útil (filtrado, maps, plan compartido).
- Limpieza correcta del listener resize del marquee y del timer de Corporations.
- Base Designer limita pointer updates con animation frame y desacopla operaciones puras.

### Lo que debe cambiar

- El store debe imponer la invariante de supply; la UI no puede repararla por separado.
- `useFlowDiagram` sincroniza legítimamente una API externa, pero su `eslint-disable` y fit timer deben quedar con dependencias/cleanup claros.
- El scroll a corporation depende de 300 ms (`corporations-accordion.tsx:26-37`); debe reaccionar a que el contenido objetivo exista mediante ref/layout callback o una condición observable, no a una duración de animación.
- Marquee no debe medir layout y provocar state update inicial para contenido decorativo si una solución CSS/ResizeObserver puede evitarlo.

No se recomienda eliminar `useMemo`/`memo` en bloque ni añadirlos por superstición. El comentario de `SupplyCard` debe corregirse, pero retirar `memo` exige profiler o un cambio que lo vuelva innecesario.

## 16. TypeScript

La configuración `strict`, `noUnusedLocals` y `noUnusedParameters` es una fortaleza. No se encontró `any` explícito relevante ni cadenas `as unknown as`. Los casts más problemáticos son los de nodos React Flow porque esconden un contrato interno controlable (TS-001); los casts únicos en el borde JSON pueden ser razonables si el modelo resultante se corrige (DATA-001).

Regla recomendada:

- casts auditables solo en fronteras externas o limitaciones reales de librería;
- tipos de fuente separados de tipos enriquecidos cuando sus invariantes cambian;
- unions discriminadas para nodos;
- `readonly` en catálogo/índices exportados;
- no introducir type-level programming ni guards que validen todo el JSON en runtime.

Debe añadirse un tsconfig de tooling que cubra `playwright.config.ts` y `e2e/**/*.ts`; hoy `pnpm build` solo comprueba `src` y `vite.config.ts`.

## 17. UI / Design System

Existe un **design system mínimo real**, no solo variables:

- paleta y superficies en `src/hero.ts`;
- colores de dominio en `src/index.css:23-31`;
- escala tipográfica en `shared/ui/typography.tsx:5-20`;
- spacing discreto en `Flex` y `Panel`;
- shells de página consistentes;
- estados loading/empty y assets con espacio reservado.

La dirección dark, técnica y densa encaja con una herramienta industrial del juego. Base Designer mantiene esa dirección y no necesita rediseño. Los gaps están en consistencia operativa:

- responsive del shell y toolbar;
- contraste del chip de categoría;
- jerarquía H1;
- nombres accesibles;
- política de reduced motion incompleta;
- `transition-all` y alturas animadas en TreeList/Flow;
- afirmación visual de escala exacta cuando la mayoría es estimada.

El sistema debe ampliarse solo con tokens/variantes que tengan dos o más consumidores reales: estados de controles, motion/reduced-motion y contraste de categorías. No se propone un framework UI interno.

## 18. Performance

### Resumen

| Finding                                  | Clasificación        | Prioridad       | Interpretación                                            |
| ---------------------------------------- | -------------------- | --------------- | --------------------------------------------------------- |
| PERF-001                                 | MEASURED             | P1              | LCP 4.827 ms móvil y reflow 63 ms; actuar primero.        |
| PERF-002                                 | MEASURED             | P2              | Entry 194,16 kB gzip y CSS global; optimizar con budgets. |
| Búsquedas `.find` sobre 44/104 registros | THEORETICAL          | Sin hito propio | Centralizar por mantenimiento, no por CPU.                |
| Modal de 104 items                       | LIKELY_IMPACT bajo   | Observar        | Dataset acotado; no virtualizar sin perfil.               |
| Tabla Items                              | MEASURED previamente | Mantener        | Virtualización existente y documentada.                   |

No se recomienda recomprimir indiscriminadamente iconos: el análisis móvil estimó unos 37 kB de ahorro total de imagen, muy inferior al retraso de descubrimiento. Tampoco se recomienda `manualChunks` para silenciar Vite. El objetivo es reducir trabajo crítico inicial: empty state, CSS global, imports DEV y, si la medición lo avala, coste del shell HeroUI.

## 19. Vitest

La suite actual es rápida y valiosa. Clasificación:

| Valor      | Áreas actuales                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| CRITICAL   | producción del Planner, asociaciones de corporation, persistencia/migración y conexión de Base Designer, invariantes de stores |
| HIGH VALUE | colisiones, creación de nodos, catálogo/estadísticas Base Designer, filtros Items, navegación de corporation                   |
| NORMAL     | render de stats y estados de `AssetImage`                                                                                      |
| LOW VALUE  | Ningún grupo claramente prescindible detectado.                                                                                |
| REDUNDANT  | Ninguno confirmado.                                                                                                            |

La prioridad no es cobertura 100%, sino completar fronteras donde ya se observaron fallos: filas one-to-many, supply plan→views, raw target, error routing y catálogo derivado. Los tests deben seguir junto al módulo propietario, usando fixtures pequeñas tipadas y sin mockear lógica propia.

## 20. Playwright / E2E

La configuración es un buen comienzo: usa `baseURL`, `webServer`, locators semánticos, retries solo en CI y artefactos en fallo. No contiene `waitForTimeout`, CSS selectors ni dependencias entre tests. El problema es de cierre operativo y cobertura, no de estilo.

### Estrategia para este proyecto

- **Vitest:** cálculo, adapters, selectors, stores, persistencia, relaciones e invariantes.
- **Playwright:** recorridos completos, navegación, teclado, responsive, integración entre rutas y persistencia visible.
- **Manual:** evaluación visual fina de grafos grandes, drag complejo multi-touch y casos cuyo mantenimiento automatizado supere su riesgo.

### Flujo humano → Playwright

Usar una plantilla corta, no burocrática:

```md
ID y nombre:
Prioridad:
Objetivo:
Precondiciones / estado inicial:
Pasos del usuario:
Resultado observable esperado:
Cleanup (solo si aplica):
Tags opcionales:
```

Codex debe convertir ese escenario en tests pequeños con `test.step` solo cuando ayude a leer el recorrido, roles/labels, assertions web-first y aislamiento. Una vez automatizado, el ID enlaza escenario y spec; no se duplican detalles en tres documentos. Playwright MCP queda explícitamente fuera del camino por defecto.

## 21. AGENTS.md

`AGENTS.md` es corto y práctico, pero incompleto. Debe seguir siendo una guía operativa, no duplicar todos los README. Añadir:

1. los agentes no modifican los cuatro JSON para resolver faltantes o errores; las actualizaciones del juego son un flujo separado;
2. catálogo estático no equivale a estado Zustand;
3. reglas de imports internos/externos de features;
4. matriz Vitest/Playwright/manual;
5. setup de navegador E2E;
6. comentarios útiles: responsabilidad, decisión, invariante y fases complejas; nunca narrar la línea siguiente;
7. ejecutar gates desde toolchain fijado.

## 22. Skills

### Clasificación de todas las skills locales

| Skill                         | Clasificación | Motivo y acción                                                                                                                                                                                 |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interface-design`            | KEEP          | Aporta revisión de jerarquía, tokens, estados y responsive. La guía genérica debe subordinarse al sistema existente; no obliga a rediseñar cada cambio.                                         |
| `web-perf`                    | KEEP          | Su workflow de trace/Network/CWV produjo evidencia concreta. Mantener su preferencia por medición y fuentes actuales.                                                                           |
| `react-best-practices`        | IMPROVE       | Conservar bundle, renders, estructura y testing; retirar referencias Mastra/TanStack Query y convertir prohibiciones absolutas de memo/casts/null en criterios basados en evidencia/boundary.   |
| `vercel-composition-patterns` | MERGE         | Integrar sus pocas reglas útiles de composition/variants en React; corregir la afirmación `use()` vs `useContext` y retirar ejemplos no web/repetidos. Después eliminar la skill independiente. |
| `find-skills`                 | IMPROVE       | Mantener discovery, pero exigir revisión completa de SKILL/scripts/licencia/commit, pinning y aprobación antes de instalar; stars/installs no bastan. Adaptar comandos a pnpm/Codex.            |
| `skill-creator`               | REMOVE        | 230,6 KB, orientada a Claude CLI, viewers y un proceso de evaluación poco frecuente. Usarla global/on-demand cuando se cree una skill, no cargarla como parte del producto.                     |

### Skill externa de Playwright

Se compararon tres fuentes:

1. [Documentación oficial de Playwright](https://playwright.dev/docs/best-practices): autoridad para locators, assertions, aislamiento, CI, typecheck y browsers, pero no es una skill de proyecto.
2. [`magnus919/agent-skills/playwright`](https://github.com/magnus919/agent-skills/blob/main/playwright/SKILL.md): skill concisa (157 líneas), MIT, source-indexed, con ocho referencias y un `pwrun` para doctor/inventory/report. Sus comandos/scripts priorizan bash/npx y cubre scraping, por lo que no encaja directamente en Windows/pnpm ni en el scope del repo.
3. [`testdino-hq/playwright-skill`](https://github.com/testdino-hq/playwright-skill): mantenida, MIT y con mayor adopción visible, pero incluye más de 50 guías sobre API, seguridad, migraciones, múltiples CI y producto TestDino; es desproporcionada para dos specs de una SPA local.

**Decisión recomendada:** no instalar ninguno completo. Crear una skill local pequeña `playwright-project` usando la documentación oficial como fuente normativa y tomando del candidato Magnus únicamente el contrato operativo/diagnóstico que pase revisión. Debe hablar de los scripts reales del repo, Windows/pnpm, plantilla humana, Vitest vs E2E, trace y no-MCP. Evaluarla con 3–5 prompts reales antes de conservarla.

## 23. Developer Experience

El mayor problema DX es que el conocimiento correcto existe fragmentado: comandos en `package.json`, setup parcial en README, reglas arquitectónicas en README-STRUCTURE, E2E en su README y decisiones históricas en un roadmap eliminado. El onboarding objetivo debe responder en menos de diez minutos:

- versiones de Node/pnpm;
- instalación congelada;
- cómo instalar Chromium;
- qué hace cada gate;
- dónde colocar feature/UI/hook/tipo/selector/store;
- cómo acceder a JSON sin modificarlos;
- cuándo escribir Vitest, Playwright o dejar check manual;
- cómo transformar un escenario humano en spec.

CI debe ejecutar exactamente los comandos documentados. No se recomienda pre-commit pesado antes de que el flujo limpio funcione; primero reproducibilidad y CI, luego valorar hooks si evitan fallos reales.

## 24. Accesibilidad y SEO

Accesibilidad es prioritaria porque hay controles inaccesibles, no por perseguir una puntuación. El orden es:

1. interacción de supply por teclado/nombre;
2. navegación móvil y enlaces reales;
3. headings, labels y contraste;
4. clones/motion y TreeList;
5. ajustes de nombres en Base Designer/corporations.

SEO queda proporcionalmente bajo. La aplicación es pública, así que title/description/robots/favicon merecen un hito pequeño; no se justifica SSR, sitemap complejo, structured data o una migración de framework.

## 25. Revisión cross-cutting: causas raíz

Los 26 findings se reducen a cinco causas sistémicas:

1. **Baseline implícita.** Versiones, browser y CI no están cerrados.
2. **Modelo deseado distinto de la fuente.** Types/store/UI normalizan de maneras diferentes.
3. **Semántica añadida después de lo visual.** Supply, nav, marquee y TreeList parecen controles antes de comportarse como controles.
4. **Límites cómodos pero cíclicos.** Barrels y metadata compartida sin dirección de dependencias.
5. **Guías genéricas sin adaptación.** Docs y skills contienen reglas correctas en abstracto, pero no siempre para esta SPA.

Resolver estas causas evita crear decenas de parches locales.

## 26. Preguntas pendientes

No quedan decisiones importantes abiertas. Se registran las respuestas vinculantes:

| Tema                     | Decisión                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| Raw items en Planner     | Soportarlos consistentemente en selector, Items, copy y tests.     |
| Tab interno `Buildings`  | Retirarlo por ahora; es una funcionalidad futura.                  |
| Productores alternativos | Considerar todos al filtrar.                                       |
| Footprints incompletos   | Mantener 4×4 como estimación explícita; el JSON está sin terminar. |
| Supply                   | Una clave implica mínimo 1; cero equivale a ausencia.              |

# FASE 1 — Baseline reproducible y red de seguridad

**Objetivo global:** conseguir que una instalación limpia pueda ejecutar los mismos gates que la auditoría y que los contratos que no se pueden romper queden escritos y automatizados.

**Progreso:** 4/4 hitos cerrados; Fase 1 completada.

**Por qué ahora:** cualquier refactor posterior sería difícil de atribuir mientras el gestor de paquetes, el navegador E2E y CI dependan del entorno local. Además, esta fase deja explícito que el trabajo siguiente no debe corregir problemas editando los JSON de origen.

**Resultado acumulativo:** toolchain fijado, instalación congelada verificable, dependencias deliberadas, Chromium preparado, CI mínima y restricciones de edición alineadas con el proyecto real.

**Riesgo global:** medio; actualizar el lockfile y dependencias transitivas puede cambiar resolución o bundles aunque no cambie la API de la aplicación.

**Dependencias:** ninguna fase anterior. Los hitos 1.2 y 1.3 parten de 1.1; 1.4 puede avanzar en paralelo una vez decididas las versiones.

## Hito 1.1 — Fijar Node, pnpm y el contrato de instalación

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** convertir el entorno implícito en una baseline repetible local y en CI.
- **Problema resuelto:** `DX-001`.
- **Qué cambiar:** declarar una versión LTS concreta de Node y `packageManager` en `package.json`; añadir el mecanismo de versionado que el equipo use realmente; regenerar `pnpm-lock.yaml` una sola vez con esa versión; añadir `format`/`format:check` con Prettier como dependencia de desarrollo.
- **Áreas:** `package.json`, `pnpm-lock.yaml`, archivo de versión de Node, README raíz y futura CI.
- **Pasos:**
  1. elegir una versión LTS compatible con Vite 7 y documentar el criterio;
  2. activar Corepack y fijar una versión de pnpm compatible con lockfile v6 o migrar deliberadamente el lockfile;
  3. ejecutar una instalación congelada desde un checkout limpio;
  4. añadir scripts de formato sin reescribir JSON protegidos;
  5. registrar el comando canónico de bootstrap.
- **Tests/comprobaciones:** `pnpm install --frozen-lockfile`, `pnpm format:check`, `pnpm lint`, `pnpm test` y `pnpm build` desde entorno limpio.
- **Resultado esperado:** dos máquinas con las versiones declaradas resuelven el mismo lockfile y ejecutan los mismos scripts sin prompts ni reconciliación automática.
- **Criterios de aceptación:** no se modifica ninguno de los cuatro JSON; `packageManager` y Node están declarados; instalación congelada termina con código 0; Prettier está versionado y el gate no depende de instalación global.
- **Cierre y validación:** Node `24.20.0`, pnpm `11.19.0`, lockfile v9 y el hoist de HeroUI quedan estabilizados; Prettier `3.9.6` está versionado con gates de escritura y comprobación; los catálogos JSON están excluidos del formateo. El usuario confirmó instalación congelada, `format:check`, lint, tests, build y comprobación visual de la aplicación sin regresiones de HeroUI.

## Hito 1.2 — Reducir y actualizar la superficie de dependencias

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** eliminar dependencias sin uso o mal clasificadas y cerrar advisories aplicables sin una actualización masiva.
- **Problema resuelto:** `DEP-001`.
- **Qué cambiar:** sustituir el uso puntual de `geist` por assets locales/versionados o un script sin Next; retirar `@heroicons/react` y `lucide` si la búsqueda final confirma que siguen sin uso; mover herramientas/tipos a `devDependencies`; actualizar React Router a una versión que incluya los parches actuales; preparar la migración de `dagre` al paquete mantenido `@dagrejs/dagre` con sus tipos.
- **Áreas:** manifest/lockfile, script de fuentes, layout de grafos y sus tests.
- **Pasos:**
  1. hacer una tabla dependencia→import/script antes de borrar;
  2. retirar primero las que no llegan al runtime;
  3. actualizar React Router de forma aislada y probar navegación/deep links;
  4. migrar Dagre conservando opciones, coordenadas y semántica del layout;
  5. revisar `pnpm audit --prod` y clasificar lo restante por aplicabilidad, no solo por conteo.
- **Tests/comprobaciones:** búsqueda de imports, instalación congelada, suite de layouts, Vitest completo, build, navegación manual y E2E cuando 1.3 esté listo; comparar snapshots/posiciones mediante tolerancias, no píxel perfecto.
- **Resultado esperado:** manifest mínimo y explicable, sin Next como transitiva de producción ni paquetes de iconos redundantes, y sin advisories conocidos aplicables a las versiones directas.
- **Criterios de aceptación:** toda dependencia de producción tiene consumidor runtime; herramientas/tipos están en desarrollo; actualización de Router no rompe rutas; layout conserva conectividad y no solapa nodos en fixtures representativas; el informe de audit restante documenta su aplicabilidad.
- **Inventario final de runtime:**

  | Dependencia               | Consumidor o motivo                                                        |
  | ------------------------- | -------------------------------------------------------------------------- |
  | `@dagrejs/dagre`          | Layout del diagrama de producción; sustituye `dagre` y sus tipos externos. |
  | `@heroui/react`           | Componentes y provider de la interfaz.                                     |
  | `framer-motion`           | Peer runtime requerido por HeroUI.                                         |
  | `@tanstack/react-virtual` | Virtualización de la tabla de Items.                                       |
  | `@xyflow/react`           | Diagramas del Planner y Base Designer.                                     |
  | `lucide-react`            | Iconos usados por Planner, Base Designer, Items, Recipes y playground.     |
  | `react` / `react-dom`     | Runtime y montaje de la aplicación.                                        |
  | `react-router-dom`        | Router, navegación, enlaces y parámetros de búsqueda.                      |
  | `zustand`                 | Stores del Planner, Items, datos y Base Designer.                          |

- **Limpieza aplicada:** retirados `@heroicons/react` y `lucide` por falta de imports; retirado `geist` y su script porque los WOFF2 ya están versionados; añadida la licencia OFL y la procedencia de las fuentes; migrado Dagre a `@dagrejs/dagre` `3.1.1` con tipos nativos; actualizado React Router DOM a `7.18.3`.
- **Cierre y validación:** el usuario confirmó instalación, formato, lint, Vitest, build, auditoría de producción, navegación y recarga de rutas, además de la revisión visual de un diagrama con ramas y supplies. El nuevo test de layout comprueba conectividad, dirección y ausencia de solapes sin fijar coordenadas a píxel.

## Hito 1.3 — Hacer ejecutable Playwright y crear CI mínima

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** transformar dos specs nominales en un gate que cualquier colaborador y CI puedan ejecutar.
- **Problema resuelto:** `E2E-001` y precondición de `TEST-002`.
- **Qué cambiar:** alinear `webServer.command` con el toolchain fijado; documentar/automatizar `playwright install chromium`; añadir typecheck de `playwright.config.ts` y `e2e/**`; crear workflow de CI con instalación congelada, store de pnpm cacheado, navegador instalado según la guía oficial y artefactos solo cuando aporten diagnóstico.
- **Áreas:** `playwright.config.ts`, `e2e/`, tsconfig específico, README E2E y configuración de CI.
- **Pasos:**
  1. crear `tsconfig.e2e.json` o incluir expresamente configuración/specs en un gate;
  2. verificar que el servidor se levanta con el script documentado;
  3. instalar Chromium correspondiente exactamente a la versión de Playwright;
  4. ejecutar los dos specs en local limpio;
  5. replicar lint, typecheck, Vitest, build y E2E en CI, separando jobs solo si reduce tiempo de feedback.
- **Tests/comprobaciones:** `pnpm exec playwright test --list`, typecheck E2E y `pnpm test:e2e`; provocar temporalmente un fallo controlado en una rama de prueba para verificar trace/screenshot/video configurados.
- **Resultado esperado:** el gate falla por comportamiento de producto, no por falta de binario o por el package manager del host.
- **Criterios de aceptación:** Chromium se instala mediante un comando documentado; ambos specs actuales pasan localmente y en CI; configuración/specs se typecheckean; CI conserva trace en primer retry o fallo según política explícita.
- **Decisión de caché:** no cachear binarios de Chromium. Playwright indica que restaurarlos suele costar lo mismo que descargarlos y que las dependencias Linux no se pueden cachear; CI cachea solo el store de pnpm e instala Chromium con sus dependencias en cada ejecución.
- **Cierre y validación:** Playwright usa el servidor Vite fijado, la configuración y los specs tienen un typecheck estricto propio y `test:all` reproduce localmente la secuencia completa de gates. El workflow instala con lockfile congelado, cachea solo el store de pnpm, instala Chromium headless con sus dependencias y conserva artefactos únicamente ante fallos E2E; la política mantiene trace en el primer retry, screenshot al fallar y vídeo de los fallos. El usuario confirmó la instalación de Chromium, el listado de los dos specs, la ejecución completa de `test:all` y la revisión visual de la aplicación. La primera ejecución remota de GitHub Actions queda aplazada hasta publicar el repositorio, conforme al acuerdo de mantener esta fase solo en local.

## Hito 1.4 — Documentar la restricción de edición de datos

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** hacer explícita para editores y agentes la prohibición de corregir faltantes o inconsistencias modificando los JSON.
- **Problema resuelto:** `AGENT-001`.
- **Qué cambiar:** ampliar `AGENTS.md` y el README de datos con la restricción, el tratamiento de datos incompletos alrededor de la fuente y la excepción para actualizaciones deliberadas del juego.
- **Áreas:** `AGENTS.md`, README raíz y documentación de `src/shared/data/`.
- **Pasos:**
  1. nombrar los cuatro catálogos en la guía de agentes;
  2. indicar que un dato ausente o erróneo se trata con código, fallback o UI alrededor;
  3. distinguir el trabajo normal del roadmap de una actualización de datos proporcionada o aprobada por el usuario;
  4. enlazar la regla desde el onboarding.
- **Tests/comprobaciones:** no se añade validación automática; esta es una restricción de edición para herramientas y agentes, no una garantía de inmutabilidad permanente.
- **Resultado esperado:** un agente no confunde “resolver un dato incompleto” con inventar o corregir contenido dentro del JSON.
- **Criterios de aceptación:** los cuatro archivos están nombrados; la guía prohíbe modificarlos como solución a errores de aplicación; las actualizaciones reales del juego siguen siendo posibles como mantenimiento separado.
- **Cierre y validación:** `AGENTS.md`, el onboarding principal y un README junto a los datos describen la misma frontera: los cuatro JSON no se corrigen durante trabajo de aplicación, los faltantes se resuelven alrededor de la fuente y una actualización deliberada del juego sí puede reemplazar los snapshots. No se añadió validación automática ni se modificó ningún catálogo. El usuario revisó y aprobó la documentación.

# FASE 2 — Correctitud y usabilidad P1

**Objetivo global:** eliminar inconsistencias visibles de dominio y barreras de uso antes de mover límites internos.

**Progreso:** 6/6 hitos cerrados; Fase 2 completada.

**Por qué ahora:** son fallos que alteran planes, ocultan productores o impiden operar con teclado/móvil; tienen más impacto que la deuda arquitectónica restante.

**Resultado acumulativo:** supply canónico, materias primas soportadas de extremo a extremo, todos los productores visibles, placeholder retirado y shell utilizable y rápido en móvil.

**Riesgo global:** medio-alto; supply y productores atraviesan stores, selectors, diagramas, persistencia y UI. Los cambios deben aterrizar por slices verticales pequeños.

**Dependencias:** Fase 1 completada. Hitos 2.1 y 2.2 requieren el gate unitario; 2.4 usa las reglas semánticas definidas en los findings; 2.6 debe medirse con build estable.

## Hito 2.1 — Imponer el invariante de supply `>= 1` o ausencia

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** hacer que store, persistencia y vistas interpreten supply de una sola manera.
- **Problema resuelto:** `BUG-001`.
- **Qué cambiar:** introducir operaciones canónicas `setSupply`, `incrementSupply` y `removeSupply`; borrar la clave cuando el valor resulte cero/no finito; normalizar estado rehidratado; derivar nodos únicamente de entradas positivas.
- **Áreas:** planner store/slices, persistencia/migraciones, modal/cards, cálculo y constructores de diagramas.
- **Pasos:**
  1. expresar el tipo/selector de supply como mapa de cantidades positivas;
  2. cerrar todas las mutaciones detrás de acciones del store;
  3. normalizar snapshots antiguos al rehidratar;
  4. retirar ramas visuales que tratan cero como item activo;
  5. comprobar que remove no deja nodos/aristas huérfanos.
- **Tests/comprobaciones:** unitarios para add/set/decrement/remove, cero, negativo, `NaN` y rehidratación; integración plan→lista→diagrama; E2E de añadir, editar a uno, reducir a cero y comprobar desaparición.
- **Resultado esperado:** no existe estado observable con una clave supply de cantidad menor que uno.
- **Criterios de aceptación:** todas las escrituras pasan por acciones canónicas; estado persistido antiguo queda normalizado; cero elimina item y conexiones; ninguna vista muestra supply huérfano.
- **Cierre y validación:** el store expone únicamente `setSupply`, `incrementSupply` y `removeSupply`; crear un supply parte de 1, mientras cero, negativos y valores no finitos eliminan su clave. La rehidratación, el plan y los constructores visuales normalizan entradas antiguas o externas antes de exponerlas. Los tests cubren mutaciones, rehidratación y plan→diagrama; el usuario confirmó el recorrido E2E y comprobó manualmente que tarjeta, nodo y conexión desaparecen al reducir el supply a cero. Ningún catálogo JSON ni estilo de HeroUI fue modificado.

## Hito 2.2 — Soportar raw items y relaciones productor one-to-many

- **Prioridad:** P1
- **Estado:** COMPLETADO con seguimiento E2E pendiente (4 de septiembre de 2026).
- **Objetivo específico:** alinear el Planner y el catálogo con el modelo real del juego.
- **Problemas resueltos:** `BUG-002`, `BUG-003`.
- **Qué cambiar:** modelar productores como colección estable; cambiar el filtro de Items de igualdad singular a pertenencia; evitar que `buildItemsTableRows` descarte productores; definir el plan válido para raw items sin receta y mostrar acción/copy coherentes en Items y Planner.
- **Áreas:** adapters/catálogo de items, filtros, tabla/detail, target selector, cálculo/empty states y navegación al Planner.
- **Pasos:**
  1. crear un índice item→todos los productores desde los catálogos de origen;
  2. adaptar filas y contratos públicos para conservar el conjunto;
  3. mostrar productor primario solo como decisión de presentación, nunca como pérdida de datos;
  4. permitir seleccionar raw item y construir un resultado terminal coherente;
  5. actualizar copy y CTA para que no afirmen que todo item necesita receta.
- **Tests/comprobaciones:** fixtures con cero, uno y dos productores; filtro por cada productor; raw target en store/calculador/UI; E2E catálogo→raw target→Planner y multi-productor→filtro.
- **Resultado esperado:** los 26 items multi-productor conservan todas sus asociaciones y los raw items son objetivos válidos, no una excepción oculta.
- **Criterios de aceptación:** filtrar por cualquiera de los productores devuelve el item; no se usa `find` para colapsar cardinalidad; un raw target se guarda/restaura y produce vista terminal sin error; CTA/copy son consistentes.
- **Cierre y validación:** un índice compartido conserva todos los buildings productores en orden de catálogo; Items filtra contra la colección completa y usa el primero solo como presentación. Las materias primas exponen el CTA Planner y muestran una vista terminal explícita sin inventar receta ni edificio. Los tests unitarios cubren relaciones 0/1/N y el filtro por productor alternativo; el E2E de `Calcium Ore` pasa. La revisión adicional dejó roles/nombres accesibles como primera opción y `data-testid` solo para elementos sin referencia semántica, con la convención documentada en `AGENTS.md` y `e2e/README.md`. Ningún catálogo JSON fue modificado.
- **Seguimiento pendiente:** el E2E que opera el filtro multi-productor queda marcado como `fixme`: HeroUI abre correctamente el Select, pero su opción renderizada no ofrece todavía un locator estable sin acoplarse al DOM interno. El comportamiento sigue protegido por tests puros y esta deuda se retomará al consolidar los journeys de Items en el Hito 5.3.

## Hito 2.3 — Retirar el tab interno `Buildings`

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** eliminar una affordance que promete una funcionalidad todavía inexistente.
- **Problema resuelto:** `UI-002`.
- **Qué cambiar:** retirar tab, estado, query/hash y rama que renderizan `Buildings` dentro de Planner; conservar la ruta catálogo Buildings independiente; no crear sustituto vacío.
- **Áreas:** composición de la página Planner, navegación interna, tests y copy.
- **Pasos:** eliminar el control y su estado; limpiar tipos/constantes/imports muertos; comprobar deep links antiguos y elegir fallback a Production; mantener el futuro feature fuera del código hasta que tenga contrato propio.
- **Tests/comprobaciones:** Vitest de selección inicial/fallback y E2E que confirma que Planner abre Production mientras `/buildings` sigue accesible.
- **Resultado esperado:** Planner muestra únicamente funciones operativas y el catálogo Buildings no cambia.
- **Criterios de aceptación:** no aparece el tab interno; no existe rama duplicada que renderice el mismo diagrama; deep link antiguo no deja pantalla rota; ruta Buildings permanece navegable.
- **Cierre y validación:** se retiró únicamente la entrada interna `Buildings`, que duplicaba el diagrama `Items`, junto con su icono sin uso. El Planner conserva `Network graph`, `Tree list` e `Items`; no existía estado ni deep link específico que migrar. El E2E confirma la selección inicial operativa y que el catálogo principal `Buildings & Recipes` continúa accesible en `/recipes`. El usuario validó el recorrido y la presentación.

## Hito 2.4 — Convertir supply en controles accesibles

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** permitir completar el flujo supply con teclado, lector de pantalla y puntero.
- **Problema resuelto:** `A11Y-001`.
- **Qué cambiar:** sustituir `li` clicable por botones/opciones con semántica; etiquetar autocomplete, clear, cantidad y cuatro botones de cada card; devolver foco al cerrar modal; exponer errores/estado de forma comprensible.
- **Áreas:** modal de supply, cards, target autocomplete y tests de interacción.
- **Pasos:**
  1. definir nombres visibles o `aria-label` específicos con item/acción;
  2. usar el patrón HeroUI apropiado sin anidar controles interactivos;
  3. garantizar Enter/Espacio, flechas donde proceda, Escape y focus return;
  4. comprobar orden de tabulación y contraste de focus.
- **Tests/comprobaciones:** Testing Library con `userEvent.keyboard`, queries por role/name, axe/Lighthouse como apoyo y E2E solo teclado para añadir y eliminar supply.
- **Resultado esperado:** ninguna acción principal de supply depende de click en un contenedor genérico o de icono sin nombre.
- **Criterios de aceptación:** flujo completo operable sin ratón; todos los controles tienen nombre único; foco no se pierde al cerrar; no hay warnings de label del autocomplete.
- **Cierre y validación:** la selección de items dejó de depender de un `li` clicable y utiliza un botón nativo con foco visible y activación por teclado. El target, la búsqueda, la cantidad y las cuatro acciones de cada supply exponen nombres accesibles específicos y legibles; el modal devuelve el foco a su disparador. Se mantuvo un cambio mínimo, sin estados anunciados adicionales ni dependencias nuevas. El E2E comprueba la acción antes inaccesible mediante teclado y el usuario validó build, recorrido y presentación.

## Hito 2.5 — Corregir navegación y toolbar responsive

- **Prioridad:** P1
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** hacer accesibles todas las rutas y controles del Planner a 320–390 px sin scroll horizontal oculto.
- **Problema resuelto:** `UI-001`.
- **Qué cambiar:** definir patrón compacto de navegación móvil (menú o scroll explícito con affordance), permitir wrap/stack del selector y rate, reservar el ancho de acciones y retirar dependencias de `overflow-hidden` que corten controles.
- **Áreas:** `RootLayout`, navbar, shells de página, toolbar del Planner y breakpoints/tokens compartidos.
- **Pasos:**
  1. medir anchos mínimos reales de labels/controles;
  2. elegir un patrón móvil único para todas las rutas;
  3. convertir destinos de ruta en enlaces reales;
  4. apilar toolbar conservando orden visual y de DOM;
  5. revisar 320, 360, 390, 768 px y zoom 200 %.
- **Tests/comprobaciones:** Playwright con viewports móviles, assertions de bounding boxes/visibilidad y recorrido de cada ruta; revisión manual de zoom y texto largo.
- **Resultado esperado:** no hay elementos cortados ni rutas inaccesibles, y la composición desktop permanece estable.
- **Criterios de aceptación:** ancho de documento no supera viewport; todos los destinos y controles son visibles/operables; selector y rate no se solapan; navegación usa URLs y soporta abrir en nueva pestaña.
- **Cierre y validación:** la navegación principal usa enlaces reales con estado activo; reserva más ancho para los destinos y reduce cada entrada a su icono en pantallas pequeñas, sin generar scroll en el menú. La marca y el acceso a GitHub se reservan para desktop. El selector y el rate comparten el ancho disponible en móvil, mientras estadísticas y requisitos saltan de línea centrados cuando lo necesitan. El E2E cubre 320, 360, 390 y 768 px, ausencia de overflow, enlaces y separación de controles. La revisión visual detectó y corrigió tanto la alineación vertical de los stats como el scroll horizontal del menú, sin cambiar colores, superficies ni componentes HeroUI.

## Hito 2.6 — Sacar el marquee del camino crítico

- **Prioridad:** P1
- **Estado:** COMPLETADO con medición cuantitativa trasladada al Hito 4.2 (4 de septiembre de 2026).
- **Objetivo específico:** reducir el LCP móvil del empty state y eliminar trabajo de layout forzado.
- **Problema resuelto:** `PERF-001` y parte de `A11Y-002`.
- **Qué cambiar:** reemplazar el marquee aleatorio por contenido determinista y ligero o cargarlo después del contenido esencial; quitar lectura sincrónica de `offsetWidth`; hacer clones no interactivos; respetar `prefers-reduced-motion`; elevar prioridad solo del asset que realmente sea LCP si sigue siendo necesario.
- **Áreas:** empty state del Planner, marquee, carga de imágenes y CSS de motion.
- **Pasos:**
  1. fijar una baseline móvil repetible;
  2. eliminar aleatoriedad SSR/client y medir una versión estática;
  3. si se mantiene animación, calcular geometría sin lectura post-render y aislar clones;
  4. volver a medir LCP, critical chain y reflow en el mismo perfil.
- **Tests/comprobaciones:** trace móvil CPU 4×/Slow 4G, prueba de reduced motion, test DOM de `aria-hidden`/tabindex para clones y comparación de métricas en tres corridas.
- **Resultado esperado:** el contenido esencial se descubre antes y el empty state no introduce controles duplicados ni reflow medible de 63 ms.
- **Criterios de aceptación:** mediana LCP móvil claramente inferior a la baseline de 4.827 ms y objetivo inicial ≤3.500 ms en el perfil auditado; forced reflow atribuible al marquee <10 ms; clones fuera del árbol interactivo; reduced motion detiene movimiento no esencial.
- **Ajuste de alcance aprobado:** se conservan los 16 items aleatorios y todas las copias visibles permanecen clicables; por tanto, se retiran de este hito los requisitos de muestra determinista y clones inertes. La accesibilidad restante de las copias se revisará en 4.1 sin sacrificar la interacción indicada por el usuario.
- **Cierre y validación:** el marquee mantiene tamaño, posición, velocidad, aleatoriedad, repetición dinámica y enlaces en ambos extremos. `ResizeObserver` sustituye las lecturas síncronas de `offsetWidth`, el foco también pausa la cinta y `prefers-reduced-motion` elimina la animación. El heading precede a las imágenes en el DOM sin cambiar su orden visual y solo el primer asset recibe carga eager/prioridad alta. Vitest, build, E2E y comportamiento visual fueron validados por el usuario. No se registraron las tres trazas móviles requeridas; la medición LCP/reflow se incorpora a la baseline y presupuesto del Hito 4.2.

# FASE 3 — Límites arquitectónicos y modelo derivado

**Objetivo global:** simplificar la dirección de dependencias y establecer un único modelo tipado derivado de los JSON, manteniendo la estructura feature-first y Zustand donde sí hay estado de usuario.

**Progreso:** 5/5 hitos cerrados; Fase 3 completada.

**Por qué ahora:** los fallos P1 ya estarán cubiertos; se puede refactorizar con tests que preserven el comportamiento correcto recién fijado.

**Resultado acumulativo:** router acíclico, APIs públicas de features explícitas, catálogo derivado compartido, Flow tipado y código muerto retirado sin introducir capas genéricas innecesarias.

**Riesgo global:** alto; los barrels, aliases y tipos de nodos tienen muchos consumidores. Migrar por feature y mantener builds verdes en cada hito.

**Dependencias:** Fases 1–2. Hito 3.3 depende del contrato one-to-many de 2.2; 3.5 se beneficia de los contratos públicos de 3.2.

## Hito 3.1 — Separar metadata de rutas del layout

- **Prioridad:** P2
- **Estado:** COMPLETADO (4 de septiembre de 2026).
- **Objetivo específico:** eliminar el ciclo router↔`RootLayout` y convertir la navegación en semántica web real.
- **Problema resuelto:** `ARCH-001` y parte de `UI-001`.
- **Qué cambiar:** mover IDs/path/labels/icon metadata a un módulo neutral sin importar JSX de página/layout; hacer que router y navbar dependan de él en una sola dirección; renderizar links mediante React Router.
- **Áreas:** `src/router/`, `src/layouts/`, metadata compartida de navegación.
- **Pasos:** definir contrato mínimo de ruta navegable; separar route objects lazy de metadata; eliminar import inverso desde layout; preservar active state y accesibilidad.
- **Tests/comprobaciones:** grafo de imports sin ciclo, build, tests de active route, deep links y E2E de navegación/History.
- **Resultado esperado:** layout no necesita importar el router completo y los destinos funcionan como enlaces.
- **Criterios de aceptación:** no existe SCC router/layout; cada metadata tiene una sola fuente; click, teclado, back/forward y abrir en nueva pestaña funcionan.
- **Cierre y validación:** rutas y navegación comparten constantes y metadata neutrales en `routes.ts`, mientras `router.tsx` conserva exclusivamente páginas lazy y el árbol React. `RootLayout` ya no importa la configuración del router ni usa navegación imperativa: renderiza enlaces reales con estado activo. La configuración interna dejó de exportarse, el límite quedó documentado y el E2E cubre deep link, `aria-current`, atrás y adelante. El usuario validó build y navegación.

## Hito 3.2 — Definir APIs públicas de features sin autociclos

- **Prioridad:** P2
- **Estado:** COMPLETADO (5 de septiembre de 2026).
- **Objetivo específico:** conservar barrels útiles para consumidores externos sin que módulos internos se importen a sí mismos a través del barrel.
- **Problema resuelto:** `ARCH-002`.
- **Qué cambiar:** establecer regla “interno usa paths internos/tipos locales; externo usa API pública”; mover contratos neutrales fuera de componentes; retirar imports de hooks/stores desde barrels que reexportan al consumidor; exponer selectors públicos para relaciones cross-feature.
- **Áreas:** `features/planner`, `features/items`, `features/corporations`, barrels y documentación.
- **Pasos:** inventariar ciclos; romper primero planner y items; crear archivos `types`/`selectors` de bajo nivel; ajustar imports de corporations sin saltar a `lib` privado; añadir regla de lint si puede expresarse sin falsos positivos.
- **Tests/comprobaciones:** detector de ciclos/import graph, TypeScript, lint, Vitest y build tras cada feature.
- **Resultado esperado:** dirección de dependencias comprensible sin prohibir todos los barrels.
- **Criterios de aceptación:** cero autociclos confirmados; ningún feature externo importa `lib/` privado de otro; API pública contiene solo contratos deliberados; AGENTS documenta la regla.
- **Cierre y validación:** Planner dejó de importar `usePlannerTarget` desde su propio barrel, el store de Items consume su contrato de tipos directamente y la navegación de niveles de Corporations se expone mediante su API pública. Los barrels raíz de Planner e Items quedaron limitados a consumidores externos reales y `AGENTS.md` documenta la dirección permitida para features y stores. La revisión estática confirmó cero imports mediante el barrel propio y cero accesos privados entre features; no se añadió una regla de lint específica porque exigiría excepciones por feature sin aportar suficiente señal adicional. Los E2E que arrancan sobre rutas lazy esperan ahora su contenido real bajo carga paralela. El usuario confirmó `pnpm test:all`, incluida la tabla final aislada para formato, lint, Vitest, typecheck E2E, build y Playwright. No se modificaron los catálogos JSON ni el comportamiento visual de la aplicación.

## Hito 3.3 — Crear un catálogo derivado tipado y retirar estado estático

- **Prioridad:** P2
- **Estado:** COMPLETADO (5 de septiembre de 2026).
- **Objetivo específico:** centralizar normalización e índices sin repository layer ni copiar los JSON.
- **Problemas resueltos:** `DATA-001`, `DATA-002` y consolidación de `BUG-002`/`BUG-003`.
- **Qué cambiar:** implementar un módulo puro cacheado a nivel de módulo con catálogos e índices (`itemById`, `buildingById`, `producersByItem`, asociaciones corporation); hacer opcionales/precisos los campos según fuente; corregir el contrato de keys de corporations; eliminar el Zustand store que solo envuelve constantes.
- **Áreas:** `src/shared/data/`, types/adapters de features, `data.store` y consumidores.
- **Pasos:**
  1. definir tipos raw que reflejen campos ausentes (`recipes?`);
  2. definir modelos derivados separados y explícitos;
  3. construir índices una vez; se omite validación runtime general porque los snapshots se revisan antes de incorporarlos;
  4. migrar consumidores gradualmente;
  5. borrar store estático cuando quede sin consumidores;
  6. unificar `NON_PRODUCING_TYPES` en el dueño del dominio.
- **Tests/comprobaciones:** tests de invariantes sobre datos reales en solo lectura; fixtures pequeñas para índices; typecheck; búsqueda de la constante duplicada y store retirado.
- **Resultado esperado:** todas las features leen la misma interpretación del dataset y Zustand queda reservado a estado mutable del usuario.
- **Criterios de aceptación:** el refactor no usa ediciones de los JSON para completar datos; los tipos raw no mienten; los índices conservan 0/1/N productores; no hay dos definiciones de reglas de producción; no existe store de datos estáticos sin estado mutable.
- **Cierre y validación:** los cuatro JSON se consumen desde una única frontera pública en `shared/data`; los tipos raw representan campos ausentes y los modelos derivados normalizan `recipes`, `power`, `heat` y asociaciones de corporations. Los índices de items, buildings, nombres, medidas, corporations y productores se crean una vez y todas las features consumen esa misma interpretación. Se retiraron `data.store`, `useItemMap` y el helper compartido ya innecesario; Zustand queda reservado a inputs editables. La regla de buildings productores tiene un único dueño y las fixtures conservan relaciones 0/1/N. El ensamblador `index.ts` delega normalización e índices a módulos pequeños documentados. Por decisión del usuario no se mantienen validaciones generales de duplicados o referencias: los snapshots cambian poco y se revisan antes de incorporarlos. No se modificó ningún JSON protegido.

## Hito 3.4 — Separar 404 de error runtime y estabilizar deep links

- **Prioridad:** P2
- **Estado:** COMPLETADO (5 de septiembre de 2026).
- **Objetivo específico:** dar una salida correcta a rutas inexistentes y fallos inesperados, sin temporizadores frágiles.
- **Problema resuelto:** `ERROR-001`.
- **Qué cambiar:** crear error boundary de ruta que distinga `isRouteErrorResponse(404)` de excepciones; renderizar ambos dentro del shell con `main`, heading y recuperación; reemplazar timeout fijo de corporation por una transición basada en router/store listo y cleanup.
- **Áreas:** configuración de React Router, páginas de error/not-found, navegación corporation→Items y tests.
- **Pasos:** definir contratos de error; conservar detalle técnico solo en desarrollo; ofrecer volver/inicio/reintentar; mover selección de corporation a state/query determinista; borrar timeout o cancelarlo si sigue siendo imprescindible.
- **Tests/comprobaciones:** unitarios de boundary, deep link válido e inválido, excepción de loader/componente y navegación rápida/desmontaje; E2E 404 y corporation→Items.
- **Resultado esperado:** una excepción no se disfraza de 404 y la navegación no depende de 300 ms arbitrarios.
- **Criterios de aceptación:** 404 y 500 tienen mensajes/acciones diferentes; ambos conservan landmark y H1; deep link funciona bajo carga lenta; no queda timer sin cleanup.
- **Cierre y validación:** el boundary de rutas vive dentro de `RootLayout`, por lo que tanto las rutas desconocidas como los fallos inesperados conservan el shell, la navegación y el landmark principal. Un 404 muestra una salida específica hacia Planner; una excepción runtime ofrece reintento e inicio, y solo expone el detalle técnico en desarrollo. La navegación directa a un nivel de Corporation ya centra la fila cuando el nodo real se monta mediante un callback ref, sin depender del timeout fijo de 300 ms. Se añadieron pruebas unitarias de ambos tipos de error y recorridos E2E para el 404 y el deep link. El usuario confirmó el funcionamiento del hito.

## Hito 3.5 — Tipar nodos React Flow y retirar contratos muertos

- **Prioridad:** P3
- **Estado:** COMPLETADO (5 de septiembre de 2026).
- **Objetivo específico:** hacer que cada renderer reciba el `data` exacto que construye su feature.
- **Problemas resueltos:** `TS-001`, `DEAD-001`.
- **Qué cambiar:** declarar un union de tipos de nodo por diagrama, parametrizar builders/resultados/`NodeProps`, eliminar casts `data as`; borrar `Stats`, `useFlowFitEffect` y `FlowBuildResult.stats` tras confirmar consumidores; limpiar imports derivados del tab retirado.
- **Áreas:** diagramas Planner, shared Flow types/hooks y tests.
- **Pasos:** migrar un diagrama cada vez; usar exhaustividad por `type`; evitar un union global que acople Base Designer; eliminar símbolos solo tras `rg` y typecheck.
- **Tests/comprobaciones:** `tsc`, tests de builders/renderers y búsqueda de casts/símbolos retirados.
- **Resultado esperado:** cambios de shape fallan en compilación en el constructor o renderer correcto.
- **Criterios de aceptación:** renderers auditados no hacen cast manual de `data`; union es exhaustivo; símbolos muertos tienen cero referencias; tests/build siguen verdes.
- **Cierre y validación:** `flow/types.ts` define la unión local de nodos de Planner y relaciona cada discriminante con los datos exactos de su renderer. Builders, estado de nodos, `ReactFlow` y cada `NodeProps` consumen el mismo contrato; el mapa de componentes es exhaustivo mediante un mapped type y ya no existen casts `data as`. Se retiraron `Stats`, `useFlowFitEffect`, `FlowBuildResult`, el builder y barrel redundantes, además de callbacks, flags y campos que ningún nodo utilizaba. El ajuste diferido del viewport devuelve cleanup y tiene pruebas de ejecución y cancelación. Los recorridos de error comprueban la navegación real de HeroUI y que el deep link abre y centra el nivel solicitado. El usuario confirmó formato, lint, 77 unitarios, typecheck E2E, build y los E2E afectados; los catálogos JSON protegidos permanecen intactos.

# FASE 4 — Accesibilidad, coherencia visual y presupuesto de rendimiento

**Objetivo global:** terminar la semántica de la interfaz y hacer que las mejoras de carga se sostengan mediante límites medibles, sin rediseñar el producto.

**Progreso:** 1/2 hitos cerrados; Fase 4 en curso.

**Por qué ahora:** los bloqueos P1 de interacción y LCP ya habrán desaparecido; esta fase completa los estados menos críticos y previene regresiones del bundle.

**Resultado acumulativo:** headings y nombres coherentes, motion respetuoso, TreeList operable, escala de Base Designer honesta y entry/CSS bajo presupuesto explícito.

**Riesgo global:** medio; las mejoras semánticas pueden alterar estructura DOM y selectores, y el code splitting puede introducir waterfalls si se hace sin medir.

**Dependencias:** Hitos 2.4–2.6 y 3.1. El presupuesto de 4.2 usa una baseline construida con el toolchain de Fase 1.

## Hito 4.1 — Completar semántica, contraste y reduced motion

- **Prioridad:** P2
- **Estado:** COMPLETADO (5 de septiembre de 2026).
- **Objetivo específico:** corregir los problemas accesibles restantes de forma sistemática y visible.
- **Problema resuelto:** `A11Y-002` y remanentes de `A11Y-001`.
- **Qué cambiar:** un solo H1 de página dentro de `main`; brand sin apropiarse del heading principal; labels/nombres iguales al texto visible; contraste AA del chip de categoría; estructura válida del navbar; TreeList con botones y estado expandido o patrón tree completo; reduced motion también para Flow/transiciones; marcar los footprints fallback como “estimados”.
- **Áreas:** layout, PageHeader/Typography, navbar, Items, corporations, Base Designer, TreeList, Flow y CSS/tokens.
- **Pasos:**
  1. fijar jerarquía de headings por shell y página;
  2. corregir nombres visibles/accesibles desalineados;
  3. ajustar color dentro de la paleta actual y verificar ambos estados;
  4. elegir para TreeList semántica disclosure simple o tree completa según interacción real;
  5. centralizar media query de movimiento reducido;
  6. añadir badge/copy de estimación solo a footprints sin dato.
- **Tests/comprobaciones:** Testing Library por roles/nombres, axe/Lighthouse como detector, contraste calculado, Playwright keyboard, snapshot con `prefers-reduced-motion: reduce` y revisión visual desktop/móvil.
- **Resultado esperado:** la misma jerarquía y terminología se perciben visualmente y por tecnología asistiva; la estimación 4×4 no se presenta como dato exacto.
- **Criterios de aceptación:** una H1 por ruta; markup de lista válido; contraste de texto normal ≥4.5:1; nombres accesibles contienen el nombre visible; TreeList expone expanded/level cuando aplique; animación no esencial se detiene con reduced motion; los 40 fallbacks se identifican como estimados.
- **Cierre y validación:** cada ruta dispone de un único H1 dentro de `main` y la marca conserva su apariencia sin apropiarse del heading. La navegación principal usa una lista nativa válida y los enlaces de corporations obtienen su nombre accesible del mismo texto visible. Los chips de categoría conservan el fondo cromático de dominio con texto de foreground contrastado. TreeList adopta el patrón disclosure real mediante listas anidadas y botones nativos con `aria-expanded`, retirando el control simulado y su transición de montaje. La preferencia de movimiento reducido detiene marquee, animaciones CSS y edges, elimina la duración de los ajustes de viewport de ambos Flow y evita scroll programático suave. Las copias del marquee siguen siendo clicables, pero solo el ciclo principal participa en el orden de tabulación. Base Designer muestra la medida de todos los edificios y etiqueta como `estimated` los 40 fallbacks 4×4, sin modificar los catálogos. Se añadieron pruebas para semántica de TreeList, procedencia del footprint, viewport sin animación y copias del marquee. El usuario confirmó `pnpm test:all` y la revisión visual.

## Hito 4.2 — Dividir trabajo inicial y fijar budgets

- **Prioridad:** P2
- **Objetivo específico:** bajar coste inicial sin fragmentación manual arbitraria.
- **Problema resuelto:** `PERF-002`.
- **Qué cambiar:** importar CSS de XYFlow solo donde se necesita; impedir que el playground DEV se resuelva/emita en producción; auditar imports HeroUI por entrada; lazy-load de rutas/features pesadas que no participan en la primera vista; añadir reporte/budget del entry JS y CSS.
- **Áreas:** entry global, router lazy, Dev UI, imports de UI/Flow, Vite y CI.
- **Pasos:**
  1. capturar tamaños antes del cambio;
  2. quitar primero assets/código inequívocamente globales;
  3. inspeccionar grafo después de cada split para evitar waterfalls;
  4. fijar límites inicialmente cercanos a la mejora lograda, no un número aspiracional;
  5. fallar CI solo ante regresión significativa y mostrar el delta.
- **Tests/comprobaciones:** `pnpm build`, inspección de chunks/sourcemap, trace de primera ruta y navegación diferida, comparación gzip y ausencia de chunk DEV en manifest de producción.
- **Resultado esperado:** entry menor que la baseline de 687,02 kB min/194,16 kB gzip y CSS inicial menor que 273 kB, sin retrasar la primera interacción de rutas lazy.
- **Criterios de aceptación:** chunk Dev UI de 56,45 kB no se emite en producción; XYFlow no carga en rutas que nunca muestran grafos cuando técnicamente separable; budgets están versionados; métricas de navegación no empeoran materialmente.
- **Seguimiento heredado de 2.6:** repetir tres trazas móviles CPU 4×/Slow 4G sobre el empty state, registrar mediana LCP y confirmar que el marquee no vuelve a introducir reflow forzado.

# FASE 5 — Cobertura de riesgos y flujo humano → Playwright

**Objetivo global:** cubrir contratos de dominio y recorridos críticos con la capa de prueba correcta, y dar a humanos/Codex un proceso corto para convertir escenarios en E2E mantenibles.

**Por qué ahora:** la arquitectura y la semántica estabilizadas evitan escribir tests contra estructuras que se van a retirar inmediatamente.

**Resultado acumulativo:** Vitest cubre reglas puras/estado; Playwright cubre journeys, móvil y teclado; CI ejecuta ambos; los escenarios humanos tienen una plantilla y ownership claros.

**Riesgo global:** medio; el mayor riesgo es sobreautomatizar detalles visuales o duplicar casos entre capas.

**Dependencias:** Playwright operativo desde 1.3; contratos de Fases 2–4 terminados. El hito 5.2 precede a la expansión de specs de 5.3.

## Hito 5.1 — Añadir tests unitarios de las fronteras de dominio

- **Prioridad:** P2
- **Objetivo específico:** proteger las reglas con mayor fan-out sin perseguir cobertura porcentual.
- **Problema resuelto:** `TEST-001`.
- **Qué cambiar:** añadir fixtures tipadas pequeñas y tests para one-to-many, raw target, supply/persistencia, índices derivados, error routing y footprint estimado; consolidar helpers de render solo si reducen repetición real.
- **Áreas:** tests colocados junto a planner/items/data/router/base-designer.
- **Pasos:** escribir primero tabla de casos por invariante; probar funciones/selectors antes que DOM; añadir integración de store solo donde importa la secuencia; usar dataset real únicamente para asserts de integridad, no snapshots gigantes.
- **Tests/comprobaciones:** suite Vitest completa, mutación manual temporal de una condición para comprobar que el test falla y revisión de tiempo total.
- **Resultado esperado:** un cambio que vuelva a colapsar productores, conserve supply cero o trate raw como receta falla cerca de su causa.
- **Criterios de aceptación:** cada regla crítica tiene test positivo y negativo; fixtures no copian bloques grandes de JSON; no hay mocks de la lógica bajo prueba; suite mantiene feedback rápido y determinista.

## Hito 5.2 — Crear y evaluar la skill local `playwright-project`

- **Prioridad:** P2
- **Objetivo específico:** adaptar buenas prácticas de Playwright al workflow real Windows/pnpm del repositorio.
- **Problema resuelto:** parte principal de `SKILL-001` y habilitador de `TEST-002`.
- **Qué cambiar:** crear una skill breve con trigger preciso, comandos reales, routing Vitest/E2E/manual, plantilla humana, locators, web-first assertions, aislamiento, trace y prohibición del MCP en el camino por defecto; citar documentación oficial y fijar cualquier referencia externa reutilizada.
- **Áreas:** `.agents/skills/playwright-project/` y documentación E2E.
- **Pasos:**
  1. extraer solo reglas verificadas de la documentación oficial;
  2. revisar y adaptar, no copiar ciegamente, ideas diagnósticas del candidato Magnus;
  3. crear 3–5 prompts de evaluación reales del repo;
  4. comprobar trigger, utilidad, longitud y que no invente scripts;
  5. conservarla solo si supera la baseline sin skill.
- **Tests/comprobaciones:** evals con navegación simple, flujo multi-ruta, keyboard/mobile, elección Vitest vs Playwright y diagnóstico de browser ausente.
- **Resultado esperado:** Codex genera specs alineadas con el proyecto y sabe rechazar casos que pertenecen a Vitest/manual.
- **Criterios de aceptación:** skill referencia `pnpm` y paths reales; no presupone bash/npx ni servicios externos; incluye plantilla humana; todos los comandos funcionan; evals muestran mejora observable; licencia/origen de fragmentos queda registrado.

## Hito 5.3 — Automatizar journeys críticos, responsive y teclado

- **Prioridad:** P2
- **Objetivo específico:** ampliar desde smoke tests a un conjunto pequeño que detecte roturas de producto de alto impacto.
- **Problema resuelto:** `TEST-002` y validación integrada de `BUG-001`, `BUG-002`, `BUG-003`, `UI-001` y `A11Y-001`.
- **Qué cambiar:** organizar specs por journey con estado aislado; cubrir Planner target/rate/supply/persistencia visible, raw target, Items filtro multi-productor y CTA, corporation deep link, Base Designer catálogo/place/remove y navegación móvil/teclado.
- **Áreas:** `e2e/`, helpers mínimos y fixtures de storage cuando sean imprescindibles.
- **Pasos:**
  1. priorizar 5–8 journeys, no cada combinación;
  2. usar role/name y assertions web-first;
  3. limpiar localStorage/context por test;
  4. añadir un proyecto móvil solo para journeys responsive relevantes;
  5. documentar qué evaluación visual queda manual.
- **Tests/comprobaciones:** repetición local (`--repeat-each`) para detectar flakiness, ejecución Chromium en CI y revisión de traces de fallos reales.
- **Resultado esperado:** el usuario puede confiar en que los recorridos principales sobreviven cambios de layout, datos derivados y routing.
- **Criterios de aceptación:** specs independientes y paralelizables; cero sleeps fijos/selectores CSS; los journeys P1 están cubiertos; móvil detecta overflow/cortes; teclado completa supply; historial de CI no muestra flakiness persistente.

## Hito 5.4 — Consolidar gates y política de artefactos

- **Prioridad:** P2
- **Objetivo específico:** convertir lint, tipos, unit, build y E2E en una definición única de listo.
- **Problema resuelto:** cierre de `DX-001`, `E2E-001`, `TEST-001` y `TEST-002`.
- **Qué cambiar:** ordenar jobs para feedback temprano, cachear pnpm de forma segura, cancelar ejecuciones superseded, publicar solo reportes útiles y documentar excepciones temporales con owner/fecha.
- **Áreas:** CI, scripts y README de contribución.
- **Pasos:** ejecutar format/lint/typecheck/unit antes de build/E2E; usar los mismos scripts local/CI; medir duración; separar solo el trabajo que paraleliza de verdad; limitar retención de artefactos.
- **Tests/comprobaciones:** PR de prueba verde, fallos inducidos de cada gate y verificación de que el mensaje apunta al comando local equivalente.
- **Resultado esperado:** una regresión obtiene feedback específico y reproducible, no un “build failed” opaco.
- **Criterios de aceptación:** todos los gates obligatorios se ejecutan; no hay comandos exclusivos de CI; artefactos aparecen en fallo conforme a política; caché no oculta instalación congelada; tiempo total queda medido y documentado.

# FASE 6 — Documentación, skills y housekeeping proporcional

**Objetivo global:** alinear la superficie de mantenimiento con el sistema resultante y retirar ruido de bajo riesgo.

**Por qué ahora:** documentación y skills deben describir la arquitectura final, no el estado intermedio; los últimos cambios son pequeños y no deben bloquear la corrección del producto.

**Resultado acumulativo:** onboarding fiable, comentarios útiles, catálogo de skills pequeño, metadatos públicos básicos correctos y política de assets explícita.

**Riesgo global:** bajo, salvo retirar una skill/dependencia todavía usada; cada eliminación requiere búsqueda de consumidores.

**Dependencias:** Fases 1–5. El README técnico debe actualizarse después de 3.2/3.3; la guía de pruebas después de 5.3.

## Hito 6.1 — Reescribir documentación operativa y comentarios engañosos

- **Prioridad:** P2
- **Objetivo específico:** hacer que README, estructura y comentarios coincidan con el código y los comandos comprobados.
- **Problema resuelto:** `DOC-001` y parte documental de `AGENT-001`.
- **Qué cambiar:** corregir referencias a `src/assets`, `src/app/App.tsx`, escala exacta de Base Designer y setup E2E; añadir mapa corto de arquitectura/data flow; depurar comentarios de SupplyCard y módulos afines para conservar solo intención/invariante/decisión.
- **Áreas:** README raíz, `README-STRUCTURE`, README E2E/Base Designer, `AGENTS.md` y comentarios inline.
- **Pasos:** validar cada path/comando con el repo; enlazar documentos especializados en vez de duplicarlos; marcar 4×4 fallback como estimación; introducir regla de comentarios con ejemplos breves; borrar texto histórico obsoleto.
- **Tests/comprobaciones:** ejecutar todos los comandos copiados, comprobar links/paths con script simple y revisión de un onboarding simulado desde checkout limpio.
- **Resultado esperado:** un colaborador puede arrancar, ubicar un cambio y elegir la capa de test sin descubrir excepciones por ensayo/error.
- **Criterios de aceptación:** cero paths conocidos obsoletos; comandos verificados; restricción de edición de JSON y footprint estimado explícitos; comentarios narrativos/misleading señalados en el finding han sido corregidos.

## Hito 6.2 — Reducir y adaptar el catálogo de skills

- **Prioridad:** P2
- **Objetivo específico:** conservar únicamente guías frecuentes, precisas y adaptadas a esta SPA.
- **Problema resuelto:** resto de `SKILL-001`.
- **Qué cambiar:** KEEP de `interface-design` y `web-perf`; IMPROVE de `react-best-practices` y `find-skills`; MERGE de reglas útiles de composition dentro de React y retirada de `vercel-composition-patterns`; REMOVE de `skill-creator` local, manteniéndola disponible global/on-demand.
- **Áreas:** `.agents/skills/` y cualquier índice/documentación de skills.
- **Pasos:** editar descripciones para triggers específicos; retirar referencias Mastra/TanStack/no-web; convertir absolutos sobre memo/casts/null en criterios; exigir revisión/licencia/pinning al descubrir; ejecutar evals antes/después; eliminar una skill solo tras confirmar que la consolidada cubre prompts relevantes.
- **Tests/comprobaciones:** matriz de prompts positivos/negativos, revisión completa de los `SKILL.md`, medición de conflicto de triggers y búsqueda de links internos rotos.
- **Resultado esperado:** menor carga de contexto y menos reglas contradictorias, sin perder capacidades frecuentes de diseño, React y performance.
- **Criterios de aceptación:** cada skill restante tiene scope y trigger no solapados; composición está cubierta una sola vez; discovery exige supply-chain review; `skill-creator` no vive localmente; evals documentan que no cae la calidad.

## Hito 6.3 — Corregir metadatos públicos básicos

- **Prioridad:** P4
- **Objetivo específico:** cerrar inconsistencias SEO/documentales sin ampliar el alcance a SSR.
- **Problema resuelto:** `SEO-001`.
- **Qué cambiar:** favicon con MIME/extensión real, description útil, `robots.txt` servido como texto y title estable; decidir conscientemente indexación. No añadir sitemap/schema/SSR sin necesidad de negocio.
- **Áreas:** `index.html`, `public/`, configuración SPA/hosting.
- **Pasos:** crear/reutilizar asset correcto; añadir meta; colocar `robots.txt` antes del rewrite catch-all; verificar headers y rutas en preview/deploy.
- **Tests/comprobaciones:** `curl`/browser sobre favicon y robots, Lighthouse SEO y build preview.
- **Resultado esperado:** crawlers y navegador reciben tipos/contenido correctos, sin que una ruta de texto termine en la SPA.
- **Criterios de aceptación:** favicon carga sin mismatch; description presente; `/robots.txt` devuelve `text/plain` y no HTML; Lighthouse deja de señalar esos ítems.

## Hito 6.4 — Formalizar la política de iconos y fallbacks

- **Prioridad:** P4
- **Objetivo específico:** distinguir assets anticipados de huérfanos y hacer explícitas las excepciones.
- **Problema resuelto:** `ASSET-001`.
- **Qué cambiar:** documentar naming/origen/ownership; generar un reporte no destructivo catálogo↔archivos; decidir si los 26 iconos de item extra son futuros; conservar el fallback explícito de Zipline o aportar asset autorizado.
- **Áreas:** `public/assets/icons/`, `AssetImage`, documentación y script de inventario.
- **Pasos:** comparar manifest de datos y disco; etiquetar categorías `used`, `future`, `missing-with-fallback`, `orphan`; no borrar automáticamente; añadir comprobación informativa o gate solo para missing sin fallback.
- **Tests/comprobaciones:** inventario reproducible y render de fallback.
- **Resultado esperado:** incorporar o retirar assets deja de depender de inspección manual y ninguna ausencia aceptada se confunde con error.
- **Criterios de aceptación:** los 26 extras tienen decisión registrada; Zipline está cubierto por asset o fallback probado; el script no escribe/borrar archivos; CI solo falla por ausencias no declaradas.

# Matriz de trazabilidad hallazgo → roadmap

| Finding     | Prioridad | Hito primario | Hitos relacionados | Estado objetivo                                     |
| ----------- | --------- | ------------- | ------------------ | --------------------------------------------------- |
| `DX-001`    | P1        | 1.1           | 5.4                | Toolchain e instalación reproducibles.              |
| `DEP-001`   | P1        | 1.2           | 4.2                | Dependencias mínimas, actualizadas y justificadas.  |
| `E2E-001`   | P1        | 1.3           | 5.4                | Chromium y specs ejecutables local/CI.              |
| `AGENT-001` | P1        | 1.4           | 6.1                | Restricción de edición explicada a los agentes.     |
| `BUG-001`   | P1        | 2.1           | 5.1, 5.3           | Supply es positivo o no existe.                     |
| `BUG-002`   | P1        | 2.2           | 3.3, 5.1, 5.3      | Ningún productor se descarta.                       |
| `BUG-003`   | P2        | 2.2           | 3.3, 5.1, 5.3      | Raw item soportado de extremo a extremo.            |
| `A11Y-001`  | P1        | 2.4           | 5.3                | Supply/target operables y nombrados.                |
| `UI-001`    | P1        | 2.5           | 3.1, 5.3           | Navegación y toolbar responsive.                    |
| `UI-002`    | P2        | 2.3           | 3.5                | Placeholder interno retirado.                       |
| `PERF-001`  | P1        | 2.6           | 4.1                | LCP/reflow/motion del empty state corregidos.       |
| `ARCH-001`  | P2        | 3.1           | 2.5                | Router/layout sin ciclo y links reales.             |
| `ARCH-002`  | P2        | 3.2           | 6.1                | APIs públicas con dirección de imports.             |
| `DATA-001`  | P2        | 3.3           | 2.2, 5.1           | Tipos raw/derivados fieles a la fuente.             |
| `DATA-002`  | P2        | 3.3           | 1.4, 5.1           | Índices/reglas únicos, sin Zustand estático.        |
| `ERROR-001` | P2        | 3.4           | 5.1, 5.3           | 404, error runtime y deep links diferenciados.      |
| `TS-001`    | P3        | 3.5           | 5.1                | Nodos Flow tipados sin casts de frontera.           |
| `DEAD-001`  | P3        | 3.5           | 2.3                | Contratos y hooks sin consumidores retirados.       |
| `A11Y-002`  | P2        | 4.1           | 2.6, 5.3           | Semántica, contraste y motion consistentes.         |
| `PERF-002`  | P2        | 4.2           | 1.2, 5.4           | Entry/CSS medidos y bajo budget.                    |
| `TEST-001`  | P2        | 5.1           | 5.4                | Invariantes cubiertos por Vitest.                   |
| `TEST-002`  | P2        | 5.3           | 1.3, 5.2, 5.4      | Journeys críticos cubiertos por Playwright.         |
| `SKILL-001` | P2        | 5.2           | 6.2                | Skill Playwright adaptada y catálogo racionalizado. |
| `DOC-001`   | P2        | 6.1           | 1.4                | Onboarding/docs/comentarios fieles al repo.         |
| `SEO-001`   | P4        | 6.3           | —                  | Metadatos y recursos públicos correctos.            |
| `ASSET-001` | P4        | 6.4           | —                  | Assets clasificados y fallbacks explícitos.         |

La secuencia es acumulativa, no un conjunto de iniciativas paralelas: cada fase debe terminar con sus criterios de aceptación y gates verdes antes de empezar la siguiente. Dentro de una fase solo se paralelizan hitos cuyas dependencias se indiquen como independientes; cualquier edición no autorizada de datos, regresión de cálculo o accesibilidad bloquea el avance aunque el build compile.
