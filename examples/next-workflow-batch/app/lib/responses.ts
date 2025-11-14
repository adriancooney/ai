import { InferBatchResponse } from '@ai-sdk/batch';
import { batch } from './batch';
import { redis } from './redis';

export async function findResponses(): Promise<
  InferBatchResponse<typeof batch>[]
> {
  const responses = await redis.hgetall('responses');

  if (!responses) {
    return [];
  }

  return Object.values(responses) as InferBatchResponse<typeof batch>[];
}

export async function createResponse(
  response: InferBatchResponse<typeof batch>,
) {
  await redis.hset('responses', { [`${response.id}`]: response });
}

export async function clearResponses() {
  await redis.del('responses');
}
