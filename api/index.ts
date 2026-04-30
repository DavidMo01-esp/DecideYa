import { randomUUID } from 'crypto';

interface ApiRequest {
  method?: string;
  query?: { path?: string | string[] };
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  send(body?: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

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

let decisionsStore: Decision[] = [];

const getPathSegments = (request: ApiRequest) => {
  const raw = request.query?.path;
  const path = Array.isArray(raw) ? raw.join('/') : raw ?? '';
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const parseBody = <T>(body: unknown): T | { error: string } => {
  if (body === undefined || body === null || body === '') {
    return {} as T;
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return { error: 'El cuerpo JSON no es valido.' };
    }
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf-8')) as T;
    } catch {
      return { error: 'El cuerpo JSON no es valido.' };
    }
  }

  return body as T;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const validateOptions = (options: unknown): ValidationError[] => {
  if (!Array.isArray(options)) {
    return [{ field: 'options', message: 'Debe ser un arreglo de opciones.' }];
  }

  if (options.length < 2) {
    return [{ field: 'options', message: 'Debes enviar al menos 2 opciones.' }];
  }

  if (options.some((option) => !isNonEmptyString(option))) {
    return [
      {
        field: 'options',
        message: 'Todas las opciones deben ser texto no vacio.',
      },
    ];
  }

  return [];
};

const validateSelectedOption = (
  selectedOption: unknown,
  options: string[] | undefined,
): ValidationError[] => {
  if (selectedOption === undefined || selectedOption === null) {
    return [];
  }

  if (typeof selectedOption !== 'string') {
    return [
      {
        field: 'selectedOption',
        message: 'selectedOption debe ser string o null.',
      },
    ];
  }

  if (options && !options.includes(selectedOption)) {
    return [
      {
        field: 'selectedOption',
        message: 'selectedOption debe existir dentro de options.',
      },
    ];
  }

  return [];
};

const validateCreateDecision = (payload: CreateDecisionDTO): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(payload?.title)) {
    errors.push({ field: 'title', message: 'El titulo es obligatorio.' });
  }

  errors.push(...validateOptions(payload?.options));
  if (Array.isArray(payload?.options)) {
    errors.push(...validateSelectedOption(payload.selectedOption, payload.options));
  }

  return errors;
};

const validateUpdateDecision = (payload: UpdateDecisionDTO): ValidationError[] => {
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'body', message: 'Body invalido.' }];
  }

  const hasFields =
    payload.title !== undefined ||
    payload.options !== undefined ||
    payload.selectedOption !== undefined;

  if (!hasFields) {
    return [{ field: 'body', message: 'Debes enviar al menos un campo.' }];
  }

  const errors: ValidationError[] = [];

  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    errors.push({
      field: 'title',
      message: 'Si se envia title, debe ser texto no vacio.',
    });
  }

  if (payload.options !== undefined) {
    errors.push(...validateOptions(payload.options));
  }

  errors.push(...validateSelectedOption(payload.selectedOption, payload.options));

  return errors;
};

const sendJson = (response: ApiResponse, code: number, payload: unknown) =>
  response.status(code).json(payload);

const methodNotAllowed = (response: ApiResponse, allowed: string[]) => {
  response.setHeader('Allow', allowed.join(', '));
  return sendJson(response, 405, { error: 'Metodo no permitido' });
};

const handleCollection = async (request: ApiRequest, response: ApiResponse) => {
  if (request.method === 'GET') {
    return sendJson(response, 200, decisionsStore);
  }

  if (request.method === 'POST') {
    const payload = parseBody<CreateDecisionDTO>(request.body);
    if ('error' in payload) {
      return sendJson(response, 400, payload);
    }

    const errors = validateCreateDecision(payload);
    if (errors.length > 0) {
      return sendJson(response, 400, { errors });
    }

    const now = new Date().toISOString();
    const created: Decision = {
      id: randomUUID(),
      title: payload.title.trim(),
      options: payload.options.map((option) => option.trim()),
      selectedOption: payload.selectedOption ?? null,
      createdAt: now,
      updatedAt: now,
    };
    decisionsStore.push(created);
    return sendJson(response, 201, created);
  }

  return methodNotAllowed(response, ['GET', 'POST']);
};

const handleItem = async (
  request: ApiRequest,
  response: ApiResponse,
  id: string,
) => {
  const index = decisionsStore.findIndex((decision) => decision.id === id);

  if (request.method === 'GET') {
    if (index < 0) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
    return sendJson(response, 200, decisionsStore[index]);
  }

  if (request.method === 'PUT' || request.method === 'PATCH') {
    const payload = parseBody<UpdateDecisionDTO>(request.body);
    if ('error' in payload) {
      return sendJson(response, 400, payload);
    }

    const errors = validateUpdateDecision(payload);
    if (errors.length > 0) {
      return sendJson(response, 400, { errors });
    }

    if (index < 0) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }

    const current = decisionsStore[index];
    const nextOptions = payload.options ?? current.options;
    const selectedCandidate =
      payload.selectedOption === undefined
        ? current.selectedOption
        : payload.selectedOption;
    const nextSelectedOption =
      typeof selectedCandidate === 'string' && nextOptions.includes(selectedCandidate)
        ? selectedCandidate
        : null;

    const updated: Decision = {
      ...current,
      ...payload,
      options: nextOptions,
      selectedOption: nextSelectedOption,
      updatedAt: new Date().toISOString(),
    };
    decisionsStore[index] = updated;

    return sendJson(response, 200, updated);
  }

  if (request.method === 'DELETE') {
    if (index < 0) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
    decisionsStore = decisionsStore.filter((decision) => decision.id !== id);
    response.status(204);
    response.end();
    return;
  }

  return methodNotAllowed(response, ['GET', 'PUT', 'PATCH', 'DELETE']);
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    const segments = getPathSegments(request);

    if (segments.length === 1 && segments[0] === 'health') {
      if (request.method !== 'GET') {
        methodNotAllowed(response, ['GET']);
        return;
      }

      sendJson(response, 200, { status: 'ok', timestamp: new Date().toISOString() });
      return;
    }

    if (segments.length === 1 && segments[0] === 'decisions') {
      await handleCollection(request, response);
      return;
    }

    if (segments.length === 2 && segments[0] === 'decisions') {
      await handleItem(request, response, segments[1]);
      return;
    }

    sendJson(response, 404, { error: 'Ruta no encontrada' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Vercel API error:', message);
    sendJson(response, 500, { error: 'Error interno del servidor' });
  }
}
