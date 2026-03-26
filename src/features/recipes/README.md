# Recipes (Feature)

Pagina para visualizar edificios y sus recetas de produccion.

## Estructura

```
src/features/recipes
+- ui/
|  +- sections/   # secciones de pagina (header/list)
|  +- components/ # piezas reutilizables
|     +- accordion/ # cabeceras y meta del acordeon
|     +- recipe/    # filas de receta y subcomponentes
+- hooks/          # hooks de la feature
+- lib/            # helpers puros
+- index.ts        # exports publicos
```

## Recorrido rapido

page -> ui/sections -> ui/components -> lib/hooks
