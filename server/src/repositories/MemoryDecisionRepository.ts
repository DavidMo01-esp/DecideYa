import type { Decision } from '../types';
import type { DecisionRepository } from './DecisionRepository';

const normalizeDecision = (decision: Partial<Decision>): Decision => ({
  id: String(decision.id ?? ''),
  title: String(decision.title ?? ''),
  options: Array.isArray(decision.options) ? decision.options : [],
  selectedOption:
    typeof decision.selectedOption === 'string' ? decision.selectedOption : null,
  createdAt: String(decision.createdAt ?? new Date().toISOString()),
  updatedAt: String(decision.updatedAt ?? new Date().toISOString()),
});

let decisionsStore: Decision[] = [];

export class MemoryDecisionRepository implements DecisionRepository {
  async findAll(): Promise<Decision[]> {
    return decisionsStore.map(normalizeDecision);
  }

  async findById(id: string): Promise<Decision | undefined> {
    return decisionsStore.find((decision) => decision.id === id);
  }

  async create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision> {
    const newDecision: Decision = {
      ...decision,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    decisionsStore.push(newDecision);
    return newDecision;
  }

  async update(
    id: string,
    data: Partial<Omit<Decision, 'id' | 'createdAt'>>,
  ): Promise<Decision | null> {
    const index = decisionsStore.findIndex((decision) => decision.id === id);

    if (index === -1) {
      return null;
    }

    const currentDecision = decisionsStore[index];
    const nextOptions = data.options ?? currentDecision.options;
    const nextSelectedOptionCandidate =
      data.selectedOption === undefined
        ? currentDecision.selectedOption
        : data.selectedOption;
    const nextSelectedOption =
      typeof nextSelectedOptionCandidate === 'string' &&
      nextOptions.includes(nextSelectedOptionCandidate)
        ? nextSelectedOptionCandidate
        : null;

    const updatedDecision: Decision = {
      ...currentDecision,
      ...data,
      options: nextOptions,
      selectedOption: nextSelectedOption,
      updatedAt: new Date().toISOString(),
    };

    decisionsStore[index] = updatedDecision;
    return updatedDecision;
  }

  async delete(id: string): Promise<boolean> {
    const filteredDecisions = decisionsStore.filter(
      (decision) => decision.id !== id,
    );

    if (filteredDecisions.length === decisionsStore.length) {
      return false;
    }

    decisionsStore = filteredDecisions;
    return true;
  }
}
