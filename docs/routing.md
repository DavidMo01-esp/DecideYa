# Estructura de Rutas

## Objetivo

La aplicacion usa React Router para separar la experiencia en paginas claras y navegables sin recargar el navegador.

## Rutas principales

| Ruta | Componente | Responsabilidad |
| --- | --- | --- |
| `/` | `Home` | Portada, resumen general y accesos rapidos. |
| `/decisions` | `Decisions` | Alta, listado y eliminacion de decisiones. |
| `/decisions/:decisionId` | `DecisionDetail` | Vista de detalle para una decision concreta. |
| `/about` | `About` | Contexto funcional y tecnico de la app. |
| `*` | `NotFound` | Manejo de rutas inexistentes mediante pagina 404. |

## Layout comun

- `AppLayout` envuelve todas las rutas.
- La cabecera contiene enlaces a `Inicio`, `Decisiones` y `Acerca de`.
- El contenido de cada pagina se renderiza mediante `Outlet`.

## Navegacion

- La navegacion principal se implementa con `NavLink` para resaltar la ruta activa.
- Desde la lista de decisiones se puede abrir `/decisions/:decisionId` con el enlace `Ver detalles`.
- La pagina 404 ofrece accesos de retorno a `/` y `/decisions`.

## Manejo de errores de ruta

- Cualquier URL no reconocida cae en la ruta comodin `*`.
- Si se intenta abrir una decision eliminada o inexistente, la app reutiliza la vista `NotFound` con un mensaje especifico.
