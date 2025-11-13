import { resumeHook } from 'workflow/api';
import { batch } from '../generate/generate';

export async function GET() {
  for await (const response of batch.consumeAvailableResponses()) {
    resumeHook(response.id, response);
  }

  return new Response('OK');
}
