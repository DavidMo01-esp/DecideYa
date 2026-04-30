# Gestion de estado con Context API

La aplicacion utiliza `Context API` como capa de acceso compartido al estado de decisiones. La idea no fue almacenar "todo" en contexto, sino exponer un unico store de dominio que pudiera consumirse desde cualquier pagina sin prop drilling.

## Piezas que lo componen

La solucion actual se apoya en tres elementos:

- `DecisionContext`
- `DecisionProvider`
- `useDecisionContext()`

El archivo responsable es `src/context/DecisionContext.tsx`.

## Que expone el contexto

El contexto no guarda un objeto arbitrario. Expone exactamente el resultado del hook `useDecisions()`, es decir:

- `decisions`
- `networkState`
- `addDecision()`
- `removeDecision()`
- `setSelectedOption()`
- `refresh()`

De este modo, los componentes no necesitan conocer detalles de la capa de red ni de la estructura del hook.

## Por que se uso esta estrategia

El estado de decisiones se necesita en varios lugares:

- en la pagina principal para listar decisiones
- en el formulario para crear nuevas entradas
- en el detalle para cambiar la opcion elegida o eliminar
- en el layout para mostrar metricas y estado de red

Sin contexto, habria que subir el estado hasta un punto muy alto y distribuirlo por props. Eso haria el arbol mas fragil y aumentaria el acoplamiento entre componentes.

## Papel del provider

`DecisionProvider` actua como puente entre el hook de dominio y el resto de la aplicacion.

Su responsabilidad es muy concreta:

1. Ejecutar `useDecisions()`.
2. Guardar ese resultado en el contexto.
3. Envolver el arbol de rutas para que cualquier pagina pueda consumirlo.

## Hook de consumo

`useDecisionContext()` simplifica el acceso al contexto y añade una comprobacion de seguridad. Si alguien intenta usar el contexto fuera del provider, se lanza un error explicito.

Eso ayuda a detectar errores de integracion rapidamente y evita estados `undefined` silenciosos.

## Limites del contexto

El contexto resuelve bien el estado compartido de decisiones, pero no sustituye al backend ni a la capa de red:

- la fuente de verdad sigue estando en la API
- el contexto solo comparte el estado ya resuelto por el hook
- la logica HTTP continua centralizada fuera de los componentes

Esa separacion fue importante para no convertir el contexto en una capa de negocio demasiado pesada.
