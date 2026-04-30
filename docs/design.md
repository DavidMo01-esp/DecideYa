# Diseño de la interfaz

El diseño de DecideYa busca un equilibrio entre claridad funcional y una presencia visual mas expresiva que la de una aplicacion utilitaria convencional. La interfaz no pretende parecer un panel administrativo neutro; quiere transmitir ligereza, rapidez y una cierta sensacion de juego.

## Direccion visual

La aplicacion se apoya en tres ideas principales:

- una base clara y luminosa
- tarjetas con efecto cristal suave
- acentos de color que diferencian estados y bloques de informacion

El resultado es una interfaz amable, con suficiente contraste para guiar la lectura y con una identidad propia sin volverse recargada.

## Paleta

La paleta se define en `src/index.css` mediante variables CSS.

Colores principales:

- `--paper`: fondo base calido
- `--ink`: color principal del texto
- `--coral`: acento de accion y energia
- `--sky`: acento informativo
- `--gold`: acento de apoyo y metricas
- `--forest`: acento de seleccion o confirmacion

Tambien existen variantes suaves (`*-soft`) para fondos, tarjetas y badges.

## Tipografia

La interfaz utiliza dos familias con papeles distintos:

- una sans serif para lectura general y elementos de interfaz
- una serif para titulares y piezas con mayor peso visual

Esa combinacion permite dar personalidad a la aplicacion sin comprometer la legibilidad.

## Fondo y atmosfera

El fondo no es plano. Combina:

- degradados muy suaves
- manchas radiales de color
- una cuadricula casi imperceptible

Esto aporta profundidad visual sin competir con el contenido principal.

## Sistema de tarjetas

Buena parte de la interfaz se organiza en tarjetas. Hay varios estilos:

- `glass-card`
- `coral-card`
- `sky-card`
- `sun-card`
- `forest-card`

Cada variante comparte una misma logica:

- borde sutil
- sombreado blando
- sensacion de capa flotante

Ese sistema ayuda a separar bloques de informacion sin recurrir a divisores agresivos.

## Componentes visuales destacados

### Cabecera

La cabecera fija resume el estado global:

- numero de decisiones
- numero total de opciones
- estado de red

No es solo navegacion; tambien funciona como panel de estado.

### Tarjetas de decision

Las decisiones guardadas se muestran en tarjetas con jerarquia clara:

- titulo en primer plano
- metadatos compactos
- resumen de opciones
- accion rapida de apertura o borrado

### Ruleta

La ruleta es el elemento mas distintivo de la app. Visualmente cumple dos funciones:

- introducir dinamismo
- convertir una accion de eleccion en una experiencia mas memorable

Su construccion con gradiente conico, puntero superior y animacion de giro refuerza esa idea.

## Movimiento

La app utiliza animaciones moderadas:

- `fade-in-up` para entrada de bloques
- pequenos desplazamientos en hover
- animacion de giro en la ruleta

La intencion no es impresionar, sino mejorar la sensacion de respuesta y continuidad.

## Accesibilidad y claridad

Aunque el diseno tiene una intencion visual marcada, se intento mantener una base funcional:

- botones con estados deshabilitados visibles
- etiquetas claras en formularios
- mensajes de error legibles
- contraste suficiente entre fondo y texto
- estructura visual coherente entre pagina principal y detalle

## Conclusion

El diseno de DecideYa no gira alrededor de la decoracion, sino de una idea concreta: hacer que una tarea cotidiana y pequena, como elegir entre varias opciones, resulte clara, agradable y un poco mas viva.
