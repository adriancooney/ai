import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import {
  getInfiniteBatch,
  InfiniteBatch,
  InfiniteBatchMetadata,
  InfiniteBatchStore,
} from './infinite-batch';
import { Batch } from './types';

export interface InfiniteBatchBuilderStore<CURSOR>
  extends InfiniteBatchStore<CURSOR> {
  getLatestBatch(): Promise<Batch<InfiniteBatchMetadata<CURSOR>> | null>;
}

export interface InfiniteBatchBuilderOptions<CURSOR> {
  key: string;
  model: LanguageModelV2 | LanguageModelV3;
  store: InfiniteBatchBuilderStore<CURSOR>;
  findRequests(cursor?: CURSOR): AsyncIterableIterator<{
    id: string;
    request: unknown;
    cursor: CURSOR;
  }>;
}

export interface InfiniteBatchBuilder<CURSOR> extends InfiniteBatch<CURSOR> {
  buildRequests(options?: { abortSignal: AbortSignal }): Promise<void>;
}

export function createInfiniteBatchBuilder<CURSOR>({
  key,
  model,
  store,
  findRequests,
}: InfiniteBatchBuilderOptions<CURSOR>): InfiniteBatchBuilder<CURSOR> {
  const infiniteBatch = getInfiniteBatch({
    key,
    model,
    store,
  });

  return {
    ...infiniteBatch,

    async buildRequests() {
      const latestBatch = await store.getLatestBatch();

      for await (const { id, request, cursor } of findRequests(
        latestBatch?.metadata.cursor,
      )) {
        await infiniteBatch.pushRequest({ id, data: request }, { cursor });
      }
    },
  };
}
