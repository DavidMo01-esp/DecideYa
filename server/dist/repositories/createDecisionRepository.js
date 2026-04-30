"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecisionRepository = void 0;
const BlobDecisionRepository_1 = require("./BlobDecisionRepository");
const FileDecisionRepository_1 = require("./FileDecisionRepository");
const resolveStorageDriver = () => {
    if (process.env.DECISIONS_STORAGE) {
        return process.env.DECISIONS_STORAGE;
    }
    return process.env.VERCEL === '1' ? 'blob' : 'file';
};
const createDecisionRepository = () => {
    const storageDriver = resolveStorageDriver();
    if (storageDriver === 'blob') {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('BLOB_READ_WRITE_TOKEN es obligatorio cuando DECISIONS_STORAGE=blob o en Vercel.');
        }
        return new BlobDecisionRepository_1.BlobDecisionRepository();
    }
    return new FileDecisionRepository_1.FileDecisionRepository();
};
exports.createDecisionRepository = createDecisionRepository;
