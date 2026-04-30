# Formularios e interacción

El formulario principal de DecideYa vive en la página `src/pages/Decisions.tsx`. No se trata de un formulario aislado, sino de una pequeña herramienta de composición que permite construir una decisión antes de guardarla.

## Objetivo del formulario

El flujo de creación se diseñó para que el usuario pueda:

- escribir un título
- introducir varias opciones rápidamente
- revisar un borrador antes de guardar
- seleccionar manualmente una opción si lo desea
- probar una ruleta con el borrador antes de persistirlo

## Estructura del estado local

Antes de enviar datos al backend, el formulario trabaja con un estado local de borrador:

- `title`
- `optionInput`
- `draftOptions`
- `draftSelectedOption`
- `isSubmitting`

Esta separación permite que el usuario experimente con el contenido sin modificar todavía el estado global de la aplicación.

## Entrada de opciones

Una de las decisiones más útiles del formulario fue permitir introducir opciones de forma flexible.

La función `parseOptions()` acepta:

- texto separado por comas
- texto separado por saltos de línea

De esta forma, el usuario puede pegar varias opciones de una sola vez sin tener que rellenar campos individuales.

## Reglas del borrador

El formulario aplica reglas locales antes de permitir el envío:

- el título debe tener al menos 3 caracteres útiles
- el borrador debe contener entre 2 y 6 opciones
- las opciones vacías se descartan
- no se añaden duplicados, comparando en minúsculas

Estas reglas mejoran la experiencia de usuario, aunque la validacion definitiva sigue estando en el backend.

## Selección manual previa

Antes de guardar, el usuario puede marcar una opción como elegida. Esa selección se guarda en `draftSelectedOption` y, si finalmente se envía el formulario, pasa al backend como parte del `CreateDecisionDTO`.

Si una opción se elimina del borrador y era la seleccionada, el estado se corrige automáticamente para no dejar una referencia inválida.

## Flujo de envío

Cuando el formulario se envía:

1. Se comprueba que el borrador cumple las reglas mínimas.
2. Se activa `isSubmitting`.
3. Se llama a `addDecision()` a través del contexto.
4. Si la creación va bien, el formulario se limpia.
5. Si falla, el error se gestiona desde el store global.

Este enfoque evita duplicar la lógica de errores dentro del propio formulario.

## Feedback al usuario

El formulario da información en varios niveles:

- pistas cortas bajo los campos
- desactivación de botones cuando una acción no es válida
- mensajes de estado global si falla la red
- cambio de texto en botones durante acciones asincronas

No se optó por una validación agresiva campo a campo. En su lugar, se buscó un equilibrio entre guía visual y sencillez de uso.

## Relación con la API

El formulario no habla directamente con la API. Toda la comunicación pasa por el contexto y por `useDecisions()`. Esto aporta varias ventajas:

- mantiene el componente centrado en la experiencia de usuario
- evita repetir lógica HTTP
- garantiza que la creación siga el mismo flujo que el resto de mutaciones

## Coherencia con el backend

Las reglas del formulario están pensadas para coincidir con la API:

- mínimo 2 opciones
- máximo 6
- título válido
- `selectedOption` opcional

Aún así, la comprobación definitiva está en el backend, que sigue siendo la autoridad final sobre la validez de los datos.

## Interacción complementaria: ruleta del borrador

Un detalle diferencial del formulario es que el borrador se puede probar con la ruleta antes de guardar. Esto convierte el formulario en algo más que una capa de entrada de datos: también permite explorar el contenido que se está creando.

## Conclusion

La solucion final no se basa en un formulario complejo con muchos campos, sino en un flujo compacto y muy orientado a la accion. La prioridad fue que crear una decision resultara rapido, claro y facil de revisar antes de persistirla.
