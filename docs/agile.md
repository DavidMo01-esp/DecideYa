# Enfoque ágil del proyecto

Este proyecto se gestionó con una lógica ágil sencilla y pragmática. El objetivo no fue seguir un marco de trabajo de forma rigida, sino mantener un flujo constante de avance, validar decisiones tecnicas con frecuencia y corregir el rumbo cuando aparecian nuevos problemas.

## Scrum y Kanban: diferencias utiles

Scrum y Kanban comparten una misma base: trabajar de forma incremental y revisar el progreso con frecuencia. Aún así, responden a necesidades distintas.

### Scrum

Scrum organiza el trabajo en iteraciones cerradas, normalmente llamadas sprints. Durante cada sprint se define un conjunto de tareas y se intenta proteger ese compromiso hasta la siguiente revisión.

Suele funcionar bien cuando:

- el alcance del ciclo está razonablemente claro
- el equipo necesita una cadencia fija de entrega
- interesa trabajar con rituales definidos, como planificación, revisión y retrospectiva

### Kanban

Kanban parte de una idea mas visual y flexible. El trabajo se organiza en columnas y se mueve segun su estado real: pendiente, en curso, en revision o terminado. No obliga a trabajar por bloques de tiempo cerrados.

Suele funcionar mejor cuando:

- aparecen bloqueos tecnicos imprevistos
- las prioridades cambian con frecuencia
- el proyecto combina trabajo funcional, correccion de errores y tareas de integracion

## Por que Kanban encajaba mejor aqui

En DecideYa había una secuencia lógica de fases, pero no un camino totalmente lineal. A medida que el proyecto avanzaba surgieron ajustes en varios frentes:

- cambios en la forma de persistir los datos
- evolución de la capa de red del frontend
- adaptación del backend para producción
- problemas de despliegue y configuración en Vercel
- necesidad de revisar y actualizar la documentación

Ese tipo de trabajo encaja mejor con Kanban que con un sprint cerrado. Permitió priorizar lo que realmente bloqueaba el avance en cada momento y mover el foco con rapidez sin romper una planificación artificial.

## Aplicacion practica en el proyecto

El trabajo se organizo como un flujo de entregas pequenas:

1. Definición de la idea y del alcance funcional.
2. Construcción de la interfaz base.
3. Implementación del backend y de la API REST.
4. Integración entre frontend y backend.
5. Ajustes de persistencia y despliegue.
6. Revisión y cierre documental.

El resultado fue una forma de trabajo sencilla, pero muy util para mantener claridad tecnica sin perder flexibilidad.
