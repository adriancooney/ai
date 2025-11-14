import { createHook, getWritable } from 'workflow';
import {
  BatchRequestGenerateText,
  type InferBatchResponse,
} from '@ai-sdk/batch';
import { batch } from '@/app/lib/batch';
import { saveResponse } from '@/app/lib/responses';

export async function generate() {
  'use workflow';

  const startedAt = Date.now();

  const response = await generateTextBatch({
    id: `the-human-torch:${Date.now()}`,
    prompt: 'Respond with one word: The Human Torch is denied a bank loan.',
  });

  console.log(
    response.text,
    `(took ${((Date.now() - startedAt) / 1000 / 60 / 60).toFixed(2)}hrs)`,
  );

  await saveResponseStep(response);
  await sendResponseText(response.text);
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

async function saveResponseStep(response: InferBatchResponse<typeof batch>) {
  'use step';

  await saveResponse(response);
}

async function sendResponseText(text: string) {
  'use step';

  const writer = getWritable().getWriter();
  await writer.write(text);
  await writer.releaseLock();
}
