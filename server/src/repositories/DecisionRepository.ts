import type { Decision } from '../types';

export interface DecisionRepository {
  findAll(): Promise<Decision[]>;
  findById(id: string): Promise<Decision | undefined>;
  create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision>;
  update(
    id: string,
    data: Partial<Omit<Decision, 'id' | 'createdAt'>>,
  ): Promise<Decision | null>;
  delete(id: string): Promise<boolean>;
}
