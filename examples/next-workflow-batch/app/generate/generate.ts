import { createHook } from 'workflow';
import {
  getInfiniteBatch,
  BatchRequestGenerateText,
  type InferBatchResponse,
} from '@ai-sdk/batch';
import { google } from '@ai-sdk/google';

export const batch = getInfiniteBatch({
  key: 'one-word',
  model: google.languageModel('gemini-2.5-flash-lite'),
});

export async function generate() {
  'use workflow';

  const startedAt = Date.now();

  const { text: word } = await generateTextBatch({
    id: `the-human-torch:${Date.now()}`,
    prompt: 'Respond with one word: The Human Torch is denied a bank loan.',
  });

  console.log(
    word,
    `(took ${((Date.now() - startedAt) / 1000 / 60 / 60).toFixed(2)}hrs)`,
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
