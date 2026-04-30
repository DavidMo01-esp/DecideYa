# Hooks del proyecto

DecideYa utiliza hooks de React para separar la logica de datos de la capa visual. El hook mas importante del proyecto es `useDecisions()`, ya que concentra la comunicacion con la API y el estado compartido de la aplicacion.

## Hook principal: useDecisions

Archivo: `src/hooks/useDecisions.ts`

`useDecisions()` funciona como un store de dominio para las decisiones. Su objetivo no es solo cargar datos, sino coordinar todo el ciclo de vida del recurso dentro del frontend.

### Lo que expone

```ts
{
  decisions,
  networkState,
  addDecision,
  removeDecision,
  setSelectedOption,
  refresh
}
```

### Responsabilidades

- cargar las decisiones al montar la aplicacion
- crear nuevas decisiones
- eliminar decisiones existentes
- actualizar la opcion elegida
- gestionar los estados de red
- ofrecer una accion de recarga manual

## Hooks de React que utiliza

`useDecisions()` se apoya en varios hooks estandar:

### useState

Se utiliza para almacenar:

- la lista de decisiones
- el estado de red

### useEffect

Dispara la carga inicial de decisiones cuando el store entra en funcionamiento.

### useCallback

Se usa para estabilizar las funciones principales del store:

- `syncDecisions`
- `fetchDecisions`
- `addDecision`
- `removeDecision`
- `setSelectedOption`
- `refresh`

### useRef

`decisionsRef` permite acceder a la version mas reciente de la coleccion durante operaciones asincronas sin depender de cierres desactualizados.

Este detalle fue importante para actualizar la lista despues de crear, eliminar o modificar decisiones sin introducir errores de sincronizacion.

## Estado de red

Uno de los valores principales del hook es `networkState`, que unifica la experiencia de carga, exito y error:

```ts
type NetworkState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

Gracias a eso, los componentes pueden decidir si mostrar skeletons, datos o mensajes de error sin tener que deducir estados a partir de varias banderas sueltas.

## Relacion con el resto de la app

`useDecisions()` no se consume directamente desde todas las paginas. Normalmente se utiliza a traves de `DecisionContext`, que lo comparte con toda la arborescencia de la aplicacion.

Eso permite mantener un solo punto de acceso al estado de decisiones y evita inicializar logica de red duplicada en distintos componentes.

## Conclusiones

El hook termino siendo una de las piezas mas importantes del proyecto porque dio una forma ordenada a la integracion entre frontend y backend. Sin el, la logica de red habria quedado dispersa entre componentes y la aplicacion seria bastante mas dificil de mantener.
