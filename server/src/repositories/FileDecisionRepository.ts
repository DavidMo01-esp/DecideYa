import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Decision, UpdateDecisionDTO } from '../types';
import type { DecisionRepository } from './DecisionRepository';

const resolveDbPath = () => {
  const localPath = path.resolve(process.cwd(), 'data', 'db.json');
  if (existsSync(localPath)) {
    return localPath;
  }
  return path.resolve(process.cwd(), 'server', 'data', 'db.json');
};

const DB_PATH = resolveDbPath();

export class FileDecisionRepository implements DecisionRepository {
  private async load(): Promise<Decision[]> {
    try {
      const raw = await readFile(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Decision[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async save(items: Decision[]): Promise<void> {
    await mkdir(path.dirname(DB_PATH), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(items, null, 2), 'utf-8');
  }

  async findAll(): Promise<Decision[]> {
    return this.load();
  }

  async findById(id: string): Promise<Decision | null> {
    const items = await this.load();
    return items.find((item) => item.id === id) ?? null;
  }

  async create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision> {
    const items = await this.load();
    const now = new Date().toISOString();
    const created: Decision = {
      ...decision,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    items.push(created);
    await this.save(items);
    return created;
  }

  async update(id: string, payload: UpdateDecisionDTO): Promise<Decision | null> {
    const items = await this.load();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) {
      return null;
    }

    const current = items[index];
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
    items[index] = updated;
    await this.save(items);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.load();
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) {
      return false;
    }
    await this.save(next);
    return true;
  }
}
