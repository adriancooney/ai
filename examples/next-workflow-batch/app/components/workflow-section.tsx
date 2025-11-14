'use client';

import { useState } from 'react';

export function WorkflowSection() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No readable stream');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        setOutput(prev => prev + chunk);
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      setOutput('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Workflow</h1>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Loading...' : 'Generate'}
      </button>

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
