import { start } from 'workflow/api';
import { generate } from './generate';

export async function POST(request: Request) {
  const run = await start(generate, [await request.json()]);

  return new Response(run.readable, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
