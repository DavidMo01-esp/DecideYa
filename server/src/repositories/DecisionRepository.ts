import type { Decision, UpdateDecisionDTO } from '../types';

export interface DecisionRepository {
  findAll(): Promise<Decision[]>;
  findById(id: string): Promise<Decision | null>;
  create(decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision>;
  update(id: string, payload: UpdateDecisionDTO): Promise<Decision | null>;
  remove(id: string): Promise<boolean>;
}
