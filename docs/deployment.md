# Despliegue en Vercel

DecideYa se despliega como un unico proyecto de Vercel.

La misma aplicacion publica:

- el frontend estatico generado por Vite
- la API bajo `/api`
- el endpoint de salud en `/health`

## Estructura de despliegue

El proyecto raiz contiene dos piezas:

- la SPA en `src/`
- la API de Vercel en `api/index.ts`

En produccion no hace falta un segundo proyecto para el backend. Vercel sirve ambos lados desde el mismo dominio.

## Configuracion recomendada del proyecto

- **Root Directory**: raiz del repositorio
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

El archivo `vercel.json` hace dos cosas:

- reescribe `/api/:path*` hacia la funcion interna `/api`
- reescribe `/health` hacia la misma funcion
- deja el resto de rutas de la SPA en `index.html`

## Persistencia en cada entorno

En desarrollo local, el backend usa:

```text
server/data/db.json
```

En Vercel, la API usa `Vercel Blob`.

La API separa datos por dispositivo usando el header `x-device-id`.
Ese valor lo genera y conserva el frontend en `localStorage`, para que cada navegador tenga su propio espacio de decisiones.

Si `BLOB_READ_WRITE_TOKEN` no existe, la API hace fallback a memoria para que el despliegue siga funcionando. Ese modo es util para demos, pero no garantiza persistencia entre reinicios.

## Variables de entorno necesarias

### Produccion en Vercel

```text
BLOB_READ_WRITE_TOKEN=<token de Vercel Blob>
```

`VITE_API_BASE_URL` no es obligatoria cuando frontend y backend viven en el mismo despliegue. El cliente usa por defecto `https://<tu-dominio>/api`.

Solo necesitas `VITE_API_BASE_URL` si quieres forzar un backend externo.

## Comprobaciones tras desplegar

Antes de dar el despliegue por bueno conviene validar:

```text
GET https://<tu-proyecto>.vercel.app/health
GET https://<tu-proyecto>.vercel.app/api/decisions
```

La primera debe devolver un JSON con `status: "ok"`.
La segunda debe devolver JSON, aunque sea una lista vacia.

Si cualquiera de las dos devuelve `index.html`, la configuracion de rewrites no esta entrando por la API.

## Desarrollo local

El comando principal del proyecto es:

```bash
npm run dev
```

Ese script:

- comprueba si frontend y backend ya estan activos
- compila el backend local si hace falta
- levanta Vite en la raiz
- ejecuta el backend desde `server/dist/index.js`

URLs locales habituales:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`
- health: `http://localhost:3001/health`

## Flujo de publicacion recomendado

1. Configurar `BLOB_READ_WRITE_TOKEN`.
2. Desplegar la raiz del repositorio.
3. Verificar `/health` y `/api/decisions`.
4. Confirmar que el mismo dispositivo mantiene datos tras cerrar y abrir navegador.

## Archivos implicados

- `vercel.json`
- `package.json`
- `api/index.ts`
- `src/api/client.ts`
- `server/src/app.ts`
- `server/src/repositories/FileDecisionRepository.ts`
