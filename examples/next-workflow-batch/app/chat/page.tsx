'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import {
  Box,
  Card,
  Text,
  TextField,
  Button,
  Flex,
  ScrollArea,
  Code,
  Spinner,
} from '@radix-ui/themes';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  console.log({ status });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <Box flexGrow="1" asChild>
      <Card>
        <Flex height="100%" direction="column" gap="2">
          <Box flexGrow="1">
            <ScrollArea>
              <Flex direction="column" gap="2">
                {messages.map((message, index) => (
                  <Card
                    key={index}
                    variant="surface"
                    style={{
                      width: '70%',
                      alignSelf:
                        message.role === 'user' ? 'flex-start' : 'flex-end',
                      backgroundColor:
                        message.role === 'user'
                          ? 'var(--blue-3)'
                          : 'var(--gray-3)',
                    }}
                  >
                    <Text weight="bold">{message.role}</Text>
                    {message.parts.map(part => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <Box key={part.text}>
                              <Text as="p">{part.text}</Text>
                            </Box>
                          );

                        default:
                          return (
                            <Box key={JSON.stringify(part)}>
                              <Code
                                size="1"
                                style={{ display: 'block', whiteSpace: 'pre' }}
                              >
                                {JSON.stringify(part, null, 2)}
                              </Code>
                            </Box>
                          );
                      }
                    })}
                  </Card>
                ))}
                {status !== 'ready' && status !== 'error' && (
                  <Flex gap="2" align="center">
                    <Spinner /> <Text color="gray">Loading...</Text>
                  </Flex>
                )}
              </Flex>
            </ScrollArea>
          </Box>

          <form onSubmit={handleSubmit}>
            <Flex gap="2">
              <TextField.Root
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                size="3"
                style={{ flex: 1 }}
              />
              <Button type="submit" disabled={status === 'streaming'} size="3">
                Send
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Box>
  );
}
