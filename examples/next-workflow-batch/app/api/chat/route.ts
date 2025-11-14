import { start } from 'workflow/api';
import { generate } from './generate';
import { revalidatePath } from 'next/cache';
import { convertToModelMessages, validateUIMessages } from 'ai';

export async function POST(request: Request) {
  const body = await request.json();

  const validatedMessages = await validateUIMessages({ messages: body.messages });
  const modelMessages = convertToModelMessages(validatedMessages);

  const run = await start(generate, [{
    id: crypto.randomUUID(),
    messages: modelMessages,
  }]);

  await revalidatePath('/');

  return new Response(run.readable, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
