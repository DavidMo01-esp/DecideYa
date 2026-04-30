# Idea del proyecto

## Nombre

**DecideYa**

## Planteamiento general

DecideYa es una aplicacion pensada para ayudar a tomar decisiones pequenas de forma rapida. Parte de una situacion muy comun: muchas decisiones cotidianas no son complejas, pero aun asi consumen tiempo y energia mental.

La aplicacion propone una solucion simple:

- crear una decision
- registrar varias opciones
- elegir manualmente o dejar que la ruleta decida

## Problema que intenta resolver

El proyecto nace para reducir la llamada "paralisis por analisis" en decisiones triviales:

- que comer
- que hacer el fin de semana
- que tema estudiar primero
- que plan elegir entre varias alternativas

No pretende sustituir la reflexion en decisiones importantes. Su valor esta en agilizar elecciones pequenas, repetidas o compartidas entre varias personas.

## Usuarios a los que se dirige

El producto puede resultar util para distintos perfiles:

- personas indecisas en decisiones cotidianas
- parejas o grupos de amigos que necesitan resolver planes rapidamente
- estudiantes que quieren ordenar una sesion de estudio
- cualquier usuario que necesite una lista de opciones con una salida clara

## Funcionalidades principales

La version actual del proyecto se apoya en cuatro capacidades:

1. Crear decisiones con un titulo y varias opciones.
2. Consultar un listado de decisiones ya guardadas.
3. Abrir el detalle de una decision y marcar una opcion elegida.
4. Utilizar una ruleta visual para obtener una salida aleatoria.

## Valor del enfoque tecnico

Aunque la idea funcional es sencilla, el proyecto sirvio tambien para construir una arquitectura completa:

- frontend en React y TypeScript
- backend REST con Express
- validacion de datos
- persistencia local y en produccion
- despliegue separado de cliente y servidor

Eso convierte DecideYa en algo mas que una interfaz bonita: es una aplicacion completa, con flujo real de datos y con una separacion clara entre cliente, API y almacenamiento.

## Alcance y posibles mejoras

El proyecto actual cubre el nucleo funcional, pero deja abiertas varias lineas de crecimiento:

- historial de decisiones tomadas
- sincronizacion multiusuario
- autenticacion
- categorias o etiquetas
- importacion y exportacion de datos
- integracion con fuentes externas de opciones

## Resumen

La fuerza de DecideYa no esta en la complejidad del problema, sino en la claridad de la solucion. La aplicacion convierte una tarea pequena y frecuente en una experiencia mas directa, mas ordenada y, en cierto modo, mas agradable.
