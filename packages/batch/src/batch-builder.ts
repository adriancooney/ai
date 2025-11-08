import { LanguageModelV2, LanguageModelV3 } from '@ai-sdk/provider';
import { Batch, BatchMetadata, BatchRequest } from './types';
import { createBatch } from './batch';

export interface BatchBuilder {
  isFull(): boolean;
  pushRequest(request: BatchRequest): void;
  submit(options?: {
    metadata?: BatchMetadata;
    abortSignal?: AbortSignal;
  }): Promise<Batch>;
}

export function createBatchBuilder({
  model,
  metadata,
}: {
  model: LanguageModelV2 | LanguageModelV3;
  metadata?: BatchMetadata;
}): BatchBuilder {
  const requests: BatchRequest[] = [];

  return {
    isFull() {
      return false;
    },

    pushRequest(request) {
      requests.push(request);
    },

    async submit(options) {
      return await createBatch({
        model,
        metadata:
          metadata || options?.metadata
            ? {
                ...metadata,
                ...options?.metadata,
              }
            : {},
        requests,
        abortSignal: options?.abortSignal,
      });
    },
  };
}
