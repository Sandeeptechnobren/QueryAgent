import React, { useState } from 'react';

const API_BASE = 'https://api.easycoders.in/projects/backend/public';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('test1');
  const [open, setOpen] = useState(false);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const callAgent = async (text) => {
    const res = await fetch(`${API_BASE}/api/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, sessionId }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Agent error');

    const webhook = data.webhook_response;
    if (webhook?.sessionId) setSessionId(webhook.sessionId);

    return {
      text: webhook?.response_text || 'No response',
      query: webhook?.query || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);
    addMessage({ role: 'user', text });
    setLoading(true);

    try {
      const reply = await callAgent(text);
      addMessage({ role: 'agent', text: reply.text, query: reply.query });
    } catch (err) {
      setError(err.message);
      addMessage({ role: 'agent', text: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= MAIN AI AGENT CONTENT ================= */}
      <div
        style={{
          minHeight: '100vh',
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #020617, #030d3a)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            background: '#020617',
            borderRadius: 16,
            padding: 40,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          <h1 style={{ fontSize: 32, marginBottom: 10 }}>
            🧠 Forecast AI Agent
          </h1>

          <p style={{ color: '#cbd5f5', fontSize: 16, marginBottom: 30 }}>
            Ask business questions in plain English and instantly get
            production-ready SQL queries for forecasts, revenue, and expenses.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            <Feature title="Natural Language → SQL">
              Ask questions like a human. Get clean, executable SQL.
            </Feature>

            <Feature title="Forecast Scenarios">
              Increase, decrease, compare, or project financial data.
            </Feature>

            <Feature title="AI-Powered Intelligence">
              Backed by AI + n8n workflows with session memory.
            </Feature>
          </div>

          <div
            style={{
              marginTop: 40,
              background: '#020617',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <strong>Try asking:</strong>
            <ul style={{ marginTop: 10, color: '#cbd5f5', lineHeight: 1.8 }}>
              <li>Show revenue forecast for next quarter</li>
              <li>Increase marketing expenses by 25%</li>
              <li>Compare revenue and operating expenses</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= FLOATING CHAT BUTTON ================= */}
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
            height: 540,
            background: 'linear-gradient(180deg, #020617, #030d3a)',
            borderRadius: 16,
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e40af, #537dd8ff)',
              color: '#fff',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>Forecast AI</strong>
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                Natural language → SQL
              </div>
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
            style={{
              flex: 1,
              padding: 12,
              overflowY: 'auto',
              background: '#020617',
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
                    lineHeight: 1.4,
                    background:
                      m.role === 'user'
                        ? 'linear-gradient(135deg, #1e40af, #537dd8ff)'
                        : '#0f172a',
                    color: '#e5e7eb',
                  }}
                >
                  {m.text}

                  {/* SQL Block */}
                  {m.query && (
                    <div
                      style={{
                        marginTop: 10,
                        background: '#020617',
                        border: '1px solid #1e293b',
                        borderRadius: 8,
                        padding: 8,
                        position: 'relative',
                      }}
                    >
                      {/* Copy Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.query);
                        }}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          background: '#2563eb',
                          color: '#fff',
                        }}
                      >
                        Copy
                      </button>

                      {/* SQL Content */}
                      <pre
                        style={{
                          margin: 0,
                          maxHeight: 160,
                          overflowY: 'auto',
                          overflowX: 'auto',
                          padding: '10px 8px',
                          fontSize: 11,
                          fontFamily: 'monospace',
                          color: '#a5f3fc',

                          /* 🔥 Hide scrollbar but allow scroll */
                          scrollbarWidth: 'none',       // Firefox
                          msOverflowStyle: 'none',      // IE / Edge
                        }}
                        className="sql-scroll"
                      >
                        {m.query}
                      </pre>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {loading && (
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Forecast AI is thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 10,
              borderTop: '1px solid #1e293b',
              display: 'flex',
              gap: 8,
              background: '#020617',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about revenue, expenses, forecasts…"
              style={{
                flex: 1,
                borderRadius: 999,
                border: '1px solid #1e293b',
                padding: '10px 14px',
                fontSize: 13,
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
                background: 'linear-gradient(135deg, #1e40af, #537dd8ff)',
                color: '#fff',
                fontSize: 13,
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

/* ===== Reusable Feature Card ===== */
function Feature({ title, children }) {
  return (
    <div
      style={{
        background: '#020617',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 20,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#cbd5f5', fontSize: 14 }}>{children}</p>
    </div>
  );
}

export default App;
