# Auditoría final de prepublicación — StarRupture Planner

**Fecha:** 20 de septiembre de 2026 · **Revisión:** `f2e7f6e` · **Estado:** auditoría terminada; estado de ejecución actualizado al final.

**Alcance:** repositorio local y build de producción servido con `pnpm preview`; sin cambios de producto, tests, configuración ni catálogos.

## Resumen ejecutivo

La arquitectura y la identidad visual actuales son coherentes con `PRODUCT.md` y `DESIGN.md`. Las cinco rutas cargan en Chromium sin errores de consola, peticiones fallidas, imágenes rotas ni desbordamiento horizontal del documento en los viewports revisados. El gate existente pasa completo: **83 tests Vitest y 16 E2E**, además de formato, lint, tipos y build.

Quedan **2 incidencias P1 y 3 P2 confirmadas**. La más directa afecta al flujo de suministro del Planner: tras una búsqueda sin coincidencias, el modal puede reabrirse vacío con el campo aparentemente limpio. El grafo de una cadena representativa también inicia a una escala que impide leer sus nodos sin hacer zoom. En My Base hay problemas concretos de identificación de tarjetas y semántica/contraste. **No se confirmó ningún P0**. No hay motivos medidos para rediseñar, cambiar HeroUI, añadir dependencias o refactorizar módulos por tamaño.

> Este resumen conserva la fotografía de la auditoría en `f2e7f6e`. Posteriormente se implementaron REL-01 y REL-03–05 en `codex/planner-release-fixes`. REL-02 se resolvió como decisión de producto: conservar la vista completa del grafo y usar Tree list para inspeccionar detalles. El estado actualizado figura en el roadmap.

## Método y línea base

- Estado inicial: `master` limpio, un commit por delante de `origin/master`; no había cambios del usuario en el working tree.
- Instrucciones y contexto leídos: `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `README.md`, `README-STRUCTURE.md`, guías de las cinco features, router, datos, iconos, E2E y CI. `pnpm check:skills` confirmó **15 skills instaladas y bloqueadas**; se aplicaron Impeccable, calidad web, rendimiento, Playwright, TypeScript/React y verificación. El detector Impeccable produjo avisos de tipografía, colores y rejilla; la rejilla pertenece al lienzo de medida y Geist es la identidad aprobada. No se abren tareas por esas preferencias.
- Historial: se consultaron desde Git `docs/AUDIT.md` y `docs/ROADMAP.md`, retirados deliberadamente en `6065323`. Se comprobaron las correcciones anteriores de responsive a 320 px, marquee accesible, skill gate, LCP y warning de bundle. No se duplican como incidencias abiertas.
- `pnpm test:all`: skill catalog, Prettier, ESLint (`0 problems`), tipos E2E, **24 archivos / 83 tests Vitest**, build (`4114` módulos) y **16/16 journeys Playwright**. Primer intento en sandbox: `EPERM` leyendo ESLint; repetición con acceso a `node_modules`: gate completo verde. El build avisa de un chunk de `694,14 kB` raw / `191,70 kB` gzip, muy próximo al baseline documentado (`694,03/191,65 kB`), sin fallo de carga demostrado.
- Build local en Chromium: `/`, `/items`, `/recipes`, `/corporations`, `/my-base` y ruta desconocida a **1440×900 y 390×844**; Planner, Recipes y Corporations expandidos a **320×800**. Se probaron filtros, estados vacíos, tabs, supply, selección/arrastre/zoom en React Flow y colocación/deshacer/rehacer en My Base. Capturas en `C:/Users/javid/.codex/visualizations/2026/09/20/01a0bf65-b2f6-7f63-894d-06ac928386d4/`.
- Lighthouse 13 sobre la navegación inicial de cada ruta en Chromium de escritorio: accesibilidad **100/100/100/100/93** en el orden anterior; Best Practices y SEO **100** en todas. Esto es señal automatizada, no certificación WCAG. Los fallos de My Base se verificaron contra el DOM y el código. El aviso `llms.txt` es opcional para este producto y no se convierte en trabajo.
- Rendimiento: traza local de portada sin throttling: LCP **295 ms**, CLS **0**; no hay datos CrUX para localhost. En seis cargas frías adicionales con CPU ×4, latencia 150 ms y descarga 1,6 Mbps, cinco registraron LCP entre **2.060 y 2.088 ms**, CLS 0; una no emitió LCP antes de cerrar la sesión. Son datos de laboratorio local y no sustituyen medición de campo ni INP.

## Cobertura por página y lectura transversal

| Página                       | Estructura y estados inspeccionados                                                                                                                                   | Resultado                                                                                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planner `/`                  | Toolbar, estado vacío y marquee, target/rate, métricas, grafo de 27 nodos/39 edges, tres vistas, tabs de Supply/Variants, modal de suministro, zoom, selección y drag | Dos P1. Navegación, persistencia de supply y reduced motion tienen E2E existentes; los efectos recientes usan tokens y no bloquearon puntero en el recorrido manual.                          |
| Items `/items`               | Filtros, búsqueda vacía, tabla virtual de 104 items, iconos, links y acción Planner; escritorio y móvil                                                               | Sin incidencia confirmada. En móvil la tabla ancha tiene scroll interno operable; el resto de columnas no aparece en el primer encuadre, una limitación deliberada del patrón de tabla densa. |
| Recipes `/recipes`           | 21 edificios, 130 recetas, acordeones cerrados/abiertos, tarjetas de outputs e inputs a 320 px                                                                        | Sin recorte documental ni incidencia confirmada; animación de apertura inspeccionada tras estabilizarse.                                                                                      |
| Corporations `/corporations` | Cinco corporaciones, 72 niveles, acordeón abierto, recompensas y deep link cubierto por E2E; 320 px                                                                   | Sin recorte documental ni incidencia confirmada.                                                                                                                                              |
| My Base `/my-base`           | Catálogo lista/cuadrícula y vacío, stats, canvas, controles, teclado, persistencia de estructura en tests, colocación y undo/redo                                     | Tres P2. El fallback `zipline` con Lucide está documentado y es intencional.                                                                                                                  |

**Sistema visual:** las cinco páginas comparten nav, superficies oscuras, Geist, espaciados `Page*`/`Panel`, bordes y acento azul. Los colores de categoría y conexiones tienen significados estables. `Flex` y `Grid` aplican gaps explícitos con defaults razonables; no se observó efecto secundario global. Los gradientes/spotlights recientes son sutiles, están limitados a las superficies previstas y el pseudo-elemento de acordeón usa `pointer-events: none`. La jerarquía de Recipes/Corporations se conserva al compactar; no se justifica un cambio de sistema. La inspección de imágenes comparó 104/104 iconos de Items, 5/5 de Corporations y 43/44 de Buildings; la excepción `zipline` es la prevista por la política de iconos.

**Arquitectura y QA:** las páginas componen APIs de feature; `shared/data` normaliza los snapshots sin editarlos; Zustand guarda entradas editables y `ProductionPlanProvider` comparte el cálculo derivado; Items virtualiza sus 104 filas. Los imports internos examinados siguen la frontera declarada. `@heroui/react` está fijado en el lock a **2.8.10** y `@xyflow/react` se usa en los dos lienzos. El store de My Base (229 líneas) y la persistencia (178) tienen responsabilidades concretas y pruebas; su tamaño no es evidencia de refactor necesario. No se hallaron `TODO/FIXME`, sinks HTML peligrosos o logs de producto. Los tests existentes no cubren el estado de reapertura del modal, la identificación de tarjetas en cuadrícula ni la legibilidad del fit inicial del grafo.

## Incidencias confirmadas

### REL-01 · P1 · Funcionalidad/UX · Planner, modal Supply

- **Archivos:** `src/features/planner/ui/sidebar/supply-panel/supply-modal.tsx`; prueba candidata `e2e/planner/supply.spec.ts`.
- **Descripción:** una búsqueda sin coincidencias deja el cuerpo del modal sin mensaje. Al cerrar con Escape y reabrir, el campo visible aparece vacío pero el filtro React conserva la consulta anterior y la lista sigue con cero elementos.
- **Evidencia:** en build de producción, `__missing__` devolvió solo el título `Select input items`. Tras Escape (el diálogo cierra y devuelve el foco correctamente a `Add supply item`) y reapertura, `searchValue=""`, `items=0`, texto visible solo `Select input items`. `search` se restablece únicamente en `handleSupply`; el `Input` no recibe `value`.
- **Impacto:** el usuario encuentra un selector aparentemente vacío e inexplicable al reintentar añadir suministro; el flujo principal queda bloqueado hasta escribir otra consulta.
- **Causa probable:** estado de búsqueda retenido en el componente mientras HeroUI remonta el input no controlado.
- **Corrección propuesta:** sincronizar valor visual y filtro, reiniciar la consulta en cada cierre o apertura, y mostrar un estado vacío con una acción clara para limpiar la búsqueda. Sin cambiar cálculo ni catálogos.
- **Aceptación:** con consulta sin resultados hay mensaje útil; cerrar y reabrir muestra consulta y resultados coherentes, preferiblemente el catálogo completo; foco y Escape siguen funcionando.
- **Pruebas:** E2E de búsqueda sin resultados → Escape/cierre → reapertura → selección de un item; comprobar también cierre tras selección.

### REL-02 · P1 · UX/legibilidad · Planner, Network graph

- **Archivos:** `src/features/planner/flow/diagram/production-flow-diagram.tsx`, `src/features/planner/hooks/use-flow-diagram.ts`, `src/features/planner/flow/layout/flow-fit.ts` y layout/config del grafo.
- **Descripción:** `fitView` intenta mostrar todo el grafo de una cadena común y deja los nodos y labels demasiado pequeños para leer de entrada.
- **Evidencia:** Accumulator a 60/min produjo **27 nodos y 39 aristas**. A 1440×900 la transformación inicial fue `scale(0.170503)` y la primera tarjeta midió **43,6 px** dentro de un lienzo de 989 px; a 320 px se ve el diagrama completo con textos microscópicos. Capturas `desktop-planner-result.png` y `narrow-planner-result.png` en el directorio indicado. Selección, drag y botón de zoom respondieron; tras un zoom la tarjeta midió 52,4 px, todavía lejos de un tamaño de lectura. Tree list e Items ofrecen alternativas legibles.
- **Impacto:** el diagrama principal transmite estructura pero no permite inspeccionar nombres/cantidades sin una secuencia larga de zoom y pan. No afecta a las cifras calculadas.
- **Causa probable:** ajuste global de un layout Dagre ancho con `minZoom={0.15}`.
- **Corrección propuesta:** decidir un encuadre inicial legible para planes densos o una señal de navegación clara hacia zoom/Tree list; conservar nodos, conexiones, selección, pan y cálculos. Comparar el mismo plan antes/después y medir el coste de interacción.
- **Aceptación:** un plan de 27 nodos ofrece de entrada una zona legible o una ruta evidente de inspección; ningún nodo/edge desaparece, los controles siguen operables y planes pequeños conservan el ajuste útil.
- **Pruebas:** revisión visual a 1440 y 320 px con Accumulator 60/min, recorrido de zoom/pan/selección/drag y regresión de `plan-to-flow`/`flow-fit`; sin optimización de rendimiento no medida.

### REL-03 · P2 · UX/accesibilidad · My Base, catálogo de edificios

- **Archivos:** `src/features/base-designer/ui/catalog/building-catalog-item.tsx`, `building-catalog.tsx`.
- **Descripción:** en la cuadrícula táctil, las tarjetas muestran solo imagen y `4×4 est.` (10 px), sin nombre visible. En la lista, `aria-label="Place Assembler"` sustituye el texto interno completo, de modo que el nombre accesible de la acción no comunica huella estimada, potencia ni calor. Lighthouse marcó cuatro tarjetas visibles como `label-content-name-mismatch`.
- **Evidencia:** primera tarjeta en cuadrícula a 390 px: `visibleText="4×4 est."`, `ariaLabel="Place Assembler"`, sin `title`; captura `mobile-my-base-grid.png`. En lista, el reporte Lighthouse de `/my-base` señala las tarjetas Assembler, Fabricator, Fabricator v.2 y Helium-3 Extractor.
- **Impacto:** identificar el edificio depende de reconocer la imagen o de un tooltip hover no fiable en táctil; usuarios de voz/lector reciben menos información que la visible.
- **Causa probable:** diseño de cuadrícula solo icónico y `aria-label` que anula el contenido descendiente del control.
- **Corrección propuesta:** mostrar un nombre breve en cada celda sin perder densidad y ajustar el nombre/descripción accesible para conservar la acción y datos clave. No cambiar HeroUI ni la interacción de arrastre.
- **Aceptación:** el nombre es visible sin hover a 390 px y 320 px; el foco/lector anuncia edificio y datos relevantes; lista y cuadrícula conservan colocación por teclado y puntero.
- **Pruebas:** inspección táctil y teclado en ambos modos, comprobación dirigida del árbol accesible y Lighthouse/axe del catálogo.

### REL-04 · P2 · Accesibilidad · My Base, nodo Base Core

- **Archivo:** `src/features/base-designer/ui/nodes/core-node.tsx`.
- **Descripción/evidencia:** Lighthouse `aria-prohibited-attr` localiza `<div aria-label="Base Core">` sin rol válido. El nombre no está expuesto conforme a la semántica ARIA esperada.
- **Impacto:** el nodo del núcleo puede carecer de identificación fiable para tecnología asistiva.
- **Causa probable:** etiqueta aplicada al `div` visual en vez de a un elemento/rol semántico apropiado.
- **Corrección propuesta:** exponer un nombre mediante semántica válida en el nodo o en su contenedor React Flow, evitando roles interactivos falsos.
- **Aceptación:** el núcleo se identifica de forma útil en el árbol accesible y desaparece `aria-prohibited-attr`.
- **Pruebas:** snapshot accesible y Lighthouse/axe de My Base; comprobar que selección y layout no cambian.

### REL-05 · P2 · Accesibilidad/contraste · My Base, atribución React Flow

- **Archivos:** `src/features/base-designer/ui/base-designer-canvas.tsx`, `src/features/base-designer/ui/base-designer.css` (si se necesita ajuste local del tema).
- **Descripción/evidencia:** Lighthouse `color-contrast` mide **4,3:1** en el enlace visible `React Flow` (texto de 10 px) frente al mínimo **4,5:1** para texto normal. Es el único fallo de contraste automático registrado en las cinco rutas iniciales.
- **Impacto:** la atribución pequeña resulta difícil de leer; es un enlace externo real aunque no participe en el trabajo principal.
- **Causa probable:** estilo oscuro por defecto de la atribución de React Flow sobre la superficie actual.
- **Corrección propuesta:** ajuste local de color/contraste del enlace, conservando atribución y marca de terceros.
- **Aceptación:** ratio ≥4,5:1 en el estado normal y foco visible sin alterar la rejilla.
- **Pruebas:** medición de contraste y auditoría de My Base a tamaño normal.

## Señales descartadas y límites

- No se eleva el warning genérico de chunk de Vite: el tamaño coincide con el baseline aceptado, las rutas secundarias son lazy y la portada local carga sin fallo medido. No se recomiendan `manualChunks` ni imports privados de HeroUI.
- No se elevan los avisos del detector Impeccable sobre Geist, rejilla del canvas, tonos de scrollbar o tamaños de tipografía expresivos: pertenecen a decisiones documentadas o no muestran impacto demostrado. La etiqueta de 10 px de la cuadrícula sí figura dentro de REL-03 porque identifica un dato sin nombre visible.
- El scroll horizontal interno de Items y el de tabs del Planner a 320 px son operables. El tercer tab se pudo desplazar y activar; el documento no desborda. Una prueba de usabilidad con usuarios podría valorar su descubribilidad, pero no hay defecto confirmado.
- El modal Supply sí cierra con Escape y restaura el foco; el recuento inmediato antes de terminar su animación había dado una falsa alarma. El problema confirmado es el filtro retenido al reabrir.
- Firefox no se probó: el binario de Playwright no está instalado y no se instaló. Tampoco se verificó el host público de Vercel, su fallback de rutas, cabeceras ni datos reales de Core Web Vitals/INP. `pnpm preview` sí resolvió deep links y 404 local; no demuestra la configuración de producción. No se ejecutó auditoría de advisories por red.
- Lighthouse de navegación inicial no cubre todos los estados expandidos ni acredita conformidad WCAG completa. No se hicieron pruebas manuales con lector de pantalla.

## Roadmap de correcciones

**Estado:** REL-01 y REL-03–05 completados en `codex/planner-release-fixes`; REL-02 cerrado por decisión de producto, sin cambio de encuadre. La verificación local de la fase 3 está hecha; el host real y Firefox siguen pendientes.

### Fase 1 — Flujo principal y legibilidad

**Hito 1.1 · Recuperar el modal Supply — P1 · REL-01**

- Objetivo: que búsqueda, vacío y reapertura describan siempre el mismo estado.
- Tareas: controlar/restablecer consulta; añadir estado sin resultados; proteger foco y cierre.
- Componentes: `SupplyModal`; E2E de supply.
- Aceptación: consulta fallida → cierre → reapertura permite elegir inmediatamente un suministro y no presenta lista vacía con input limpio.
- Pruebas: E2E de búsqueda vacía, limpieza, cierre/reapertura y foco; `pnpm test:all`. **Estado:** completado. **Commit:** `fe89e1b`.

**Hito 1.2 · Hacer inspeccionable el grafo denso — P1 · REL-02**

- Objetivo: lectura inicial viable sin alterar cálculos ni conexiones.
- Tareas: comparar encuadres del mismo plan, escoger el cambio mínimo, verificar zoom/pan/drag/selección y reduced motion.
- Componentes: React Flow del Planner y ajuste de vista.
- Aceptación: Accumulator 60/min legible o con camino evidente hacia detalle en 1440/320 px; planes pequeños sin regresión.
- Pruebas: inspección visual original a 1440 y 320 px, navegación por tabs y decisión explícita del usuario de retirar el zoom automático al objetivo. **Estado:** cerrado por decisión de producto: Network graph conserva el panorama completo; Tree list ofrece lectura por pasos. No queda cambio de código para este hito.

### Fase 2 — Catálogo y accesibilidad de My Base

**Hito 2.1 · Identificar tarjetas en ambas vistas — P2 · REL-03**

- Objetivo: que el catálogo funcione visualmente en táctil y conserve los datos accesibles.
- Tareas: nombre visible en cuadrícula; ajustar nombre/descripción accesible de tarjetas; revisar tamaño de huella compacta.
- Componentes: `BuildingCatalogItem`, `BuildingCatalog`.
- Aceptación: nombre reconocible sin tooltip; datos clave disponibles para lector; colocación intacta.
- Pruebas: capturas a 320 y 1440 px; E2E de nombres y límites a 320/390/1440 px, árbol accesible, colocación por teclado y arrastre. **Estado:** completado. **Commit:** `6469001`.

**Hito 2.2 · Cerrar semántica y contraste del lienzo — P2 · REL-04, REL-05**

- Objetivo: eliminar los dos fallos automáticos restantes de My Base sin rediseñar el canvas.
- Tareas: semántica válida de Base Core; contraste local de atribución.
- Componentes: `CoreNode`, `BaseDesignerCanvas`/CSS.
- Aceptación: Lighthouse My Base sin `aria-prohibited-attr` ni `color-contrast`; grafo y atribución conservados.
- Pruebas: Base Core expuesto como imagen con nombre; contraste calculado desde estilos de Chromium ≥4,5:1; Lighthouse del build local de My Base: accesibilidad 100, con `aria-prohibited-attr`, `color-contrast` y `label-content-name-mismatch` aprobados. **Estado:** completado. **Commit:** `6469001`. No se ha probado con lector de pantalla.

### Fase 3 — Preparación de publicación

**Hito 3.1 · Verificación final del release — prioridad dependiente de hallazgos, sin incidencia nueva**

- Objetivo: confirmar que los hitos anteriores y el host real se comportan como el build local.
- Tareas: ejecutar gate completo; comprobar en el hosting actual deep links, recarga, 404, favicon, recursos, consola y red; repetir portada móvil/escritorio y al menos un plan denso; probar Firefox si se dispone de su binario; registrar métricas de campo solo si existen.
- Componentes: cinco rutas, router, hosting y documentación de release existente.
- Aceptación: ninguna regresión P0/P1, incidencias P2 cerradas o decisión explícita, enlaces de producción operables, working tree revisado.
- Pruebas: `pnpm test:all`, Lighthouse dirigido, navegador manual en los estados corregidos, `git diff --check` y `git status`. **Estado:** gate local y revisión del despliegue existente completados; comparación posterior al despliegue y validación funcional en Firefox pendientes. `pnpm test:all` pasó de nuevo el 20/09/2026: catálogo de skills, formato, lint, tipos E2E, build, 83 tests unitarios y 21 E2E de Chromium; 104 tests aprobados, ninguno fallido u omitido. El build servido con `pnpm preview` resolvió las cinco rutas y el 404, sin errores de consola ni peticiones fallidas; favicon y recursos cargaron con 200.
- Hosting actual (solo lectura, Chromium): las cinco rutas abren por URL directa; `/my-base` conserva su contenido tras recarga sin caché; una ruta desconocida muestra `Page not found`; favicon y recursos revisados responden 200. No hubo errores de consola ni peticiones fallidas en las cinco rutas. En el 404 apareció un aviso menor por precarga de un icono no utilizado. La portada y Accumulator 60/min se inspeccionaron a 1440 y 320 px: sin desbordamiento horizontal; el grafo denso expuso 27 nodos y 39 conexiones. Esta versión publicada usa un bundle distinto del build local y aún no valida los commits de esta rama.
- Firefox: el navegador de escritorio está instalado, pero Playwright requiere su binario instrumentado; lanzar el Firefox del sistema con `executablePath` terminó antes de conectar. Una captura nativa mostró solo el estado previo a la hidratación, así que no demuestra compatibilidad funcional. No se instalaron navegadores ni dependencias.

**Siguiente alcance pendiente:** después de publicar esta rama con autorización, repetir en el host los recorridos corregidos y las comprobaciones de rutas, consola y red; validar Firefox con un método compatible cuando esté disponible. No se requiere otro cambio local confirmado ni se ha desplegado.
