import type { NextFunction, Request, Response } from 'express';
import { DecisionService } from '../services/DecisionService';
import {
  validateCreateDecision,
  validateUpdateDecision,
} from '../validators/decisionValidator';

export class DecisionController {
  constructor(private readonly service: DecisionService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const decisions = await this.service.getAll();
      res.status(200).json(decisions);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decision = await this.service.getById(req.params.id);
      if (!decision) {
        res.status(404).json({ error: 'Decision no encontrada' });
        return;
      }
      res.status(200).json(decision);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validateCreateDecision(req.body);
      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const decision = await this.service.create(req.body);
      res.status(201).json(decision);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validateUpdateDecision(req.body);
      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const decision = await this.service.update(req.params.id, req.body);
      if (!decision) {
        res.status(404).json({ error: 'Decision no encontrada' });
        return;
      }

      res.status(200).json(decision);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const removed = await this.service.remove(req.params.id);
      if (!removed) {
        res.status(404).json({ error: 'Decision no encontrada' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
