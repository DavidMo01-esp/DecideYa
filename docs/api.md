# API de DecideYa!

Documentación de los endpoints REST del backend.

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Decisiones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/decisions` | Listar todas las decisiones |
| GET | `/decisions/:id` | Obtener una decisión por ID |
| POST | `/decisions` | Crear una nueva decisión |
| PUT | `/decisions/:id` | Actualizar una decisión |
| DELETE | `/decisions/:id` | Eliminar una decisión |

---

## GET /decisions

Listar todas las decisiones.

### Request

```bash
GET http://localhost:3001/api/decisions
```

### Response

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "¿Qué restaurante elegir?",
    "options": ["Italiano", "Mexicano", "Japonés"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "¿Qué película ver?",
    "options": ["Acción", "Comedia", "Drama"],
    "createdAt": "2024-01-14T15:20:00.000Z",
    "updatedAt": "2024-01-14T15:20:00.000Z"
  }
]
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Lista de decisiones |

---

## GET /decisions/:id

Obtener una decisión por su ID.

### Request

```bash
GET http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
```

### Response (200)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "¿Qué restaurante elegir?",
  "options": ["Italiano", "Mexicano", "Japonés"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Response (404)

```json
{
  "error": "Decisión no encontrada"
}
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Decisión encontrada |
| 404 | Not Found - La decisión no existe |

---

## POST /decisions

Crear una nueva decisión.

### Request

```bash
POST http://localhost:3001/api/decisions
Content-Type: application/json

{
  "title": "¿Qué restaurante elegir?",
  "options": ["Italiano", "Mexicano", "Japonés"]
}
```

### Response (201)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "¿Qué restaurante elegir?",
  "options": ["Italiano", "Mexicano", "Japonés"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Response (400) - Errores de Validación

```json
{
  "errors": [
    { "field": "title", "message": "El título es requerido" },
    { "field": "options", "message": "Se requieren al menos 2 opciones" }
  ]
}
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 201 | Created - Decisión creada |
| 400 | Bad Request - Datos inválidos |

### Reglas de Validación

| Campo | Requerido | Reglas |
|-------|-----------|--------|
| title | Sí | 3-100 caracteres |
| options | Sí | Array de 2-6 elementos, no vacíos |

---

## PUT /decisions/:id

Actualizar una decisión existente.

### Request

```bash
PUT http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "¿Qué restaurante ir hoy?"
}
```

### Response (200)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "¿Qué restaurante ir hoy?",
  "options": ["Italiano", "Mexicano", "Japonés"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### Response (400) - Errores de Validación

```json
{
  "errors": [
    { "field": "title", "message": "El título debe tener al menos 3 caracteres" }
  ]
}
```

### Response (404)

```json
{
  "error": "Decisión no encontrada"
}
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Decisión actualizada |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - La decisión no existe |

---

## DELETE /decisions/:id

Eliminar una decisión.

### Request

```bash
DELETE http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
```

### Response (204)

```
No content - Eliminación exitosa
```

### Response (404)

```json
{
  "error": "Decisión no encontrada"
}
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 204 | No Content - Decisión eliminada |
| 404 | Not Found - La decisión no existe |

---

## Health Check

### GET /health

Verificar que el servidor está funcionando.

### Request

```bash
GET http://localhost:3001/health
```

### Response (200)

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Códigos HTTP Resumen

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Iniciar el Servidor

```bash
cd server
npm install
npm run dev
```

El servidor correrá en `http://localhost:3001`