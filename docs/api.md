# API de DecideYa

Esta documentacion describe la API REST que utiliza el frontend para leer y modificar decisiones.

En desarrollo local la API corre con Express desde `server/src/`.
En Vercel la misma logica se expone mediante una funcion en `api/index.ts`.

## Base URL

En desarrollo local:

```text
http://localhost:3001/api
```

En produccion, cuando frontend y backend comparten despliegue:

```text
https://<tu-proyecto>.vercel.app/api
```

El endpoint de salud se expone fuera de `/api`:

```text
http://localhost:3001/health
https://<tu-proyecto>.vercel.app/health
```

## Recurso principal

La API trabaja con un unico recurso:

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

## Endpoints disponibles

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/decisions` | Lista todas las decisiones |
| GET | `/decisions/:id` | Devuelve una decision concreta |
| POST | `/decisions` | Crea una nueva decision |
| PUT | `/decisions/:id` | Actualiza una decision existente |
| DELETE | `/decisions/:id` | Elimina una decision |
| GET | `/health` | Comprueba que la API esta activa |

## Ejemplos rapidos

```bash
curl http://localhost:3001/api/decisions
curl http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
curl -X DELETE http://localhost:3001/api/decisions/550e8400-e29b-41d4-a716-446655440000
curl http://localhost:3001/health
```

## Codigos esperados

- `200 OK` para lecturas correctas
- `201 Created` para creaciones correctas
- `204 No Content` para eliminaciones correctas
- `400 Bad Request` para errores de validacion
- `404 Not Found` cuando no existe la decision
- `500 Internal Server Error` para fallos inesperados

## Persistencia

La API puede trabajar con dos estrategias:

- en local: archivo JSON en `server/data/db.json`
- en Vercel: `Vercel Blob`

Si el despliegue de Vercel no tiene `BLOB_READ_WRITE_TOKEN`, la API cae a memoria para evitar errores de arranque. En ese caso los datos no son persistentes.

La eleccion depende de las variables de entorno:

```text
DECISIONS_STORAGE=blob
BLOB_READ_WRITE_TOKEN=<token>
```
