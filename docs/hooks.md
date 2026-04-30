# Hooks del proyecto

DecideYa utiliza hooks de React para separar la lógica de datos de la capa visual. El hook más importante del proyecto es `useDecisions()`, ya que concentra la comunicación con la API y el estado compartido de la aplicación.

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

- cargar las decisiones al montar la aplicación
- crear nuevas decisiones
- eliminar decisiones existentes
- actualizar la opción elegida
- gestionar los estados de red
- ofrecer una acción de recarga manual

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

`decisionsRef` permite acceder a la versión más reciente de la colección durante operaciones asincronas sin depender de cierres desactualizados.

Este detalle fue importante para actualizar la lista después de crear, eliminar o modificar decisiones sin introducir errores de sincronización.

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

`useDecisions()` no se consume directamente desde todas las páginas. Normalmente se utiliza a través de `DecisionContext`, que lo comparte con toda la arborescencia de la aplicación.

Eso permite mantener un solo punto de acceso al estado de decisiones y evita inicializar lógica de red duplicada en distintos componentes.

## Conclusiones

El hook terminó siendo una de las piezas más importantes del proyecto porque dio una forma ordenada a la integración entre frontend y backend. Sin él, la lógica de red habría quedado dispersa entre componentes y la aplicación sería bastante más difícil de mantener.
