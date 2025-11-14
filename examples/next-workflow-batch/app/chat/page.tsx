'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <strong>{message.role}</strong>
              {message.parts.map(part => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div>
                        <p>{part.text}</p>
                      </div>
                    );

                  default:
                    return (
                      <div>
                        <pre>{JSON.stringify(part, null, 2)}</pre>
                      </div>
                    );
                }
              })}
            </div>
          ))}
          {status === 'streaming' && (
            <div style={{ padding: '10px', color: '#666' }}>
              Loading...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            disabled={status === 'streaming'}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: status === 'streaming' ? '#ccc' : '#007bff',
              color: 'white',
              cursor: status === 'streaming' ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
