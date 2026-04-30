import { Router } from 'express';
import { DecisionController } from '../controllers/DecisionController';

export const createDecisionRoutes = (controller: DecisionController) => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};
