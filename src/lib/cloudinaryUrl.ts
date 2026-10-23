// Adds Cloudinary transformations (auto format, auto quality, resize)
// to a stored secure_url. Non-Cloudinary URLs are returned unchanged.

export interface CldOptions {
  w?: number;
  h?: number;
  crop?: 'fill' | 'fit' | 'limit';
}

export function cld(url: string | undefined | null, opts: CldOptions = {}): string {
  if (!url) return '';
  const marker = '/image/upload/';
  if (!url.includes(marker)) return url;

  const t: string[] = ['f_auto', 'q_auto'];
  if (opts.w) t.push(`w_${opts.w}`);
  if (opts.h) t.push(`h_${opts.h}`);
  if (opts.w || opts.h) t.push(`c_${opts.crop ?? 'fill'}`);

  return url.replace(marker, `${marker}${t.join(',')}/`);
}