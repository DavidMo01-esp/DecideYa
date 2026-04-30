# DecideYa!

Aplicacion web para crear decisiones, registrar opciones y elegir una alternativa manualmente o con ruleta.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- Persistencia local: JSON en `server/data/db.json`
- Persistencia en Vercel: Vercel Blob

## Desarrollo local

```bash
npm run dev
```

Ese comando levanta:

- frontend en `http://localhost:5173`
- backend en `http://localhost:3001`

## URLs de produccion

Las URLs reales no se pudieron generar desde este entorno porque el despliegue a Vercel quedo bloqueado por autenticacion/red del CLI. Dejo los campos preparados para completar en cuanto se ejecute el deploy:

- Frontend: `https://<frontend-project>.vercel.app`
- API: `https://<backend-project>.vercel.app`
- Base URL de API en frontend: `https://<backend-project>.vercel.app/api`

## Variables de entorno

### Frontend

- `VITE_API_BASE_URL`

### Backend

- `DECISIONS_STORAGE=blob`
- `BLOB_READ_WRITE_TOKEN`

## Despliegue

La guia paso a paso esta en [docs/deployment.md](docs/deployment.md).
