import { randomUUID } from 'crypto';
import type { Decision, UpdateDecisionDTO } from '../types';
import type { DecisionRepository } from './DecisionRepository';

let memoryStore: Decision[] = [];

export class MemoryDecisionRepository implements DecisionRepository {
  async findAll(): Promise<Decision[]> {
    return memoryStore;
  }

  async findById(id: string): Promise<Decision | null> {
    return memoryStore.find((item) => item.id === id) ?? null;
  }

  async create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision> {
    const now = new Date().toISOString();
    const created: Decision = {
      ...decision,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.push(created);
    return created;
  }

  async update(id: string, payload: UpdateDecisionDTO): Promise<Decision | null> {
    const index = memoryStore.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const current = memoryStore[index];
    const nextOptions = payload.options ?? current.options;
    const selectedCandidate =
      payload.selectedOption === undefined
        ? current.selectedOption
        : payload.selectedOption;
    const nextSelectedOption =
      typeof selectedCandidate === 'string' && nextOptions.includes(selectedCandidate)
        ? selectedCandidate
        : null;

    const updated: Decision = {
      ...current,
      ...payload,
      options: nextOptions,
      selectedOption: nextSelectedOption,
      updatedAt: new Date().toISOString(),
    };

    memoryStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const next = memoryStore.filter((item) => item.id !== id);
    if (next.length === memoryStore.length) {
      return false;
    }
    memoryStore = next;
    return true;
  }
}
