export interface BatchModelBatch {
  id: string;
  // status: { status: 'pending' | 'ready' } | { status: 'error'; error: string };
  status: 'pending' | 'ready' | 'error';
  metadata: Record<string, unknown>;
}

/**
 * Standard error codes for batch validati don errors.
 */
export type BatchValidationErrorCode =
  | 'request_too_large'
  | 'batch_too_large'
  | 'batch_empty'
  | 'invalid_request'
  | 'invalid_batch'
  | string;

export interface BatchValidationError {
  code: BatchValidationErrorCode;
  message: string;
}

export interface BatchPolicy {
  limits: {
    [meterName: string]: number;
  };
}

export type BatchPolicyOfModel<MODEL extends BatchModelV1> =
  MODEL['batchPolicy'];
export type BatchMetersState<POLICY extends BatchPolicy> = Partial<
  POLICY['limits']
>;

export interface BatchModelV1<POLICY extends BatchPolicy = BatchPolicy> {
  modelId: string;
  batchPolicy: POLICY;

  measureBatchRequest(
    request: {
      id: string;
    } & unknown,
  ): POLICY['limits'];
  validateBatchRequest(
    request: {
      id: string;
    } & unknown,
  ): { success: true } | { success: false; code: string; message: string };

  doGetBatchById(options: {
    id: string;
    abortSignal?: AbortSignal;
  }): Promise<BatchModelBatch>;

  doGetBatchResultsById(options: {
    id: string;
    abortSignal?: AbortSignal;
  }): AsyncIterableIterator<{ id: string; data: unknown }>;

  doCreateBatch(options: {
    metadata: unknown;
    requests: ({ id: string } & unknown)[];
    abortSignal?: AbortSignal;
  }): Promise<BatchModelBatch>;

  doDeleteBatchById(options: {
    id: string;
    abortSignal?: AbortSignal;
  }): Promise<void>;

  doListBatches?(options?: {
    abortSignal?: AbortSignal;
  }): Promise<BatchModelBatch[]>;
}
