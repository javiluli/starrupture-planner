# Planner Lib

Helpers puros de dominio para la feature de planner.
Aqui no hay UI, solo calculos, filtros y utilidades.

## Indice de archivos

- `planner-logic.ts`: calculo de demanda neta, stats y clamp de ipm.
- `recipes.ts`: resolver edificio y receta para un item.
- `corporations.ts`: comprobar si un item es exportable por corporacion.
- `corporation-requirements.ts`: ordenar y seleccionar requisitos.
- `random-items.ts`: ids aleatorios estables para el marquee.
- `supply-items.ts`: filtros y agrupacion de items del supply.
- `supply.ts`: helpers simples de ids para supply.
- `index.ts`: barrel con exports publicos.

## Recorrido rapido

1. `planner-logic.ts` es el nucleo de calculo.
2. `recipes.ts` y `corporations.ts` dan lookups puntuales.
3. `supply-items.ts` y `random-items.ts` alimentan UI de sidebar y marquee.
