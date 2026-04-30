# Capa de red del frontend

Este proyecto usa la API REST del backend como unica fuente de verdad para las decisiones. El frontend ya no persiste decisiones en `localStorage`: la UI lee y escribe siempre contra `http://localhost:3001/api` o el valor definido en `VITE_API_BASE_URL`.

## Estructura

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

## Cliente API tipado

Archivo: `src/api/client.ts`

Responsabilidades:

- Resolver la URL base de la API desde `VITE_API_BASE_URL` o el fallback local.
- Encapsular `fetch` en un helper `request<T>()`.
- Devolver respuestas tipadas por endpoint.
- Normalizar errores HTTP y de validacion en `ApiClientError`.

Endpoints expuestos:

```ts
apiClient.getDecisions(): Promise<Decision[]>
apiClient.getDecision(id: string): Promise<Decision>
apiClient.createDecision(data: CreateDecisionDTO): Promise<Decision>
apiClient.updateDecision(id: string, data: UpdateDecisionDTO): Promise<Decision>
apiClient.deleteDecision(id: string): Promise<void>
```

El cliente tambien exporta:

```ts
API_BASE_URL: string
getApiErrorMessage(error: unknown, fallbackMessage: string): string
```

## Contrato de tipos

Archivo: `src/types/api.ts`

Tipos alineados con `server/src/types/index.ts`:

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

interface ValidationError {
  field: string;
  message: string;
}
```

Tipos de error del frontend:

```ts
interface ApiErrorResponse {
  error: string;
}

interface ApiValidationErrorResponse {
  errors: ValidationError[];
}

class ApiClientError extends Error {
  statusCode: number;
  validationErrors: ValidationError[];
}
```

Estado de red compartido por la UI:

```ts
type NetworkState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

## Flujo en la UI

`useDecisions()` concentra la logica de red:

- carga inicial con `GET /decisions`
- creacion con `POST /decisions`
- borrado con `DELETE /decisions/:id`
- actualizacion de `selectedOption` con `PUT /decisions/:id`
- estado `loading | success | error` compartido

`DecisionContext` solo expone ese store a los componentes:

```ts
{
  decisions,
  networkState,
  addDecision,
  removeDecision,
  setSelectedOption,
  refresh
}
```

## Estados de red renderizados

La UI contempla los tres estados pedidos:

- `loading`: skeletons iniciales y pill global de sincronizacion.
- `success`: datos visibles desde `decisions`.
- `error`: mensaje legible y accion de `retry` con `refresh()`.

Pantallas principales:

- `src/pages/Decisions.tsx`
- `src/pages/DecisionDetail.tsx`
- `src/components/AppLayout.tsx`

## Fuente de verdad

Las decisiones viven en el backend y el frontend mantiene solo un cache en memoria derivado de respuestas de la API.

- No se usa `localStorage` para decisiones.
- No hay seed local en el cliente.
- Cada mutacion parte de la respuesta del backend.

## Desarrollo local

```bash
npm run dev
```

Ese comando levanta frontend y backend juntos. Si necesitas apuntar a otra API:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```
