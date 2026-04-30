# Documentación de Hooks

En este proyecto se han implementado Hooks de React para separar la lógica de negocio de la interfaz de usuario.

## Hooks Estándar
- **useState**: Utilizado para gestionar la lista de decisiones y los estados de carga (`loading`).
- **useEffect**: Utilizado para disparar la carga de datos cuando el componente se monta.
- **useMemo**: Optimiza el cálculo del total de opciones, recalculando solo cuando la lista de decisiones cambia.
- **useCallback**: Memoriza la función `deleteDecision` para evitar que los componentes hijos (`DecisionCard`) se re-rendericen innecesariamente.

## Custom Hooks
### `useDecisions`
Centraliza toda la lógica relacionada con las decisiones. 
- **Retorna**: `decisions`, `loading`, `deleteDecision`, `totalOptionsCount`.
- **Beneficio**: Permite reutilizar la lógica de carga y eliminación en cualquier parte de la aplicación (Home, Dashboard, etc.).