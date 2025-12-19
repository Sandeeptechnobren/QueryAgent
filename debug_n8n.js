
const fetch = require('node-fetch');

const url = 'https://n8n.brenops.com/webhook/forecast-query?sessionId=test1&input=hi';

async function test() {
    try {
        console.log('Fetching:', url);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: 'test1', input: 'hi' })
        });

        console.log('Status:', res.status);
        console.log('Headers:');
        res.headers.forEach((val, key) => console.log(`  ${key}: ${val}`));

        const text = await res.text();
        const fs = require('fs');
        fs.writeFileSync('debug_output.json', text);
        console.log('Body written to debug_output.json');

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
