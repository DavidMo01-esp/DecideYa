"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const DecisionController_1 = require("./controllers/DecisionController");
const createDecisionRepository_1 = require("./repositories/createDecisionRepository");
const decisionRoutes_1 = require("./routes/decisionRoutes");
const DecisionService_1 = require("./services/DecisionService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const repository = (0, createDecisionRepository_1.createDecisionRepository)();
const service = new DecisionService_1.DecisionService(repository);
const controller = new DecisionController_1.DecisionController(service);
app.use('/api/decisions', (0, decisionRoutes_1.createDecisionRouter)(controller));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use((err, _req, res, _next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});
app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});
exports.default = app;
