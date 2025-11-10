import { defineHook } from 'workflow';
import {
  getInfiniteBatch,
  BatchRequestGenerateText,
  type InferBatchResponse,
} from '@ai-sdk/batch';
import { google } from '@ai-sdk/google';

export const summarizeBatch = getInfiniteBatch({
  key: 'summarize',
  model: google.languageModel('gemini-2.5-flash-lite'),
});

export const summarizeBatchHook =
  defineHook<InferBatchResponse<typeof summarizeBatch>>();

export async function summarize() {
  'use workflow';

  const startedAt = Date.now();

  console.log('summarizing document');

  const { text: summary } = await generateTextBatch({
    id: 'yoghurt',
    prompt: `Summary the following texts in 3-5 sentences: ${await fetchDocument()}`,
  });

  console.log(
    `document summarized (${((Date.now() - startedAt) / 1000 / 60 / 60).toFixed(2)}hrs)`,
    {
      summary,
    },
  );
}

async function generateTextBatch(request: BatchRequestGenerateText) {
  'use workflow';

  await pushRequest(request);

  return await summarizeBatchHook.create({
    token: request.id,
  });
}

async function pushRequest(request: BatchRequestGenerateText) {
  'use step';

  await summarizeBatch.pushRequest(request);
}

async function fetchDocument(): Promise<string> {
  'use step';

  return (
    await fetch(
      'https://gist.githubusercontent.com/adriancooney/dd88723da1c41e36c884d838785fa117/raw/ce6168c62abf4598e495c50649688e9ea645a5db/when-the-yogurt-took-over-a-short-story.txt',
    )
  ).text();
}
