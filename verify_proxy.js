
const fetch = require('node-fetch');

async function verify() {
    try {
        const res = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'hi' })
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}

verify();
