# Catálogo de Componentes

## 1. Button
Componente de acción principal.
- **Props**: label, onClick, variant (primary, secondary, danger).
- **Estilos**: Tailwind CSS con transiciones y estados de deshabilitado.

## 2. DecisionCard
Representación visual de una lista de decisiones.
- **Props**: `decision` (objeto tipo Decision), `onDelete` (función callback).
- **Composición**: Utiliza tipado estricto para asegurar que los datos de la API se rendericen correctamente.

## 3. InputField (Próximamente)
Componente de formulario controlado para capturar nuevas opciones.