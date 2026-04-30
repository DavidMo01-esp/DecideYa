import {
  ApiClientError,
  type ApiErrorResponse,
  type ApiValidationErrorResponse,
  type CreateDecisionDTO,
  type Decision,
  type DecisionListResponse,
  type DecisionResponse,
  type UpdateDecisionDTO,
} from '../types/api';

const LOCAL_API_PORT = '3001';
const LOCAL_API_PROTOCOL = 'http:';

const isPrivateIpv4Hostname = (hostname: string) =>
  /^10\./.test(hostname) ||
  /^192\.168\./.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

const isLocalDevelopmentHostname = (hostname: string) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '[::1]' ||
  isPrivateIpv4Hostname(hostname);

const resolveDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return `${LOCAL_API_PROTOCOL}//localhost:${LOCAL_API_PORT}/api`;
  }

  const { hostname, origin } = window.location;

  if (isLocalDevelopmentHostname(hostname || 'localhost')) {
    return `${LOCAL_API_PROTOCOL}//${hostname}:${LOCAL_API_PORT}/api`;
  }

  return `${origin}/api`;
};

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? resolveDefaultApiBaseUrl()
).replace(/\/$/, '');

const isValidationErrorResponse = (
  value: unknown,
): value is ApiValidationErrorResponse =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as ApiValidationErrorResponse).errors);

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ApiErrorResponse).error === 'string';

const parseJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const buildApiError = (statusCode: number, payload: unknown) => {
  if (isValidationErrorResponse(payload)) {
    return new ApiClientError({
      message: payload.errors.map((error) => error.message).join(', '),
      statusCode,
      validationErrors: payload.errors,
    });
  }

  if (isApiErrorResponse(payload)) {
    return new ApiClientError({
      message: payload.error,
      statusCode,
    });
  }

  return new ApiClientError({
    message: `La API respondio con estado ${statusCode}.`,
    statusCode,
  });
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw buildApiError(response.status, payload);
  }

  return payload as T;
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: CreateDecisionDTO | UpdateDecisionDTO;
}

const buildNonJsonResponseError = (statusCode: number) => {
  const baseMessage = `La API en ${API_BASE_URL} no devolvio JSON.`;

  if (
    typeof window !== 'undefined' &&
    !import.meta.env.VITE_API_BASE_URL &&
    !isLocalDevelopmentHostname(window.location.hostname)
  ) {
    return new ApiClientError({
      message: `${baseMessage} En produccion configura VITE_API_BASE_URL con la URL del backend desplegado o crea un proxy /api hacia esa API.`,
      statusCode,
    });
  }

  return new ApiClientError({
    message: `${baseMessage} Revisa la URL configurada del backend.`,
    statusCode,
  });
};

const request = async <T>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...headers,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';

  if (response.status !== 204 && !contentType.includes('application/json')) {
    throw buildNonJsonResponseError(response.status);
  }

  return handleResponse<T>(response);
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof TypeError && /fetch/i.test(error.message)) {
    return `No se pudo conectar con la API en ${API_BASE_URL}. Verifica que el backend este activo.`;
  }

  return error instanceof Error ? error.message : fallbackMessage;
};

export const apiClient = {
  async getDecisions(): Promise<DecisionListResponse> {
    return request<DecisionListResponse>('/decisions');
  },

  async getDecision(id: string): Promise<DecisionResponse> {
    return request<DecisionResponse>(`/decisions/${id}`);
  },

  async createDecision(data: CreateDecisionDTO): Promise<DecisionResponse> {
    return request<DecisionResponse>('/decisions', {
      method: 'POST',
      body: data,
    });
  },

  async updateDecision(
    id: string,
    data: UpdateDecisionDTO,
  ): Promise<DecisionResponse> {
    return request<DecisionResponse>(`/decisions/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteDecision(id: string): Promise<void> {
    return request<void>(`/decisions/${id}`, {
      method: 'DELETE',
    });
  },
};

export type { CreateDecisionDTO, Decision, UpdateDecisionDTO } from '../types/api';
