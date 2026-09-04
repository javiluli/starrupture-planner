# Pruebas E2E

Las pruebas de navegador viven aqui y se agrupan por recorrido o feature:

- `smoke/`: navegacion y disponibilidad de rutas criticas.
- `base-designer/`: comportamiento visible del editor de bases.

Usa locators por rol, nombre accesible o texto estable. Evita clases CSS, estructura interna de HeroUI y esperas manuales. Playwright arranca Vite automaticamente si no existe un servidor reutilizable.

## Preparacion local

Instala el Chromium exacto que corresponde a la version de Playwright declarada en el lockfile:

```bash
pnpm exec playwright install chromium
```

En Linux o CI, instala tambien sus dependencias del sistema:

```bash
pnpm exec playwright install --with-deps --only-shell chromium
```

Los binarios del navegador no se cachean en CI. Solo se cachea el store de pnpm y Chromium se instala en cada ejecucion.

## Comandos frecuentes

```bash
pnpm test:e2e
pnpm test:e2e:headed
pnpm test:e2e:ui
pnpm test:e2e:debug
pnpm test:e2e:report
pnpm typecheck:e2e
pnpm test:all
```

## CLI de Playwright

Usa la CLI directamente para operaciones menos frecuentes:

```bash
# Ver que tests descubre sin ejecutarlos
pnpm exec playwright test --list

# Ejecutar una carpeta, fichero o test por titulo
pnpm exec playwright test e2e/base-designer
pnpm exec playwright test -g "catalogo"

# Repetir solo los fallos de la ultima ejecucion
pnpm exec playwright test --last-failed

# Generar un recorrido como punto de partida (requiere pnpm dev)
pnpm exec playwright codegen http://127.0.0.1:5173
```

El codigo de `codegen` es un borrador: revisa sus locators y conserva solo aserciones que representen comportamiento real. Para probar una URL ya desplegada, define `PLAYWRIGHT_BASE_URL`; en ese caso Playwright no inicia Vite.
