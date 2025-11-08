import { deleteBatchById } from './batch';

export type BatchStatus = 'pending' | 'processed' | 'errored';
export type BatchMetadata = Record<string, unknown>;

export interface Batch<METADATA extends BatchMetadata = BatchMetadata> {
  id: string;
  status: BatchStatus;
  metadata: METADATA;
}

export interface BatchStoreOperationOptions {
  abortSignal?: AbortSignal;
}

export type BatchRequest = {
  id: string;
  data: unknown;
};

export type BatchResponse = {
  id: string;
  data: unknown;
};
