"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionService = void 0;
class DecisionService {
    constructor(repository) {
        this.repository = repository;
    }
    getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        return (await this.repository.findById(id)) || null;
    }
    create(data) {
        return this.repository.create({
            title: data.title,
            options: data.options,
            selectedOption: data.selectedOption ?? null,
        });
    }
    update(id, data) {
        return this.repository.update(id, data);
    }
    delete(id) {
        return this.repository.delete(id);
    }
}
exports.DecisionService = DecisionService;
