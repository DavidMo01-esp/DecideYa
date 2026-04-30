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

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
};

let cachedDecisionService: DecisionService | null = null;

const getDecisionService = () => {
  if (!cachedDecisionService) {
    cachedDecisionService = new DecisionService(createDecisionRepository());
  }

  return cachedDecisionService;
};

const jsonResponse = (
  body: unknown,
  status = 200,
  headers: HeadersInit = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  });

const noContentResponse = () => new Response(null, { status: 204 });

const methodNotAllowedResponse = (allowedMethods: string[]) =>
  jsonResponse(
    { error: 'Metodo no permitido' },
    405,
    { Allow: allowedMethods.join(', ') },
  );

const parseRouteSegments = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') ?? '';

  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const parseJsonBody = async <T>(request: Request) => {
  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return jsonResponse({ error: 'El cuerpo JSON no es valido' }, 400);
  }
};

const handleHealthRoute = (request: Request) => {
  if (request.method !== 'GET') {
    return methodNotAllowedResponse(['GET']);
  }

  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};

const handleCollectionRoute = async (request: Request) => {
  const service = getDecisionService();

  if (request.method === 'GET') {
    const decisions = await service.getAll();
    return jsonResponse(decisions);
  }

  if (request.method === 'POST') {
    const payload = await parseJsonBody<CreateDecisionDTO>(request);

    if (payload instanceof Response) {
      return payload;
    }

    const errors = validateCreateDecision(payload);

    if (errors.length > 0) {
      return jsonResponse({ errors }, 400);
    }

    const decision = await service.create(payload);
    return jsonResponse(decision, 201);
  }

  return methodNotAllowedResponse(['GET', 'POST']);
};

const handleItemRoute = async (request: Request, decisionId: string) => {
  const service = getDecisionService();

  if (request.method === 'GET') {
    const decision = await service.getById(decisionId);

    if (!decision) {
      return jsonResponse({ error: 'Decision no encontrada' }, 404);
    }

    return jsonResponse(decision);
  }

  if (request.method === 'PUT') {
    const payload = await parseJsonBody<UpdateDecisionDTO>(request);

    if (payload instanceof Response) {
      return payload;
    }

    const errors = validateUpdateDecision(payload);

    if (errors.length > 0) {
      return jsonResponse({ errors }, 400);
    }

    const decision = await service.update(decisionId, payload);

    if (!decision) {
      return jsonResponse({ error: 'Decision no encontrada' }, 404);
    }

    return jsonResponse(decision);
  }

  if (request.method === 'DELETE') {
    const deleted = await service.delete(decisionId);

    if (!deleted) {
      return jsonResponse({ error: 'Decision no encontrada' }, 404);
    }

    return noContentResponse();
  }

  return methodNotAllowedResponse(['GET', 'PUT', 'DELETE']);
};

const routeRequest = async (request: Request) => {
  const segments = parseRouteSegments(request);

  if (segments.length === 1 && segments[0] === 'health') {
    return handleHealthRoute(request);
  }

  if (segments.length === 1 && segments[0] === 'decisions') {
    return handleCollectionRoute(request);
  }

  if (segments.length === 2 && segments[0] === 'decisions') {
    return handleItemRoute(request, segments[1]);
  }

  return jsonResponse({ error: 'Ruta no encontrada' }, 404);
};

export default {
  async fetch(request: Request) {
    try {
      return await routeRequest(request);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';

      console.error('Error en la API de Vercel:', message);

      return jsonResponse({ error: 'Error interno del servidor' }, 500);
    }
  },
};
