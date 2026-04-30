"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobDecisionRepository = void 0;
const blob_1 = require("@vercel/blob");
const DECISIONS_BLOB_PATH = 'decisions/data.json';
const normalizeDecision = (decision) => ({
    id: String(decision.id ?? ''),
    title: String(decision.title ?? ''),
    options: Array.isArray(decision.options) ? decision.options : [],
    selectedOption: typeof decision.selectedOption === 'string' ? decision.selectedOption : null,
    createdAt: String(decision.createdAt ?? new Date().toISOString()),
    updatedAt: String(decision.updatedAt ?? new Date().toISOString()),
});
const parseDecisionList = async () => {
    const result = await (0, blob_1.get)(DECISIONS_BLOB_PATH, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
        return [];
    }
    const text = await new Response(result.stream).text();
    if (!text.trim()) {
        return [];
    }
    const parsed = JSON.parse(text);
    return parsed.map(normalizeDecision);
};
const saveDecisionList = async (decisions) => {
    await (0, blob_1.put)(DECISIONS_BLOB_PATH, JSON.stringify(decisions, null, 2), {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
    });
};
class BlobDecisionRepository {
    async findAll() {
        return parseDecisionList();
    }
    async findById(id) {
        const decisions = await parseDecisionList();
        return decisions.find((decision) => decision.id === id);
    }
    async create(decision) {
        const decisions = await parseDecisionList();
        const newDecision = {
            ...decision,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        decisions.push(newDecision);
        await saveDecisionList(decisions);
        return newDecision;
    }
    async update(id, data) {
        const decisions = await parseDecisionList();
        const index = decisions.findIndex((decision) => decision.id === id);
        if (index === -1) {
            return null;
        }
        const currentDecision = decisions[index];
        const nextOptions = data.options ?? currentDecision.options;
        const nextSelectedOptionCandidate = data.selectedOption === undefined
            ? currentDecision.selectedOption
            : data.selectedOption;
        const nextSelectedOption = typeof nextSelectedOptionCandidate === 'string' &&
            nextOptions.includes(nextSelectedOptionCandidate)
            ? nextSelectedOptionCandidate
            : null;
        const updatedDecision = {
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
    async delete(id) {
        const decisions = await parseDecisionList();
        const filteredDecisions = decisions.filter((decision) => decision.id !== id);
        if (filteredDecisions.length === decisions.length) {
            return false;
        }
        await saveDecisionList(filteredDecisions);
        return true;
    }
}
exports.BlobDecisionRepository = BlobDecisionRepository;
