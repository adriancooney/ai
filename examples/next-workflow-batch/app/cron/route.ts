import { summarizeBatch, summarizeBatchHook } from '../workflows/summarize';

export async function GET() {
  for await (const response of summarizeBatch.consumeAvailableResponses()) {
    summarizeBatchHook.resume(response.id, response.data);
  }
}
