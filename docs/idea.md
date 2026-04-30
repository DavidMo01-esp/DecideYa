# Idea del proyecto

## Nombre

**DecideYa**

## Planteamiento general

DecideYa es una aplicación pensada para ayudar a tomar decisiones pequeñas de forma rápida. Parte de una situación muy común: muchas decisiones cotidianas no son complejas, pero aún así consumen tiempo y energía mental.

La aplicacion propone una solucion simple:

- crear una decisión
- registrar varias opciones
- elegir manualmente o dejar que la ruleta decida

## Problema que intenta resolver

El proyecto nace para reducir la llamada "parálisis por análisis" en decisiones triviales:

- qué comer
- qué hacer el fin de semana
- qué tema estudiar primero
- qué plan elegir entre varias alternativas

No pretende sustituir la reflexion en decisiones importantes. Su valor esta en agilizar elecciones pequenas, repetidas o compartidas entre varias personas.

## Usuarios a los que se dirige

El producto puede resultar útil para distintos perfiles:

- personas indeciosas en decisiones cotidianas
- parejas o grupos de amigos que necesitan resolver planes rápidamente
- estudiantes que quieren ordenar una sesión de estudio
- cualquier usuario que necesite una lista de opciones con una salida clara

## Funcionalidades principales

La versión actual del proyecto se apoya en cuatro capacidades:

1. Crear decisiones con un título y varias opciones.
2. Consultar un listado de decisiones ya guardadas.
3. Abrir el detalle de una decisión y marcar una opción elegida.
4. Utilizar una ruleta visual para obtener una salida aleatoria.

## Valor del enfoque técnico

Aunque la idea funcional es sencilla, el proyecto sirvió también para construir una arquitectura completa:

- frontend en React y TypeScript
- backend REST con Express
- validación de datos
- persistencia local y en producción
- despliegue separado de cliente y servidor

Eso convierte DecideYa en algo mas que una interfaz bonita: es una aplicacion completa, con flujo real de datos y con una separacion clara entre cliente, API y almacenamiento.

## Alcance y posibles mejoras

El proyecto actual cubre el núcleo funcional, pero deja abiertas varias líneas de crecimiento:

- historial de decisiones tomadas
- sincronización multiusuario
- autenticación
- categorías o etiquetas
- importación y exportación de datos
- integración con fuentes externas de opciones

## Resumen

La fuerza de DecideYa no está en la complejidad del problema, sino en la claridad de la solución. La aplicación convierte una tarea pequeña y frecuente en una experiencia más directa, más ordenada y, en cierto modo, más agradable.
