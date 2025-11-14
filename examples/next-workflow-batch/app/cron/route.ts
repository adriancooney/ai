import { batch } from '@/app/lib/batch';
import { resumeHook } from 'workflow/api';

export async function GET() {
  for await (const response of batch.consumeAvailableResponses()) {
    console.log('consume', response);
    resumeHook(response.id, response);
  }

  return new Response('OK');
}
