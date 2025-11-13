import { AISDKError, BatchModelV1 } from '@ai-sdk/provider';
import { Batch, BatchMetadata, BatchRequest } from './types';
import { createBatch } from './batch';
import { createBatchMeters } from './batch-policy';

export interface BatchBuilder<MODEL extends BatchModelV1> {
  accepts(request: BatchRequest<MODEL>): boolean;
  pushRequest(request: BatchRequest<MODEL>): void;
  submit(options?: {
    metadata?: BatchMetadata;
    abortSignal?: AbortSignal;
  }): Promise<Batch>;
}

export function createBatchBuilder<MODEL extends BatchModelV1>({
  model,
  metadata,
}: {
  model: MODEL;
  metadata?: BatchMetadata;
}): BatchBuilder<MODEL> {
  let requests: BatchRequest<MODEL>[] = [];
  const meters = createBatchMeters(model);

  return {
    accepts(request) {
      return meters.isRequestAcceptable(request);
    },

    pushRequest(request) {
      const validationResult = model.validateBatchRequest(request);

      if (!validationResult.success) {
        throw new AISDKError({
          name: 'invalid_batch_request',
          message: `${validationResult.code}: ${validationResult.message}`,
        });
      }

      meters.commitRequest(request);
      requests.push(request);
    },

    async submit(options) {
      const mergedMetadata =
        metadata || options?.metadata
          ? {
              ...metadata,
              ...options?.metadata,
            }
          : {};

      const batch = await createBatch({
        model,
        metadata: mergedMetadata,
        requests,
        abortSignal: options?.abortSignal,
      });

      return batch;
    },
  };
}
