import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import { Batch, BatchMetadata, BatchRequest } from './types';
import { BatchNotSupportedError } from './errors';

export async function createBatch({
  model,
  metadata,
  requests,
  abortSignal,
}: {
  model: LanguageModelV2 | LanguageModelV3;
  metadata: BatchMetadata;
  requests: BatchRequest[];
  abortSignal?: AbortSignal;
}): Promise<Batch> {
  if (!model.doCreateBatch) {
    throw new Error(
      `Cannot create batch: model '${model.modelId}' does not support batching`,
    );
  }

  const { batchId: providerBatchId } = await model.doCreateBatch({
    metadata,
    requests,
    abortSignal,
  });

  return {
    id: providerBatchId,
    metadata,
    status: 'pending',
  };
}

export async function* consumeBatchResults({
  model,
  id,
  abortSignal,
}: {
  id: string;
  model: LanguageModelV2 | LanguageModelV3;
  abortSignal?: AbortSignal;
}): AsyncIterableIterator<{ id: string; data: unknown }> {
  if (!model.doGetBatchResults) {
    throw new BatchNotSupportedError({
      name: 'batch_not_supported',
      message: `Batch is not supported with model '${model.modelId}'`,
    });
  }

  for await (const response of model.doGetBatchResults({
    batchId: id,
    abortSignal,
  })) {
    yield response;
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
  model: LanguageModelV2 | LanguageModelV3;
  id: string;
  abortSignal?: AbortSignal;
}): Promise<void> {
  if (!model.doDeleteBatch) {
    throw new BatchNotSupportedError({
      name: 'batch_not_supported',
      message: `Batch is not supported with model '${model.modelId}'`,
    });
  }

  await model.doDeleteBatch({
    batchId: id,
    abortSignal,
  });
}
