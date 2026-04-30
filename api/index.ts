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
  query?: {
    path?: string | string[];
  };
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  send(body?: unknown): void;
  end(): void;
}

let cachedDecisionService: DecisionService | null = null;

const getDecisionService = () => {
  if (!cachedDecisionService) {
    cachedDecisionService = new DecisionService(createDecisionRepository());
  }

  return cachedDecisionService;
};

const jsonResponse = (response: ApiResponse, statusCode: number, body: unknown) =>
  response.status(statusCode).json(body);

const noContentResponse = (response: ApiResponse) => {
  response.status(204);
  response.end();
};

const methodNotAllowedResponse = (
  response: ApiResponse,
  allowedMethods: string[],
) => {
  response.setHeader('Allow', allowedMethods.join(', '));
  return jsonResponse(response, 405, { error: 'Metodo no permitido' });
};

const parseRouteSegments = (request: ApiRequest) => {
  const rawPath = request.query?.path;
  const normalizedPath = Array.isArray(rawPath)
    ? rawPath.join('/')
    : rawPath ?? '';

  return normalizedPath
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const parseJsonBody = <T>(body: unknown): T | { error: string } => {
  if (body === undefined || body === null || body === '') {
    return {} as T;
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return { error: 'El cuerpo JSON no es valido' };
    }
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf-8')) as T;
    } catch {
      return { error: 'El cuerpo JSON no es valido' };
    }
  }

  return body as T;
};

const handleHealthRoute = (request: ApiRequest, response: ApiResponse) => {
  if (request.method !== 'GET') {
    return methodNotAllowedResponse(response, ['GET']);
  }

  return jsonResponse(response, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};

const handleCollectionRoute = async (
  request: ApiRequest,
  response: ApiResponse,
) => {
  const service = getDecisionService();

  if (request.method === 'GET') {
    const decisions = await service.getAll();
    return jsonResponse(response, 200, decisions);
  }

  if (request.method === 'POST') {
    const payload = parseJsonBody<CreateDecisionDTO>(request.body);

    if ('error' in payload) {
      return jsonResponse(response, 400, payload);
    }

    const errors = validateCreateDecision(payload);

    if (errors.length > 0) {
      return jsonResponse(response, 400, { errors });
    }

    const decision = await service.create(payload);
    return jsonResponse(response, 201, decision);
  }

  return methodNotAllowedResponse(response, ['GET', 'POST']);
};

const handleItemRoute = async (
  request: ApiRequest,
  response: ApiResponse,
  decisionId: string,
) => {
  const service = getDecisionService();

  if (request.method === 'GET') {
    const decision = await service.getById(decisionId);

    if (!decision) {
      return jsonResponse(response, 404, { error: 'Decision no encontrada' });
    }

    return jsonResponse(response, 200, decision);
  }

  if (request.method === 'PUT') {
    const payload = parseJsonBody<UpdateDecisionDTO>(request.body);

    if ('error' in payload) {
      return jsonResponse(response, 400, payload);
    }

    const errors = validateUpdateDecision(payload);

    if (errors.length > 0) {
      return jsonResponse(response, 400, { errors });
    }

    const decision = await service.update(decisionId, payload);

    if (!decision) {
      return jsonResponse(response, 404, { error: 'Decision no encontrada' });
    }

    return jsonResponse(response, 200, decision);
  }

  if (request.method === 'DELETE') {
    const deleted = await service.delete(decisionId);

    if (!deleted) {
      return jsonResponse(response, 404, { error: 'Decision no encontrada' });
    }

    return noContentResponse(response);
  }

  return methodNotAllowedResponse(response, ['GET', 'PUT', 'DELETE']);
};

const routeRequest = async (request: ApiRequest, response: ApiResponse) => {
  const segments = parseRouteSegments(request);

  if (segments.length === 1 && segments[0] === 'health') {
    return handleHealthRoute(request, response);
  }

  if (segments.length === 1 && segments[0] === 'decisions') {
    return handleCollectionRoute(request, response);
  }

  if (segments.length === 2 && segments[0] === 'decisions') {
    return handleItemRoute(request, response, segments[1]);
  }

  return jsonResponse(response, 404, { error: 'Ruta no encontrada' });
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    await routeRequest(request, response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido';

    console.error('Error en la API de Vercel:', message);

    if (
      typeof message === 'string' &&
      message.includes('BLOB_READ_WRITE_TOKEN')
    ) {
      jsonResponse(response, 500, {
        error:
          'Falta BLOB_READ_WRITE_TOKEN en Vercel. Configuralo para guardar decisiones de forma persistente.',
      });
      return;
    }

    jsonResponse(response, 500, { error: 'Error interno del servidor' });
  }
}
