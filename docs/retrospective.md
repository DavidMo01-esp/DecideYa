# Retrospectiva final del proyecto

## Una nota previa sobre la documentacion

La revision completa de la carpeta `docs/` deja una conclusion clara: la documentacion del proyecto ha sido util, pero tambien ha reflejado las distintas etapas por las que ha pasado DecideYa. Algunos documentos estaban muy bien alineados con el estado final del codigo, especialmente los relacionados con la API y el despliegue. Otros, en cambio, describian una version anterior de la aplicacion.

Eso no invalida el trabajo hecho, pero si deja una leccion importante: documentar no es solo escribir, sino mantener la coherencia entre lo que el proyecto fue, lo que es y lo que realmente se entrega.

## Que aprendi durante el desarrollo

El aprendizaje principal fue entender que un proyecto aparentemente sencillo cambia por completo cuando deja de ser solo una interfaz y pasa a ser un sistema conectado de verdad.

Al inicio, el problema parecia directo: crear una aplicacion para registrar decisiones y elegir una opcion. Sin embargo, en la practica aparecieron varias capas de complejidad:

- la estructura del frontend
- la definicion de una API estable
- la validacion de datos
- la persistencia
- la sincronizacion entre cliente y servidor
- el despliegue real en produccion

En ese recorrido aprendi que la parte visual es solo una fraccion del trabajo. La solidez del proyecto dependio mucho mas de que las capas se entendieran bien entre si.

## Como se conectaron frontend, backend y API

La arquitectura final se puede resumir de forma bastante limpia.

En el frontend, React y TypeScript se encargan de la experiencia de usuario. La interfaz no accede directamente al backend desde cada componente, sino que delega la comunicacion en una capa de red centralizada.

El flujo real es este:

1. El usuario interactua con la interfaz.
2. La pagina llama a una accion del contexto.
3. El contexto se apoya en `useDecisions()`.
4. `useDecisions()` usa el cliente API tipado.
5. El cliente API envía la peticion a Express.
6. El backend valida, procesa y devuelve una respuesta JSON.
7. El frontend actualiza el estado y vuelve a renderizar la UI.

Este esquema hizo posible separar responsabilidades con bastante claridad:

- los componentes renderizan
- el hook coordina el flujo de datos
- el cliente API encapsula HTTP
- el backend aplica reglas y persiste informacion

## Lo mas valioso del uso de TypeScript

TypeScript aporto valor sobre todo en la definicion del contrato de datos. No fue solo una ayuda cosmetica para el editor.

Los tipos obligaron a pensar con precision en detalles que facilmente podrian haberse dejado ambiguos:

- que una decision siempre tiene `selectedOption` aunque pueda ser `null`
- que crear y actualizar no tienen exactamente las mismas reglas
- que una respuesta `204` no trae cuerpo
- que los errores de validacion y los errores simples no comparten la misma forma

Ese trabajo de modelado redujo bastante el riesgo de incoherencias entre frontend y backend.

## Principales problemas encontrados

### 1. Integracion entre frontend y API

El mayor cambio de mentalidad fue abandonar una logica local de interfaz y pasar a depender de una API como fuente de verdad. Eso obligo a resolver cuestiones como:

- que URL usar en desarrollo y en produccion
- como distinguir entre error de red y error de validacion
- como refrescar el estado visible sin romper la experiencia del usuario
- como evitar que el frontend se desincronizara del backend

Tambien hubo que modelar con cuidado la diferencia entre una carga inicial y una actualizacion posterior, porque no se renderizan igual ni se perciben igual.

### 2. Tipos y validacion

Otro foco importante fue la coherencia del contrato:

- `selectedOption` debia ser opcional en la entrada, pero estable en la salida
- el backend debia validar la forma de los datos sin volver demasiado rigido el flujo
- el frontend tenia que traducir errores tecnicos en mensajes comprensibles

Esto hizo visible una idea que suele pasar desapercibida: los tipos buenos no se escriben solo para el compilador, sino para aclarar el comportamiento del sistema.

### 3. Desfase documental

Al revisar la documentacion aparecio otro problema real: no todos los archivos reflejaban la version final del proyecto.

Por ejemplo:

- la documentacion de rutas hablaba de paginas que ya no se usan como antes
- la documentacion de hooks se habia quedado por detras del store actual
- la documentacion de componentes seguia una API anterior
- `design.md` ni siquiera estaba completado

Esto me hizo ver que la deuda documental existe igual que la deuda tecnica.

### 4. Despliegue en Vercel

El despliegue fue probablemente el tramo con mas friccion tecnica. Los problemas mas relevantes fueron:

- entender que el proyecto necesitaba dos despliegues separados
- configurar correctamente la base URL del backend para el frontend
- adaptar la persistencia a `Vercel Blob`
- resolver errores de build causados por artefactos generados y dependencias versionadas

Fue una fase especialmente util porque obligo a mirar el proyecto no como codigo local, sino como software que tiene que ejecutarse en un entorno real.

## Como utilice IA durante el desarrollo

La IA se utilizo como herramienta de apoyo y aceleracion, no como sustituto del criterio tecnico.

Su utilidad fue especialmente clara en estas tareas:

- redactar borradores iniciales de documentacion
- contrastar opciones de implementacion
- revisar incoherencias entre capas
- localizar posibles causas de errores en Git o Vercel
- acelerar tareas mecanicas de analisis y reorganizacion

La experiencia tambien dejo una advertencia sana: la IA puede orientar muy bien, pero no sustituye la verificacion tecnica. Los errores de despliegue, de contrato o de configuracion solo se resolvieron de verdad cuando se reviso el codigo, se ejecutaron comandos y se comprobó el comportamiento real del sistema.

## Valor final del proyecto

Lo mas interesante de DecideYa no fue construir una aplicacion compleja, sino convertir una idea pequena en una solucion tecnicamente coherente.

El proyecto termino teniendo:

- una interfaz clara
- una API REST funcional
- una capa de red tipada
- persistencia diferenciada por entorno
- una estrategia de despliegue real

Eso lo convierte en un buen ejercicio de integracion completa, no solo de maquetacion o de consumo superficial de datos.

## Reflexion final

Si tuviera que resumir el aprendizaje general en una sola frase, seria esta: el proyecto maduro en el momento en que dejo de ser una interfaz que guarda datos y paso a comportarse como un sistema con reglas, contratos y estados bien definidos.

Tambien me llevo una idea de fondo que vale mas alla de este caso concreto: incluso un proyecto funcionalmente pequeno exige rigor cuando aparecen persistencia, validacion, red y produccion. Ese rigor no se nota siempre en una demo visual, pero es lo que realmente hace que una aplicacion resulte mantenible.

## Mejoras futuras

Todavia quedan varias lineas de mejora razonables:

- consolidar tipos compartidos entre frontend y backend
- anadir pruebas de integracion para la API y la capa de red
- completar una documentacion visual mas detallada
- seguir refinando la consistencia de toda la carpeta `docs/`
- valorar nuevas funcionalidades como historial, autenticacion o sincronizacion multiusuario
