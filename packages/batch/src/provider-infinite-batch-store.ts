import { AISDKError, BatchModelV1 } from '@ai-sdk/provider';
import { InfiniteBatchStore } from './infinite-batch';
import { BatchStatus } from './types';

export function createProviderInfiniteBatchStore<CURSOR>(
  model: BatchModelV1,
): InfiniteBatchStore<CURSOR> {
  return {
    async queryBatches(query, options) {
      if (!model.doListBatches) {
        throw new AISDKError({
          name: 'list_batchs_unsupported',
          message:
            'Cannot create provider infinite batch store, listing batches is not supported',
        });
      }

      const batches = await model.doListBatches(options);

      console.log(JSON.stringify({ batches }, null, 2));

      const matchingBatches = batches.filter(batch => {
        if (query.groupKey && batch.metadata.groupKey !== query.groupKey) {
          return false;
        }

        return true;
      }) as {
        id: string;
        status: BatchStatus;
        metadata: { groupKey: string; cursor: CURSOR };
      }[];

      return matchingBatches;
    },
  };
}
