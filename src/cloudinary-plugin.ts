
// import crypto from 'node:crypto';
// import type { IncomingMessage, ServerResponse } from 'node:http';
// import type { Plugin } from 'vite';

// type Env = Record<string, string>;

// const pick = (env: Env, key: string) => (env[key] || process.env[key] || '').trim();

// // Only these folders may be used.
// const ALLOWED_FOLDERS = [
//   'kolhapur-saree/products',
//   'kolhapur-saree/hero',
//   'kolhapur-saree/categories'
// ];

// function sendJson(res: ServerResponse, status: number, payload: unknown) {
//   res.statusCode = status;
//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify(payload));
// }

// function readJson(req: IncomingMessage, limit = 5_000): Promise<any> {
//   return new Promise((resolve, reject) => {
//     let body = '';
//     req.on('data', (chunk) => {
//       body += chunk;
//       if (body.length > limit) {
//         reject(new Error('Request too large'));
//         req.destroy();
//       }
//     });
//     req.on('end', () => {
//       try {
//         resolve(JSON.parse(body || '{}'));
//       } catch {
//         reject(new Error('Invalid JSON'));
//       }
//     });
//     req.on('error', reject);
//   });
// }

// export function cloudinaryPlugin(env: Env): Plugin {
//   const cloudName = pick(env, 'CLOUDINARY_CLOUD_NAME') || pick(env, 'VITE_CLOUDINARY_CLOUD_NAME');
//   const apiKey = pick(env, 'CLOUDINARY_API_KEY');
//   const apiSecret = pick(env, 'CLOUDINARY_API_SECRET');

//   const missing = [
//     !cloudName && 'CLOUDINARY_CLOUD_NAME',
//     !apiKey && 'CLOUDINARY_API_KEY',
//     !apiSecret && 'CLOUDINARY_API_SECRET'
//   ].filter(Boolean) as string[];

//   if (missing.length) {
//     console.warn(`[CLOUDINARY] Missing in .env: ${missing.join(', ')}. Uploads will fail until they are set.`);
//   } else {
//     console.log('[CLOUDINARY] Configured for cloud:', cloudName);
//   }

//   // POST /api/v1/cloudinary-sign  -> returns an upload signature
//   const signHandler = async (req: IncomingMessage, res: ServerResponse) => {
//     if (req.method !== 'POST') {
//       return sendJson(res, 405, { success: false, error: 'Method not allowed' });
//     }
//     if (missing.length) {
//       return sendJson(res, 500, {
//         success: false,
//         error: `Cloudinary env vars missing in .env: ${missing.join(', ')}`
//       });
//     }

//     try {
//       const { folder = 'kolhapur-saree/products' } = await readJson(req);
//       if (!ALLOWED_FOLDERS.includes(folder)) {
//         return sendJson(res, 400, { success: false, error: 'Folder not allowed' });
//       }

//       const timestamp = Math.floor(Date.now() / 1000);
//       // Params to sign: alphabetical, joined with &, secret appended, SHA-1.
//       const toSign = `folder=${folder}&timestamp=${timestamp}`;
//       const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');

//       sendJson(res, 200, { success: true, cloudName, apiKey, timestamp, folder, signature });
//     } catch (e: any) {
//       sendJson(res, 500, { success: false, error: e?.message || 'Server error' });
//     }
//   };

//   // GET /api/v1/cloudinary-list?folder=...&cursor=...  -> lists images in a folder
//   const listHandler = async (req: IncomingMessage, res: ServerResponse) => {
//     if (req.method !== 'GET') {
//       return sendJson(res, 405, { success: false, error: 'Method not allowed' });
//     }
//     if (missing.length) {
//       return sendJson(res, 500, {
//         success: false,
//         error: `Cloudinary env vars missing in .env: ${missing.join(', ')}`
//       });
//     }

//     try {
//       const reqUrl = new URL(req.url || '', 'http://localhost');
//       const folder = reqUrl.searchParams.get('folder') || 'kolhapur-saree/products';
//       const cursor = reqUrl.searchParams.get('cursor');

//       if (!ALLOWED_FOLDERS.includes(folder)) {
//         return sendJson(res, 400, { success: false, error: 'Folder not allowed' });
//       }

//       const params = new URLSearchParams({
//         prefix: `${folder}/`,
//         max_results: '50'
//       });
//       if (cursor) params.set('next_cursor', cursor);

//       const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params.toString()}`;
//       const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

//       const r = await fetch(apiUrl, { headers: { Authorization: `Basic ${auth}` } });
//       const data: any = await r.json().catch(() => ({}));

//       if (!r.ok) {
//         return sendJson(res, r.status, {
//           success: false,
//           error: data?.error?.message || 'Cloudinary request failed'
//         });
//       }

//       const images = (data.resources || []).map((x: any) => ({
//         url: x.secure_url as string,
//         publicId: x.public_id as string,
//         width: x.width as number,
//         height: x.height as number,
//         createdAt: x.created_at as string
//       }));

//       sendJson(res, 200, { success: true, images, nextCursor: data.next_cursor || null });
//     } catch (e: any) {
//       sendJson(res, 500, { success: false, error: e?.message || 'Server error' });
//     }
//   };

//   return {
//     name: 'cloudinary-signer',
//     configureServer(server) {
//       server.middlewares.use('/api/v1/cloudinary-sign', signHandler);
//       server.middlewares.use('/api/v1/cloudinary-list', listHandler);
//     },
//     configurePreviewServer(server) {
//       server.middlewares.use('/api/v1/cloudinary-sign', signHandler);
//       server.middlewares.use('/api/v1/cloudinary-list', listHandler);
//     }
//   };
// }

// Signs Cloudinary upload requests and lists images, so the API secret
// never reaches the browser.
import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

type Env = Record<string, string>;

const pick = (env: Env, key: string) => (env[key] || process.env[key] || '').trim();

// Only these folders may be used.
const ALLOWED_FOLDERS = [
  'kolhapur-saree/products',
  'kolhapur-saree/hero',
  'kolhapur-saree/categories'
];

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readJson(req: IncomingMessage, limit = 5_000): Promise<any> {
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

export function cloudinaryPlugin(env: Env): Plugin {
  const cloudName = pick(env, 'CLOUDINARY_CLOUD_NAME') || pick(env, 'VITE_CLOUDINARY_CLOUD_NAME');
  const apiKey = pick(env, 'CLOUDINARY_API_KEY');
  const apiSecret = pick(env, 'CLOUDINARY_API_SECRET');

  const missing = [
    !cloudName && 'CLOUDINARY_CLOUD_NAME',
    !apiKey && 'CLOUDINARY_API_KEY',
    !apiSecret && 'CLOUDINARY_API_SECRET'
  ].filter(Boolean) as string[];

  if (missing.length) {
    console.warn(`[CLOUDINARY] Missing in .env: ${missing.join(', ')}. Uploads will fail until they are set.`);
  } else {
    console.log('[CLOUDINARY] Configured for cloud:', cloudName);
  }

  // POST /api/v1/cloudinary-sign -> returns an upload signature
  const signHandler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { success: false, error: 'Method not allowed' });
    }
    if (missing.length) {
      return sendJson(res, 500, {
        success: false,
        error: `Cloudinary env vars missing in .env: ${missing.join(', ')}`
      });
    }

    try {
      const { folder = 'kolhapur-saree/products' } = await readJson(req);
      if (!ALLOWED_FOLDERS.includes(folder)) {
        return sendJson(res, 400, { success: false, error: 'Folder not allowed' });
      }

      const timestamp = Math.floor(Date.now() / 1000);
      // Params to sign: alphabetical, joined with &, secret appended, SHA-1.
      const toSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');

      sendJson(res, 200, { success: true, cloudName, apiKey, timestamp, folder, signature });
    } catch (e: any) {
      sendJson(res, 500, { success: false, error: e?.message || 'Server error' });
    }
  };

  // GET /api/v1/cloudinary-list?folder=...&cursor=... -> lists images in a folder
  const listHandler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'GET') {
      return sendJson(res, 405, { success: false, error: 'Method not allowed' });
    }
    if (missing.length) {
      return sendJson(res, 500, {
        success: false,
        error: `Cloudinary env vars missing in .env: ${missing.join(', ')}`
      });
    }

    try {
      const reqUrl = new URL(req.url || '', 'http://localhost');
      const folder = reqUrl.searchParams.get('folder') || 'kolhapur-saree/products';
      const cursor = reqUrl.searchParams.get('cursor');

      if (!ALLOWED_FOLDERS.includes(folder)) {
        return sendJson(res, 400, { success: false, error: 'Folder not allowed' });
      }

      const params = new URLSearchParams({
        prefix: `${folder}/`,
        max_results: '50'
      });
      if (cursor) params.set('next_cursor', cursor);

      const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params.toString()}`;
      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

      const r = await fetch(apiUrl, { headers: { Authorization: `Basic ${auth}` } });
      const data: any = await r.json().catch(() => ({}));

      if (!r.ok) {
        return sendJson(res, r.status, {
          success: false,
          error: data?.error?.message || 'Cloudinary request failed'
        });
      }

      const images = (data.resources || []).map((x: any) => ({
        url: x.secure_url as string,
        publicId: x.public_id as string,
        width: x.width as number,
        height: x.height as number,
        createdAt: x.created_at as string
      }));

      sendJson(res, 200, { success: true, images, nextCursor: data.next_cursor || null });
    } catch (e: any) {
      sendJson(res, 500, { success: false, error: e?.message || 'Server error' });
    }
  };

  return {
    name: 'cloudinary-signer',
    configureServer(server) {
      server.middlewares.use('/api/v1/cloudinary-sign', signHandler);
      server.middlewares.use('/api/v1/cloudinary-list', listHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/v1/cloudinary-sign', signHandler);
      server.middlewares.use('/api/v1/cloudinary-list', listHandler);
    }
  };
}