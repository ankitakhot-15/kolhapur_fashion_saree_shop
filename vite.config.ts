

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';
import { cloudinaryPlugin } from './src/cloudinary-plugin.ts';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';

type Env = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Reads from .env (loaded by loadEnv) first, then from real environment variables.
function pick(env: Env, key: string): string {
  return (env[key] || process.env[key] || '').trim();
}

function escapeHtml(value: unknown): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

function inr(paise: unknown): string {
  const n = Number(paise);
  return '₹' + (Number.isFinite(n) ? Math.round(n / 100) : 0).toLocaleString('en-IN');
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readJson(req: IncomingMessage, limit = 60_000): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error('Request too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Mailer {
  transporter: ReturnType<typeof nodemailer.createTransport> | null;
  from: string;
  error: string | null;
}

function getMailer(env: Env): Mailer {
  const host = pick(env, 'SMTP_HOST') || 'smtp.gmail.com';
  const port = Number(pick(env, 'SMTP_PORT')) || 465;
  const user = pick(env, 'SMTP_USER');
  const pass = pick(env, 'SMTP_PASS').replace(/\s+/g, ''); // app password: no spaces

  if (!user || !pass) {
    return {
      transporter: null,
      from: '',
      error: 'SMTP_USER or SMTP_PASS is missing. Put them in a file named ".env" in the project root and restart the server.'
    };
  }
  return {
    transporter: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }),
    from: pick(env, 'SMTP_FROM') || `Kolhapuri Fashion Saree <${user}>`,
    error: null
  };
}

async function deliver(
  mailer: Mailer,
  message: { to: string; subject: string; text: string; html: string },
  label: string
): Promise<{ sentOverSmtp: boolean; smtpError: string | null }> {
  if (!mailer.transporter) {
    console.warn(`[SMTP] ${mailer.error}`);
    return { sentOverSmtp: false, smtpError: mailer.error };
  }
  try {
    await mailer.transporter.sendMail({ from: mailer.from, ...message });
    console.log(`[SMTP] ${label} sent to ${message.to}`);
    return { sentOverSmtp: true, smtpError: null };
  } catch (e: any) {
    const smtpError = e?.message || 'Unknown SMTP error';
    console.warn(`[SMTP] ${label} to ${message.to} FAILED: ${smtpError}`);
    return { sentOverSmtp: false, smtpError };
  }
}

/* ------------------------------------------------------------------ */
/* Shared email layout                                                 */
/* ------------------------------------------------------------------ */

const FOOTER_HTML = `
  <p style="font-size: 11px; color: #766B61; margin-top: 24px; border-top: 1px solid #E6E0D8; padding-top: 12px;">
    Kolhapuri Fashion Saree, Shivaji Nagar, Unchgaon, Kolhapur, Maharashtra. Ph: 9096863092
  </p>`;

function wrapEmail(inner: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FAF7F0; color: #292522; border: 1px solid #E6E0D8; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #641D32; margin: 0;">Kolhapuri Fashion Saree</h2>
        <p style="font-size: 11px; text-transform: uppercase; color: #766B61; margin: 4px 0;">Authentic Handloom Weaves &middot; Kolhapur</p>
      </div>
      ${inner}
      ${FOOTER_HTML}
    </div>`;
}

/* ------------------------------------------------------------------ */
/* OTP email                                                           */
/* ------------------------------------------------------------------ */

function buildOtpEmail(subject: string, otp: string, minutes: number, text?: string) {
  return {
    subject,
    text:
      text ||
      `Namaste,\n\nYour 6-digit OTP code for Kolhapuri Fashion Saree is: ${otp}\nValid for ${minutes} minutes.\n\nKolhapuri Fashion Saree, Shivaji Nagar, Unchgaon, Kolhapur.`,
    html: wrapEmail(`
      <p style="font-size: 14px;">Namaste,</p>
      <p style="font-size: 14px; line-height: 1.6;">Use the following single-use verification code to complete your sign-in / order checkout:</p>
      <div style="text-align: center; margin: 24px 0; padding: 18px; background: #FFFFFF; border: 2px dashed #C7A66A; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 6px; color: #641D32;">${escapeHtml(otp)}</span>
      </div>
      <p style="font-size: 12px; color: #766B61;">This OTP is valid for ${minutes} minutes. Never share this code with anyone.</p>`)
  };
}

/* ------------------------------------------------------------------ */
/* Order status email                                                  */
/* ------------------------------------------------------------------ */

const STATUS_COPY: Record<string, { emoji: string; headline: string; message: string }> = {
  'Pending Payment': { emoji: '⏳', headline: 'Waiting for your payment', message: 'We have reserved your sarees. Please complete the payment to confirm your order.' },
  'Payment Confirmed': { emoji: '💳', headline: 'Payment received', message: 'Thank you! We have received your payment.' },
  'Order Confirmed': { emoji: '✅', headline: 'Your order is confirmed', message: 'Thank you for shopping with us! Your order is confirmed and our team will start preparing your saree.' },
  'Processing': { emoji: '🧵', headline: 'We are preparing your order', message: 'Your handloom saree is being quality-checked and prepared by our team.' },
  'Packed': { emoji: '📦', headline: 'Your order is packed', message: 'Your saree has been carefully packed and will be handed over to the courier soon.' },
  'Shipped': { emoji: '🚚', headline: 'Your order has been shipped', message: 'Good news! Your order is on its way to you.' },
  'Out for Delivery': { emoji: '🛵', headline: 'Out for delivery', message: 'Your order is out for delivery and should reach you today. Please keep your phone nearby.' },
  'Delivered': { emoji: '🎉', headline: 'Your order has been delivered', message: 'We hope you love your saree! Thank you for choosing Kolhapuri Fashion Saree.' },
  'Cancelled': { emoji: '❌', headline: 'Your order has been cancelled', message: 'Your order has been cancelled. If you did not ask for this, please contact us.' },
  'Refund Pending': { emoji: '💸', headline: 'Refund in progress', message: 'Your order was cancelled and we are processing your refund to the original payment method.' },
  'Refunded': { emoji: '✅', headline: 'Your refund is complete', message: 'Your refund has been processed to your original payment method. It may take a few days to show in your account.' }
};

function buildStatusEmail(p: any) {
  const status = String(p.status || 'Updated').slice(0, 40);
  const copy = STATUS_COPY[status] || { emoji: '📌', headline: `Order status: ${status}`, message: 'The status of your order has been updated.' };
  const orderNumber = String(p.orderNumber || '').slice(0, 40);
  const customerName = String(p.customerName || 'Customer').slice(0, 80);
  const note = String(p.note || '').slice(0, 500);
  const items: any[] = Array.isArray(p.items) ? p.items.slice(0, 30) : [];
  const ship = p.shipment && typeof p.shipment === 'object' ? p.shipment : {};
  const hasTracking = !!ship.trackingNumber;
  const safeUrl = typeof ship.trackingUrl === 'string' && /^https?:\/\//i.test(ship.trackingUrl) ? ship.trackingUrl : '';

  const subject = `${copy.emoji} Order ${orderNumber}: ${copy.headline}`;

  const textLines = [
    `Namaste ${customerName},`,
    '',
    copy.headline + '.',
    copy.message,
    note ? `\nNote from the store: ${note}` : '',
    hasTracking ? `\nCourier: ${ship.courierName || '-'}\nTracking number: ${ship.trackingNumber}${safeUrl ? `\nTrack here: ${safeUrl}` : ''}` : '',
    ship.estimatedDeliveryDate ? `Estimated delivery: ${ship.estimatedDeliveryDate}` : '',
    '',
    `Order number: ${orderNumber}`,
    ...items.map((i) => `- ${i.name} (${i.colorName}) x ${i.quantity}: ${inr(i.totalPaise)}`),
    `Total: ${inr(p.totalPaise)}`,
    '',
    'Kolhapuri Fashion Saree, Shivaji Nagar, Unchgaon, Kolhapur. Ph: 9096863092'
  ].filter((l) => l !== '');

  const itemRows = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 6px 0; font-size: 13px;">${escapeHtml(i.name)}<br><span style="font-size: 11px; color: #766B61;">${escapeHtml(i.colorName)} &times; ${escapeHtml(i.quantity)}</span></td>
        <td style="padding: 6px 0; font-size: 13px; text-align: right; white-space: nowrap;">${inr(i.totalPaise)}</td>
      </tr>`
    )
    .join('');

  const trackingBlock = hasTracking
    ? `
      <div style="margin: 16px 0; padding: 14px; background: #FFFFFF; border: 1px solid #E6E0D8; border-radius: 8px; font-size: 13px; line-height: 1.7;">
        <strong>Courier:</strong> ${escapeHtml(ship.courierName || '-')}<br>
        <strong>Tracking number:</strong> ${escapeHtml(ship.trackingNumber)}<br>
        ${ship.estimatedDeliveryDate ? `<strong>Estimated delivery:</strong> ${escapeHtml(ship.estimatedDeliveryDate)}<br>` : ''}
        ${safeUrl ? `<a href="${escapeHtml(safeUrl)}" style="color: #641D32; font-weight: bold;">Track your parcel</a>` : ''}
      </div>`
    : '';

  const noteBlock = note
    ? `<p style="font-size: 13px; padding: 10px 12px; background: #FFFFFF; border-left: 3px solid #C7A66A; margin: 16px 0;"><strong>Note from the store:</strong> ${escapeHtml(note)}</p>`
    : '';

  const addressBlock = p.address
    ? `<p style="font-size: 12px; color: #766B61; margin: 12px 0 0;"><strong style="color: #292522;">Delivering to:</strong> ${escapeHtml(String(p.address).slice(0, 300))}</p>`
    : '';

  const html = wrapEmail(`
    <p style="font-size: 14px;">Namaste ${escapeHtml(customerName)},</p>
    <div style="text-align: center; margin: 18px 0; padding: 16px; background: #FFFFFF; border: 2px dashed #C7A66A; border-radius: 8px;">
      <div style="font-size: 28px;">${copy.emoji}</div>
      <div style="font-size: 18px; font-weight: bold; color: #641D32; margin-top: 6px;">${escapeHtml(copy.headline)}</div>
      <div style="font-size: 12px; color: #766B61; margin-top: 4px;">Order ${escapeHtml(orderNumber)}</div>
    </div>
    <p style="font-size: 14px; line-height: 1.6;">${escapeHtml(copy.message)}</p>
    ${noteBlock}
    ${trackingBlock}
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px; border-top: 1px solid #E6E0D8;">
      ${itemRows}
      <tr>
        <td style="padding: 10px 0 0; font-size: 14px; font-weight: bold; border-top: 1px solid #E6E0D8;">Total</td>
        <td style="padding: 10px 0 0; font-size: 14px; font-weight: bold; text-align: right; border-top: 1px solid #E6E0D8;">${inr(p.totalPaise)}</td>
      </tr>
    </table>
    ${addressBlock}`);

  return { subject, text: textLines.join('\n'), html };
}

/* ------------------------------------------------------------------ */
/* Dev-server plugin with two endpoints                                */
/* ------------------------------------------------------------------ */
function emailDispatcherPlugin(env: Env): Plugin {
  // 1) OTP emails
  const sendEmailHandler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });
    try {
      const { to, subject, text, otp, validMinutes } = await readJson(req);

      if (!to || !EMAIL_RE.test(to)) return sendJson(res, 400, { success: false, error: 'Valid "to" email is required' });
      if (!otp || !/^\d{6}$/.test(String(otp))) return sendJson(res, 400, { success: false, error: 'A 6-digit "otp" is required' });

      const minutes = Number.isFinite(validMinutes) && validMinutes >= 1 && validMinutes <= 60 ? Math.round(validMinutes) : 10;
      const mail = buildOtpEmail(String(subject || 'Your Kolhapuri Fashion Saree verification code').slice(0, 200), String(otp), minutes, text);

      const result = await deliver(getMailer(env), { to, ...mail }, 'OTP email');
      sendJson(res, 200, { success: true, ...result, to });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err?.message || 'Server error' });
    }
  };

  // 2) Order status emails (Packed, Shipped, Delivered, ...)
  const sendOrderStatusHandler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });
    try {
      const payload = await readJson(req);
      const to = String(payload.to || '').trim();

      if (!EMAIL_RE.test(to)) return sendJson(res, 400, { success: false, error: 'Valid "to" email is required' });
      if (!payload.orderNumber || !payload.status) return sendJson(res, 400, { success: false, error: '"orderNumber" and "status" are required' });

      const mail = buildStatusEmail(payload);
      const result = await deliver(getMailer(env), { to, ...mail }, `Status email (${payload.status}, ${payload.orderNumber})`);
      sendJson(res, 200, { success: true, ...result, to });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err?.message || 'Server error' });
    }
  };

  // Shared by the dev server and the preview server
  const register = (server: { middlewares: ViteDevServer['middlewares'] }) => {
    server.middlewares.use('/api/v1/send-email', sendEmailHandler);
    server.middlewares.use('/api/v1/send-order-status', sendOrderStatusHandler);
  };

  return {
    name: 'email-dispatcher',
    configureServer: register,
    configurePreviewServer: register
  };
}
// function emailDispatcherPlugin(env: Env): Plugin {
//   return {
//     name: 'email-dispatcher',
//     configureServer(server) {
//       // 1) OTP emails
//       server.middlewares.use('/api/v1/send-email', async (req, res) => {
//         if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });
//         try {
//           const { to, subject, text, otp, validMinutes } = await readJson(req);

//           if (!to || !EMAIL_RE.test(to)) return sendJson(res, 400, { success: false, error: 'Valid "to" email is required' });
//           if (!otp || !/^\d{6}$/.test(String(otp))) return sendJson(res, 400, { success: false, error: 'A 6-digit "otp" is required' });

//           const minutes = Number.isFinite(validMinutes) && validMinutes >= 1 && validMinutes <= 60 ? Math.round(validMinutes) : 10;
//           const mail = buildOtpEmail(String(subject || 'Your Kolhapuri Fashion Saree verification code').slice(0, 200), String(otp), minutes, text);

//           const result = await deliver(getMailer(env), { to, ...mail }, 'OTP email');
//           sendJson(res, 200, { success: true, ...result, to });
//         } catch (err: any) {
//           sendJson(res, 500, { success: false, error: err?.message || 'Server error' });
//         }
//       });

//       // 2) Order status emails (Packed, Shipped, Delivered, ...)
//       server.middlewares.use('/api/v1/send-order-status', async (req, res) => {
//         if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });
//         try {
//           const payload = await readJson(req);
//           const to = String(payload.to || '').trim();

//           if (!EMAIL_RE.test(to)) return sendJson(res, 400, { success: false, error: 'Valid "to" email is required' });
//           if (!payload.orderNumber || !payload.status) return sendJson(res, 400, { success: false, error: '"orderNumber" and "status" are required' });

//           const mail = buildStatusEmail(payload);
//           const result = await deliver(getMailer(env), { to, ...mail }, `Status email (${payload.status}, ${payload.orderNumber})`);
//           sendJson(res, 200, { success: true, ...result, to });
//         } catch (err: any) {
//           sendJson(res, 500, { success: false, error: err?.message || 'Server error' });
//         }
//       });
//     }
//   };
// }

export default defineConfig(({ mode }) => {
  // '' prefix = load ALL variables from .env, not just VITE_*
  const env = loadEnv(mode, process.cwd(), '');

  console.log('[ENV CHECK]', {
    cwd: process.cwd(),
    mode,
    hasSmtpUser: !!pick(env, 'SMTP_USER'),
    hasSmtpPass: !!pick(env, 'SMTP_PASS'),
    hasCloudinaryKey: !!pick(env, 'CLOUDINARY_API_KEY'),
    hasCloudinarySecret: !!pick(env, 'CLOUDINARY_API_SECRET')
  });

//   return {
//     plugins: [react(), tailwindcss(), emailDispatcherPlugin(env), cloudinaryPlugin(env)],
//     resolve: {
//       alias: {
//         '@': path.resolve(import.meta.dirname, '.')
//       }
//     },
//     server: {
//       hmr: process.env.DISABLE_HMR !== 'true',
//       watch: process.env.DISABLE_HMR === 'true' ? null : {}
//     }
//   };
// });
  return {
    plugins: [react(), tailwindcss(), emailDispatcherPlugin(env), cloudinaryPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.')
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {}
    },
    preview: {
      allowedHosts: true
    }
  };
});