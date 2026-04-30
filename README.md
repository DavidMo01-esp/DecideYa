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

### Frontend

- `VITE_API_BASE_URL`

### Backend

- `DECISIONS_STORAGE=blob`
- `BLOB_READ_WRITE_TOKEN`

