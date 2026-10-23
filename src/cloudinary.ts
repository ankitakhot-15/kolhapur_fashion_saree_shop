// NEW FILE: src/lib/cloudinary.ts
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

export interface UploadedImage {
  url: string;       // secure_url, store this in your product data
  publicId: string;  // store this too if you ever want to delete/replace
  width: number;
  height: number;
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(
  file: File,
  folder: 'kolhapur-saree/products' | 'kolhapur-saree/hero' | 'kolhapur-saree/categories' = 'kolhapur-saree/products'
): Promise<UploadedImage> {
  if (!ALLOWED.includes(file.type)) throw new Error('Only JPG, PNG or WebP images are allowed');
  if (file.size > MAX_BYTES) throw new Error('Image must be under 8 MB');

  // 1) ask our server for a signature
  const signRes = await fetch('/api/v1/cloudinary-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder })
  });
  const sign = await signRes.json();
  if (!sign.success) throw new Error(sign.error || 'Could not get upload signature');

  // 2) upload straight to Cloudinary
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', String(sign.timestamp));
  form.append('folder', sign.folder);
  form.append('signature', sign.signature);

  const upRes = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: 'POST',
    body: form
  });
  const data = await upRes.json();
  if (!upRes.ok) throw new Error(data?.error?.message || 'Cloudinary upload failed');

  return { url: data.secure_url, publicId: data.public_id, width: data.width, height: data.height };
}

/**
 * Optimised delivery URL: auto format (WebP/AVIF), auto quality, resized.
 * Works with a full Cloudinary URL or a bare public_id.
 * Non-Cloudinary URLs (old images) are returned unchanged.
 */
export function cldUrl(src: string, width = 800): string {
  if (!src) return '';
  const t = `f_auto,q_auto,w_${width},c_limit`;
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    return src.replace('/upload/', `/upload/${t}/`);
  }
  if (!/^https?:\/\//.test(src) && !src.startsWith('/') && !src.startsWith('data:')) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${src}`;
  }
  return src;
}