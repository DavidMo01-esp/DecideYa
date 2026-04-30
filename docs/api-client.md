# Capa de red del frontend

La capa de red del frontend se diseno para que los componentes de React no dependan directamente de `fetch` ni de detalles HTTP. La idea central fue clara desde el inicio: la interfaz debia consumir la API como unica fuente de verdad y tratar la comunicacion con el backend como una responsabilidad separada.

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

Cada una de estas piezas cumple una funcion concreta:

- `client.ts` conoce HTTP y la forma de las respuestas.
- `useDecisions.ts` orquesta la carga y las mutaciones.
- `DecisionContext.tsx` comparte el estado con toda la UI.
- `src/types/api.ts` define el contrato que consume el cliente.

## URL base y entornos

La URL base de la API se resuelve asi:

- en local, el valor por defecto es `http://localhost:3001/api`
- en otros entornos, se puede sobreescribir con `VITE_API_BASE_URL`

Esto permite mantener el mismo frontend apuntando a un backend local, a un backend desplegado en Vercel o a cualquier otro entorno de pruebas.

## Cliente API tipado

`src/api/client.ts` expone una API pequena y predecible:

```ts
apiClient.getDecisions()
apiClient.getDecision(id)
apiClient.createDecision(data)
apiClient.updateDecision(id, data)
apiClient.deleteDecision(id)
```

Detras de esas funciones hay una serie de decisiones tecnicas importantes:

- un helper `request<T>()` evita repetir configuracion de `fetch`
- `handleResponse()` resuelve casos especiales como `204 No Content`
- `parseJson()` evita fallos cuando la respuesta no trae cuerpo
- los errores HTTP se transforman en una instancia de `ApiClientError`

Con este enfoque, los componentes no necesitan saber si el error fue un `400`, un `404` o un problema de conexion: reciben un mensaje coherente y pueden reaccionar de forma uniforme.

## Contrato de tipos

Los tipos principales son:

```ts
interface Decision {
  id: string;
  title: string;
  options: string[];
  selectedOption: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateDecisionDTO {
  title: string;
  options: string[];
  selectedOption?: string | null;
}

interface UpdateDecisionDTO {
  title?: string;
  options?: string[];
  selectedOption?: string | null;
}
```

Tambien se tipan los errores:

```ts
interface ApiErrorResponse {
  error: string;
}

interface ApiValidationErrorResponse {
  errors: ValidationError[];
}
```

Esto fue importante porque el backend no devuelve siempre la misma forma de error:

- para validacion devuelve `errors[]`
- para errores simples devuelve `error`

El cliente abstrae esa diferencia y la convierte en un unico modelo de error para la UI.

## Flujo de uso en la interfaz

Los componentes no llaman directamente al cliente API. La secuencia real es esta:

1. El usuario interactua con la UI.
2. El componente invoca una accion del contexto.
3. El contexto delega en `useDecisions()`.
4. `useDecisions()` llama a `apiClient`.
5. La respuesta del backend actualiza `decisions` y `networkState`.

Este flujo deja bien separadas las responsabilidades:

- los componentes renderizan
- el hook coordina
- el cliente API comunica

## Estado de red compartido

La UI trabaja con un estado compartido de red:

```ts
type NetworkState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

Ese modelo se refleja en varias pantallas:

- carga inicial con skeletons
- actualizacion de datos visibles sin perder el contenido
- mensajes claros cuando falla una peticion
- accion de reintento mediante `refresh()`

## Decisiones de arquitectura

La capa de red no se limito a "hacer peticiones". Tambien definio una forma de pensar el frontend:

- la fuente de verdad esta en el backend
- el cliente solo mantiene un estado temporal en memoria
- cada mutacion se apoya en la respuesta real del servidor

Esa decision redujo bastante la complejidad de la interfaz y evito inconsistencias entre datos locales y datos persistidos.
