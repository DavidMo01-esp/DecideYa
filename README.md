# DecideYa!

Aplicacion web para crear decisiones, registrar opciones y elegir una alternativa manualmente o con ruleta.

## Stack

- Frontend: React + TypeScript + Vite
- API local: Express + TypeScript
- API en Vercel: Vercel Function en `api/index.ts`
- Persistencia local: JSON en `server/data/db.json`
- Persistencia en Vercel: Vercel Blob (aislada por dispositivo)

## Desarrollo local

```bash
npm run dev
```

Ese comando levanta:

- frontend en `http://localhost:5173`
- backend en `http://localhost:3001`

## Despliegue en Vercel

El proyecto esta preparado para un unico despliegue.

En produccion:

- el frontend se sirve desde la raiz del dominio
- la API responde en `/api`
- el healthcheck responde en `/health`

Variables necesarias en Vercel:

```text
BLOB_READ_WRITE_TOKEN=<token de Vercel Blob>
```

`VITE_API_BASE_URL` es opcional y solo hace falta si quieres apuntar a una API externa.

La API separa datos por dispositivo usando un `deviceId` que el cliente envia en el header `x-device-id`.
Ese identificador se guarda en `localStorage` para conservar el mismo espacio de datos en ese navegador.

Si no defines `BLOB_READ_WRITE_TOKEN`, la API usa almacenamiento en memoria para evitar errores `500`, pero las decisiones se perderan al reiniciar la funcion.

## Verificacion rapida

```text
GET https://<tu-proyecto>.vercel.app/health
GET https://<tu-proyecto>.vercel.app/api/decisions
```
