'use client';

import { Button, Spinner } from '@radix-ui/themes';
import { useState } from 'react';

export function ProcessButton() {
  const [loading, setLoading] = useState(false);

  async function handleProcess() {
    setLoading(true);
    try {
      await fetch('/cron');
      window.location.reload();
    } catch (error) {
      console.error('Failed to process batches:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleProcess} disabled={loading}>
      {loading ? <Spinner /> : 'Process Batches'}
    </Button>
  );
}
