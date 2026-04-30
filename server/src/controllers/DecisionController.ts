import { Request, Response } from 'express';
import { DecisionService } from '../services/DecisionService';
import {
  validateCreateDecision,
  validateUpdateDecision,
} from '../validators/decisionValidator';

export class DecisionController {
  constructor(private service: DecisionService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const decisions = await this.service.getAll();
    res.status(200).json(decisions);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const decision = await this.service.getById(id);

    if (!decision) {
      res.status(404).json({ error: 'Decision no encontrada' });
      return;
    }

    res.status(200).json(decision);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const errors = validateCreateDecision(req.body);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const decision = await this.service.create(req.body);
    res.status(201).json(decision);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const errors = validateUpdateDecision(req.body);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const decision = await this.service.update(id, req.body);

    if (!decision) {
      res.status(404).json({ error: 'Decision no encontrada' });
      return;
    }

    res.status(200).json(decision);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await this.service.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Decision no encontrada' });
      return;
    }

    res.status(204).send();
  };
}
