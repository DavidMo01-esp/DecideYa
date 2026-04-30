import { BlobDecisionRepository } from './BlobDecisionRepository';
import type { DecisionRepository } from './DecisionRepository';
import { FileDecisionRepository } from './FileDecisionRepository';

const resolveStorageDriver = () => {
  if (process.env.DECISIONS_STORAGE) {
    return process.env.DECISIONS_STORAGE;
  }

  return process.env.VERCEL === '1' ? 'blob' : 'file';
};

export const createDecisionRepository = (): DecisionRepository => {
  const storageDriver = resolveStorageDriver();

  if (storageDriver === 'blob') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        'BLOB_READ_WRITE_TOKEN es obligatorio cuando DECISIONS_STORAGE=blob o en Vercel.',
      );
    }

    return new BlobDecisionRepository();
  }

  return new FileDecisionRepository();
};
