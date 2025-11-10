import { summarizeBatch, summarizeBatchHook } from '../summarize/summarize';

export async function GET() {
  for await (const response of summarizeBatch.consumeAvailableResponses()) {
    summarizeBatchHook.resume(response.id, response);
  }

  return new Response('OK');
}
