# Lib (Planner)

Helpers puros que no dependen de React.

## Archivos

- `planner-logic.ts`: normaliza valores de entrada (clamp).
- `production-plan/`: calculos de demanda, steps y stats del plan.
- `recipes.ts`: helpers de recetas.
- `corporations.ts`: helpers de corporaciones.
- `requirements.ts`: ordenamiento y picks de requirements.
- `random-items.ts`: ids aleatorios para el marquee.
- `supply-count.ts`: helpers simples de ids para supply.
- `supply-count-items.ts`: filtros y agrupacion para el modal de supply.

## Flujo

1. `production-plan/` calcula el total requerido por item y genera steps.
2. `requirements.ts` ordena y calcula tiempos.
3. `random-items.ts` alimenta el marquee.
