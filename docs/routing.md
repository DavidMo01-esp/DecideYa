# Estructura de rutas

La aplicación utiliza `react-router-dom` para organizar la navegación entre la vista principal, el detalle de una decisión y las rutas de error.

## Objetivo del enrutado

La idea no fue crear una estructura compleja, sino una navegación clara y fácil de mantener. La aplicación tiene pocas pantallas, pero cada una responde a una responsabilidad concreta.

## Rutas actuales

| Ruta | Componente | Función |
| --- | --- | --- |
| `/` | `Decisions` | Pantalla principal con formulario, listado y ruleta de borrador |
| `/decisions` | `Decisions` | Alias de la pantalla principal |
| `/decisions/:decisionId` | `DecisionDetail` | Vista de detalle de una decisión |
| `/about` | `Navigate` | Redirección a `/` |
| `*` | `NotFound` | Manejo de rutas inexistentes |

## Layout común

Todas las rutas principales cuelgan de `AppLayout`, que se encarga de:

- renderizar la cabecera común
- mostrar métricas globales
- reflejar el estado general de la red
- insertar el contenido de cada página mediante `Outlet`

Esto evita repetir estructura y mantiene una experiencia visual consistente.

## Página principal

La ruta `/` ya no funciona como una portada separada. Hoy actúa como punto de entrada real de la aplicación y renderiza directamente `Decisions`.

Esa decisión simplifica la navegación:

- el usuario entra y ya puede crear una decisión
- el listado de contenido está disponible desde el inicio
- no existe una pantalla intermedia vacía

## Ruta de detalle

`/decisions/:decisionId` abre una decisión concreta.

En esta pantalla el usuario puede:

- consultar la decisión completa
- marcar o quitar una opción elegida
- lanzar la ruleta
- eliminar la decisión

Si el identificador no existe, la aplicación reutiliza `NotFound` con un mensaje adaptado al caso.

## Rutas no utilizadas de forma funcional

La ruta `/about` no muestra actualmente una página propia. Se mantiene como redirección a `/`, probablemente como resto de una fase anterior del proyecto o como posible punto de extensión futuro.

## Manejo de errores de ruta

La ruta comodín `*` envía al usuario a `NotFound`. Esta pantalla se usa tanto para URLs inexistentes como para decisiones que ya no están disponibles.

Con ello se consigue una estrategia de error coherente y fácil de entender.
