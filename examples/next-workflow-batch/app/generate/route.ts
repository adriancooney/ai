import { start } from 'workflow/api';
import { generate } from './generate';

export async function POST() {
  const run = await start(generate);

  return Response.json({
    message: 'Workflow started',
    runId: run.runId,
  });
}
