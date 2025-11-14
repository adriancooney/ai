import { getInfiniteBatch, createBatchBufferer } from '@ai-sdk/batch';
import { google } from '@ai-sdk/google';
import { redis } from '@/app/lib/redis';

export const batch = getInfiniteBatch({
  key: 'one-word',
  model: google.languageModel('gemini-2.5-flash-lite'),
  bufferer: createBatchBufferer({
    store: redis,
    bufferTime: 10_000,
  }),
});
