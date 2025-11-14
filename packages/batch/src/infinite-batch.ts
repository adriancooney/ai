import { BatchModelV1 } from '@ai-sdk/provider';
import { Batch, BatchBufferer, BatchRequest, BatchResponse } from './types';
import { consumeBatchResults } from './batch';
import { ToolSet, Output } from 'ai';
import { createProviderInfiniteBatchStore } from './provider-infinite-batch-store';
import { createMemoryBatchBufferer } from './bufferers/memory-batch-bufferer';

export interface InfiniteBatch<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> {
  getBufferedRequests(): Promise<BatchRequest<MODEL>[]>;
  clearBufferedRequests(): Promise<void>;
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
  bufferer?: BatchBufferer;
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
  bufferer: inputBufferer,
}: InfiniteBatchOptions<CURSOR, MODEL>): InfiniteBatch<
  CURSOR,
  MODEL,
  TOOLS,
  OUTPUT
> {
  const store = inputStore || createProviderInfiniteBatchStore<CURSOR>(model);
  const bufferer = inputBufferer || createMemoryBatchBufferer();

  async function findAvailableBatches(options?: {
    abortSignal?: AbortSignal;
  }): Promise<Batch<InfiniteBatchMetadata<CURSOR>>[]> {
    const batches = await store.queryBatches(
      {
        groupKey,
      },
      options,
    );

    console.log({ batches });

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

    console.log({ batchesToConsume });

    for (const { consumeResponses } of batchesToConsume) {
      for await (const response of consumeResponses) {
        yield response;
      }
    }
  }

  return {
    async getBufferedRequests() {
      return await bufferer.getRequests(model, groupKey);
    },

    async clearBufferedRequests() {
      return await bufferer.clearRequests(model, groupKey);
    },

    async pushRequest(request, options) {
      await bufferer.pushRequest(
        model,
        groupKey,
        { groupKey },
        request,
        options,
      );
    },

    consumeAvailableResponses,
  };
}
