import { start } from 'workflow/api';
import { generate } from './generate';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const run = await start(generate, [await request.json()]);

  await revalidatePath('/');

  return new Response(run.readable, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
