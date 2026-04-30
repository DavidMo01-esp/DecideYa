# Despliegue en Vercel

Esta app se despliega como dos proyectos de Vercel dentro del mismo repositorio:

- frontend: raiz del repo
- backend: directorio `server`

## Requisitos

- Cuenta de Vercel con acceso al repositorio
- Vercel Blob habilitado para el proyecto backend
- Vercel CLI opcional si quieres desplegar desde terminal

## Arquitectura de despliegue

### Frontend

- Proyecto Vercel apuntando a la raiz del repo
- Build command: `npm run build`
- Output directory: `dist`
- Routing SPA resuelto con `vercel.json`

### Backend

- Proyecto Vercel apuntando a `server`
- Entrada Express exportable en `server/src/app.ts`
- Persistencia en produccion con Vercel Blob
- API publica bajo:

```text
https://<backend-project>.vercel.app/api/decisions
https://<backend-project>.vercel.app/health
```

## Variables de entorno

### Backend

Configura estas variables en el proyecto `server`:

```text
DECISIONS_STORAGE=blob
BLOB_READ_WRITE_TOKEN=<token generado por Vercel Blob>
```

Notas:

- en local, si no defines `DECISIONS_STORAGE`, el backend usa `server/data/db.json`
- en Vercel, el backend esta preparado para fallar de forma explicita si falta `BLOB_READ_WRITE_TOKEN`

### Frontend

Configura esta variable en el proyecto frontend:

```text
VITE_API_BASE_URL=https://<backend-project>.vercel.app/api
```

## Paso a paso en el dashboard

### 1. Crear el proyecto backend

1. En Vercel, elige `Add New -> Project`.
2. Selecciona este repositorio.
3. Define `Root Directory` como `server`.
4. Crea o conecta un Blob Store.
5. Agrega:

```text
DECISIONS_STORAGE=blob
BLOB_READ_WRITE_TOKEN=<token>
```

6. Despliega.
7. Anota la URL final del backend.

### 2. Verificar el backend

Comprueba al menos:

```text
GET https://<backend-project>.vercel.app/health
GET https://<backend-project>.vercel.app/api/decisions
```

Si ambas responden, el backend esta operativo.

### 3. Crear el proyecto frontend

1. Crea otro proyecto en Vercel usando el mismo repositorio.
2. Deja `Root Directory` en la raiz del repo.
3. Configura:

```text
VITE_API_BASE_URL=https://<backend-project>.vercel.app/api
```

4. Despliega.

## Despliegue con CLI

### Backend

Desde `server`:

```bash
vercel
vercel --prod
```

### Frontend

Desde la raiz:

```bash
vercel
vercel --prod
```

Si el proyecto ya existe, Vercel reutiliza el enlace local tras el primer deploy.

## Verificacion en produccion

Una vez desplegados ambos proyectos:

1. Abre el frontend en produccion.
2. Crea una decision con al menos dos opciones.
3. Recarga la pagina.
4. Comprueba que la decision sigue existiendo.
5. Abre el detalle y cambia `selectedOption`.
6. Recarga y confirma que el cambio persiste.
7. Si quieres validar la API directamente, prueba:

```bash
curl https://<backend-project>.vercel.app/health
curl https://<backend-project>.vercel.app/api/decisions
```

## Archivos relevantes

- `vercel.json`
- `server/src/app.ts`
- `server/src/repositories/createDecisionRepository.ts`
- `server/src/repositories/FileDecisionRepository.ts`
- `server/src/repositories/BlobDecisionRepository.ts`
- `src/api/client.ts`

## Estado desde este entorno

El repositorio quedo preparado para despliegue, pero la publicacion real no se pudo completar aqui porque el CLI no pudo autenticarse/salir a red desde este entorno. Por eso las URLs de produccion quedaron documentadas como plantillas.
