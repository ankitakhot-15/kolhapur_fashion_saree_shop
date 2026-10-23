import { useCallback, useEffect, useState } from 'react';
import { cld } from '../lib/cloudinaryUrl';
import type { UploadFolder } from '../lib/uploadImage';

export interface GalleryImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  createdAt?: string;
}

interface Props {
  folder?: UploadFolder;
  onSelect?: (img: GalleryImage) => void;
  selectedUrl?: string;
  refreshKey?: number; // change this number to force a reload (e.g. after an upload)
}

export default function CloudinaryGallery({
  folder = 'kolhapur-saree/products',
  onSelect,
  selectedUrl,
  refreshKey = 0
}: Props) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = useCallback(
    async (cursor?: string | null) => {
      const qs = new URLSearchParams({ folder });
      if (cursor) qs.set('cursor', cursor);

      const res = await fetch(`/api/v1/cloudinary-list?${qs.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not load images');
      }
      return data as { images: GalleryImage[]; nextCursor: string | null };
    },
    [folder]
  );

  // Initial load / reload
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchPage()
      .then((d) => {
        if (cancelled) return;
        setImages(d.images);
        setNextCursor(d.nextCursor);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchPage, refreshKey]);

  const loadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const d = await fetchPage(nextCursor);
      setImages((prev) => [...prev, ...d.images]);
      setNextCursor(d.nextCursor);
    } catch (e: any) {
      setError(e.message || 'Could not load more images');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading images…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!images.length) return <p className="text-sm text-gray-500">No images in this folder yet.</p>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img) => {
          const selected = selectedUrl === img.url;
          return (
            <button
              type="button"
              key={img.publicId}
              onClick={() => onSelect?.(img)}
              className={`overflow-hidden rounded border-2 focus:outline-none ${
                selected ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
              title={img.publicId}
            >
              <img
                src={cld(img.url, { w: 300, h: 400 })}
                alt={img.publicId}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover"
              />
            </button>
          );
        })}
      </div>

      {nextCursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 rounded border px-4 py-2 text-sm disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}