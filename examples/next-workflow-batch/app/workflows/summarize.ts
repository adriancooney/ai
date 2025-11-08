import { defineHook } from 'workflow';
import { getInfiniteBatch } from '@ai-sdk/batch';
import { google } from '@ai-sdk/google';

export const summarizeBatchHook = defineHook();

export const summarizeBatch = getInfiniteBatch({
  key: 'summarize',
  model: google.languageModel('gemini-2.5-flash-lite'),
});

export async function summarize() {
  'use workflow';

  const { text: summary } = await generateTextBatch();
}

async function generateTextBatch({ id, request }: { id: string }) {
  'use workflow';

  const { id } = await summarizeBatch.pushRequest({
    id: doc.id,
    prompt: 'summarize this document',
  });

  return await summarizeBatchHook.create({
    token: id,
  });
}
