# Items (Feature)

Listado de items, filtros y preparacion de filas para la tabla.

## Estructura

```text
src/features/items/
|- hooks/                 # Filtros y filas derivadas
|- lib/                   # Construccion pura de ItemTableRow
|- types/                 # Contratos exclusivos
|- ui/
|  |- filters/            # Selects, busqueda y clear
|  `- table/
|     |- items-table.tsx          # Orquesta TanStack Virtual y la tabla
|     |- items-table-header.tsx   # Columnas y cabecera semantica
|     |- items-table-body.tsx     # Filas visibles y espaciadores
|     |- items-table-row.tsx      # Render de una fila virtual
|     |- items-table-cells.tsx    # Contenido de cada tipo de celda
|     `- items-table-columns.ts   # Columnas, anchuras y configuracion
|- index.ts               # API publica
`- README.md
```

## Flujo

1. `useItemsTableRows` lee el catalogo estatico.
2. `src/shared/data` asocia cada item con sus niveles de corporation; `buildItemsTableRows` solo añade su building y ordena una vez.
3. `useFilteredItemRows` aplica los filtros de `items.store.ts`.
4. `ItemsTable` virtualiza y renderiza solo el segmento visible.

## Tabla virtualizada

`ItemsTable` usa TanStack Virtual sobre una tabla HTML con layout fijo. La estimacion de `72px` coincide con la imagen de `56px` y el padding vertical de la fila; la medicion real corrige cualquier contenido mas alto. El overscan mantiene filas cercanas preparadas para evitar huecos durante el scroll.

La tabla conserva `aria-label`, `aria-rowcount`, `aria-rowindex` y `scope="col"` aunque solo exista una parte de las filas en el DOM. Las imagenes usan `AssetImage` con dimensiones reservadas, carga diferida y decodificacion asincrona.
