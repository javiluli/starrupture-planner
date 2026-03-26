# Corporations (Feature)

Pagina para visualizar las corporaciones y sus niveles, asociados a sus recompensas/rewards

## Estructura

```
src/features/corporations
+- ui/
|  +- sections/                 # secciones de pagina (header/list)
|  +- components/               # piezas reutilizables
|     +- accordion/             # cabeceras y meta del acordeon
|     +- levels-and-rewards/    # filas de niveles y rewards
+- hooks/                       # hooks de la feature
+- lib/                         # helpers puros
+- index.ts                     # exports publicos
```

## Recorrido rapido

page -> ui/sections -> ui/components -> lib/hooks
