import { google } from '@ai-sdk/google';
import { deleteBatchById, findBatches } from '@ai-sdk/batch';
import { batch } from '@/app/lib/batch';
import { findResponses, clearResponses } from '@/app/lib/responses';
import { ProcessButton } from './components/process-button';
import { WorkflowSection } from './components/workflow-section';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const model = google.languageModel('gemini-2.5-flash-lite');
  const batches = await findBatches({ model });
  const buffererRequests = await batch.getBufferedRequests();
  const responses = await findResponses();

  async function deleteBatchAction(formData: FormData) {
    'use server';

    await deleteBatchById({
      model: google.languageModel('gemini-2.5-flash-lite'),
      id: formData.get('batchId') as string,
    });
  }

  async function clearBufferAction() {
    'use server';

    await batch.clearBufferedRequests();
  }

  async function clearResponsesAction() {
    'use server';

    await clearResponses();
  }

  return (
    <div>
      <WorkflowSection />

      <h1>Batches: {batches.length}</h1>
      <ul>
        {batches.map(batch => {
          return (
            <div key={batch.id}>
              <h4>
                {batch.id}: {batch.status}
              </h4>
              <form action={deleteBatchAction}>
                <input type="hidden" name="batchId" value={batch.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          );
        })}
      </ul>

      <ProcessButton />

      <h1>Buffered Requests: {buffererRequests.length}</h1>
      <form action={clearBufferAction}>
        <button type="submit">Clear</button>
      </form>
      <ul>
        {buffererRequests.map(request => (
          <li key={request.id}>
            <pre>
              <code>{JSON.stringify(request, null, 2)}</code>
            </pre>
          </li>
        ))}
      </ul>

      <h1>Responses: {responses.length}</h1>
      <form action={clearResponsesAction}>
        <button type="submit">Clear</button>
      </form>
      {responses.map(response => (
        <li key={response.id}>
          <pre>
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </li>
      ))}
    </div>
  );
}
