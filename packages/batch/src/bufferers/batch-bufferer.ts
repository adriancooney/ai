import { BatchModelV1 } from '@ai-sdk/provider';
import { BatchMeters, createBatchMeters } from '../batch-policy';
import { BatchBufferer, BatchRequest } from '../types';
import { createBatch } from '../batch';

// Use the Redis interface for simplicities sake
interface KVStore {
  get<V = unknown>(key: string): Promise<V>;
  set(key: string, value: unknown): Promise<void>;
  lpush(key: string, item: unknown): Promise<void>;
  lrange<V>(key: string, indexStart: number, indexEnd: number): Promise<V[]>;
  setnx(key: string, value: unknown): Promise<boolean>;
  del(key: string): Promise<void>;
}

export interface CreateBatchBuffererOptions {
  store: KVStore;
  bufferTime?: number;
  locking?: {
    maxRetries?: number;
    retryDelay?: number;
  };
}

export function createBatchBufferer({
  store,
  bufferTime = 60_000,
  locking,
}: CreateBatchBuffererOptions): BatchBufferer {
  return {
    async pushRequest<MODEL extends BatchModelV1>(
      model: MODEL,
      batchId: string,
      request: BatchRequest<MODEL>,
      options?: { abortSignal?: AbortSignal },
    ) {
      // Submit batch if full
      // Submit request
      await withBatchLock(
        store,
        batchId,
        async () => {
          const batchMeters = await getBatchMeters<MODEL>(
            store,
            model,
            batchId,
          );

          if (!batchMeters.isRequestAcceptable(request)) {
            await submitBatch(store, model, batchId);
          }

          await pushRequest(model, store, batchId, request);
        },
        locking,
      );

      // Linger for buffer timeout
      await new Promise(resolve => {
        const timeout = setTimeout(() => {
          options?.abortSignal?.removeEventListener('abort', onAbort);

          resolve(void 0);
        }, bufferTime);

        function onAbort() {
          clearTimeout(timeout);
        }

        options?.abortSignal?.addEventListener('abort', onAbort);
      });

      // Submit batch if no change
      await withBatchLock(
        store,
        batchId,
        async () => {
          const batchHeadRequest = await getBatchHeadRequest<MODEL>(
            store,
            batchId,
          );

          if (batchHeadRequest?.id === request.id) {
            // No change in the batch, submit it
            await submitBatch(store, model, batchId);
          }
        },
        locking,
      );
    },
  };
}

async function pushRequest<MODEL extends BatchModelV1>(
  model: MODEL,
  store: KVStore,
  batchId: string,
  request: BatchRequest<MODEL>,
) {
  await store.lpush(`batches:${batchId}:requests`, request);

  const batchMeters = await getBatchMeters<MODEL>(store, model, batchId);

  await store.set(
    `batches:${batchId}:meters`,
    batchMeters.commitRequest(request),
  );
}

async function withBatchLock(
  store: KVStore,
  batchId: string,
  callback: () => Promise<void>,
  {
    maxRetries = 50,
    retryDelay = 1000,
  }: {
    maxRetries?: number;
    retryDelay?: number;
  } = {},
): Promise<void> {
  const lockKey = `batches:${batchId}:lock`;
  const lockValue = Date.now();

  let acquired = false;

  for (let i = 0; i < maxRetries; i++) {
    acquired = await store.setnx(lockKey, lockValue);

    if (acquired) {
      break;
    }

    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }

  if (!acquired) {
    throw new Error(`Failed to acquire lock for batch ${batchId}`);
  }

  try {
    await callback();
  } finally {
    await store.del(lockKey);
  }
}

async function getBatchMeters<MODEL extends BatchModelV1>(
  store: KVStore,
  model: BatchModelV1,
  batchId: string,
): Promise<BatchMeters<MODEL>> {
  return createBatchMeters(model, await store.get(`batches:${batchId}:meters`));
}

async function getBatchHeadRequest<MODEL extends BatchModelV1>(
  store: KVStore,
  batchId: string,
): Promise<BatchRequest<MODEL> | null> {
  const requests = await store.lrange<BatchRequest<MODEL>>(
    `batches:${batchId}:requests`,
    0,
    0,
  );

  return requests[0] || null;
}

async function submitBatch<MODEL extends BatchModelV1>(
  store: KVStore,
  model: MODEL,
  batchId: string,
): Promise<void> {
  const requests = await store.lrange<BatchRequest<MODEL>>(
    `batches:${batchId}:requests`,
    0,
    -1,
  );

  if (requests.length === 0) {
    return;
  }

  await createBatch({
    model,
    metadata: { batchId },
    requests,
  });

  await Promise.all([
    store.del(`batches:${batchId}:requests`),
    store.del(`batches:${batchId}:meters`),
  ]);
}
