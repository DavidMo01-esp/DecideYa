# API de DecideYa

Esta documentacion describe la API REST que utiliza el frontend para leer y modificar decisiones. La API esta implementada en Express y sigue una estructura sencilla: rutas, controlador, servicio y repositorio.

## Base URL

En desarrollo local:

```text
http://localhost:3001/api
```

En produccion, la base URL depende del proyecto backend desplegado en Vercel:

```text
https://<backend-project>.vercel.app/api
```

El endpoint de salud se expone fuera de `/api`:

```text
http://localhost:3001/health
https://<backend-project>.vercel.app/health
```

## Recurso principal: Decisión

La API trabaja con un único recurso funcional:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Que hacemos este fin de semana",
  "options": ["Cine", "Senderismo", "Cena fuera"],
  "selectedOption": "Cine",
  "createdAt": "2026-04-30T08:15:00.000Z",
  "updatedAt": "2026-04-30T08:20:00.000Z"
}
```

### Campos

- `id`: identificador único
- `title`: título de la decisión
- `options`: lista de opciones disponibles
- `selectedOption`: opción elegida manualmente o `null`
- `createdAt`: fecha de creacion en formato ISO
- `updatedAt`: fecha de ultima actualizacion en formato ISO

## Endpoints disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/decisions` | Lista todas las decisiones |
| GET | `/decisions/:id` | Devuelve una decisión concreta |
| POST | `/decisions` | Crea una nueva decisión |
| PUT | `/decisions/:id` | Actualiza una decisión existente |
| DELETE | `/decisions/:id` | Elimina una decisión |
| GET | `/health` | Comprueba que el backend esta activo |

## GET /decisions

Devuelve la colección completa de decisiones.

### Ejemplo de peticion

```bash
curl http://localhost:3001/api/decisions
```

### Respuesta correcta

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Qué hacemos este fin de semana",
    "options": ["Cine", "Senderismo", "Cena fuera"],
    "selectedOption": null,
    "createdAt": "2026-04-30T08:15:00.000Z",
    "updatedAt": "2026-04-30T08:15:00.000Z"
  }
]
```

### Codigo esperado

- `200 OK`

## GET /decisions/:id

Devuelve una única decisión a partir de su identificador.

### Ejemplo de peticion

```bash
curl http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
```

### Respuesta correcta

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Que hacemos este fin de semana",
  "options": ["Cine", "Senderismo", "Cena fuera"],
  "selectedOption": null,
  "createdAt": "2026-04-30T08:15:00.000Z",
  "updatedAt": "2026-04-30T08:15:00.000Z"
}
```

### Error posible

```json
{
  "error": "Decision no encontrada"
}
```

### Codigos esperados

- `200 OK`
- `404 Not Found`

## POST /decisions

Crea una nueva decision.

### Cuerpo esperado

```json
{
  "title": "Que cenamos hoy",
  "options": ["Pizza", "Pasta", "Ensalada"],
  "selectedOption": "Pizza"
}
```

`selectedOption` es opcional. Si no se envia, el backend almacena `null`.

### Respuesta correcta

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Que cenamos hoy",
  "options": ["Pizza", "Pasta", "Ensalada"],
  "selectedOption": "Pizza",
  "createdAt": "2026-04-30T09:00:00.000Z",
  "updatedAt": "2026-04-30T09:00:00.000Z"
}
```

### Error de validacion

```json
{
  "errors": [
    { "field": "title", "message": "El titulo es requerido" },
    { "field": "options", "message": "Se requieren al menos 2 opciones" }
  ]
}
```

### Codigos esperados

- `201 Created`
- `400 Bad Request`

## PUT /decisions/:id

Actualiza uno o varios campos de una decision existente.

### Cuerpo de ejemplo

```json
{
  "selectedOption": "Senderismo"
}
```

Tambien se puede actualizar el titulo, la lista de opciones o varias propiedades a la vez.

### Respuesta correcta

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Que hacemos este fin de semana",
  "options": ["Cine", "Senderismo", "Cena fuera"],
  "selectedOption": "Senderismo",
  "createdAt": "2026-04-30T08:15:00.000Z",
  "updatedAt": "2026-04-30T09:10:00.000Z"
}
```

### Errores posibles

```json
{
  "errors": [
    { "field": "body", "message": "Debe proporcionar al menos un campo para actualizar" }
  ]
}
```

```json
{
  "error": "Decision no encontrada"
}
```

### Nota de comportamiento

Si se actualiza la lista de opciones y la opcion elegida deja de existir en el resultado final, el backend guarda `selectedOption` como `null`. Esto evita que la decision quede en un estado incoherente.

### Codigos esperados

- `200 OK`
- `400 Bad Request`
- `404 Not Found`

## DELETE /decisions/:id

Elimina una decision existente.

### Ejemplo de peticion

```bash
curl -X DELETE http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
```

### Respuesta correcta

No devuelve cuerpo.

### Codigos esperados

- `204 No Content`
- `404 Not Found`

## GET /health

Sirve para comprobar que el backend esta funcionando.

### Respuesta correcta

```json
{
  "status": "ok",
  "timestamp": "2026-04-30T09:15:00.000Z"
}
```

### Codigo esperado

- `200 OK`

## Reglas de validacion

La API valida los datos antes de delegar en el servicio:

### En creacion

- `title` es obligatorio
- `title` debe tener entre 3 y 100 caracteres
- `options` es obligatorio
- `options` debe contener entre 2 y 6 elementos
- cada opcion debe ser una cadena no vacia
- `selectedOption`, si se envia, debe ser `null` o una cadena incluida en `options`

### En actualizacion

- debe enviarse al menos un campo
- `title`, si aparece, debe cumplir las mismas reglas que en creacion
- `options`, si aparece, debe seguir teniendo entre 2 y 6 elementos validos
- `selectedOption`, si aparece, debe ser `null` o una cadena

## Persistencia

La API puede trabajar con dos estrategias de almacenamiento:

- en local: archivo JSON en `server/data/db.json`
- en Vercel: `Vercel Blob`

La eleccion depende de las variables de entorno del backend.
