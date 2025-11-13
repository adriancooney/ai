import {
  AISDKError,
  BatchMetersState,
  BatchModelV1,
  BatchPolicy,
  BatchPolicyOfModel,
} from '@ai-sdk/provider';
import { BatchRequest } from './types';

export interface BatchMeters<MODEL extends BatchModelV1> {
  getBatchMetersState(): BatchMetersState<BatchPolicyOfModel<MODEL>>;
  isRequestAcceptable(request: BatchRequest<MODEL>): boolean;
  commitRequest(
    request: BatchRequest<MODEL>,
  ): BatchMetersState<BatchPolicyOfModel<MODEL>>;
}

export function createBatchMeters<MODEL extends BatchModelV1>(
  model: MODEL,
  initialBatchMetersState?: BatchMetersState<BatchPolicyOfModel<MODEL>>,
): BatchMeters<MODEL> {
  let currentBatchMetersState =
    initialBatchMetersState ??
    ({} satisfies BatchMetersState<BatchPolicyOfModel<MODEL>>);

  function isRequestAcceptable(request: BatchRequest<MODEL>): boolean {
    const nextMeters = addMeters(
      model.batchPolicy,
      currentBatchMetersState,
      model.measureBatchRequest(request),
    );

    return Object.keys(model.batchPolicy.limits).every(
      meterName =>
        (nextMeters[meterName] ?? 0) <= model.batchPolicy.limits[meterName],
    );
  }

  return {
    getBatchMetersState: () => currentBatchMetersState,

    isRequestAcceptable,

    commitRequest(request: BatchRequest<MODEL>) {
      if (!isRequestAcceptable(request)) {
        throw new AISDKError({
          name: 'batch_policy_exceeded',
          message: `Cannot commit batch meters, exceeds batch policy`,
        });
      }

      currentBatchMetersState = addMeters(
        model.batchPolicy,
        currentBatchMetersState,
        model.measureBatchRequest(request),
      );

      return currentBatchMetersState;
    },
  };
}

function addMeters<POLICY extends BatchPolicy>(
  policy: POLICY,
  meterA: BatchMetersState<POLICY>,
  meterB: BatchMetersState<POLICY>,
): BatchMetersState<POLICY> {
  return Object.fromEntries(
    Object.keys(policy.limits).map(meterName => [
      meterName,
      (meterA[meterName] ?? 0) + (meterB[meterName] ?? 0),
    ]),
  ) as BatchMetersState<POLICY>;
}
