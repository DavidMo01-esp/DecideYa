# Componentes principales

La interfaz de DecideYa se apoya en un conjunto pequeño de componentes reutilizables. No existe una librería de componentes completa, pero sí una base común suficiente para mantener coherencia visual y funcional.

## Criterios generales

Los componentes comparten varias decisiones de diseño:

- tipado explícito en TypeScript
- estilo visual basado en Tailwind y utilidades propias
- jerarquía clara entre componentes de página y componentes reutilizables
- responsabilidad concreta para cada pieza

## AppLayout

Archivo: `src/components/AppLayout.tsx`

Es el layout comun de la aplicacion. Envuelve las rutas principales y se encarga de:

- renderizar la cabecera fija
- mostrar metricas globales
- indicar el estado de sincronizacion de la red
- ofrecer accesos de navegacion segun la pagina actual

No contiene lógica de negocio compleja, pero sí actúa como punto de unión entre el contexto global y la navegación.

## Button

Archivo: `src/components/Button.tsx`

Es el componente de accion reutilizable de la aplicacion. Acepta dos formas de uso:

- mediante la prop `label`
- mediante `children`

Tambien soporta variantes visuales:

- `primary`
- `secondary`
- `danger`

El componente unifica estilos, estados deshabilitados y comportamiento de botones de formulario o de accion normal.

## DecisionCard

Archivo: `src/components/DecisionCard.tsx`

Representa una decision en el listado principal. Su funcion es resumir una entidad `Decision` sin obligar al usuario a entrar en el detalle.

Muestra:

- título
- número de opciones
- fecha de creación
- opción elegida, si existe
- acceso al detalle
- accion de borrado

Incluye un estado local `isDeleting` para evitar dobles clics durante la eliminacion.

## DecisionWheel

Archivo: `src/components/DecisionWheel.tsx`

Es el componente mas expresivo de la interfaz. No solo presenta informacion: tambien introduce una capa de interaccion y juego.

Permite dos modos:

- selección inmediata
- ruleta animada

El componente es reutilizable porque recibe por props:

- título
- descripción
- mensaje vacío
- lista de opciones

Internamente gestiona:

- rotación de la ruleta
- selección aleatoria
- animación temporal
- estado de opción elegida

## ErrorBoundary

Archivo: `src/components/ErrorBoundary.tsx`

Se utiliza para capturar errores de renderizado de React y evitar que toda la aplicacion quede inutilizable ante una excepcion no controlada.

Su papel es sencillo, pero importante:

- intercepta errores de componentes hijos
- registra el error en consola
- muestra una pantalla de fallo con el mensaje y la traza

## NotFound

Archivo: `src/pages/NotFound.tsx`

Aunque tecnicamente es una pagina y no un componente atomico, cumple una funcion transversal en el sistema.

Se reutiliza en dos contextos:

- rutas inexistentes
- decisiones que ya no existen o fueron eliminadas

Eso evita duplicar una misma experiencia de error en varios sitios.

## Relacion entre componentes y paginas

Las paginas principales (`Decisions` y `DecisionDetail`) no intentan hacerlo todo por si mismas. Delegan responsabilidades:

- `AppLayout` organiza el marco comun
- `DecisionCard` resume entidades
- `DecisionWheel` resuelve la eleccion aleatoria
- `Button` da consistencia a las acciones

Esa composicion mantiene el codigo mas legible y hace que la interfaz sea mas facil de extender.
