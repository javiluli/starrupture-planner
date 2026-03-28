# Recipes (Feature)

Pagina para visualizar edificios y sus recetas de produccion.

## Estructura

```
src/features/recipes
+- ui/        # componentes visuales de la pagina
+- hooks/     # hooks de datos para la UI
+- lib/       # helpers puros (sin estado)
+- types/     # tipos locales de la feature
+- index.ts   # exports publicos
```

## Recorrido rapido

page-recipes -> RecipesAccordion -> RecipeRow -> RecipeInputs/RecipeOutput

## Datos

- useRecipesSummary: resumen de buildings y recipes
- useRecipesAccordionData: lista de buildings con recetas + unlock info + itemMap
```
