# Lib (Planner)

Funciones puras del dominio, sin estado React ni acceso directo a Zustand.

## Enlaces

- [Planner](../README.md)
- [Flow](../flow/README.md)
- [Production plan](./production-plan/README.md)

## Indice

- `production-plan/`: demanda, steps, stats y resolucion de variantes.
- `planner-logic.ts`: normalizacion de IPM.
- `recipes.ts`: busqueda y seleccion de recetas.
- `building-variants.ts`: variantes relevantes por item.
- `corporation-requirements.ts`: calculo y seleccion de requisitos de nivel.
- `random-items.ts`: muestra aleatoria del marquee.
- `supply-count.ts`: operaciones puras sobre cantidades de supply.
- `supply-count-items.ts`: filtros y agrupacion para el modal.

Si una funcion necesita React o Zustand, no pertenece aqui. Si solo adapta un `ProductionPlan` a una vista, pertenece a la carpeta de ese diagrama.
