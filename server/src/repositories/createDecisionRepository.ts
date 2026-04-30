import { BlobDecisionRepository } from './BlobDecisionRepository';
import type { DecisionRepository } from './DecisionRepository';
import { FileDecisionRepository } from './FileDecisionRepository';
import { MemoryDecisionRepository } from './MemoryDecisionRepository';

const resolveStorageDriver = () => {
  if (process.env.DECISIONS_STORAGE) {
    return process.env.DECISIONS_STORAGE;
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return 'blob';
  }

  return process.env.VERCEL === '1' ? 'memory' : 'file';
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

  if (storageDriver === 'memory') {
    console.warn(
      'Usando almacenamiento en memoria en Vercel. Configura BLOB_READ_WRITE_TOKEN para persistencia real.',
    );
    return new MemoryDecisionRepository();
  }

  return new FileDecisionRepository();
};
