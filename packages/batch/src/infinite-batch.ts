import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import { Batch, BatchRequest, BatchResponse } from './types';
import { BatchNotSupportedError } from './errors';
import { consumeBatchResults } from './batch';
import { type BatchBuilder, createBatchBuilder } from './batch-builder';

export interface InfiniteBatch<CURSOR> {
  pushRequest(
    request: BatchRequest,
    options?: { cursor?: CURSOR; abortSignal?: AbortSignal },
  ): Promise<void>;
  findAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<Batch<InfiniteBatchMetadata<CURSOR>>[]>;
  consumeAvailableBatches(options?: { abortSignal?: AbortSignal }): Promise<
    {
      batch: Batch;
      consumeResponses: AsyncIterableIterator<BatchResponse>;
    }[]
  >;
  consumeAvailableResponses(options?: {
    abortSignal?: AbortSignal;
  }): AsyncIterableIterator<BatchResponse>;
}

export type InfiniteBatchMetadata<CURSOR> = {
  groupKey: string;
  cursor?: CURSOR;
};

export type InfiniteBatchStore<CURSOR> = {
  createBatch?(
    batch: Batch<InfiniteBatchMetadata<CURSOR>>,
    options?: { abortSignal?: AbortSignal },
  ): Promise<Batch<InfiniteBatchMetadata<CURSOR>>>;
  queryBatches(
    query: {
      groupKey: string;
    },
    options?: { abortSignal?: AbortSignal },
  ): Promise<Batch<InfiniteBatchMetadata<CURSOR>>[]>;
};

export type InfiniteBatchOptions<CURSOR> = {
  key: string;
  model: LanguageModelV2 | LanguageModelV3;
  store: InfiniteBatchStore<CURSOR>;
};

export function getInfiniteBatch<CURSOR>({
  key: groupKey,
  model,
  store,
}: InfiniteBatchOptions<CURSOR>): InfiniteBatch<CURSOR> {
  let batchBuilder: BatchBuilder | undefined;

  async function findAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<Batch<InfiniteBatchMetadata<CURSOR>>[]> {
    return await store.queryBatches(
      {
        groupKey,
      },
      options,
    );
  }

  async function consumeAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<
    {
      batch: Batch<InfiniteBatchMetadata<CURSOR>>;
      consumeResponses: AsyncIterableIterator<BatchResponse>;
    }[]
  > {
    const { doGetBatchResults } = model;

    if (!doGetBatchResults) {
      throw new BatchNotSupportedError({
        name: 'batch_not_supported',
        message: `Model '${model.modelId}' does not support batching`,
      });
    }

    const availableBatches = await findAvailableBatches(options);

    return availableBatches.map(batch => ({
      batch,
      consumeResponses: consumeBatchResults({
        model,
        id: batch.id,
        abortSignal: options?.abortSignal,
      }),
    }));
  }

  async function* consumeAvailableResponses(): AsyncIterableIterator<BatchResponse> {
    for (const { consumeResponses } of await consumeAvailableBatches()) {
      for await (const response of consumeResponses) {
        yield response;
      }
    }
  }

  return {
    async pushRequest(request, options) {
      if (!batchBuilder) {
        batchBuilder = createBatchBuilder({
          model,
          metadata: {
            groupKey,
          },
        });
      }

      batchBuilder.pushRequest(request);

      if (batchBuilder.isFull()) {
        const batch = await batchBuilder.submit({
          ...options,
          metadata: {
            cursor: options?.cursor,
          },
        });

        await store.createBatch?.(
          batch as Batch<InfiniteBatchMetadata<CURSOR>>,
          options,
        );

        batchBuilder = undefined;
      }
    },

    findAvailableBatches,
    consumeAvailableBatches,
    consumeAvailableResponses,
  };
}
