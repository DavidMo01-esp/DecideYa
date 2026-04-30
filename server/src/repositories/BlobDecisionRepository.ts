import { randomUUID } from 'crypto';
import { get, put } from '@vercel/blob';
import type { Decision } from '../types';
import type { DecisionRepository } from './DecisionRepository';

const DECISIONS_BLOB_PATH = 'decisions/data.json';

const normalizeDecision = (decision: Partial<Decision>): Decision => ({
  id: String(decision.id ?? ''),
  title: String(decision.title ?? ''),
  options: Array.isArray(decision.options) ? decision.options : [],
  selectedOption:
    typeof decision.selectedOption === 'string' ? decision.selectedOption : null,
  createdAt: String(decision.createdAt ?? new Date().toISOString()),
  updatedAt: String(decision.updatedAt ?? new Date().toISOString()),
});

const parseDecisionList = async () => {
  const result = await get(DECISIONS_BLOB_PATH, { access: 'private' });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return [] as Decision[];
  }

  const text = await new Response(result.stream).text();

  if (!text.trim()) {
    return [] as Decision[];
  }

  const parsed = JSON.parse(text) as Partial<Decision>[];
  return parsed.map(normalizeDecision);
};

const saveDecisionList = async (decisions: Decision[]) => {
  await put(DECISIONS_BLOB_PATH, JSON.stringify(decisions, null, 2), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
  });
};

export class BlobDecisionRepository implements DecisionRepository {
  async findAll(): Promise<Decision[]> {
    return parseDecisionList();
  }

  async findById(id: string): Promise<Decision | undefined> {
    const decisions = await parseDecisionList();
    return decisions.find((decision) => decision.id === id);
  }

  async create(
    decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Decision> {
    const decisions = await parseDecisionList();
    const newDecision: Decision = {
      ...decision,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    decisions.push(newDecision);
    await saveDecisionList(decisions);

    return newDecision;
  }

  async update(
    id: string,
    data: Partial<Omit<Decision, 'id' | 'createdAt'>>,
  ): Promise<Decision | null> {
    const decisions = await parseDecisionList();
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
    await saveDecisionList(decisions);

    return updatedDecision;
  }

  async delete(id: string): Promise<boolean> {
    const decisions = await parseDecisionList();
    const filteredDecisions = decisions.filter((decision) => decision.id !== id);

    if (filteredDecisions.length === decisions.length) {
      return false;
    }

    await saveDecisionList(filteredDecisions);
    return true;
  }
}
