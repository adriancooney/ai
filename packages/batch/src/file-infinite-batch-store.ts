import { dirname, join } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { InfiniteBatchMetadata, InfiniteBatchStore } from './infinite-batch';
import { Batch } from './types';
import { InfiniteBatchBuilderStore } from './infinite-batch-builder';

export type FileInfiniteBatchStoreState = {
  batches: Batch<InfiniteBatchMetadata<any>>[];
};

export function createFileInfiniteBatchStore(
  storeDir: string,
): InfiniteBatchStore<unknown> & {
  getState: () => Promise<FileInfiniteBatchStoreState>;
  setState: (state: FileInfiniteBatchStoreState) => Promise<void>;
} {
  const stateFilepath = join(storeDir, 'batches.json');

  async function getState(): Promise<FileInfiniteBatchStoreState> {
    try {
      const content = await readFile(stateFilepath, 'utf-8');

      return JSON.parse(content);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return { batches: [] };
      }

      throw error;
    }
  }

  async function setState(state: FileInfiniteBatchStoreState): Promise<void> {
    await mkdir(dirname(stateFilepath), { recursive: true });
    await writeFile(stateFilepath, JSON.stringify(state, null, 2), 'utf-8');
  }

  return {
    getState,
    setState,
    async createBatch(batch) {
      const state = await getState();

      await setState({
        batches: [...state.batches, batch],
      });

      return batch;
    },

    async queryBatches(query, options) {
      const { groupKey } = query;
      const state = await getState();

      return state.batches.filter(batch => {
        if (groupKey && batch.metadata.groupKey !== groupKey) {
          return false;
        }

        return true;
      });
    },
  };
}

export function createFileInfiniteBatchBuilderStore<CURSOR>(
  storeDir: string,
  options: {
    cursorComparator: (a: CURSOR, b: CURSOR) => number;
  },
): InfiniteBatchBuilderStore<any> {
  const fileInfiniteBatchStore = createFileInfiniteBatchStore(storeDir);

  return {
    ...fileInfiniteBatchStore,
    async getLatestBatch() {
      const { batches } = await fileInfiniteBatchStore.getState();
      const sortedBatches = batches.sort((batchA, batchB) =>
        options.cursorComparator(
          batchA.metadata.cursor,
          batchB.metadata.cursor,
        ),
      );

      return sortedBatches[sortedBatches.length - 1] || null;
    },
  };
}
