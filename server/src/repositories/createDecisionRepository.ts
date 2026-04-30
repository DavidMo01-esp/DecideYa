import { BlobDecisionRepository } from './BlobDecisionRepository';
import type { DecisionRepository } from './DecisionRepository';
import { FileDecisionRepository } from './FileDecisionRepository';
import { MemoryDecisionRepository } from './MemoryDecisionRepository';

const resolveStorageDriver = () => {
  if (process.env.DECISIONS_STORAGE) {
    return process.env.DECISIONS_STORAGE.trim().toLowerCase();
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
      console.warn(
        'DECISIONS_STORAGE=blob pero falta BLOB_READ_WRITE_TOKEN. Se usara memoria para evitar errores 500.',
      );
      return new MemoryDecisionRepository();
    }

    return new BlobDecisionRepository();
  }

  if (storageDriver === 'memory') {
    console.warn(
      'Usando almacenamiento en memoria en Vercel. Configura BLOB_READ_WRITE_TOKEN para persistencia real.',
    );
    return new MemoryDecisionRepository();
  }

  if (storageDriver === 'file') {
    return new FileDecisionRepository();
  }

  if (storageDriver !== 'file') {
    console.warn(
      `DECISIONS_STORAGE=${storageDriver} no es valido. Usa "blob", "memory" o "file".`,
    );
  }

  return process.env.VERCEL === '1'
    ? new MemoryDecisionRepository()
    : new FileDecisionRepository();
};
