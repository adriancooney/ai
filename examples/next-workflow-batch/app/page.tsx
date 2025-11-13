import { google } from '@ai-sdk/google';
import { findBatches } from '@ai-sdk/batch';
import { start } from 'workflow/api';
import { batch, generate } from './generate/generate';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const model = google.languageModel('gemini-2.5-flash-lite');
  const batches = await findBatches({ model });

  const buffererRequests = await batch.getBufferedRequests();

  async function generateAction() {
    'use server';

    await start(generate);
  }

  return (
    <div>
      <h1>Batches: {batches.length}</h1>
      <ul>
        {batches.map(batch => {
          return (
            <div>
              <h4>{batch.id}</h4>
            </div>
          );
        })}
      </ul>

      <form action={generateAction}>
        <button type="submit">Create Batch</button>
      </form>
      <h1>Buffered Requests: {buffererRequests.length}</h1>
      <ul>
        {buffererRequests.map(request => (
          <li>
            <pre>
              <code>{JSON.stringify(request, null, 2)}</code>
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
