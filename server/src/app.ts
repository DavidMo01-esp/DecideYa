import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { DecisionController } from './controllers/DecisionController';
import { createDecisionRepository } from './repositories/createDecisionRepository';
import { createDecisionRouter } from './routes/decisionRoutes';
import { DecisionService } from './services/DecisionService';

const app = express();

app.use(cors());
app.use(express.json());

const repository = createDecisionRepository();
const service = new DecisionService(repository);
const controller = new DecisionController(service);

app.use('/api/decisions', createDecisionRouter(controller));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;
