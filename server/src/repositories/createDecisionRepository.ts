import type { DecisionRepository } from './DecisionRepository';
import { FileDecisionRepository } from './FileDecisionRepository';
import { MemoryDecisionRepository } from './MemoryDecisionRepository';

const normalizeStorage = () =>
  (process.env.DECISIONS_STORAGE ?? '').trim().toLowerCase();

export const createDecisionRepository = (): DecisionRepository => {
  const storage = normalizeStorage();

  if (storage === 'memory') {
    return new MemoryDecisionRepository();
  }

  if (storage === 'file') {
    return new FileDecisionRepository();
  }

  return process.env.VERCEL === '1'
    ? new MemoryDecisionRepository()
    : new FileDecisionRepository();
};
