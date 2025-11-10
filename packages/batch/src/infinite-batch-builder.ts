import { BatchModelV1 } from '@ai-sdk/provider';
import {
  getInfiniteBatch,
  InfiniteBatch,
  InfiniteBatchMetadata,
  InfiniteBatchStore,
} from './infinite-batch';
import { Batch, BatchRequest } from './types';
import { Output, ToolSet } from 'ai';

export interface InfiniteBatchBuilderStore<CURSOR>
  extends InfiniteBatchStore<CURSOR> {
  getLatestBatch(): Promise<Batch<InfiniteBatchMetadata<CURSOR>> | null>;
}

export interface InfiniteBatchBuilderOptions<
  CURSOR,
  MODEL extends BatchModelV1,
> {
  key: string;
  model: MODEL;
  store: InfiniteBatchBuilderStore<CURSOR>;
  findRequests(cursor?: CURSOR): AsyncIterableIterator<
    {
      cursor: CURSOR;
    } & BatchRequest<MODEL>
  >;
}

export interface InfiniteBatchBuilder<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> extends InfiniteBatch<CURSOR, MODEL, TOOLS, OUTPUT> {
  buildRequests(options?: { abortSignal: AbortSignal }): Promise<void>;
}

export function createInfiniteBatchBuilder<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
>({
  key,
  model,
  store,
  findRequests,
}: InfiniteBatchBuilderOptions<CURSOR, MODEL>): InfiniteBatchBuilder<
  CURSOR,
  MODEL,
  TOOLS,
  OUTPUT
> {
  const infiniteBatch = getInfiniteBatch<CURSOR, MODEL, TOOLS, OUTPUT>({
    key,
    model,
    store,
  });

  return {
    ...infiniteBatch,

    async buildRequests() {
      const latestBatch = await store.getLatestBatch();

      for await (const { cursor, ...request } of findRequests(
        latestBatch?.metadata.cursor,
      )) {
        // TODO: Remove this case
        const castedRequest = request as unknown as BatchRequest<MODEL>;

        await infiniteBatch.pushRequest(castedRequest, { cursor });
      }
    },
  };
}
