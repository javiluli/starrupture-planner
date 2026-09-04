# TreeList

Componente generico para renderizar arboles con filas custom.

## Uso base

```tsx
<TreeList data={data}>
  {(nodeProps) => (
    <TreeListNode {...nodeProps}>
      <div>{nodeProps.node.label}</div>
    </TreeListNode>
  )}
</TreeList>
```

## Shape por defecto

Si no pasas `getNodeId` ni `getChildren`, el componente usa:
- `node.id`
- `node.children`

```ts
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
```

## Personalizacion

- `getNodeId(node, path)`: define la key/id de cada nodo.
- `getChildren(node)`: permite usar otro campo para los hijos.
- `lineConfig`: ajusta las lineas del arbol.
- `defaultExpanded`: abre/cierra el arbol por defecto.
