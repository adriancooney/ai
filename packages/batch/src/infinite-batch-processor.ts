import {
  createInfiniteBatchBuilder,
  InfiniteBatchBuilder,
  InfiniteBatchBuilderOptions,
} from './infinite-batch-builder';

export interface InfiniteBatchProcessorOptions<CURSOR>
  extends InfiniteBatchBuilderOptions<CURSOR> {
  consumeResponse(response: { id: string; data: unknown }): Promise<void>;
}

export interface InfiniteBatchProcessor<CURSOR>
  extends InfiniteBatchBuilder<CURSOR> {
  processResponses(): Promise<void>;
}

export function createInfiniteBatchProcessor<CURSOR>({
  key,
  model,
  store,
  findRequests,
  consumeResponse,
}: InfiniteBatchProcessorOptions<CURSOR>): InfiniteBatchProcessor<CURSOR> {
  const builder = createInfiniteBatchBuilder({
    key,
    model,
    store,
    findRequests,
  });

  return {
    ...builder,
    async processResponses() {
      for await (const response of builder.consumeAvailableResponses()) {
        await consumeResponse(response);
      }
    },
  };
}
