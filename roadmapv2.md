# Roadmap v2 — Revisión incremental de calidad

**Fecha:** 7 de septiembre de 2026  
**Tipo:** roadmap posterior a una auditoría completa  
**Alcance:** mejoras incrementales, de bajo o medio riesgo, basadas en evidencia  
**Estado de creación (histórico):** sin cambios realizados durante esta revisión

**Estado actualizado al 12 de septiembre de 2026:** los lotes 1, 2 y 6 se ejecutaron parcialmente o por completo en `71f51c8`. Esta actualización conserva el plan original y añade el resultado de la auditoría incremental final; no modifica código de producto ni catálogos protegidos.

## 1. Objetivo

Este roadmap no sustituye a `AUDIT.md` ni pretende repetir la auditoría histórica completa. Su objetivo es ordenar las mejoras que todavía tienen una relación clara entre coste y beneficio después de:

- la auditoría general del proyecto;
- el delta audit documentado en `docs/AUDIT.md`;
- la actualización del catálogo de skills;
- la corrección reciente de la semántica del marquee;
- una revisión incremental de arquitectura, código, UI/UX, rendimiento, configuración, tests y documentación.

La regla de trabajo es conservadora:

> No se modifica una parte correcta del proyecto sin evidencia de un beneficio apreciable.

No se deben tocar los catálogos protegidos de `src/shared/data/`:

- `buildings_and_recipes.json`;
- `buildings_construction_area.json`;
- `corporations_components.json`;
- `items_catalog.json`.

## 2. Estado de partida

### 2.1 Estado general

El proyecto está en un estado sólido. La arquitectura feature-first, la separación entre estado editable y datos derivados, la normalización del catálogo, la carga lazy por ruta y el uso combinado de Vitest y Playwright siguen siendo adecuados.

No se identificaron problemas P0 ni P1 en esta revisión incremental.

Las áreas que todavía justifican trabajo son:

1. accesibilidad explícita en controles y contenido repetido;
2. integración completa del dark mode con superficies nativas del navegador;
3. comportamiento responsive de niveles expandidos en Corporations;
4. LCP móvil y presupuesto de la ruta inicial;
5. fidelidad del resumen agregado de lint;
6. pequeñas inconsistencias de semántica, documentación y React.

### 2.2 Skills actuales

El catálogo actual contiene 14 skills y está sincronizado con `skills-lock.json`. `pnpm check:skills` valida actualmente:

- correspondencia entre skills instaladas y bloqueadas;
- frontmatter básico;
- nombres declarados;
- descripciones;
- enlaces locales requeridos.

Las skills que aportan criterios directamente aplicables son:

| Skill                            | Aplicación en este roadmap                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `best-practices`                 | Compatibilidad, errores de consola, limpieza de listeners, HTML válido y configuración web. |
| `frontend-design`                | Coherencia visual, jerarquía, responsive, estados y uso intencional de movimiento.          |
| `playwright-best-practices`      | Journeys dirigidos, locators semánticos, assertions de comportamiento y validación móvil.   |
| `playwright-cli`                 | Inspección y reproducción en navegador cuando exista un servidor disponible.                |
| `typescript-best-practices`      | Tipos estrechos, casts en fronteras y derivación de estado.                                 |
| `vercel-composition-patterns`    | Composición de componentes y rechazo de abstracciones innecesarias.                         |
| `vercel-react-best-practices`    | Renders derivados, dependencias, bundle y patrones React 19.                                |
| `vitest`                         | Tests unitarios/componentes enfocados en invariantes reales.                                |
| `web-design-guidelines`          | Labels, focus, imágenes, `aria-hidden`, reduced motion, dark mode y semántica.              |
| `web-perf`                       | LCP, INP, CLS, carga de imágenes y presupuestos medidos.                                    |
| `web-quality-audit`              | Separación entre medición runtime, inspección estática e hipótesis.                         |
| `verification-before-completion` | No declarar gates verdes sin salida fresca y verificable.                                   |

`find-skills` no se activa para esta revisión: no se pidió descubrir ni instalar nuevas capacidades.

### 2.3 Skills eliminadas

Las skills locales antiguas `interface-design`, `react-best-practices` y `skill-creator` ya no forman parte del catálogo. No se encontraron dependencias activas del producto hacia ellas.

La ruta `skills/react-best-practices/SKILL.md` dentro de `vercel-react-best-practices` es la ruta de origen de la skill actualmente instalada; no representa una referencia activa a la antigua skill local eliminada.

No se debe recrear ninguna de las skills eliminadas. Las responsabilidades relevantes están cubiertas por el catálogo actual y por las reglas de `AGENTS.md`.

## 3. Evidencia y límites de verificación

### 3.1 Evidencia fresca de esta revisión

| Comprobación         | Resultado                                                                         |
| -------------------- | --------------------------------------------------------------------------------- |
| `pnpm format:check`  | Correcto.                                                                         |
| `pnpm check:skills`  | Correcto: 14 skills instaladas y bloqueadas.                                      |
| Estado de Git        | Limpio al finalizar la revisión.                                                  |
| `pnpm test`          | No verificable en el sandbox: Node no pudo abrir un módulo de Vitest por `EPERM`. |
| `pnpm typecheck:e2e` | No verificable en el sandbox: no pudo resolver el enlace de `@types/node`.        |

Los fallos de lectura de `node_modules` no se clasifican como fallos del proyecto. Antes de cerrar cualquier lote que cambie código se deben repetir los gates en un entorno donde el runtime pueda leer correctamente las dependencias.

### 3.2 Evidencia previa que sigue siendo relevante

`docs/AUDIT.md` registra para el 6 de septiembre:

- 83 tests unitarios/componentes;
- 15 journeys E2E después de la corrección del marquee;
- build de producción correcto;
- ausencia de overflow en el smoke de 390 × 844;
- LCP móvil frío de 3.532, 3.572 y 3.624 ms;
- mediana LCP de 3.572 ms;
- una imagen aleatoria del marquee como elemento LCP.

Esta evidencia sirve como baseline histórico reciente, pero debe reproducirse para validar cambios posteriores.

## 4. Priorización global

### P0 y P1

No hay hallazgos nuevos P0 ni P1.

### P2

1. Añadir nombres accesibles explícitos a los filtros de Items.
2. Completar la integración del dark mode con `color-scheme` y `theme-color`.
3. Corregir el layout móvil de niveles de Corporations expandidos.
4. Validar y, si procede, corregir botones dentro de copias `aria-hidden` del marquee.
5. Completar el Hito 3 heredado de LCP y presupuesto de bundle.
6. Corregir las tablas actuales contradictorias de `docs/AUDIT.md` sobre las skills.

### P3

1. Añadir la `key` que falta en `BuildingSelect`.
2. Hacer fiel el resumen de warnings de `test:all`.
3. Corregir imágenes decorativas que duplican nombres visibles.
4. Añadir skip link al shell principal.
5. Renderizar la descripción de Corporations como párrafo, no como heading.

## 5. Lote 1 — Accesibilidad explícita y consistencia de iconos

**Prioridad:** P2/P3  
**Riesgo:** bajo  
**Beneficio:** alto para usuarios de lector de pantalla y para robustez semántica  
**Dependencias:** ninguna

### 5.1 Labels de filtros

**Problema**

Los filtros de categoría, corporación y búsqueda no declaran un nombre accesible explícito.

**Ubicación**

- `src/features/items/ui/filters/category-select.tsx:21-29`;
- `src/features/items/ui/filters/corporation-select.tsx:12-21`;
- `src/features/items/ui/filters/search-input.tsx:9-17`.

**Cambio previsto**

Añadir `aria-label` o un label visible compartido. Los placeholders pueden conservarse como ayuda visual, pero no deben ser el único nombre del control.

**Criterios de aceptación**

- Cada filtro tiene un nombre estable y específico.
- El nombre no depende del valor seleccionado.
- Las assertions E2E usan `getByRole` con esos nombres.
- No cambia el ancho ni el wrapping visual de la barra de filtros.

### 5.2 Iconos decorativos

**Problema**

Algunos iconos de búsqueda no están marcados explícitamente como decorativos.

**Cambio previsto**

Añadir `aria-hidden` a iconos cuyo significado ya está expresado por el nombre del control.

**Criterios de aceptación**

- El icono no introduce un nombre o anuncio adicional.
- El control mantiene su nombre accesible.
- No se marca como decorativo ningún icono que sea el único contenido informativo.

### 5.3 `alt` contextual en iconos de catálogo

**Problema**

`AssetImage` genera un `alt` a partir del ID cuando no se proporciona uno. En varios componentes el icono aparece junto a un nombre visible y puede anunciarse dos veces.

**Ubicación**

- `src/shared/ui/asset-image/asset-image.tsx:57-68`;
- `src/features/items/ui/table/items-table-cells.tsx:11-15`;
- `src/features/recipes/ui/recipe-output.tsx:20-23`;
- `src/features/recipes/ui/recipe-inputs.tsx:23-28`;
- filas equivalentes de Corporations y Planner.

**Cambio previsto**

Usar `alt=""` en los callsites donde el nombre visible ya comunica la misma información. Mantener el fallback global para contextos donde el icono sí sea informativo por sí mismo.

**Criterios de aceptación**

- No se cambia el comportamiento del fallback de `AssetImage` en contextos standalone.
- Los nombres visibles siguen siendo accesibles.
- Un lector de pantalla no recibe el mismo nombre dos veces en los casos corregidos.

### 5.4 Skip link

**Problema**

El shell tiene navegación primaria, pero no se encontró un skip link hacia el contenido principal.

**Ubicación**

- `src/layouts/root-layout.tsx`;
- `index.html`.

**Cambio previsto**

Añadir un enlace `Skip to main content` con destino estable y un `id` en el elemento `main`. Debe hacerse visible al recibir foco.

**Criterios de aceptación**

- El primer foco útil permite saltar la navegación.
- El enlace no ocupa espacio visual cuando no está enfocado.
- El indicador de foco cumple el estilo del tema.
- El destino conserva el scroll correcto en desktop y móvil.

## 6. Lote 2 — Dark mode nativo y estados visuales

**Prioridad:** P2  
**Riesgo:** bajo  
**Beneficio:** medio/alto, especialmente en móvil y controles nativos  
**Dependencias:** ninguna

### 6.1 Integración del esquema oscuro

**Problema**

HeroUI está configurado en dark mode y el documento usa `class="dark"`, pero el navegador no recibe una declaración explícita de esquema oscuro.

**Ubicación**

- `index.html:2-11`;
- `src/index.css`;
- `src/hero.ts:93` y `src/hero.ts:125`.

**Cambio previsto**

- Declarar `color-scheme: dark` en el ámbito global apropiado.
- Añadir `meta[name="theme-color"]` usando el fondo existente `#03050A`.
- Revisar selectores nativos, scrollbar y superficies del navegador.

**Criterios de aceptación**

- No aparecen selectores nativos claros sobre la aplicación oscura.
- La barra de navegación móvil usa una superficie coherente.
- Scrollbars y focus rings conservan contraste suficiente.
- No se introduce una segunda paleta de colores.
- No se rompe el estilo de HeroUI ni el modo reducido de movimiento.

### 6.2 Revisión de colores

La paleta de producto debe seguir centralizada en `src/hero.ts` y en los tokens de `src/index.css`. No se deben añadir colores hexadecimales nuevos salvo que sean necesarios para una superficie documentada del navegador.

La scrollbar neutral hardcodeada y el único `transition-all` existente se consideran polish de bajo impacto. No forman un lote independiente.

## 7. Lote 3 — Responsive de Corporations

**Prioridad:** P2  
**Riesgo:** medio  
**Beneficio:** alto en una interacción real de la página Corporations  
**Dependencias:** validación visual a 390 px y desktop

### 7.1 Fila de componentes

**Problema**

El contenedor interno de componentes usa `nowrap`, mientras el catálogo contiene niveles con hasta tres alternativas. Cada tarjeta tiene `min-w-30` y el nivel aplica padding horizontal amplio.

**Ubicación**

`src/features/corporations/ui/corporation-level-row.tsx:37-87`

**Cambio previsto**

Diseñar una presentación responsive que mantenga la relación `OR`:

- wrapping controlado;
- grid responsive;
- o apilado en móvil.

La opción final debe elegirse mediante inspección visual, no por preferencia abstracta.

### 7.2 Fila de recompensas

La misma revisión debe cubrir la fila de recompensas, que actualmente usa un `Flex` sin wrapping y puede contener hasta cinco chips.

### 7.3 Criterios de aceptación

- Un nivel con tres componentes no produce overflow horizontal a 390 px.
- Un nivel con cinco recompensas no produce overflow horizontal a 390 px.
- El orden y la lectura de `OR` permanecen claros.
- Los botones `Open on planner` siguen siendo alcanzables y visibles.
- Desktop conserva la composición compacta actual.
- Se añade un journey o assertion dirigido si la regresión es plausible.

## 8. Lote 4 — Semántica del marquee tras la corrección reciente

**Prioridad:** P2  
**Riesgo:** medio  
**Beneficio:** evita una regresión de accesibilidad en un cambio reciente  
**Dependencias:** navegador operativo y smoke de accesibilidad pequeño

### 8.1 Situación actual

La corrección de `5245e5a` mejoró el contrato:

- los objetivos primarios son botones nativos;
- las copias no aparecen en el recuento de roles accesibles;
- las copias tienen `tabIndex=-1`;
- el click de puntero sobre copias se conserva;
- Playwright cubre roles, nombres, foco, click primario, click de copia y reduced motion.

### 8.2 Punto pendiente

Las copias están dentro de un contenedor `aria-hidden`, pero todavía contienen botones. `tabIndex=-1` elimina el foco secuencial, aunque no necesariamente el foco programático. Herramientas de accesibilidad pueden marcar esta combinación como un elemento enfocable dentro de `aria-hidden`.

### 8.3 Cambio previsto

Primero validar el árbol accesible y una regla dirigida de axe. Si se confirma el problema, hacer que las copias sean superficies de puntero no semánticas, manteniendo los botones accesibles únicamente en el conjunto primario.

No se debe retirar el marquee ni eliminar la interacción por puntero sin una decisión explícita de producto.

### 8.4 Criterios de aceptación

- Exactamente 16 acciones accesibles.
- Ninguna copia aparece como control para tecnología asistiva.
- Ninguna copia entra en el orden de tabulación.
- El click primario y el click de copia siguen seleccionando el objetivo.
- No existe warning `aria-hidden-focus` en la validación dirigida.
- Reduced motion continúa funcionando.

## 9. Lote 5 — LCP móvil y presupuesto inicial

**Prioridad:** P2  
**Riesgo:** medio  
**Beneficio:** mejora medible del primer render  
**Dependencias:** Lote 4, porque el DOM accesible del marquee debe estar estabilizado antes de medir

Este lote conserva el Hito 3 ya definido en `docs/ROADMAP.md`.

### 9.1 Baseline

Reproducir tres cargas frías con:

- viewport 390 × 844;
- caché deshabilitada;
- el mismo perfil de CPU y red usado en la auditoría anterior;
- build de producción servido localmente;
- registro del elemento LCP, CLS y una interacción básica.

### 9.2 Hipótesis a contrastar

- La primera imagen aleatoria del marquee continúa entrando en el camino crítico.
- `eager` y `fetchPriority="high"` aceleran un recurso que no es contenido principal estable.
- Diferir imágenes decorativas o hacer determinista el recurso inicial puede mejorar LCP sin cambiar la función del estado vacío.

### 9.3 Cambio previsto

Elegir una sola estrategia después de medir:

1. recurso visual inicial determinista;
2. carga diferida del marquee después del contenido útil;
3. excepción documentada si el coste visual se considera intencional y el resultado no puede mejorar razonablemente.

No introducir `manualChunks` cosmético, imports profundos de HeroUI ni una nueva abstracción de imágenes sin una reducción medida.

### 9.4 Presupuesto de bundle

Usar como baseline provisional el entry de aproximadamente 177,32 kB gzip documentado el 6 de septiembre. Definir un margen explícito y un gate que detecte regresiones reales del JS inicial.

No perseguir únicamente el warning genérico de Vite sobre chunks raw mayores de 500 kB.

### 9.5 Criterios de aceptación

- Mediana LCP local de 2.5 s o menos con el perfil declarado, o excepción documentada con nuevo umbral.
- Ningún asset aleatorio cambia materialmente la interpretación del resultado.
- CLS e interacción no empeoran.
- El presupuesto detecta un incremento relevante del entry gzip.
- `README-STRUCTURE.md` registra baseline, fecha, commit y método.

## 10. Lote 6 — Gates y calidad de código pequeña

**Prioridad:** P3  
**Riesgo:** bajo  
**Beneficio:** feedback más fiable y eliminación de warnings reales  
**Dependencias:** ninguna funcional

### 10.1 `key` faltante en BuildingSelect

**Ubicación**

`src/features/items/ui/filters/building-select.tsx:22-33`

**Cambio previsto**

Añadir `key={b.id}` al elemento raíz devuelto por `renderValue`, igual que en `CorporationSelect`.

**Aceptación**

- No aparece warning de keys al seleccionar un edificio.
- El valor renderizado no cambia visualmente.

### 10.2 Resumen de lint

**Problema**

`getStageDetails` en `scripts/test-all.mjs` imprime `0 problems` para cualquier lint con exit code 0, aunque existan warnings.

**Cambio previsto**

Elegir y documentar una política:

- mostrar warnings reales y mantener el gate verde;
- o usar `--max-warnings=0` y convertirlos en fallo.

Después eliminar la dependencia innecesaria de `items` en:

`src/features/planner/ui/sidebar/supply-panel/supply-modal.tsx:16`

**Aceptación**

- Una salida simulada con un warning no se resume como `0 problems`.
- El warning actual desaparece.
- `pnpm lint` y `pnpm test:all` muestran el mismo estado.
- No se añade un parser general innecesario si una política estricta resuelve el problema de forma más simple.

### 10.3 Semántica de descripción de Corporation

**Ubicación**

`src/features/corporations/ui/corporation-accordion-header.tsx:16`

**Cambio previsto**

Cambiar `Typography as="h3" variant="h4"` por un párrafo con la misma variante visual.

**Aceptación**

- El nombre de la corporación sigue siendo el heading.
- La descripción conserva tamaño, tono y layout.
- El árbol de headings no gana niveles ficticios.

## 11. Lote 7 — Documentación y gobierno de skills

**Prioridad:** P2  
**Riesgo:** bajo  
**Beneficio:** evita que futuras revisiones reaperturen problemas cerrados  
**Dependencias:** ninguna

### 11.1 Contradicciones en `docs/AUDIT.md`

Las secciones que describen el estado actual todavía contienen afirmaciones que corresponden al estado previo al Hito 1:

- enlace roto de `web-quality-audit`;
- catálogo no reproducible;
- lock con skills eliminadas.

### 11.2 Cambio previsto

- Mantener la evidencia antigua dentro del finding histórico.
- Marcarla explícitamente como estado previo a la remediación.
- Corregir las tablas de inventario y del mapa skill → código para reflejar 14 skills actuales.
- Mantener la explicación de que no se recrean las skills eliminadas.

### 11.3 Validación del catálogo

El validador actual comprueba presencia, frontmatter y enlaces, pero no debe ampliarse para comparar hashes hasta documentar qué representa exactamente `computedHash`: el hash almacenado no coincide directamente con el hash de los archivos locales muestreados.

Por ahora:

- `pnpm check:skills` sigue siendo el gate válido;
- no se clasifica como defecto la ausencia de verificación de hashes;
- si se necesita reproducibilidad criptográfica, debe investigarse primero el formato generado por el instalador.

### 11.4 Criterios de aceptación

- Las tablas de estado actual no describen problemas ya resueltos.
- Las menciones históricas permanecen identificadas como históricas.
- `pnpm check:skills` continúa pasando.
- No se añade ninguna skill eliminada.

## 12. Orden recomendado de ejecución

### Fase A — Mejoras rápidas y seguras

Ejecutar Lote 1, Lote 2 y la parte mecánica del Lote 6:

- labels explícitos;
- iconos decorativos;
- `alt` contextual;
- `color-scheme` y `theme-color`;
- `key` de `BuildingSelect`;
- semántica de la descripción de Corporation.

**Salida de la fase:** cambios pequeños, sin alterar lógica de negocio, con tests de accesibilidad dirigidos y validación visual básica.

### Fase B — Responsive y marquee

Ejecutar Lote 3 y Lote 4:

- niveles de Corporations expandidos a 390 px;
- recompensas con wrapping;
- validación de `aria-hidden-focus`;
- regresión E2E del click y teclado del marquee.

**Salida de la fase:** estados interactivos móviles y semántica del marquee verificados.

### Fase C — Rendimiento medido

Ejecutar Lote 5:

- reproducir baseline;
- escoger estrategia de carga;
- medir tres veces por variante;
- añadir presupuesto de entry gzip;
- actualizar baseline operativo.

**Salida de la fase:** decisión de rendimiento basada en datos, no en optimización especulativa.

### Fase D — Gobierno y cierre

Ejecutar la parte restante del Lote 6 y el Lote 7:

- política de warnings de lint;
- eliminación del warning conocido;
- parser o gate mínimo si sigue siendo necesario;
- documentación de skills sincronizada.

**Salida de la fase:** los gates comunican fielmente el estado real y la documentación no contradice el catálogo.

## 13. Verificación por lote

Antes de declarar un lote terminado:

1. revisar `git diff` y confirmar que no se tocaron catálogos protegidos;
2. ejecutar `pnpm format:check`;
3. ejecutar `pnpm lint`;
4. ejecutar `pnpm test`;
5. ejecutar `pnpm typecheck:e2e` si hay cambios E2E o de tipos compartidos;
6. ejecutar `pnpm build` si cambia código de producción;
7. ejecutar los journeys E2E afectados;
8. comprobar estados móviles relevantes;
9. revisar warnings de consola y errores de página;
10. registrar mediciones antes/después cuando el lote sea de rendimiento.

Para cambios visuales, la validación mínima debe incluir:

- 390 × 844;
- desktop;
- estado vacío;
- estado cargado;
- estado expandido o seleccionado afectado;
- foco de teclado;
- reduced motion cuando haya movimiento.

## 14. Elementos que permanecen fuera del roadmap

No se recomienda convertir en trabajo adicional:

- sustituir `useContext` por `use()` sin un defecto o benchmark;
- eliminar barrels de HeroUI o de features contra el contrato local;
- introducir schemas runtime globales para datos ya normalizados;
- añadir memoización masiva;
- crear un segundo sistema de diseño;
- añadir CSP, SSR, sitemap o structured data sin una necesidad de producto;
- añadir axe de forma masiva;
- virtualizar más componentes sin una medición;
- actualizar dependencias indiscriminadamente;
- recrear skills eliminadas;
- modificar catálogos JSON protegidos.

## 15. Definición de terminado de Roadmap v2

Roadmap v2 puede considerarse cerrado cuando:

- los filtros principales tienen nombres accesibles explícitos;
- el dark mode también es coherente en superficies nativas;
- Corporations no produce overflow en niveles expandidos a 390 px;
- el marquee conserva una única colección accesible de acciones sin warnings de foco oculto;
- LCP y bundle tienen baseline, objetivo y guardrail documentados;
- `test:all` informa fielmente warnings y errores;
- la documentación de skills distingue estado actual e histórico;
- los gates requeridos pasan en un entorno operativo con evidencia fresca;
- ningún catálogo protegido ha sido modificado.

## 16. Resumen reducido de cambios

Esta sección recoge únicamente los cambios que merece la pena implementar. No incluye contexto histórico, hallazgos descartados ni propuestas de rediseño.

### Lote 1 — Accesibilidad y semántica — PARCIALMENTE EJECUTADO

**Prioridad:** P2/P3  
**Riesgo:** bajo

- Completado: `aria-label` explícito en los filtros principales.
- Completado: iconos de búsqueda decorativos y skip link hacia `main`.
- Completado: descripción de Corporation como párrafo y `key={b.id}` en `BuildingSelect`.
- Pendiente: completar `alt=""` en todos los iconos que duplican nombres visibles; quedan callsites en Planner, Recipes, Corporations y Base Designer.

### Lote 2 — Dark mode — PARCIALMENTE EJECUTADO

**Prioridad:** P2  
**Riesgo:** bajo

- Completado: declaración global `color-scheme: dark`.
- Parcial: existe `meta[name="theme-color"]`, pero conserva `#03050A` mientras el fondo actual del tema es `#05070c`.
- Pendiente: alinear el meta color con el token real y validar la superficie nativa en desktop y móvil.

### Lote 3 — Responsive de Corporations

**Prioridad:** P2  
**Riesgo:** medio

- Permitir una composición responsive para las alternativas de componentes.
- Mantener clara la relación `OR` en móvil.
- Permitir wrapping de la fila de recompensas.
- Validar niveles con tres componentes y cinco recompensas a 390 px.

### Lote 4 — Marquee accesible

**Prioridad:** P2  
**Riesgo:** medio

- Comprobar `aria-hidden-focus` en las copias del marquee.
- Si se confirma, sustituir los botones de las copias por superficies de puntero no semánticas.
- Mantener los botones accesibles únicamente en la copia primaria.
- Conservar click de puntero, teclado y reduced motion.

### Lote 5 — Rendimiento inicial

**Prioridad:** P2  
**Riesgo:** medio

- Repetir tres mediciones frías de LCP móvil.
- Hacer determinista el recurso crítico o diferir las imágenes decorativas del marquee.
- Medir CLS e interacción después del cambio.
- Añadir un presupuesto de JS inicial gzip.
- Actualizar el baseline de `README-STRUCTURE.md`.

### Lote 6 — EJECUTADO CON DERIVA DOCUMENTAL PENDIENTE

**Prioridad:** P2/P3  
**Riesgo:** bajo

- Completado en código: la política `lint --max-warnings=0` convierte warnings en fallo.
- Completado en código: se eliminó la dependencia innecesaria de `items` en `supply-modal.tsx`.
- Pendiente documental: `docs/ROADMAP.md`, `README-STRUCTURE.md` y el estado inicial de este archivo todavía contienen estados o baselines históricos que deben distinguirse explícitamente del estado vivo.

### Orden recomendado

1. Lote 1 — accesibilidad y semántica.
2. Lote 2 — dark mode.
3. Lote 3 — responsive de Corporations.
4. Lote 4 — marquee.
5. Lote 5 — rendimiento.
6. Lote 6 — gates y documentación.

## 17. Auditoría incremental final — 12 de septiembre de 2026

### Resultado

La auditoría estática final queda **COMPLETADA** como revisión de alcance, pero el proyecto **NO está listo para cerrar la fase de calidad**. No se encontraron P0 ni P1. Persisten cuatro áreas técnicas P2, una deriva documental P2 y la verificación operativa completa no pudo repetirse en este entorno.

La arquitectura feature-first, los límites entre features, la separación entre estado editable y datos derivados, la persistencia versionada del Base Designer, los catálogos protegidos y la matriz Vitest/Playwright se mantienen razonables. No se justifica un refactor general.

### Skills y skills eliminadas

- `pnpm check:skills` pasa con 14 skills instaladas y bloqueadas.
- Las skills eliminadas `interface-design`, `react-best-practices` y `skill-creator` no tienen dependencias activas del producto.
- La ruta `skills/react-best-practices/SKILL.md` del lock pertenece a la skill instalada `vercel-react-best-practices`; no es una referencia activa a la skill local eliminada.
- Las skills nuevas aportan criterios concretos que todavía dejan trabajo: semántica de `aria-hidden`, labels e imágenes decorativas; responsive probado; presupuestos de bundle; y evidencia fresca antes de declarar gates verdes.

### Hallazgos abiertos

#### CORP-RESP-001 — Niveles de Corporations sin composición responsive demostrada

- **Problema:** la fila de componentes y la fila de recompensas usan `Flex` sin wrapping. El catálogo contiene niveles con hasta 3 componentes y hasta 5 recompensas.
- **Ubicación:** `src/features/corporations/ui/corporation-level-row.tsx`.
- **Evidencia:** `corporations_components.json` contiene esos máximos; cada tarjeta usa `min-w-30`, el nivel añade `px-10` y la composición mantiene `flex-nowrap` por defecto.
- **Impacto:** un nivel expandido puede exceder el ancho útil en 390 px aunque las rutas generales no presenten overflow.
- **Propuesta:** probar una composición responsive con wrapping/grid y mantener la relación `OR`; añadir un journey dirigido a 390 px.
- **Prioridad:** P2.
- **Confianza:** Media — el riesgo estructural es alto, pero el overflow real requiere navegador operativo.

#### A11Y-MARQUEE-001 — Botones dentro de copias `aria-hidden`

- **Problema:** las copias visuales del marquee están ocultas con `aria-hidden="true"`, pero aún contienen elementos `<button>` con `tabIndex=-1`.
- **Ubicación:** `src/features/planner/ui/marquee/index.tsx` y `src/features/planner/ui/random-item-marquee.tsx`.
- **Evidencia:** el E2E verifica roles, nombres y `tabindex`, pero no ejecuta una comprobación dirigida de `aria-hidden-focus`; las pautas actuales exigen que un contenedor `aria-hidden` no contenga descendientes enfocables.
- **Impacto:** una herramienta de accesibilidad puede marcar la combinación y el DOM conserva controles duplicados aunque no estén en el tab secuencial.
- **Propuesta:** validar primero con una regla dirigida; si falla, renderizar las copias como superficies no semánticas de puntero y mantener botones únicamente en la colección primaria.
- **Prioridad:** P2.
- **Confianza:** Alta para la necesidad de validación; Media para afirmar fallo de herramienta sin ejecutarla.

#### PERF-001 — LCP móvil sigue fuera del objetivo

- **Problema:** la primera imagen aleatoria del marquee continúa en el camino crítico del estado vacío.
- **Ubicación:** `src/features/planner/ui/random-item-marquee.tsx` y `src/pages/page-planner.tsx`.
- **Evidencia:** `docs/AUDIT.md` documenta tres cargas frías con mediana de 3.572 ms y una imagen del marquee como LCP; el cambio actual conserva `eager` y `fetchPriority="high"` para un asset aleatorio.
- **Impacto:** primer render móvil más lento y variable; el resultado no entra en el umbral objetivo de 2.500 ms.
- **Propuesta:** repetir el benchmark con build de producción y decidir entre recurso inicial determinista, diferir el marquee o documentar una excepción medida.
- **Prioridad:** P2.
- **Confianza:** Alta como pendiente histórica; Media para afirmar que la cifra no ha variado sin repetir el benchmark.

#### PERF-002 — No hay presupuesto automatizado para el entry gzip

- **Problema:** existe un baseline documentado, pero CI no falla ni avisa ante una regresión de tamaño del JavaScript inicial.
- **Ubicación:** `.github/workflows/ci.yml`, `vite.config.ts`, `README-STRUCTURE.md`.
- **Evidencia:** el baseline operativo documentado es aproximadamente 628,47 kB raw / 177,32 kB gzip, mientras `README-STRUCTURE.md` aún conserva 685/194 kB; no hay comparación automatizada.
- **Impacto:** una dependencia o cambio de import puede inflar la ruta inicial sin señal temprana.
- **Propuesta:** registrar baseline fechado y añadir un gate pequeño para el entry gzip, sin `manualChunks` cosmético ni deep imports no medidos.
- **Prioridad:** P2.
- **Confianza:** Alta.

### Pulido y deriva documental

#### UI-THEME-001 — `theme-color` desalineado del fondo real

- **Problema:** el color del navegador móvil no coincide con el fondo de la aplicación.
- **Ubicación:** `index.html:7` frente a `src/hero.ts:109`.
- **Evidencia:** el meta usa `#03050A`, pero el token `background` actual es `#05070c`.
- **Impacto:** puede verse un cambio de tono en la barra del navegador o durante la carga en móvil.
- **Propuesta:** usar el token real del tema y comprobar el resultado en móvil.
- **Prioridad:** P3.
- **Confianza:** Alta.

#### A11Y-IMG-001 — Callsites restantes con `alt` derivado duplicado

- **Problema:** `AssetImage` deriva un `alt` desde el ID cuando no recibe uno; varios callsites tienen el mismo nombre visible o un `aria-label` en el padre.
- **Ubicación:** `AssetImage` y, entre otros, `recipe-accordion-meta.tsx`, `recipe-accordion-header.tsx`, `corporation-accordion-header.tsx`, `corporation-level-requirements.tsx`, `building-variants-panel/index.tsx`, `planner-tree-row.tsx`, nodos del Flow y nodos del Base Designer.
- **Evidencia:** esos callsites omiten `alt`, mientras muestran el nombre junto al icono o exponen un nombre accesible en el contenedor.
- **Impacto:** anuncios duplicados o mayor ruido para lectores de pantalla.
- **Propuesta:** añadir `alt=""` solo en contextos decorativos; conservar alt contextual en imágenes standalone y en el catálogo arrastrable.
- **Prioridad:** P3.
- **Confianza:** Alta.

#### DOC-DRIFT-001 — Roadmaps y baseline operativo desactualizados

- **Problema:** la documentación viva no refleja completamente los lotes ya ejecutados.
- **Ubicación:** `docs/ROADMAP.md`, `README-STRUCTURE.md` y estado inicial de `roadmapv2.md`.
- **Evidencia:** `docs/ROADMAP.md` mantiene Hito 4 como pendiente aunque `package.json` ya usa `--max-warnings=0` y el warning de `supply-modal` ya no está en el código; `README-STRUCTURE.md` conserva 685/194 kB; `roadmapv2.md` decía que no había cambios.
- **Impacto:** dificulta saber qué queda realmente pendiente y puede repetir trabajo cerrado.
- **Propuesta:** actualizar únicamente el estado vivo, mantener los documentos históricos fechados y registrar el baseline nuevo después de la medición de PERF-001/PERF-002.
- **Prioridad:** P2.
- **Confianza:** Alta.

### Revisado — no requiere cambios

- No se detectó una separación de responsabilidades que justifique reestructurar features o stores.
- No se recomienda sustituir barrels públicos, `useContext`, `useMemo` o casts de frontera solo por reglas genéricas de skills.
- No se detectaron `TODO/FIXME`, `console` de producto, `any` explícitos, `transition: all`, listeners sin cleanup ni catálogos JSON modificados.
- La cobertura actual protege lógica de producción, persistencia, filtros, tablas, flow, navegación y journeys críticos; no se propone aumentar cobertura por porcentaje.
- La metadata `homepage` no canónica no se eleva a defecto de deploy sin una URL pública confirmada.
- No se propone auditoría de seguridad amplia, CSP, SSR, schemas globales ni actualización indiscriminada de dependencias.

### Limitaciones de verificación

- `pnpm format:check` y `pnpm check:skills` pasaron en este entorno.
- `pnpm lint`, `pnpm test`, `pnpm typecheck:e2e` y `pnpm build` no pudieron completar bajo el sandbox por `EPERM`/tipos de `node_modules`; la repetición escalada fue rechazada por el límite de uso del entorno.
- `pnpm audit --prod` no pudo consultar el registro por `EACCES`/`fetch failed`.
- Por tanto, no se declaran verdes los gates de runtime ni se actualiza el baseline de rendimiento con una nueva medición.

### Lotes siguientes

1. **Lote A — Responsive Corporations y prueba dirigida del marquee:** P2, cambio acotado, riesgo medio.
2. **Lote B — Benchmark LCP y budget gzip:** P2, requiere entorno operativo y decisión basada en medición.
3. **Lote C — Pulido semántico y de theme:** P3, bajo riesgo.
4. **Lote D — Sincronización documental:** P2 por fiabilidad del proceso, bajo riesgo.

No se recomienda ejecutar cambios de producto antes de completar la verificación del lote correspondiente y de resolver la decisión de interacción del marquee si la comprobación de accesibilidad confirma el problema.

## 18. Ejecución y estado vivo — 12 de septiembre de 2026

Esta sección reemplaza el estado operativo de la sección 17. La inspección runtime sí pudo completarse con permisos locales, y confirmó un P1 que la revisión estática no podía demostrar: Recipes y Corporations recortaban contenido a 320 px.

### Ejecutado

- **P1 responsive:** cabeceras, métricas, filas de componentes y recompensas se adaptan a móvil. Un journey nuevo verifica a 320×800 las dos rutas y un nivel expandido.
- **P2 marquee:** las copias animadas son `span` no enfocables dentro de los grupos `aria-hidden`; solo la colección primaria expone 16 botones accesibles. Se conserva la selección con puntero sobre las copias.
- **P2 estabilidad E2E:** una espera inicial de 5 s falló una vez bajo compilación fría concurrente. Cinco repeticiones aisladas pasaron y la suite completa posterior pasó; el límite inicial se amplió a 20 s sin relajar el contrato funcional.
- **P3 semántica/UI:** iconos decorativos usan alt vacío, el alt contextual se conserva donde identifica una fila, `theme-color` coincide con el tema y la transición genérica se restringió.
- **Documentación:** `docs/AUDIT.md`, `docs/ROADMAP.md` y `README-STRUCTURE.md` contienen ahora el estado y baseline fechados.
- **Skills:** el gate detectó `impeccable` instalada sin entrada de lock; se registró su origen/hash y `pnpm check:skills` confirma 15 skills instaladas y bloqueadas.
- **Validación completa:** `pnpm test:all` pasa formato, lint estricto, tipos E2E, 83 tests Vitest, build y 16 journeys Playwright; total 99/99 tests.

### Rendimiento cerrado

- La build produce un entry de **694,03 kB raw / 191,65 kB gzip**. El aumento elimina el waterfall de la home y deja toolbar, diagramas y sidebar en chunks lazy.
- Accumulator es el primer item estable y se precarga desde el documento; los otros 15 siguen siendo aleatorios.
- Tres cargas frías de producción a 390×844 dan una mediana LCP de **2.400 ms**; a 1440×900, **2.480 ms**. CLS mediano es 0. El objetivo ≤2.500 ms queda cumplido.
- El preload aislado empeoró la mediana a 4.020 ms porque otro icono aleatorio del mismo tamaño pasó a ser LCP; esa variante se descartó. La solución conservada combina el recurso crítico con la división arquitectónica medida.
- No se añade un presupuesto automático de gzip sin un SLA acordado; se conserva un baseline fechado y el warning raw de Vite como señal, no como fallo.

### Clasificación resultante

| Prioridad | Resultado                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------- |
| P0        | Ninguno.                                                                                                |
| P1        | `RESP-001`, resuelto.                                                                                   |
| P2        | Marquee, estabilidad E2E, deriva documental y `PERF-001` resueltos.                                     |
| P3        | Pulido semántico, tema y transición resueltos; budget de bundle descartado por ahora con justificación. |

El proyecto no necesita un refactor general. No quedan P0, P1 ni P2 importantes abiertos; el cierre estricto es **SÍ**.
