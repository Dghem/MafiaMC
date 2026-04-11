const crypto = require('crypto');

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const SIGN_SECRET = process.env.SIGN_SECRET || 'mafiamc_verify_default';
const DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { token, action } = req.body || {};

        // Get visitor IP
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || req.headers['x-real-ip']
            || req.connection?.remoteAddress
            || 'unknown';

        // Action: check — verify if stored token is still valid for this IP
        if (action === 'check') {
            const storedToken = req.body.storedToken;
            if (!storedToken) return res.json({ valid: false });

            try {
                const parts = storedToken.split(':');
                if (parts.length !== 3) return res.json({ valid: false });

                const [ipHash, timestamp, signature] = parts;
                const ts = parseInt(timestamp);

                // Check if expired (2 days)
                if (Date.now() - ts > DURATION) return res.json({ valid: false });

                // Verify IP matches
                const expectedIpHash = crypto.createHmac('sha256', SIGN_SECRET).update(ip).digest('hex').substring(0, 16);
                if (ipHash !== expectedIpHash) return res.json({ valid: false });

                // Verify signature
                const expectedSig = crypto.createHmac('sha256', SIGN_SECRET).update(ipHash + ':' + timestamp).digest('hex').substring(0, 32);
                if (signature !== expectedSig) return res.json({ valid: false });

                return res.json({ valid: true });
            } catch (e) {
                return res.json({ valid: false });
            }
        }

        // Action: verify — validate Turnstile token and create signed session
        if (!token) return res.status(400).json({ error: 'Missing token' });

        // Validate with Cloudflare
        const cfResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${SECRET_KEY}&response=${token}&remoteip=${ip}`
        });
        const cfResult = await cfResponse.json();

        if (!cfResult.success) {
            return res.status(403).json({ error: 'Verification failed', details: cfResult });
        }

        // Create signed token: ipHash:timestamp:signature
        const timestamp = Date.now().toString();
        const ipHash = crypto.createHmac('sha256', SIGN_SECRET).update(ip).digest('hex').substring(0, 16);
        const signature = crypto.createHmac('sha256', SIGN_SECRET).update(ipHash + ':' + timestamp).digest('hex').substring(0, 32);
        const verifyToken = `${ipHash}:${timestamp}:${signature}`;

        return res.json({ verified: true, token: verifyToken });

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
