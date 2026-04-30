# Formularios e interaccion

El formulario principal de DecideYa vive en la pagina `src/pages/Decisions.tsx`. No se trata de un formulario aislado, sino de una pequena herramienta de composicion que permite construir una decision antes de guardarla.

## Objetivo del formulario

El flujo de creacion se diseno para que el usuario pueda:

- escribir un titulo
- introducir varias opciones rapidamente
- revisar un borrador antes de guardar
- seleccionar manualmente una opcion si lo desea
- probar una ruleta con el borrador antes de persistirlo

## Estructura del estado local

Antes de enviar datos al backend, el formulario trabaja con un estado local de borrador:

- `title`
- `optionInput`
- `draftOptions`
- `draftSelectedOption`
- `isSubmitting`

Esta separacion permite que el usuario experimente con el contenido sin modificar todavia el estado global de la aplicacion.

## Entrada de opciones

Una de las decisiones mas utiles del formulario fue permitir introducir opciones de forma flexible.

La funcion `parseOptions()` acepta:

- texto separado por comas
- texto separado por saltos de linea

De esta forma, el usuario puede pegar varias opciones de una sola vez sin tener que rellenar campos individuales.

## Reglas del borrador

El formulario aplica reglas locales antes de permitir el envio:

- el titulo debe tener al menos 3 caracteres utiles
- el borrador debe contener entre 2 y 6 opciones
- las opciones vacias se descartan
- no se anaden duplicados, comparando en minusculas

Estas reglas mejoran la experiencia de usuario, aunque la validacion definitiva sigue estando en el backend.

## Seleccion manual previa

Antes de guardar, el usuario puede marcar una opcion como elegida. Esa seleccion se guarda en `draftSelectedOption` y, si finalmente se envia el formulario, pasa al backend como parte del `CreateDecisionDTO`.

Si una opcion se elimina del borrador y era la seleccionada, el estado se corrige automaticamente para no dejar una referencia invalida.

## Flujo de envio

Cuando el formulario se envia:

1. Se comprueba que el borrador cumple las reglas minimas.
2. Se activa `isSubmitting`.
3. Se llama a `addDecision()` a traves del contexto.
4. Si la creacion va bien, el formulario se limpia.
5. Si falla, el error se gestiona desde el store global.

Este enfoque evita duplicar la logica de errores dentro del propio formulario.

## Feedback al usuario

El formulario da informacion en varios niveles:

- pistas cortas bajo los campos
- desactivacion de botones cuando una accion no es valida
- mensajes de estado global si falla la red
- cambio de texto en botones durante acciones asincronas

No se opto por una validacion agresiva campo a campo. En su lugar, se busco un equilibrio entre guia visual y sencillez de uso.

## Relacion con la API

El formulario no habla directamente con la API. Toda la comunicacion pasa por el contexto y por `useDecisions()`. Esto aporta varias ventajas:

- mantiene el componente centrado en la experiencia de usuario
- evita repetir logica HTTP
- garantiza que la creacion siga el mismo flujo que el resto de mutaciones

## Coherencia con el backend

Las reglas del formulario estan pensadas para coincidir con la API:

- minimo 2 opciones
- maximo 6
- titulo valido
- `selectedOption` opcional

Aun asi, la comprobacion definitiva esta en el backend, que sigue siendo la autoridad final sobre la validez de los datos.

## Interaccion complementaria: ruleta del borrador

Un detalle diferencial del formulario es que el borrador se puede probar con la ruleta antes de guardar. Esto convierte el formulario en algo mas que una capa de entrada de datos: tambien permite explorar el contenido que se esta creando.

## Conclusion

La solucion final no se basa en un formulario complejo con muchos campos, sino en un flujo compacto y muy orientado a la accion. La prioridad fue que crear una decision resultara rapido, claro y facil de revisar antes de persistirla.
