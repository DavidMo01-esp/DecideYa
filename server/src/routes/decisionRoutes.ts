import { Router } from 'express';
import { DecisionController } from '../controllers/DecisionController';

export const createDecisionRouter = (controller: DecisionController): Router => {
  const router = Router();

  // GET /api/decisions - Listar todas las decisiones
  router.get('/', controller.getAll);

  // GET /api/decisions/:id - Obtener una decisión por ID
  router.get('/:id', controller.getById);

  // POST /api/decisions - Crear una nueva decisión
  router.post('/', controller.create);

  // PUT /api/decisions/:id - Actualizar una decisión
  router.put('/:id', controller.update);

  // DELETE /api/decisions/:id - Eliminar una decisión
  router.delete('/:id', controller.delete);

  return router;
};