import { BatchModelV1 } from '@ai-sdk/provider';
import { Batch, BatchMetadata, BatchRequest, BatchResponse } from './types';
import { Output, ToolSet } from 'ai';

export async function createBatch<MODEL extends BatchModelV1>({
  model,
  metadata,
  requests,
  abortSignal,
}: {
  model: MODEL;
  metadata: BatchMetadata;
  requests: BatchRequest<MODEL>[];
  abortSignal?: AbortSignal;
}): Promise<Batch> {
  const batch = await model.doCreateBatch({
    metadata,
    requests,
    abortSignal,
  });

  return batch;
}

export async function* consumeBatchResults<
  MODEL extends BatchModelV1,
  TOOLS extends ToolSet,
  OUTPUT extends Output.Output,
>({
  model,
  id,
  abortSignal,
}: {
  id: string;
  model: BatchModelV1;
  abortSignal?: AbortSignal;
}): AsyncIterableIterator<BatchResponse<MODEL, TOOLS, OUTPUT>> {
  for await (const response of model.doGetBatchResultsById({
    id,
    abortSignal,
  })) {
    // TODO: Remove this typecast
    yield response as unknown as BatchResponse<MODEL, TOOLS, OUTPUT>;
  }

  await deleteBatchById({
    model,
    id,
    abortSignal,
  });
}

export async function deleteBatchById({
  model,
  id,
  abortSignal,
}: {
  model: BatchModelV1;
  id: string;
  abortSignal?: AbortSignal;
}): Promise<void> {
  await model.doDeleteBatchById({
    id,
    abortSignal,
  });
}
