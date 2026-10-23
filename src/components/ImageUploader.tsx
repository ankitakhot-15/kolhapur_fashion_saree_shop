// NEW FILE: src/components/ImageUploader.tsx
// Drop this into your admin "Add / Edit Saree" form.
import { useRef, useState } from 'react';
import { uploadImage, cldUrl } from '../cloudinary';

interface Props {
  images: string[];                    // current image URLs
  onChange: (urls: string[]) => void;  // save these into your product state
  folder?: 'kolhapur-saree/products' | 'kolhapur-saree/hero' | 'kolhapur-saree/categories';
  max?: number;
}

export default function ImageUploader({ images, onChange, folder = 'kolhapur-saree/products', max = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    setBusy(true);
    try {
      const room = max - images.length;
      const picked = Array.from(files).slice(0, Math.max(room, 0));
      const uploaded = await Promise.all(picked.map((f) => uploadImage(f, folder)));
      onChange([...images, ...uploaded.map((u) => u.url)]);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="relative h-24 w-20 overflow-hidden rounded border">
            <img src={cldUrl(url, 200)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute right-0 top-0 bg-black/60 px-1 text-xs text-white"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {images.length < max && (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded border px-3 py-2 text-sm disabled:opacity-50"
        >
          {busy ? 'Uploading…' : 'Upload images'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}