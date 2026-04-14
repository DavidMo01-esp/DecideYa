#NOMBRE DEL PROYECTO: DecideYa!#

DecideYa! es una herrramienta de apoyo a la toma de decisiones para personas indecisas. Permite crear ruletas o listas de opciones personalizadas y obtener una elección aleatoria de forma visual y rápida.

    - Problema a resolver: La parálisis por anñalisis en decisiones cotidianas triviales. El tiempo perdido dudando en pequeñas decisiones reduce la energía mental para tareas más importantes.


    1. Usuario objetivo:

        - Personas indecisas que pierden mucho tiempo tomando una decisión.

        - Grupo de amigos o parejas que necesitan decidir actividades de forma principal.

        - Estudiantes que necesitan decidir que tema repasar primero.

    2. Funcionalidades principales:

        - Gestión de listas: Crear, editar y eliminar conjunto de opciones.

        - Selector aleatorio: Botón para generar un resultado basado en opciones guardadas.

        - Persistencia centralizada: Almacenamiento y recuperación de listas a través de una API RESTful.

        - Cliente API tipado: Comunicación frontend-backend validada mediante interfaces TypeScript
    
    3. Funcionalidades opcionales:

        - Historial de decisiones: registro local de las últimas elecciones realizadas.

        - Modo ruleta: Animación CSS que simula el proceso de elección para mejorar la experiencia de usuario.

        - Exportación JSON: Descarga de listas para respaldo personal.

    4. Posibles mejoras futuras:

        - Sincronización multi-usuario: Uso de WebSockets para votaciones en tiempo real entre varios dispositivos.

        - Integración con APIs externas: Obtener opciones dinámicas (ej: Obtener una lista de películas de la API TMDB si el usuario no sabe que ver)

        - Autenticación: Implementación de login para permitir que cada usuario tenga sus propias listas privadas y pueda abrir su cuenta en cualquier dispositivo.

    5. Arquitectura técnica: 
    
        El proyecto sigue una arquitectura por capas en el backend para garantizasr la separación de responsabilidades: 

            - Controller Layer: Valida las peticiones HTTP y formatea las respuestas.

            - Service Layer: Contiene la lógica.

            - Repository Layer: Encargado de la persistecnia de datos en archivos JSON.
            
             

