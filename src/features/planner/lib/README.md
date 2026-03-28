# Lib (Planner)

Helpers puros que no dependen de React.

## Archivos

- `planner-logic.ts`: calculos de produccion y stats globales.
- `recipes.ts`: helpers de recetas.
- `corporations.ts`: helpers de corporaciones.
- `requirements.ts`: ordenamiento y picks de requirements.
- `random-items.ts`: ids aleatorios para el marquee.
- `supply-count-items.ts`: filtros y agrupacion de items del supply.
- `supply-count.ts`: helpers simples de ids para supply.

## Flujo

1. `planner-logic.ts` calcula el total requerido por item.
2. `requirements.ts` ordena y calcula tiempos.
3. `supply-count-items.ts` y `random-items.ts` alimentan UI de sidebar y marquee.
