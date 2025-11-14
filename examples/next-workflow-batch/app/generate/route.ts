import { start } from 'workflow/api';
import { generate } from './generate';

export async function POST() {
  const run = await start(generate);

  return new Response(run.readable, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
