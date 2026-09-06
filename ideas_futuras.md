# Ideas futuras

Estas ideas quedan fuera de `AUDIT.md` y no representan trabajo iniciado. Cada una
debe convertirse en un hito independiente cuando se priorice, con alcance, criterio
de aceptación y validación propios.

## Rework de transición del Flow al cambiar de receta

- **Objetivo:** evitar el salto brusco entre un Flow vacío, el skeleton y el Flow
  final cuando se selecciona una receta distinta.
- **Propuesta:** mostrar un estado de carga asociado explícitamente a la receta
  seleccionada; conservar temporalmente la estructura visible anterior mientras se
  prepara la nueva; después sustituirla por el Flow generado usando una transición
  breve y estable.
- **Coherencia visual:** reutilizar la receta real de `Ceramics` y los mismos nodos
  o tarjetas que utiliza el Flow de producción para construir el skeleton. No crear
  una maqueta paralela que pueda desalinearse del componente real.
- **Accesibilidad:** la carga debe comunicarse también por texto/estado accesible y
  desactivar movimiento y crossfade cuando exista `prefers-reduced-motion`.
- **Criterio de aceptación:** cambiar de receta no produce un salto visible de
  layout; se identifica qué receta se está preparando; el Flow final conserva sus
  interacciones y el estado vacío sigue funcionando.

## Resaltar máquinas afectadas por una receta alternativa

- **Objetivo:** hacer evidente qué tarjetas de producción cambian al seleccionar
  una receta alternativa.
- **Propuesta:** comparar la selección anterior y la nueva, aplicar un resaltado
  temporal únicamente a las máquinas o producciones afectadas y retirarlo después
  de un intervalo corto o mediante una acción del usuario.
- **Accesibilidad:** el destello no puede ser la única señal; debe existir un cambio
  de estado identificable por texto, icono o atributo accesible. Respetar
  `prefers-reduced-motion` usando una transición estática.
- **Criterio de aceptación:** solo se remarcan elementos realmente modificados, el
  foco y la interacción no se pierden, y cambiar varias veces de receta no acumula
  clases ni timers obsoletos.

## Registro visible de cambios de máquinas y recetas

- **Objetivo:** ofrecer una explicación breve de los cambios producidos por una
  selección de receta, sin obligar a comparar manualmente todo el Flow.
- **Propuesta:** añadir un registro colapsable en la zona inferior con entradas
  ordenadas por evento, indicando máquina, receta anterior y receta nueva cuando
  exista esa información.
- **Alcance inicial:** registro de sesión y solo informativo; no persistirlo ni
  convertirlo en un sistema de historial hasta que exista una necesidad de negocio.
- **Criterio de aceptación:** cada entrada tiene una descripción clara, el registro
  no altera el cálculo ni el rendimiento del Flow, puede vaciarse y permanece
  usable con teclado y lector de pantalla.

## Centralización selectiva del texto compartido

- **Objetivo:** evitar que etiquetas estables de la UI y sus referencias E2E se
  desincronicen cuando cambia un texto.
- **Propuesta:** centralizar únicamente nombres de controles y mensajes de dominio
  reutilizados por producto y tests; mantener localizados los textos específicos de
  una pantalla cuando compartirlos añada acoplamiento innecesario.
- **Límite:** no introducir todavía un sistema completo de internacionalización ni
  reemplazar todos los literales. La fuente compartida debe seguir siendo legible y
  no ocultar el significado de los tests.
- **Criterio de aceptación:** los textos seleccionados tienen una única fuente,
  producto y E2E la consumen de forma consistente y una modificación de copy no
  exige editar dos literales equivalentes.

## Medición móvil adicional de rendimiento

- **Objetivo:** obtener una referencia adicional del empty state en dispositivos
  móviles sin convertirla en una barrera para el desarrollo de escritorio.
- **Propuesta:** repetir tres trazas con CPU 4× y red Slow 4G, registrar la mediana
  de LCP y observar si el marquee introduce reflow o cambios de layout.
- **Alcance:** diagnóstico opcional y manual; no añadir budgets propios ni hacer que
  `test:all` falle por variaciones normales de una medición local.
- **Criterio de aceptación:** las trazas quedan guardadas con fecha y contexto, y
  cualquier regresión reproducible se convierte en un hito específico antes de
  modificar el código.

## Tareas pendientes para priorizar

- [ ] Definir qué iniciativa se convierte en el siguiente hito y su prioridad.
- [ ] Para el rework del Flow, acordar si se conserva el Flow anterior durante la
      carga o si se muestra siempre el skeleton de `Ceramics`.
- [ ] Elegir la duración y el comportamiento exactos de los resaltados y del
      registro de cambios, incluyendo `prefers-reduced-motion`.
- [ ] Seleccionar el primer conjunto de textos que merece centralización y evitar
      extraer etiquetas de uso único.
- [ ] Decidir si la medición móvil adicional aporta valor suficiente para ejecutarla.
