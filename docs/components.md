# Componentes principales

La interfaz de DecideYa se apoya en un conjunto pequeno de componentes reutilizables. No existe una libreria de componentes completa, pero si una base comun suficiente para mantener coherencia visual y funcional.

## Criterios generales

Los componentes comparten varias decisiones de diseño:

- tipado explicito en TypeScript
- estilo visual basado en Tailwind y utilidades propias
- jerarquia clara entre componentes de pagina y componentes reutilizables
- responsabilidad concreta para cada pieza

## AppLayout

Archivo: `src/components/AppLayout.tsx`

Es el layout comun de la aplicacion. Envuelve las rutas principales y se encarga de:

- renderizar la cabecera fija
- mostrar metricas globales
- indicar el estado de sincronizacion de la red
- ofrecer accesos de navegacion segun la pagina actual

No contiene logica de negocio compleja, pero si actua como punto de union entre el contexto global y la navegacion.

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

- titulo
- numero de opciones
- fecha de creacion
- opcion elegida, si existe
- acceso al detalle
- accion de borrado

Incluye un estado local `isDeleting` para evitar dobles clics durante la eliminacion.

## DecisionWheel

Archivo: `src/components/DecisionWheel.tsx`

Es el componente mas expresivo de la interfaz. No solo presenta informacion: tambien introduce una capa de interaccion y juego.

Permite dos modos:

- seleccion inmediata
- ruleta animada

El componente es reutilizable porque recibe por props:

- titulo
- descripcion
- mensaje vacio
- lista de opciones

Internamente gestiona:

- rotacion de la ruleta
- seleccion aleatoria
- animacion temporal
- estado de opcion elegida

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
