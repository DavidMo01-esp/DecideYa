# Capa de red del frontend

La capa de red del frontend se diseno para que los componentes de React no dependan directamente de `fetch` ni de detalles HTTP.

## Objetivo

La capa de red resuelve cuatro necesidades:

- centralizar la URL base de la API
- encapsular las peticiones HTTP
- tipar respuestas y errores con TypeScript
- ofrecer una interfaz sencilla al resto de la aplicacion

## Estructura actual

```text
src/
  api/
    client.ts
  hooks/
    useDecisions.ts
  context/
    DecisionContext.tsx
  types/
    api.ts
```

## URL base y entornos

La URL base se resuelve asi:

- en local usa `http://localhost:3001/api`
- en red local usa `http://<ip-o-host-local>:3001/api`
- en produccion, si no se define nada, usa `https://<mismo-dominio>/api`
- si existe `VITE_API_BASE_URL`, ese valor tiene prioridad

Con esto el frontend puede funcionar:

- contra el backend local
- dentro de una LAN
- en un unico despliegue de Vercel
- o contra un backend externo si hace falta

## Cliente API tipado

`src/api/client.ts` expone una API pequena y predecible:

```ts
apiClient.getDecisions()
apiClient.getDecision(id)
apiClient.createDecision(data)
apiClient.updateDecision(id, data)
apiClient.deleteDecision(id)
```

El cliente:

- centraliza `fetch`
- convierte errores HTTP en `ApiClientError`
- detecta errores de conexion
- detecta cuando una URL de API devuelve HTML en lugar de JSON

Ese ultimo caso es importante en despliegue: si `/api` devuelve la SPA, el cliente muestra un error de configuracion mas claro.

## Flujo de uso

La secuencia real es esta:

1. El usuario interactua con la UI.
2. El componente invoca una accion del contexto.
3. El contexto delega en `useDecisions()`.
4. `useDecisions()` llama a `apiClient`.
5. La respuesta actualiza `decisions` y `networkState`.

## Estado de red compartido

```ts
type NetworkState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

Ese modelo permite:

- skeletons en carga inicial
- reintentos con `refresh()`
- mensajes coherentes cuando falla una peticion
- conservar datos visibles mientras se sincroniza
