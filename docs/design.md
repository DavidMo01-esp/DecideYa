# Diseño de la interfaz

El diseño de DecideYa busca un equilibrio entre claridad funcional y una presencia visual más expresiva que la de una aplicación utilitaria convencional. La interfaz no pretende parecer un panel administrativo neutro; quiere transmitir ligereza, rapidez y una cierta sensación de juego.

## Dirección visual

La aplicación se apoya en tres ideas principales:

- una base clara y luminosa
- tarjetas con efecto cristal suave
- acentos de color que diferencian estados y bloques de información

El resultado es una interfaz amable, con suficiente contraste para guiar la lectura y con una identidad propia sin volverse recargada.

## Paleta

La paleta se define en `src/index.css` mediante variables CSS.

Colores principales:

- `--paper`: fondo base cálido
- `--ink`: color principal del texto
- `--coral`: acento de acción y energía
- `--sky`: acento informativo
- `--gold`: acento de apoyo y métricas
- `--forest`: acento de selección o confirmación

Tambien existen variantes suaves (`*-soft`) para fondos, tarjetas y badges.

## Tipografía

La interfaz utiliza dos familias con papeles distintos:

- una sans serif para lectura general y elementos de interfaz
- una serif para titulares y piezas con mayor peso visual

Esa combinación permite dar personalidad a la aplicación sin comprometer la legibilidad.

## Fondo y atmósfera

El fondo no es plano. Combina:

- degradados muy suaves
- manchas radiales de color
- una cuadrícula casi imperceptible

Esto aporta profundidad visual sin competir con el contenido principal.

## Sistema de tarjetas

Buena parte de la interfaz se organiza en tarjetas. Hay varios estilos:

- `glass-card`
- `coral-card`
- `sky-card`
- `sun-card`
- `forest-card`

Cada variante comparte una misma lógica:

- borde sutil
- sombreado blando
- sensación de capa flotante

Ese sistema ayuda a separar bloques de información sin recurrir a divisores agresivos.

## Componentes visuales destacados

### Cabecera

La cabecera fija resume el estado global:

- número de decisiones
- número total de opciones
- estado de red

No es solo navegación; también funciona como panel de estado.

### Tarjetas de decisión

Las decisiones guardadas se muestran en tarjetas con jerarquía clara:

- título en primer plano
- metadatos compactos
- resumen de opciones
- acción rápida de apertura o borrado

### Ruleta

La ruleta es el elemento más distintivo de la app. Visualmente cumple dos funciones:

- introducir dinamismo
- convertir una acción de elección en una experiencia más memorable

Su construcción con gradiente cónico, puntero superior y animación de giro refuerza esa idea.

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
