import { Decision, CreateDecisionDTO, UpdateDecisionDTO } from '../types';
import type { DecisionRepository } from '../repositories/DecisionRepository';

export class DecisionService {
  constructor(private repository: DecisionRepository) {}

  getAll(): Promise<Decision[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Decision | null> {
    return (await this.repository.findById(id)) || null;
  }

  create(data: CreateDecisionDTO): Promise<Decision> {
    return this.repository.create({
      title: data.title,
      options: data.options,
      selectedOption: data.selectedOption ?? null,
    });
  }

  update(id: string, data: UpdateDecisionDTO): Promise<Decision | null> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
