import { google } from '@ai-sdk/google';
import { deleteBatchById, findBatches } from '@ai-sdk/batch';
import { batch } from '@/app/lib/batch';
import { findResponses, clearResponses } from '@/app/lib/responses';
import { ProcessButton } from './components/process-button';
import { WorkflowSection } from './components/workflow-section';
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Container,
  Flex,
  Heading,
  Text,
} from '@radix-ui/themes';
import { revalidatePath } from 'next/cache';
import Chat from './chat/page';

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

    revalidatePath('/');
  }

  async function clearBufferAction() {
    'use server';

    await batch.clearBufferedRequests();
    revalidatePath('/');
  }

  async function clearResponsesAction() {
    'use server';

    await clearResponses();
    revalidatePath('/');
  }

  return (
    <Container>
      <Flex align="stretch" gap="2" minHeight="600px">
        <Flex flexGrow="1" direction="column" gap="2">
          <Card>
            <Flex direction="column" gap="2">
              <Flex justify="between" align="center">
                <Heading size="5">Batches ({batches.length})</Heading>
                <ProcessButton />
              </Flex>
              {batches.map(batch => {
                return (
                  <Flex key={batch.id} justify="between" align="center">
                    <Text>
                      <Code>{batch.id}</Code> <Badge>{batch.status}</Badge>
                    </Text>
                    <form action={deleteBatchAction}>
                      <input type="hidden" name="batchId" value={batch.id} />
                      <Button type="submit">Delete</Button>
                    </form>
                  </Flex>
                );
              })}
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="2">
              <Flex justify="between" align="center">
                <Heading size="5">
                  Buffered Requests ({buffererRequests.length})
                </Heading>
                <form action={clearBufferAction}>
                  <Button type="submit">Clear</Button>
                </form>
              </Flex>
              {buffererRequests.map(request => (
                <Box key={request.id} asChild>
                  <Code>
                    <pre>{JSON.stringify(request, null, 2)}</pre>
                  </Code>
                </Box>
              ))}
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="2">
              <Flex justify="between" align="center">
                <Heading size="5">Responses ({responses.length})</Heading>
                <form action={clearResponsesAction}>
                  <Button type="submit">Clear</Button>
                </form>
              </Flex>
              {responses.map(response => (
                <Box key={response.id} asChild>
                  <Code>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                  </Code>
                </Box>
              ))}
            </Flex>
          </Card>
        </Flex>
        <Flex flexGrow="1">
          <Chat />
        </Flex>
      </Flex>
    </Container>
  );
}
