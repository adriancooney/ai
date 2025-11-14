import { createHook, getWritable } from 'workflow';
import {
  BatchRequestGenerateText,
  type InferBatchResponse,
} from '@ai-sdk/batch';
import { batch } from '@/app/lib/batch';
import { createResponse } from '@/app/lib/responses';

export async function generate(prompt: string) {
  'use workflow';

  const startedAt = Date.now();
  const response = await generateTextBatch({
    id: `the-human-torch:${Date.now()}`,
    prompt,
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

  const writer = getWritable().getWriter();
  await writer.write(text);
  await writer.releaseLock();
}
