import { randomUUID } from 'crypto';
import { get, put } from '@vercel/blob';

interface ApiRequest {
  method?: string;
  query?: { path?: string | string[] };
  headers?: Record<string, string | string[] | undefined>;
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
const DECISIONS_BLOB_PATH = 'decisions/data.json';
const DEVICE_ID_HEADER = 'x-device-id';

interface DecisionsStorePayload {
  byDevice: Record<string, Decision[]>;
}

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

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const normalizeDeviceId = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim().toLowerCase();
  }
  return 'anonymous-device';
};

const getDeviceId = (request: ApiRequest): string => {
  const headerValue = request.headers?.[DEVICE_ID_HEADER];
  if (Array.isArray(headerValue)) {
    return normalizeDeviceId(headerValue[0]);
  }
  return normalizeDeviceId(headerValue);
};

const parseStorePayload = (raw: unknown): DecisionsStorePayload => {
  if (Array.isArray(raw)) {
    return {
      byDevice: {
        'anonymous-device': raw as Decision[],
      },
    };
  }

  if (
    typeof raw === 'object' &&
    raw !== null &&
    'byDevice' in raw &&
    typeof (raw as { byDevice?: unknown }).byDevice === 'object' &&
    (raw as { byDevice?: unknown }).byDevice !== null
  ) {
    return raw as DecisionsStorePayload;
  }

  return { byDevice: {} };
};

const loadStore = async (): Promise<DecisionsStorePayload> => {
  if (!hasBlobToken()) {
    return {
      byDevice: {
        'anonymous-device': decisionsStore,
      },
    };
  }

  try {
    const blob = await get(DECISIONS_BLOB_PATH, { access: 'private' });
    if (!blob?.stream || blob.statusCode !== 200) {
      return { byDevice: {} };
    }

    const text = await new Response(blob.stream).text();
    if (!text.trim()) {
      return { byDevice: {} };
    }

    const parsed = JSON.parse(text) as unknown;
    return parseStorePayload(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/not found/i.test(message)) {
      return { byDevice: {} };
    }
    throw error;
  }
};

const saveStore = async (store: DecisionsStorePayload): Promise<void> => {
  decisionsStore = store.byDevice['anonymous-device'] ?? [];

  if (!hasBlobToken()) {
    return;
  }

  await put(DECISIONS_BLOB_PATH, JSON.stringify(store, null, 2), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
  });
};

const getDeviceDecisions = (
  store: DecisionsStorePayload,
  deviceId: string,
): Decision[] => store.byDevice[deviceId] ?? [];

const setDeviceDecisions = (
  store: DecisionsStorePayload,
  deviceId: string,
  decisions: Decision[],
) => {
  store.byDevice[deviceId] = decisions;
};

const handleCollection = async (request: ApiRequest, response: ApiResponse) => {
  const deviceId = getDeviceId(request);

  if (request.method === 'GET') {
    const store = await loadStore();
    const decisions = getDeviceDecisions(store, deviceId);
    return sendJson(response, 200, decisions);
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
    const store = await loadStore();
    const decisions = getDeviceDecisions(store, deviceId);
    decisions.push(created);
    setDeviceDecisions(store, deviceId, decisions);
    await saveStore(store);
    return sendJson(response, 201, created);
  }

  return methodNotAllowed(response, ['GET', 'POST']);
};

const handleItem = async (
  request: ApiRequest,
  response: ApiResponse,
  id: string,
) => {
  const deviceId = getDeviceId(request);
  const store = await loadStore();
  const decisions = getDeviceDecisions(store, deviceId);
  const index = decisions.findIndex((decision) => decision.id === id);

  if (request.method === 'GET') {
    if (index < 0) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
    return sendJson(response, 200, decisions[index]);
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

    const current = decisions[index];
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
    decisions[index] = updated;
    setDeviceDecisions(store, deviceId, decisions);
    await saveStore(store);

    return sendJson(response, 200, updated);
  }

  if (request.method === 'DELETE') {
    if (index < 0) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
    const next = decisions.filter((decision) => decision.id !== id);
    setDeviceDecisions(store, deviceId, next);
    await saveStore(store);
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
