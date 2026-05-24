# Corporations (Feature)

Pagina para visualizar corporaciones, niveles y recompensas.

## Estructura

```
src/features/corporations
+- ui/        # componentes visuales de la pagina
+- hooks/     # hooks de datos para la UI
+- lib/       # helpers puros (sin estado)
+- index.ts   # exports publicos
```

## Recorrido rapido

page-corporations -> CorporationsAccordion -> CorporationLevelRow

## Datos

- useCorporationsSummary: resumen de counts y coste total
- useCorporationsAccordionData: lista de corporations + itemMap
