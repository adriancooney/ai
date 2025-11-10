import { BatchModelV1 } from '@ai-sdk/provider';
import {
  createInfiniteBatchBuilder,
  InfiniteBatchBuilder,
  InfiniteBatchBuilderOptions,
} from './infinite-batch-builder';
import { Output, ToolSet } from 'ai';
import { BatchResponse } from './types';

export interface InfiniteBatchProcessorOptions<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> extends InfiniteBatchBuilderOptions<CURSOR, MODEL> {
  consumeResponse(response: BatchResponse<MODEL, TOOLS, OUTPUT>): Promise<void>;
}

export interface InfiniteBatchProcessor<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
> extends InfiniteBatchBuilder<CURSOR, MODEL, TOOLS, OUTPUT> {
  processResponses(): Promise<void>;
}

export function createInfiniteBatchProcessor<
  CURSOR,
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
>({
  key,
  model,
  store,
  findRequests,
  consumeResponse,
}: InfiniteBatchProcessorOptions<
  CURSOR,
  MODEL,
  TOOLS,
  OUTPUT
>): InfiniteBatchProcessor<CURSOR, MODEL, TOOLS, OUTPUT> {
  const builder = createInfiniteBatchBuilder<CURSOR, MODEL, TOOLS, OUTPUT>({
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
