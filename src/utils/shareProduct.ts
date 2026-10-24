

import { cld } from '../lib/cloudinaryUrl.ts';
import { formatPriceINR } from './formatters.ts';

interface ShareArgs {
  slug: string;
  name: string;
  pricePaise: number;
  image?: string;
}

export const productUrl = (slug: string) =>
  `${window.location.origin}/?product=${encodeURIComponent(slug)}`;

export async function shareProduct({ slug, name, pricePaise, image }: ShareArgs) {
  const url = productUrl(slug);
  const text = `${name}\n${formatPriceINR(pricePaise)}\n${url}`;
  const imageUrl = image ? cld(image, { w: 1000, h: 1000 }) : '';

  try {
    if (imageUrl && typeof navigator.canShare === 'function') {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${slug}.jpg`, { type: blob.type || 'image/jpeg' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: name, text });
        return;
      }
    }
    if (navigator.share) {
      await navigator.share({ title: name, text, url });
      return;
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') return;
  }

  const msg = imageUrl ? `${text}\n${imageUrl}` : text;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}