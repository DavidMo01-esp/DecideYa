import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Decision } from '../types';
import type { DecisionRepository } from './DecisionRepository';

const resolveDbPath = () => {
  const directPath = path.resolve(process.cwd(), 'data', 'db.json');

  if (existsSync(directPath)) {
    return directPath;
  }

  return path.resolve(process.cwd(), 'server', 'data', 'db.json');
};

const DB_PATH = resolveDbPath();

const normalizeDecision = (decision: Partial<Decision>): Decision => ({
  id: String(decision.id ?? ''),
  title: String(decision.title ?? ''),
  options: Array.isArray(decision.options) ? decision.options : [],
  selectedOption:
    typeof decision.selectedOption === 'string' ? decision.selectedOption : null,
  createdAt: String(decision.createdAt ?? new Date().toISOString()),
  updatedAt: String(decision.updatedAt ?? new Date().toISOString()),
});

export class FileDecisionRepository implements DecisionRepository {
  private async load(): Promise<Decision[]> {
    try {
      const data = await readFile(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Partial<Decision>[];
      return parsed.map(normalizeDecision);
    } catch {
      return [];
    }
  }

  private async save(decisions: Decision[]): Promise<void> {
    await mkdir(path.dirname(DB_PATH), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(decisions, null, 2));
  }

  async findAll(): Promise<Decision[]> {
    return this.load();
  }

  async findById(id: string): Promise<Decision | undefined> {
    const decisions = await this.load();
    return decisions.find((decision) => decision.id === id);
  }

  async create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision> {
    const decisions = await this.load();
    const newDecision: Decision = {
      ...decision,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    decisions.push(newDecision);
    await this.save(decisions);

    return newDecision;
  }

  async update(
    id: string,
    data: Partial<Omit<Decision, 'id' | 'createdAt'>>,
  ): Promise<Decision | null> {
    const decisions = await this.load();
    const index = decisions.findIndex((decision) => decision.id === id);

    if (index === -1) {
      return null;
    }

    const currentDecision = decisions[index];
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

    decisions[index] = updatedDecision;
    await this.save(decisions);

    return updatedDecision;
  }

  async delete(id: string): Promise<boolean> {
    const decisions = await this.load();
    const filteredDecisions = decisions.filter((decision) => decision.id !== id);

    if (filteredDecisions.length === decisions.length) {
      return false;
    }

    await this.save(filteredDecisions);
    return true;
  }
}
