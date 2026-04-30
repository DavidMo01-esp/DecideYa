"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionController = void 0;
const decisionValidator_1 = require("../validators/decisionValidator");
class DecisionController {
    constructor(service) {
        this.service = service;
        this.getAll = async (_req, res) => {
            const decisions = await this.service.getAll();
            res.status(200).json(decisions);
        };
        this.getById = async (req, res) => {
            const { id } = req.params;
            const decision = await this.service.getById(id);
            if (!decision) {
                res.status(404).json({ error: 'Decision no encontrada' });
                return;
            }
            res.status(200).json(decision);
        };
        this.create = async (req, res) => {
            const errors = (0, decisionValidator_1.validateCreateDecision)(req.body);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }
            const decision = await this.service.create(req.body);
            res.status(201).json(decision);
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const errors = (0, decisionValidator_1.validateUpdateDecision)(req.body);
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
        this.delete = async (req, res) => {
            const { id } = req.params;
            const deleted = await this.service.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'Decision no encontrada' });
                return;
            }
            res.status(204).send();
        };
    }
}
exports.DecisionController = DecisionController;
