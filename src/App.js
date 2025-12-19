import React, { useState } from 'react';

const API_BASE = 'https://api.easycoders.in/projects/backend/public';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('test1');
  const [open, setOpen] = useState(false);

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const callAgent = async (text) => {
    const res = await fetch(`${API_BASE}/api/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, sessionId }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error('Agent error');

    const webhook = data.webhook_response;
    if (webhook?.sessionId) setSessionId(webhook.sessionId);

    return {
      text: webhook?.response_text || 'No response',
      query: webhook?.query || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput('');
    addMessage({ role: 'user', text });
    setLoading(true);

    try {
      const reply = await callAgent(text);
      addMessage({ role: 'agent', text: reply.text, query: reply.query });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= MAIN CONTENT ================= */}
      <div
        style={{
          height: '100vh',
          padding: '60px 16px',
          background: 'linear-gradient(135deg, #020617, #030d3a)',
          color: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            background: '#020617',
            borderRadius: 14,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
          }}
        >
          <h1 style={{ fontSize: 26, marginBottom: 8 }}>
            🧠 Forecast AI Agent
          </h1>

          <p style={{ fontSize: 14, color: '#cbd5f5', marginBottom: 20 }}>
            Ask business questions in plain English and instantly receive
            production-ready SQL queries.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            <Feature title="Natural Language → SQL">
              Human queries converted into clean SQL.
            </Feature>

            <Feature title="Scenario Forecasting">
              Increase, decrease, compare or project data.
            </Feature>

            <Feature title="AI Intelligence">
              Powered by AI + n8n with memory.
            </Feature>
          </div>

          <div
            style={{
              marginTop: 28,
              border: '1px solid #1e293b',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <strong>Try asking:</strong>
            <ul style={{ marginTop: 8, fontSize: 13, color: '#cbd5f5' }}>
              <li>Revenue forecast for next quarter</li>
              <li>Increase marketing expenses by 20%</li>
              <li>Compare revenue and costs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= CHAT BUTTON ================= */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
          }}
        >
          💬
        </button>
      )}

      {/* ================= CHAT WINDOW ================= */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 380,
            height: 520,
            background: 'linear-gradient(180deg, #020617, #030d3a)',
            borderRadius: 16,
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e40af, #537dd8)',
              padding: '10px 14px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong>Forecast AI</strong>
              <div style={{ fontSize: 11 }}>Natural → SQL</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              padding: 12,
              overflowY: 'auto',
              background: '#020617',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent:
                    m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 12px',
                    borderRadius: 14,
                    fontSize: 13,
                    background:
                      m.role === 'user'
                        ? 'linear-gradient(135deg, #1e40af, #537dd8)'
                        : '#0f172a',
                    color: '#e5e7eb',
                  }}
                >
                  {m.text}

                  {m.query && (
                    <div
                      style={{
                        marginTop: 8,
                        border: '1px solid #1e293b',
                        borderRadius: 8,
                        position: 'relative',
                      }}
                    >
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(m.query)
                        }
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          fontSize: 10,
                          padding: '4px 8px',
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        Copy
                      </button>

                      <pre
                        className="sql-scroll"
                        style={{
                          maxHeight: 140,
                          margin: 0,
                          padding: 10,
                          overflow: 'auto',
                          fontSize: 11,
                          color: '#a5f3fc',
                          background: '#020617',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                      >
                        {m.query}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 10,
              display: 'flex',
              gap: 8,
              borderTop: '1px solid #1e293b',
              background: '#020617',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              style={{
                flex: 1,
                borderRadius: 999,
                border: '1px solid #1e293b',
                padding: '10px 14px',
                background: '#020617',
                color: '#e5e7eb',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                border: 'none',
                background: 'linear-gradient(135deg, #1e40af, #537dd8)',
                color: '#fff',
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Feature({ title, children }) {
  return (
    <div
      style={{
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h3 style={{ fontSize: 15, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#cbd5f5' }}>{children}</p>
    </div>
  );
}

export default App;
