# Organización del trabajo

El desarrollo de DecideYa se gestionó como un proyecto incremental, con una estructura ligera pero suficiente para mantener orden técnico y visibilidad del avance.

## Principio de trabajo

La lógica general fue sencilla:

- dividir el proyecto en bloques funcionales
- priorizar primero lo que desbloqueaba el resto
- revisar integración y documentación al cierre de cada tramo relevante

No se siguio un proceso burocratico. Se busco una organizacion realista para un proyecto pequeno, pero con suficiente disciplina para no perder trazabilidad.

## Flujo de estados

La gestión de tareas se puede resumir en cuatro estados:

- **Pendiente**: trabajo identificado, pero aún no iniciado
- **En curso**: tarea activa en desarrollo
- **En revisión**: funcionalidad terminada pendiente de comprobación
- **Cerrado**: trabajo validado y asumido como parte estable del proyecto

## Bloques principales del proyecto

El trabajo termino agrupandose de forma natural en varias areas:

### 1. Definición funcional

- idea del producto
- problema a resolver
- alcance inicial

### 2. Interfaz de usuario

- estructura de páginas
- componentes reutilizables
- estilo visual y experiencia de uso

### 3. Backend y API

- modelado del recurso `Decision`
- endpoints REST
- validación de datos
- capa de persistencia

### 4. Integración

- cliente API tipado
- gestión de estado compartido
- sincronización entre UI y backend

### 5. Despliegue y cierre

- preparación de Vercel
- resolución de incidencias de build
- revisión completa de documentación

## Estructura técnica que ayudó a gestionar el trabajo

La propia arquitectura favoreció la organización:

- frontend en `src/`
- backend en `server/src/`
- documentación en `docs/`

Esa separación permitió trabajar cada capa con un foco claro y detectar antes los puntos de integración.

## Lección principal

La mayor lección de gestión fue que la documentación no debía quedar para el final como una tarea decorativa. En un proyecto con cambios de arquitectura y despliegue, documentar a tiempo reduce errores y hace mucho más fácil explicar el sistema una vez que ya funciona.
