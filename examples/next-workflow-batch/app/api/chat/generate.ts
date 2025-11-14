import { createHook, getWritable } from 'workflow';
import {
  BatchRequestGenerateText,
  type InferBatchResponse,
} from '@ai-sdk/batch';
import { batch } from '@/app/lib/batch';
import { createResponse } from '@/app/lib/responses';
import { simulateReadableStream } from 'ai';

export async function generate(request: BatchRequestGenerateText) {
  'use workflow';

  const startedAt = Date.now();
  const response = await generateTextBatch({
    ...request,
    id: `the-human-torch:${Date.now()}`,
  });

  await saveResponse(response);

  await sendResponseText(
    `${response.text} (took ${new Date(Date.now() - startedAt).toISOString().slice(11, 19)})`,
  );
}

async function generateTextBatch(
  request: BatchRequestGenerateText,
): Promise<InferBatchResponse<typeof batch>> {
  'use workflow';

  await pushRequest(request);

  return await createHook({ token: request.id });
}

async function pushRequest(request: BatchRequestGenerateText) {
  'use step';

  await batch.pushRequest(request);
}

async function saveResponse(response: InferBatchResponse<typeof batch>) {
  'use step';

  await createResponse(response);
}

async function sendResponseText(text: string) {
  'use step';

  const writer = getWritable();

  const stream = simulateReadableStream({
    chunks: text.split(' '),
    initialDelayInMs: 0, // Wait 1 second before first chunk
    chunkDelayInMs: 0.2, // Wait 0.5 seconds between chunks
  });

  await stream.pipeTo(writer);
}
