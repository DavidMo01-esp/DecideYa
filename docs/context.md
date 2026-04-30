# Gestión de estado con Context API

La aplicación utiliza `Context API` como capa de acceso compartido al estado de decisiones. La idea no fue almacenar "todo" en contexto, sino exponer un único store de dominio que pudiera consumirse desde cualquier página sin prop drilling.

## Piezas que lo componen

La solucion actual se apoya en tres elementos:

- `DecisionContext`
- `DecisionProvider`
- `useDecisionContext()`

El archivo responsable es `src/context/DecisionContext.tsx`.

## Qué expone el contexto

El contexto no guarda un objeto arbitrario. Expone exactamente el resultado del hook `useDecisions()`, es decir:

- `decisions`
- `networkState`
- `addDecision()`
- `removeDecision()`
- `setSelectedOption()`
- `refresh()`

De este modo, los componentes no necesitan conocer detalles de la capa de red ni de la estructura del hook.

## Por qué se usó esta estrategia

El estado de decisiones se necesita en varios lugares:

- en la página principal para listar decisiones
- en el formulario para crear nuevas entradas
- en el detalle para cambiar la opción elegida o eliminar
- en el layout para mostrar métricas y estado de red

Sin contexto, habría que subir el estado hasta un punto muy alto y distribuirlo por props. Eso haría el árbol más frágil y aumentaría el acoplamiento entre componentes.

## Papel del provider

`DecisionProvider` actúa como puente entre el hook de dominio y el resto de la aplicación.

Su responsabilidad es muy concreta:

1. Ejecutar `useDecisions()`.
2. Guardar ese resultado en el contexto.
3. Envolver el árbol de rutas para que cualquier página pueda consumirlo.

## Hook de consumo

`useDecisionContext()` simplifica el acceso al contexto y añade una comprobación de seguridad. Si alguien intenta usar el contexto fuera del provider, se lanza un error explícito.

Eso ayuda a detectar errores de integración rápidamente y evita estados `undefined` silenciosos.

## Limites del contexto

El contexto resuelve bien el estado compartido de decisiones, pero no sustituye al backend ni a la capa de red:

- la fuente de verdad sigue estando en la API
- el contexto solo comparte el estado ya resuelto por el hook
- la lógica HTTP continúa centralizada fuera de los componentes

Esa separación fue importante para no convertir el contexto en una capa de negocio demasiado pesada.
