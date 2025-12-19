const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const cors = require('cors');
const PORT = 3001;

const WEBHOOK_BASE = 'https://n8n.brenops.com/webhook/forecast-query';
const SESSION_ID = 'test1';

app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message from frontend:', message);
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const r = await fetch(WEBHOOK_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: SESSION_ID,
                input: message
            })
        });

        if (!r.ok) {
            const text = await r.text();
            return res.status(r.status).json({ error: 'Webhook error', detail: text });
        }

        console.log('n8n Response Status:', r.status);
        const validJson = r.headers.get('content-type')?.includes('application/json');
        const text = await r.text();
        console.log('n8n Raw Response:', text);

        let reply;
        if (validJson) {
            try {
                const data = JSON.parse(text);
                reply = data.response_text || data.reply || data.response || data.message || data.output || JSON.stringify(data);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                reply = text;
            }
        } else {
            reply = text;
        }

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Unknown error' });
    }
});

app.listen(PORT, () => {
    console.log('Proxy API listening on http://localhost:' + PORT);
});
