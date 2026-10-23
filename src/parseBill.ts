// functions/src/parseBill.ts
// Reads a supplier bill (PDF or photo) and returns { lines: [{ sku, description, quantity }] }.
// The API key lives only here (server side), never in the browser.
//
// Setup (run inside the functions folder):
//   npm i firebase-admin firebase-functions
//   firebase functions:secrets:set ANTHROPIC_API_KEY
//   functions/.env  ->  ADMIN_EMAIL=ankitakhot015@gmail.com
//   functions/src/index.ts  ->  export { parseBill } from './parseBill';
//   firebase deploy --only functions:parseBill

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');
if (!getApps().length) initializeApp();

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Cloud Functions accepts requests up to 10 MB; base64 text must stay below that.
const MAX_BASE64_CHARS = 8_000_000;

const PROMPT = `This is a supplier bill / invoice / delivery challan for sarees.
List every item line with the quantity received.
Reply with ONLY this JSON, no other text:
{"lines":[{"sku": string or null, "description": string, "quantity": number}]}
Use the SKU / item code printed on the bill if there is one, otherwise null.
Put the product name and colour in description. Ignore totals, tax and shipping lines.`;

interface BillLine {
  sku: string;
  description: string;
  quantity: number;
}

/** Pulls the JSON object out of the model reply even if it adds text or code fences. */
function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON found');
  return JSON.parse(text.slice(start, end + 1));
}

export const parseBill = onRequest(
  { cors: true, secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 120, memory: '512MiB' },
  async (req, res): Promise<void> => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'POST only.' });
        return;
      }

      // Fail closed: without a configured owner email nobody may use this function.
      const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      if (!adminEmail) {
        res.status(500).json({ error: 'Server is not configured (ADMIN_EMAIL missing).' });
        return;
      }

      // Only the owner may call this (every request costs money).
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      if (!token) {
        res.status(401).json({ error: 'Not signed in.' });
        return;
      }
      let email = '';
      try {
        const decoded = await getAuth().verifyIdToken(token);
        email = (decoded.email || '').toLowerCase();
        if (decoded.email_verified === false) email = '';
      } catch {
        res.status(401).json({ error: 'Invalid or expired sign-in. Please log in again.' });
        return;
      }
      if (email !== adminEmail) {
        res.status(403).json({ error: 'Owner access only.' });
        return;
      }

      const body = (req.body || {}) as { mimeType?: unknown; data?: unknown };
      const mimeType = typeof body.mimeType === 'string' ? body.mimeType : '';
      const data = typeof body.data === 'string' ? body.data : '';
      if (!data) {
        res.status(400).json({ error: 'No file received.' });
        return;
      }
      if (data.length > MAX_BASE64_CHARS) {
        res.status(413).json({ error: 'File is too large. Use a bill under 6 MB.' });
        return;
      }

      let block: Record<string, unknown>;
      if (mimeType === 'application/pdf') {
        block = { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } };
      } else if (IMAGE_TYPES.includes(mimeType)) {
        block = { type: 'image', source: { type: 'base64', media_type: mimeType, data } };
      } else {
        res.status(400).json({ error: 'Upload a PDF, JPG, PNG or WebP file.' });
        return;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 100_000);
      let apiRes: Response;
      try {
        apiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'content-type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY.value(),
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-5-5',
            max_tokens: 4000,
            messages: [{ role: 'user', content: [block, { type: 'text', text: PROMPT }] }],
          }),
        });
      } finally {
        clearTimeout(timer);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: any = await apiRes.json().catch(() => null);
      if (!apiRes.ok || !json) {
        res.status(502).json({ error: json?.error?.message || 'Bill reader failed.' });
        return;
      }

      const text: string = (Array.isArray(json.content) ? json.content : [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
        .join('');

      let parsed: { lines?: unknown };
      try {
        parsed = extractJson(text) as { lines?: unknown };
      } catch {
        res.status(502).json({ error: 'Could not understand the bill. Try a clearer photo.' });
        return;
      }

      const rawLines: unknown[] = Array.isArray(parsed.lines) ? parsed.lines : [];
      const lines: BillLine[] = rawLines
        .map((l): BillLine => {
          const o = (l || {}) as Record<string, unknown>;
          return {
            sku: o.sku ? String(o.sku) : '',
            description: String(o.description ?? ''),
            quantity: Number(o.quantity),
          };
        })
        .filter((l) => Number.isFinite(l.quantity) && l.quantity > 0);

      res.json({ lines });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Server error.';
      res.status(500).json({ error: message });
    }
  }
);