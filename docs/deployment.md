# Despliegue en Vercel

DecideYa no se despliega como un único proyecto monolítico dentro de Vercel. La arquitectura final separa claramente frontend y backend, y esa separación debe respetarse también en producción.

## Estructura de despliegue

Se necesitan dos proyectos de Vercel conectados al mismo repositorio:

- un proyecto frontend apuntando a la raiz del repositorio
- un proyecto backend apuntando al directorio `server`

Si solo se crea el proyecto de la raiz, la interfaz puede llegar a publicarse, pero la aplicacion no funcionara correctamente porque el frontend necesita una API activa para leer y guardar decisiones.

## Proyecto frontend

Configuración recomendada:

- **Root Directory**: raíz del repositorio
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

El enrutado de la SPA se resuelve con `vercel.json`, que reescribe las rutas al `index.html` generado por Vite.

## Proyecto backend

Configuración recomendada:

- **Root Directory**: `server`
- **Build Command**: `npm run build`

El backend esta preparado para exponer la API desde Express y para ser detectado por Vercel con una entrada valida en `server/index.ts`.

## Persistencia en cada entorno

En desarrollo local, el backend utiliza un archivo JSON:

```text
server/data/db.json
```

En producción, el backend debe usar `Vercel Blob`. La elección se controla con variables de entorno.

## Variables de entorno necesarias

### Frontend

```text
VITE_API_BASE_URL=https://<backend-project>.vercel.app/api
```

### Backend

```text
DECISIONS_STORAGE=blob
BLOB_READ_WRITE_TOKEN=<token de Vercel Blob>
```

## Flujo recomendado de despliegue

### 1. Desplegar primero el backend

Antes de publicar el frontend conviene validar que la API ya funciona.

Comprobaciones mínimas:

```text
GET https://<backend-project>.vercel.app/health
GET https://<backend-project>.vercel.app/api/decisions
```

Si estas dos rutas responden correctamente, el backend está operativo.

### 2. Configurar después el frontend

Una vez conocida la URL final del backend:

1. Se crea el proyecto frontend.
2. Se configura `VITE_API_BASE_URL`.
3. Se despliega la raíz del repositorio.

## Desarrollo local

El comando principal del proyecto es:

```bash
npm run dev
```

Ese script:

- comprueba si frontend y backend ya están activos
- compila el backend si es necesario
- levanta Vite en la raíz
- ejecuta el backend desde `server/dist/index.js`

URLs locales habituales:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`
- health: `http://localhost:3001/health`

## Problemas reales encontrados

Durante el despliegue aparecieron varios puntos sensibles:

### 1. El proyecto no era de una sola pieza

Uno de los errores mas faciles de cometer en Vercel es asumir que basta con desplegar la raiz del repositorio. En este caso no era asi: hacia falta separar cliente y servidor.

### 2. El backend necesitaba una entrada explicita

Para evitar ambiguedades en Vercel fue necesario asegurar una entrada valida en `server/index.ts`.

### 3. No se debian versionar artefactos generados

Se detecto que el repositorio habia llegado a contener `node_modules/` y `dist/`, algo especialmente problematica al desplegar desde Linux en Vercel. El repositorio se limpio y se dejo de versionar ese contenido.

### 4. La API base debia definirse en produccion

Aunque el frontend tiene un valor por defecto para desarrollo local, en produccion necesita apuntar de forma explicita al backend desplegado.

## Recomendaciones finales

- desplegar primero el backend y verificarlo
- desplegar despues el frontend con la variable `VITE_API_BASE_URL`
- no versionar `node_modules`, `dist` ni otros artefactos generados
- si Vercel mantiene un estado de build antiguo, relanzar el despliegue sin usar cache

## Archivos implicados

- `vercel.json`
- `package.json`
- `scripts/dev-all.mjs`
- `src/api/client.ts`
- `server/index.ts`
- `server/src/app.ts`
- `server/src/repositories/createDecisionRepository.ts`
- `server/src/repositories/FileDecisionRepository.ts`
- `server/src/repositories/BlobDecisionRepository.ts`
