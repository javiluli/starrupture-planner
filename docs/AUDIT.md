# Skill-Driven Delta Audit

**Fecha:** 6 de septiembre de 2026  
**Rama y commit de referencia:** `codex/review-skills` (`4896f77`)  
**Tipo de revisión:** delta sobre la auditoría histórica; no sustituye ni reescribe [`../AUDIT.md`](../AUDIT.md)  
**Alcance de cambios:** solo documentación de auditoría y roadmap; no se modificó código de producto ni los catálogos protegidos

## 1. Resultado ejecutivo

La nueva colección de skills no justifica una reescritura ni un rediseño general. La arquitectura feature-first, los límites de datos, la separación de estado editable y derivado, la carga lazy por ruta y la matriz Vitest/Playwright siguen siendo decisiones adecuadas. Los 20 findings históricos que esta revisión vuelve a comprobar permanecen cerrados.

La delta sí cambia la prioridad de tres áreas:

1. **Semántica del marquee:** el arreglo histórico sacó las copias del orden de tabulación, pero no del árbol accesible; además, la acción de elegir objetivo sigue renderizada como `Link` sin `href`.
2. **Rendimiento del estado vacío:** tres cargas frías móviles dan una mediana LCP de **3.572 ms**. Es una mejora aproximada del 26 % frente a 4.827 ms, pero la imagen aleatoria del marquee continúa siendo el LCP y no entra en el rango “good”.
3. **Gobierno de skills y gates:** el lock de skills conserva tres entradas cuyos directorios ya no existen, dos skills nuevas enlazan prerrequisitos ausentes y `test:all` informa “0 problems” aunque ESLint haya emitido un warning.

No se encontraron P0, vulnerabilidades conocidas en dependencias de producción, errores de build, fallos unitarios/E2E, overflow horizontal móvil ni errores de consola en el smoke local inspeccionado.

### Conteo de clasificación delta

| Clasificación | Cantidad | Lectura                                                                                            |
| ------------- | -------: | -------------------------------------------------------------------------------------------------- |
| `NEW`         |        1 | Fidelidad del resumen de lint.                                                                     |
| `REFINED`     |        6 | Performance, a11y, cobertura, documentación y catálogo de skills requieren un alcance más preciso. |
| `CONFIRMED`   |       20 | Findings históricos cerrados que siguen resueltos.                                                 |
| `INVALIDATED` |        2 | La cifra antigua de bundle y la inferencia de outage desde una URL no canónica quedan invalidadas. |
| `CONFLICT`    |        1 | Dos reglas genéricas de Vercel no deben imponerse sobre contratos locales ya medidos.              |
| **Total**     |   **30** | 26 findings históricos más 4 deltas explícitas.                                                    |

## 2. Método, evidencia y límites

Se revisaron completamente los `SKILL.md` relevantes y solo las referencias necesarias. Para `web-design-guidelines` se obtuvo una copia fresca de las Web Interface Guidelines el 6-09-2026. La revisión combinó búsqueda estática, lectura dirigida de componentes/stores/tests, build de producción y navegación local real.

### Comprobaciones ejecutadas

| Comprobación                          | Resultado observado                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm format:check`                   | PASS                                                                                                 |
| `pnpm lint`                           | PASS con 1 warning: dependencia innecesaria `items` en `supply-modal.tsx:16`                         |
| `pnpm typecheck:e2e`                  | PASS                                                                                                 |
| `pnpm test`                           | PASS: 24 archivos, 83 tests                                                                          |
| `pnpm build`                          | PASS: 4.111 módulos; entry 628,47 kB raw / 177,32 kB gzip; CSS 257,17 / 33,21 kB                     |
| `pnpm test:e2e`                       | PASS: 14 journeys en Chromium desktop/mobile                                                         |
| `pnpm audit --prod`                   | PASS: 0 vulnerabilidades conocidas                                                                   |
| Smoke local 390×844                   | Sin overflow horizontal, un `main`, `h1` visible y cero errores de consola/página                    |
| Referencia de `package.json#homepage` | Responde `404 DEPLOYMENT_NOT_FOUND`; el usuario confirma que no es canónica y no demuestra un outage |

Los fallos `EPERM` sufridos al iniciar algunos gates dentro del sandbox se diagnosticaron con `systematic-debugging`: los mismos comandos pasaron fuera de esa restricción, por lo que no se clasifican como defectos del repositorio.

### Perfil de rendimiento

- Build de producción servido localmente con `pnpm preview`.
- Chromium headless, viewport `390×844`, caché deshabilitada.
- CPU ×4 y red de laboratorio aproximada a slow 4G: 150 ms de latencia, 200.000 B/s de descarga y 93.750 B/s de subida.
- Tres navegaciones frías: **3.532 ms**, **3.572 ms** y **3.624 ms** de LCP; mediana **3.572 ms**.
- El elemento LCP fue en las tres ejecuciones una imagen de item seleccionada aleatoriamente por `RandomItemMarquee`.

Es evidencia de laboratorio comparable dentro de esta auditoría, no CrUX, RUM ni un Lighthouse certificado. No había una integración disponible de Chrome DevTools/Lighthouse; no se añadió tooling para fabricar una precisión inexistente.

## 3. Inventario de skills relevante

### Skills aplicadas a la evaluación

| Skill                            | Propósito aplicado                                            | Áreas del proyecto                                          | Reglas importantes y límites                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `best-practices`                 | Seguridad web, dependencias, compatibilidad y calidad básica. | `package.json`, UI, configuración Vercel, enlaces externos. | Se buscaron sinks y secretos; CSP/Trusted Types no se proponen sin superficie que los justifique.                                                 |
| `frontend-design`                | Calidad visual intencional y coherencia estética.             | Shell, páginas, paneles, Planner y Base Designer.           | Confirma la identidad industrial/oscura existente. Sus pautas de hero/landing no aplican a una herramienta densa.                                 |
| `playwright-best-practices`      | Diseño de journeys, locators, a11y, waits y diagnóstico.      | `e2e/`, `playwright.config.ts`, CI.                         | Prevalecen `AGENTS.md`, pnpm y los patrones locales. No se persigue un porcentaje arbitrario de cobertura E2E.                                    |
| `playwright-cli`                 | Inspección y reproducción de navegador.                       | Smoke local y semántica del marquee.                        | Se consultó como guía operativa; la medición se hizo con el Playwright ya instalado, sin añadir otro binario.                                     |
| `systematic-debugging`           | Separar causa raíz de síntomas.                               | Gates que fallaron bajo sandbox.                            | Permitió clasificar `EPERM` como restricción del entorno y no como fallo del proyecto.                                                            |
| `typescript-best-practices`      | Contratos, narrowing y fronteras runtime.                     | Tipos de catálogos, stores, planner y React Flow.           | Branded types y schemas no se aplican de forma general. Sus skills prerrequisito no están instaladas.                                             |
| `vercel-composition-patterns`    | APIs de componentes y composición.                            | Shared UI, providers, hooks y componentes grandes.          | No se detectó proliferación relevante de boolean props ni motivo para compound components nuevos.                                                 |
| `vercel-react-best-practices`    | Bundle, render, estado persistido y React 19.                 | Router lazy, HeroUI, providers, Zustand y marquee.          | Sus reglas para Next/server no aplican a esta SPA. Dos absolutos entran en conflicto con contratos locales; véase `SKILL-CONFLICT-001`.           |
| `vitest`                         | Calidad de unit/component tests, fixtures y mocks.            | 24 archivos de test, stores y lógica pura.                  | El proyecto usa Vitest 4.1.11; ejemplos específicos de Vitest 5 beta no se adoptan sin necesidad.                                                 |
| `web-design-guidelines`          | Semántica, teclado, focus, motion, formularios e imágenes.    | Navegación, toolbar, supply, marquee y layouts móviles.     | Se aplicó una versión fresca de las reglas. La revisión visual manual sigue siendo necesaria.                                                     |
| `web-perf`                       | Baseline de carga y Core Web Vitals.                          | Ruta `/`, marquee, imágenes, chunks y CSS.                  | Se midió antes de proponer. No se confunde laboratorio local con datos de campo.                                                                  |
| `web-quality-audit`              | Orquestación de performance, a11y, SEO y buenas prácticas.    | Repositorio completo y endpoint público.                    | Su enlace a `../performance/references/MEASUREMENT.md` está roto en el catálogo actual; se usó el método disponible y se documentó la limitación. |
| `verification-before-completion` | Evidencia fresca antes de declarar éxito.                     | Gates finales y revisión del diff.                          | Un exit code 0 no basta para afirmar “0 warnings”; este principio origina `GATE-001`.                                                             |

### Skill disponible pero no aplicable

| Skill         | Decisión                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| `find-skills` | No se pidió descubrir ni instalar capacidades. La colección existente cubre la auditoría. |

Las skills globales de documentos, imágenes, Figma, hojas de cálculo, presentaciones, Sites y plugins no guardan relación con esta SPA o con el alcance de auditoría. No se cargaron como criterios artificiales.

## 4. Mapa skill → código real

| Zona concreta                                                      | Skills usadas                                       | Resultado                                                                                                                                   |
| ------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/router/`, `src/layouts/`, `src/pages/`                        | React, composition, web guidelines, frontend design | Lazy routes, landmarks y navegación siguen bien resueltos; no se reabre arquitectura.                                                       |
| `src/features/planner/ui/random-item-marquee.tsx` y `ui/marquee/`  | Web guidelines, React, web-perf, Playwright         | Se refinan a11y y LCP; el aspecto visual y el movimiento reducido se conservan.                                                             |
| `src/features/planner/lib/production-plan/` y `providers/`         | TypeScript, React, Vitest                           | Lógica pura y plan derivado siguen siendo correctos; no se recomienda schema general ni nuevo estado.                                       |
| `src/store/planner.store.ts`                                       | TypeScript, React, Vitest                           | La rehidratación normaliza forma y supply. `sessionStorage` y tolerancia a IDs ausentes hacen desproporcionada una migración general ahora. |
| `src/store/base-designer.store.ts` y `features/base-designer/lib/` | TypeScript, React, Vitest                           | Persistencia versionada y restauración contra catálogo actual confirmadas.                                                                  |
| `src/shared/data/`                                                 | TypeScript, best practices                          | Normalización/índices continúan protegiendo los JSON. No se tocó ningún catálogo.                                                           |
| `src/shared/ui/` y HeroUI                                          | Composition, frontend design, React                 | La capa compartida es pequeña y coherente; no se aconseja otra abstracción.                                                                 |
| `e2e/`, `playwright.config.ts`, `.github/workflows/ci.yml`         | Playwright, web guidelines, verification            | Suite estable y proporcionada; faltan checks dirigidos al delta del marquee.                                                                |
| `scripts/test-all.mjs`                                             | Verification, best practices                        | El resumen positivo oculta warnings de ESLint.                                                                                              |
| `package.json`, `vercel.json` y referencia `homepage`              | Best practices, web quality, web-perf               | Build local sano; `homepage` está obsoleto y no representa el contrato público del producto.                                                |
| `.agents/skills/`, `skills-lock.json`                              | Todas, especialmente verification                   | La actualización de skills no está internamente cerrada ni totalmente reproducible.                                                         |

## 5. Disposición de todos los findings

`CONFIRMED` significa que el diagnóstico histórico y su cierre siguen siendo válidos; no significa que el defecto siga abierto.

| ID                   | Clasificación | Estado actual / delta                                                                                                               |
| -------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `DX-001`             | `CONFIRMED`   | Toolchain fijado y gates reproducibles.                                                                                             |
| `DEP-001`            | `CONFIRMED`   | Auditoría de producción en cero vulnerabilidades conocidas.                                                                         |
| `E2E-001`            | `CONFIRMED`   | Playwright ejecuta 14 journeys.                                                                                                     |
| `AGENT-001`          | `CONFIRMED`   | La frontera de JSON protegidos está en `AGENTS.md`.                                                                                 |
| `BUG-001`            | `CONFIRMED`   | Supply mantiene una única invariante positiva.                                                                                      |
| `BUG-002`            | `CONFIRMED`   | Índice one-to-many y filtros conservan productores alternativos.                                                                    |
| `BUG-003`            | `CONFIRMED`   | Raw targets siguen cubiertos.                                                                                                       |
| `A11Y-001`           | `CONFIRMED`   | Supply/toolbar son operables por teclado y están nombrados.                                                                         |
| `UI-001`             | `CONFIRMED`   | 390 px sin overflow ni recorte en el smoke y journeys.                                                                              |
| `UI-002`             | `CONFIRMED`   | El tab duplicado no reapareció.                                                                                                     |
| `PERF-001`           | `REFINED`     | Mejoró de 4.827 a 3.572 ms de mediana, pero el marquee sigue dominando LCP.                                                         |
| `ARCH-001`           | `CONFIRMED`   | Routing y metadata permanecen desacoplados.                                                                                         |
| `ARCH-002`           | `CONFIRMED`   | Límites feature-first siguen respetados.                                                                                            |
| `DATA-001`           | `CONFIRMED`   | Tipos raw/normalizados y casts de frontera siguen contenidos.                                                                       |
| `DATA-002`           | `CONFIRMED`   | Catálogo estático e índices únicos siguen centralizados.                                                                            |
| `ERROR-001`          | `CONFIRMED`   | 404, route error y deep links locales siguen diferenciados.                                                                         |
| `A11Y-002`           | `REFINED`     | Motion/foco mejoraron; rol de acción y duplicación en árbol accesible quedan abiertos.                                              |
| `PERF-002`           | `REFINED`     | Entry baja a 177,32 kB gzip, pero no existe un presupuesto que detecte regresiones.                                                 |
| `TEST-001`           | `CONFIRMED`   | 83 unit/component tests cubren lógica e invariantes principales.                                                                    |
| `TEST-002`           | `REFINED`     | Los 14 journeys son útiles, pero consolidan `link` y solo prueban `tabIndex` en clones.                                             |
| `DOC-001`            | `REFINED`     | La documentación operativa sigue útil, pero faltaba una ubicación viva separada del audit histórico; queda resuelto con estos docs. |
| `SKILL-001`          | `REFINED`     | El drift detectado quedó resuelto en el Hito 1; catálogo, referencias y precedencia ya son verificables.                            |
| `TS-001`             | `CONFIRMED`   | Contratos React Flow permanecen tipados sin casts problemáticos nuevos.                                                             |
| `DEAD-001`           | `CONFIRMED`   | No reapareció el código muerto retirado.                                                                                            |
| `SEO-001`            | `CONFIRMED`   | Metadata/favicon/robots son correctos en build local.                                                                               |
| `ASSET-001`          | `CONFIRMED`   | Política de iconos y fallback siguen explícitos.                                                                                    |
| `DEPLOY-001`         | `INVALIDATED` | El usuario confirma que la URL observada no es canónica; su 404 no demuestra una caída de producción.                               |
| `GATE-001`           | `NEW`         | `test:all` etiqueta lint como “0 problems” cuando existen warnings.                                                                 |
| `BASELINE-001`       | `INVALIDATED` | 685/194 kB ya no es el baseline cuantitativo actual; el build fresco es 628,47/177,32 kB.                                           |
| `SKILL-CONFLICT-001` | `CONFLICT`    | Reglas genéricas sobre barrels y `use()` contradicen contratos locales sin evidencia de mejora.                                     |

## 6. Findings accionables y evidencia

### DEPLOY-001 — La referencia `homepage` no representa el despliegue canónico

- **Clasificación:** `INVALIDATED`
- **Prioridad:** sin roadmap
- **Evidencia:** `package.json:11` contiene `https://sr-planner.vercel.app/` y esa URL devuelve `404 DEPLOYMENT_NOT_FOUND`, pero el usuario confirma el 6-09-2026 que no es la URL canónica del producto.
- **Skills/principios:** `web-quality-audit`, `best-practices`, `verification-before-completion`; una observación HTTP solo puede aplicarse al recurso comprobado y no acredita el estado de otro despliegue.
- **Impacto:** queda invalidada la conclusión de indisponibilidad pública y, por tanto, el P1 y su hito. Lo único demostrado es una referencia de metadata obsoleta en un paquete privado.
- **Solución propuesta:** corregir o retirar `homepage` cuando se vuelva a tocar metadata. No crear un hito de deploy ni un monitor sin conocer y poner explícitamente en alcance la URL canónica.

### GATE-001 — El agregador oculta warnings de lint

- **Clasificación:** `NEW`
- **Prioridad:** P3
- **Evidencia:** `pnpm lint` emite un warning en `src/features/planner/ui/sidebar/supply-panel/supply-modal.tsx:16` por incluir la constante de módulo `items` en dependencias de `useMemo`. `scripts/test-all.mjs:91-101` solo parsea problemas si el exit code es distinto de cero y, con exit 0, imprime literalmente `0 problems`.
- **Skills/principios:** `verification-before-completion`, `best-practices`; el resumen debe conservar la evidencia real del comando subyacente.
- **Impacto:** el gate pasa correctamente, pero su resumen crea una afirmación falsa y puede normalizar warnings futuros.
- **Solución propuesta:** o bien hacer lint estricto con `--max-warnings=0`, o parsear/reportar warnings aun con exit 0. Corregir después el warning concreto, sin convertir esta tarea en un refactor.

### PERF-001 — El arreglo del marquee mejoró LCP, pero no cerró el objetivo

- **Clasificación:** `REFINED`
- **Prioridad:** P2
- **Evidencia:** `random-item-marquee.tsx:32-33` da eager/high priority a la primera imagen primaria, pero la muestra sigue siendo aleatoria. Las tres trazas frías dieron 3.532/3.572/3.624 ms y una imagen distinta del marquee fue LCP en cada una. La mediana anterior documentada era 4.827 ms.
- **Skills/principios:** `web-perf`, `web-quality-audit`, reglas React de resource hints; optimizar el elemento medido, con un presupuesto repetible.
- **Impacto:** la mejora es real, pero el primer contenido significativo móvil sigue tardando y varía con el asset aleatorio.
- **Solución propuesta:** conservar el concepto visual, pero hacer determinista el recurso crítico o retrasar las imágenes decorativas hasta después de contenido útil. Medir tres cargas frías con el mismo perfil y fijar un objetivo explícito; si se conserva una mediana mayor de 2.500 ms, registrar conscientemente el tradeoff.

### A11Y-002 — El marquee sigue exponiendo controles duplicados y rol incorrecto

- **Clasificación:** `REFINED`
- **Prioridad:** P2
- **Evidencia:** `random-item-marquee.tsx:22-35` usa `Link` sin `href` para una acción `onPress`; el navegador expone 16 controles primarios y 32 copias en 390 px. `marquee/index.tsx:59-66` no aplica `aria-hidden` ni una representación visual no interactiva a las copias. Solo se asigna `tabIndex=-1`.
- **Skills/principios:** Web Interface Guidelines y Playwright a11y: botón para acciones, link para navegación; contenido visual repetido no debe duplicar la experiencia de tecnología asistiva.
- **Impacto:** lectores de pantalla encuentran múltiples “links” equivalentes que no navegan. El teclado secuencial ya está arreglado, por lo que baja de la urgencia histórica bloqueante a P2.
- **Solución propuesta:** renderizar el conjunto primario como botones accesibles con nombre; renderizar copias como réplicas `aria-hidden` y no enfocables. Si se conserva por decisión de producto el click de ratón sobre las copias, usar una superficie visual no semántica para ese puntero, sin crear controles repetidos para AT. Añadir una aserción dirigida de rol/árbol/foco.

### PERF-002 — La división mejora, pero carece de guardrail

- **Clasificación:** `REFINED`
- **Prioridad:** P3, integrado en el hito de performance
- **Evidencia:** el build fresco produce 628,47 kB raw / 177,32 kB gzip frente a los 685/194 kB documentados, pero Vite sigue advirtiendo sobre chunks mayores de 500 kB y CI no compara tamaños.
- **Skills/principios:** `web-perf`, reglas React de bundle; presupuestar la ruta inicial en vez de perseguir el warning de forma cosmética.
- **Impacto:** no hay regresión actual demostrada, pero tampoco señal automática si una dependencia vuelve a inflar el entry.
- **Solución propuesta:** registrar el baseline actual y añadir un presupuesto simple para JS inicial gzip. No introducir `manualChunks` ni imports profundos de HeroUI sin una reducción medida.

### TEST-002 — La suite cubre journeys, no los nuevos contratos

- **Clasificación:** `REFINED`
- **Prioridad:** P2, absorbido por `A11Y-002`
- **Evidencia:** `e2e/planner/marquee.spec.ts:6-12` busca explícitamente roles `link` y solo exige `tabindex=-1` en copias, por lo que protege el comportamiento hoy incorrecto. Tampoco existe un listener común de `pageerror`/errores inesperados.
- **Skills/principios:** `playwright-best-practices`, `web-design-guidelines`; automatizar contratos de usuario de alto valor y dejar performance detallada fuera de E2E funcional.
- **Impacto:** una suite verde no detecta la duplicación accesible.
- **Solución propuesta:** actualizar el spec del marquee junto al arreglo semántico. Un chequeo global de errores de página puede añadirse si se filtran explícitamente mensajes aceptados; no convertir cada página en un test exhaustivo.

### DOC-001 — Separar historia cerrada de estado vivo

- **Clasificación:** `REFINED`
- **Prioridad:** sin entrada futura; resuelto en esta revisión
- **Evidencia:** solo existía `AUDIT.md` raíz, cuyo cierre histórico no debe reescribirse; no existían `docs/AUDIT.md` ni `docs/ROADMAP.md`. `README-STRUCTURE.md:63` aún muestra el baseline 685/194 kB.
- **Skills/principios:** `verification-before-completion`; diferenciar evidencia histórica de estado operativo actual.
- **Impacto:** sin esta separación, actualizar cifras vivas falsearía el registro de decisiones o dejaría el roadmap sin fuente canónica.
- **Solución propuesta:** mantener `AUDIT.md` intacto y usar estos dos documentos para la delta y el roadmap vigente. Actualizar el baseline de `README-STRUCTURE.md` durante el hito de performance, no en esta auditoría.

### SKILL-001 — La actualización de skills no estaba internamente consistente

- **Clasificación:** `REFINED`
- **Prioridad:** P2
- **Estado:** RESUELTO en el Hito 1
- **Evidencia:** `skills-lock.json:16-50` conserva `interface-design`, el antiguo `react-best-practices` y `skill-creator`, pero sus directorios están borrados en la rama. `web-quality-audit/SKILL.md:19` enlaza un `performance/references/MEASUREMENT.md` inexistente. `typescript-best-practices/SKILL.md:10-25` exige `type-system-discipline` y remite a `boundary-discipline`, skills no disponibles en el proyecto.
- **Skills/principios:** reproducibilidad, prerequisite integrity y precedencia local.
- **Impacto:** futuros agentes pueden creer que hay capacidades instaladas que no existen o detenerse siguiendo referencias imposibles; dos auditorías con el mismo lock pueden usar criterios distintos.
- **Solución aplicada:** se sincronizaron las 14 skills de disco con el lock, se retiraron tres entradas obsoletas, se repararon referencias/prerrequisitos y `AGENTS.md` fija la precedencia. `pnpm check:skills` valida catálogo, frontmatter y links locales desde `test:all` y CI.

### BASELINE-001 — La cifra anterior de bundle ya no es actual

- **Clasificación:** `INVALIDATED`
- **Prioridad:** sin roadmap independiente
- **Evidencia:** `README-STRUCTURE.md:63` registra 685/194 kB; el build fresco produce 628,47/177,32 kB.
- **Skills/principios:** `web-perf`, `verification-before-completion`; los baselines caducan y deben llevar fecha/commit.
- **Impacto:** comparar optimizaciones contra la cifra antigua atribuye mejoras o regresiones de forma incorrecta.
- **Solución propuesta:** usar 628,47/177,32 kB como referencia provisional de esta rama y actualizar el documento operativo al implementar el presupuesto.

### SKILL-CONFLICT-001 — Reglas genéricas que no deben aplicarse mecánicamente

- **Clasificación:** `CONFLICT`
- **Prioridad:** sin roadmap; decisión cerrada
- **Evidencia:** la regla Vercel `bundle-barrel-imports` recomienda evitar barrels, mientras `README-STRUCTURE.md:61` documenta que `@heroui/react` es el API soportado y medido y `AGENTS.md` exige barrels de feature como frontera pública. Otra regla sugiere sustituir `useContext` por `use()` en React 19, pero `useProductionPlan` (`src/features/planner/hooks/use-production-plan.ts:1-14`) es un hook síncrono idiomático, sin problema medido.
- **Skills/principios:** `vercel-react-best-practices`, `vercel-composition-patterns` frente a contratos de paquete, arquitectura local y evidencia.
- **Impacto:** obedecer los absolutos produciría imports transitive no declarados, rompería fronteras o introduciría churn sin beneficio.
- **Resolución:** prevalecen `AGENTS.md`, APIs públicas soportadas y mediciones. Solo reabrir con un benchmark o un defecto concreto.

## 7. Observaciones no promovidas a roadmap

- El warning puntual de `useMemo` se resolverá dentro de `GATE-001`; no merece un refactor separado.
- El `homepage` no canónico es metadata obsoleta de un paquete privado. Puede retirarse o corregirse oportunísticamente, pero no es evidencia de un problema de despliegue.
- `transition-all` aparece una vez en una tarjeta de requisitos. Es polish de bajo impacto, no un milestone.
- No se añade `axe` de forma masiva. El primer paso es un test semántico dirigido; un smoke axe pequeño puede acompañarlo si su señal es estable.
- No se versiona ahora `sessionStorage` del Planner: la rehidratación ya normaliza la forma, el estado es de sesión y el cálculo tolera IDs ausentes. Reabrir solo si se exige compatibilidad entre versiones de catálogo dentro de una sesión viva.
- No se añade CSP, Trusted Types, SSR, sitemap, repositorios, DTOs generales, schemas runtime globales, memoización masiva ni otro sistema de diseño.

## 8. Restricciones preservadas

- No se modificaron `buildings_and_recipes.json`, `buildings_construction_area.json`, `corporations_components.json` ni `items_catalog.json`.
- No se cambió código de producto, configuración, dependencias, tests ni skills durante esta auditoría.
- El audit raíz permanece como evidencia histórica. Este documento registra únicamente la delta producida por el nuevo conjunto de skills y por la evidencia actual.
