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

const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
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
