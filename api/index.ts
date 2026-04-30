import { createDecisionRepository } from '../server/src/repositories/createDecisionRepository';
import { DecisionService } from '../server/src/services/DecisionService';
import type {
  CreateDecisionDTO,
  UpdateDecisionDTO,
} from '../server/src/types';
import {
  validateCreateDecision,
  validateUpdateDecision,
} from '../server/src/validators/decisionValidator';

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

let cachedService: DecisionService | null = null;

const getService = () => {
  if (!cachedService) {
    cachedService = new DecisionService(createDecisionRepository());
  }
  return cachedService;
};

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

const sendJson = (response: ApiResponse, code: number, payload: unknown) =>
  response.status(code).json(payload);

const methodNotAllowed = (response: ApiResponse, allowed: string[]) => {
  response.setHeader('Allow', allowed.join(', '));
  return sendJson(response, 405, { error: 'Metodo no permitido' });
};

const handleCollection = async (request: ApiRequest, response: ApiResponse) => {
  const service = getService();

  if (request.method === 'GET') {
    const decisions = await service.getAll();
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

    const created = await service.create(payload);
    return sendJson(response, 201, created);
  }

  return methodNotAllowed(response, ['GET', 'POST']);
};

const handleItem = async (
  request: ApiRequest,
  response: ApiResponse,
  id: string,
) => {
  const service = getService();

  if (request.method === 'GET') {
    const decision = await service.getById(id);
    if (!decision) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
    return sendJson(response, 200, decision);
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

    const updated = await service.update(id, payload);
    if (!updated) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }

    return sendJson(response, 200, updated);
  }

  if (request.method === 'DELETE') {
    const removed = await service.remove(id);
    if (!removed) {
      return sendJson(response, 404, { error: 'Decision no encontrada' });
    }
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
