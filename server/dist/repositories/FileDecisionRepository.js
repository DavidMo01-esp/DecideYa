"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDecisionRepository = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.resolve(__dirname, '../../data/db.json');
const normalizeDecision = (decision) => ({
    id: String(decision.id ?? ''),
    title: String(decision.title ?? ''),
    options: Array.isArray(decision.options) ? decision.options : [],
    selectedOption: typeof decision.selectedOption === 'string' ? decision.selectedOption : null,
    createdAt: String(decision.createdAt ?? new Date().toISOString()),
    updatedAt: String(decision.updatedAt ?? new Date().toISOString()),
});
class FileDecisionRepository {
    async load() {
        try {
            const data = await (0, promises_1.readFile)(DB_PATH, 'utf-8');
            const parsed = JSON.parse(data);
            return parsed.map(normalizeDecision);
        }
        catch {
            return [];
        }
    }
    async save(decisions) {
        await (0, promises_1.writeFile)(DB_PATH, JSON.stringify(decisions, null, 2));
    }
    async findAll() {
        return this.load();
    }
    async findById(id) {
        const decisions = await this.load();
        return decisions.find((decision) => decision.id === id);
    }
    async create(decision) {
        const decisions = await this.load();
        const newDecision = {
            ...decision,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        decisions.push(newDecision);
        await this.save(decisions);
        return newDecision;
    }
    async update(id, data) {
        const decisions = await this.load();
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
        await this.save(decisions);
        return updatedDecision;
    }
    async delete(id) {
        const decisions = await this.load();
        const filteredDecisions = decisions.filter((decision) => decision.id !== id);
        if (filteredDecisions.length === decisions.length) {
            return false;
        }
        await this.save(filteredDecisions);
        return true;
    }
}
exports.FileDecisionRepository = FileDecisionRepository;
