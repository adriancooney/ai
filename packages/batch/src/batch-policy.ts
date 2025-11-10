import { AISDKError, BatchMeters, BatchPolicy } from '@ai-sdk/provider';

export function createBatchMeters<POLICY extends BatchPolicy>(policy: POLICY) {
  let currentMeters = {} satisfies BatchMeters<POLICY>;

  function accepts(meters: BatchMeters<POLICY>): boolean {
    const nextMeters = addMeters(policy, currentMeters, meters);

    return Object.keys(policy.limits).every(
      meterName => (nextMeters[meterName] ?? 0) <= policy.limits[meterName],
    );
  }

  return {
    accepts,

    commit(meters: BatchMeters<POLICY>) {
      if (!accepts(meters)) {
        throw new AISDKError({
          name: 'batch_policy_exceeded',
          message: `Cannot commit batch meters, exceeds batch policy`,
        });
      }

      currentMeters = addMeters(policy, currentMeters, meters);
    },
  };
}

function addMeters<POLICY extends BatchPolicy>(
  policy: POLICY,
  meterA: BatchMeters<POLICY>,
  meterB: BatchMeters<POLICY>,
): BatchMeters<POLICY> {
  return Object.fromEntries(
    Object.keys(policy.limits).map(meterName => [
      meterName,
      (meterA[meterName] ?? 0) + (meterB[meterName] ?? 0),
    ]),
  ) as BatchMeters<POLICY>;
}
