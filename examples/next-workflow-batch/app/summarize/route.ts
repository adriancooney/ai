import { start } from 'workflow/api';
import { summarize } from './summarize';

export async function POST() {
  const run = await start(summarize);

  return Response.json({
    message: 'Workflow started',
    runId: run.runId,
  });
}
