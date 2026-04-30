# Estructura de rutas

La aplicacion utiliza `react-router-dom` para organizar la navegacion entre la vista principal, el detalle de una decision y las rutas de error.

## Objetivo del enrutado

La idea no fue crear una estructura compleja, sino una navegacion clara y facil de mantener. La aplicacion tiene pocas pantallas, pero cada una responde a una responsabilidad concreta.

## Rutas actuales

| Ruta | Componente | Funcion |
| --- | --- | --- |
| `/` | `Decisions` | Pantalla principal con formulario, listado y ruleta de borrador |
| `/decisions` | `Decisions` | Alias de la pantalla principal |
| `/decisions/:decisionId` | `DecisionDetail` | Vista de detalle de una decision |
| `/about` | `Navigate` | Redireccion a `/` |
| `*` | `NotFound` | Manejo de rutas inexistentes |

## Layout comun

Todas las rutas principales cuelgan de `AppLayout`, que se encarga de:

- renderizar la cabecera comun
- mostrar metricas globales
- reflejar el estado general de la red
- insertar el contenido de cada pagina mediante `Outlet`

Esto evita repetir estructura y mantiene una experiencia visual consistente.

## Pagina principal

La ruta `/` ya no funciona como una portada separada. Hoy actua como punto de entrada real de la aplicacion y renderiza directamente `Decisions`.

Esa decision simplifica la navegacion:

- el usuario entra y ya puede crear una decision
- el listado de contenido esta disponible desde el inicio
- no existe una pantalla intermedia vacia

## Ruta de detalle

`/decisions/:decisionId` abre una decision concreta.

En esta pantalla el usuario puede:

- consultar la decision completa
- marcar o quitar una opcion elegida
- lanzar la ruleta
- eliminar la decision

Si el identificador no existe, la aplicacion reutiliza `NotFound` con un mensaje adaptado al caso.

## Rutas no utilizadas de forma funcional

La ruta `/about` no muestra actualmente una pagina propia. Se mantiene como redireccion a `/`, probablemente como resto de una fase anterior del proyecto o como posible punto de extension futuro.

## Manejo de errores de ruta

La ruta comodin `*` envia al usuario a `NotFound`. Esta pantalla se usa tanto para URLs inexistentes como para decisiones que ya no estan disponibles.

Con ello se consigue una estrategia de error coherente y facil de entender.
