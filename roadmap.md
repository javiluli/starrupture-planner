# ROADMAP

- [x] Corregir únicamente AssetImage: mover el catálogo a public, eliminar el glob eager y evitar el loader lazy defectuoso de HeroUI.
- [x] Medir de nuevo Items, Recipes y marquee antes de tocar la tabla.
- [x] Consolidar la tabla virtualizada: altura estimada, semántica, división interna y README.
- [x] Mantener todos los stores Zustand centralizados en `src/store/`, incluidos los específicos de cada feature.
- [x] Reducir barrels internos redundantes y eliminar archivos globales sin consumidores.
- [x] Normalizar el shell visual y establecer un único propietario de padding, gaps y superficies.
- [x] Centralizar colores del Flow mediante tokens HeroUI/CSS.
- [x] Analizar el bundle principal y comprobar con mediciones si los imports directos de HeroUI reducen su tamaño.
- [x] Añadir pruebas para AssetImage, filtros, stores y cálculos principales.
- [x] Desde `/items`, enlazar cada referencia de corporation con su nivel exacto en `/corporations`.
- [x] Si en `/planner` pones 0/min, se borra todo, poner minimo 1 si hay un items seleccionado, y, si no hay ninguno, que ese input quede desactivado con valor 0.
- [x] El mensaje "Select an item to see corporation requirements" cuando use objetos que nos sea de mision/lo requiera alguna corporacion, hacer que no se vea para ese item.
- [x] Mostrar un Skeleton de HeroUI mientras carga cada AssetImage, ocultar visualmente el texto alternativo y usar un fallback neutro si el asset falla.
- [ ] La priemra vez que entras en cada seccion de la web, /items, /corporations, /building, tarda en cargar, da un tiron, y ya una vez carga una vez funciona bien

## Features

- Al cambiar una receta alternativa, remarcar las maquinas/produccion con un destello sobre las "cards"
- Dejar un log en la parte inferior con las maquinas y recetas cambiadas

