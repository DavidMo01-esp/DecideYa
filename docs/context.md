# Gestión de Estado Global (Context API)

Se ha implementado `Context API` para evitar el "prop drilling" y permitir que los datos de las decisiones sean accesibles desde cualquier nivel de la aplicación.

## Implementación
- **DecisionContext**: Define la estructura de los datos (lista de decisiones) y las acciones (añadir/eliminar).
- **DecisionProvider**: Componente de alto nivel que envuelve la aplicación y provee el estado.
- **useDecisionContext**: Hook personalizado para consumir el estado de forma sencilla y segura.

## Casos de uso
Es útil en este proyecto porque la lista de decisiones se necesita tanto en la página principal (`Home`) como en los formularios de creación y en los componentes de visualización detallada.