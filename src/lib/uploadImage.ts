// Browser helper: gets a signature from our server, then uploads the image
// directly to Cloudinary. The API secret never reaches the browser.

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Must be one of the folders allowed in src/cloudinary-plugin.ts
export type UploadFolder =
  | 'kolhapur-saree/products'
  | 'kolhapur-saree/hero'
  | 'kolhapur-saree/categories';

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImage(
  file: File,
  folder: UploadFolder = 'kolhapur-saree/products'
): Promise<UploadedImage> {
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) {
    throw new Error('Please choose a PNG, JPG, WEBP or GIF image');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image is too large (max 8 MB)');
  }

  // 1) Ask our server for a signature
  const signRes = await fetch('/api/v1/cloudinary-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder })
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok || !sign.success) {
    throw new Error(sign.error || 'Could not get upload signature');
  }

  // 2) Upload directly to Cloudinary
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
  const data = await upRes.json().catch(() => ({}));
  if (!upRes.ok) {
    throw new Error(data?.error?.message || 'Image upload failed');
  }

  return { url: data.secure_url, publicId: data.public_id };
}