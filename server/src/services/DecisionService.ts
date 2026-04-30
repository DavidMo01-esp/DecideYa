import type { CreateDecisionDTO, Decision, UpdateDecisionDTO } from '../types';
import type { DecisionRepository } from '../repositories/DecisionRepository';

export class DecisionService {
  constructor(private readonly repository: DecisionRepository) {}

  getAll(): Promise<Decision[]> {
    return this.repository.findAll();
  }

  getById(id: string): Promise<Decision | null> {
    return this.repository.findById(id);
  }

  create(payload: CreateDecisionDTO): Promise<Decision> {
    return this.repository.create({
      title: payload.title.trim(),
      options: payload.options.map((item) => item.trim()),
      selectedOption: payload.selectedOption ?? null,
    });
  }

  update(id: string, payload: UpdateDecisionDTO): Promise<Decision | null> {
    return this.repository.update(id, payload);
  }

  remove(id: string): Promise<boolean> {
    return this.repository.remove(id);
  }
}
