'use client';

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
    <button onClick={handleProcess} disabled={loading}>
      {loading ? 'Processing...' : 'Process Batches'}
    </button>
  );
}
