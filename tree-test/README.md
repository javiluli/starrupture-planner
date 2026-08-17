# tree-test

Carpeta autocontenida para probar y mover el componente `TreeList` a otro proyecto.

## Que incluye

- `src/tree-list.tsx`: motor recursivo del arbol.
- `src/tree-list-node.tsx`: wrapper interactivo de cada fila.
- `src/tree-lines.tsx`: lineas visuales del arbol.
- `src/use-tree-expansion.ts`: estado interno de expand/collapse.
- `src/types.ts`: tipos publicos.
- `src/mock-data.ts`: datos dummy con `id`, `label` y `children`.
- `src/tree-list-example.tsx`: ejemplo completo con fila custom.
- `src/index.ts`: exports publicos.

## Uso base

```tsx
import { TreeList, TreeListNode } from './tree-test/src'

const data = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
    ],
  },
]

export const Example = () => (
  <TreeList data={data}>
    {(nodeProps) => (
      <TreeListNode {...nodeProps}>
        <div>{nodeProps.node.label}</div>
      </TreeListNode>
    )}
  </TreeList>
)
```

## Shape por defecto

Por defecto espera:

```ts
type Node = {
  id: string
  children?: Node[]
}
```

Si tu objeto usa otros nombres, pasa:

```tsx
<TreeList
  data={data}
  getNodeId={(node) => node.uuid}
  getChildren={(node) => node.nodes}
>
  {(nodeProps) => <TreeListNode {...nodeProps}>...</TreeListNode>}
</TreeList>
```

## Notas actuales

- Usa clases tipo Tailwind en `className`.
- El contenido de cada fila es 100% custom.
- El componente no conoce nada de juegos, recipes, buildings, items ni imagenes.
- Para publicarlo como npm package, el siguiente paso seria sustituir las clases internas por CSS propio o exponer mas slots/classes.
