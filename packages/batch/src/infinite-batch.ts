import { BatchModelV1 } from '@ai-sdk/provider';
import { Batch, BatchRequest, BatchResponse } from './types';
import { consumeBatchResults } from './batch';
import { type BatchBuilder, createBatchBuilder } from './batch-builder';
import { ToolSet, Output } from 'ai';
import { createProviderInfiniteBatchStore } from './provider-infinite-batch-store';

export interface InfiniteBatch<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> {
  pushRequest(
    request: BatchRequest<MODEL>,
    options?: { cursor?: CURSOR; abortSignal?: AbortSignal },
  ): Promise<void>;
  consumeAvailableResponses(options?: {
    abortSignal?: AbortSignal;
  }): AsyncIterableIterator<BatchResponse<MODEL, TOOLS, OUTPUT>>;
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

export type InfiniteBatchOptions<CURSOR, MODEL extends BatchModelV1> = {
  key: string;
  model: MODEL;
  store?: InfiniteBatchStore<CURSOR>;
};

export function getInfiniteBatch<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
>({
  key: groupKey,
  model,
  store: inputStore,
}: InfiniteBatchOptions<CURSOR, MODEL>): InfiniteBatch<
  CURSOR,
  MODEL,
  TOOLS,
  OUTPUT
> {
  const store = inputStore || createProviderInfiniteBatchStore<CURSOR>(model);
  let batchBuilder: BatchBuilder<MODEL> | undefined;

  async function findAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<Batch<InfiniteBatchMetadata<CURSOR>>[]> {
    const batches = await store.queryBatches(
      {
        groupKey,
      },
      options,
    );

    return batches;
  }

  async function consumeAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<
    {
      batch: Batch<InfiniteBatchMetadata<CURSOR>>;
      consumeResponses: AsyncIterableIterator<
        BatchResponse<MODEL, TOOLS, OUTPUT>
      >;
    }[]
  > {
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

  async function* consumeAvailableResponses(): AsyncIterableIterator<
    BatchResponse<MODEL, TOOLS, OUTPUT>
  > {
    const batchesToConsume = await consumeAvailableBatches();

    for (const { consumeResponses } of batchesToConsume) {
      for await (const response of consumeResponses) {
        yield response;
      }
    }
  }

  return {
    async pushRequest(request, options) {
      if (batchBuilder && !batchBuilder.accepts(request)) {
        const batch = await batchBuilder.submit({
          ...options,
          metadata: {
            cursor: options?.cursor,
          },
        });

        if (store.createBatch) {
          await store.createBatch(
            batch as Batch<InfiniteBatchMetadata<CURSOR>>,
            options,
          );
        }

        batchBuilder = undefined;
      }

      if (!batchBuilder) {
        batchBuilder = createBatchBuilder({
          model,
          metadata: {
            groupKey,
          },
        });
      }

      batchBuilder.pushRequest(request);
    },

    consumeAvailableResponses,
  };
}
