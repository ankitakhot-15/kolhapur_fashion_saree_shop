import { useState } from 'react';
import { uploadImage, type UploadFolder } from '../lib/uploadImage';
import { cld } from '../lib/cloudinaryUrl';
import CloudinaryGallery from './CloudinaryGallery';

interface Props {
  value: string; // current image URL
  onChange: (url: string) => void;
  folder?: UploadFolder;
}

export default function ProductImagePicker({
  value,
  onChange,
  folder = 'kolhapur-saree/products'
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(file, folder);
      onChange(url);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <img
          src={cld(value, { w: 300, h: 400 })}
          alt="Selected"
          className="w-40 aspect-[3/4] object-cover rounded border"
        />
      ) : (
        <div className="w-40 aspect-[3/4] rounded border border-dashed flex items-center justify-center text-xs text-gray-400">
          No image
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded bg-black px-4 py-2 text-sm text-white">
          {uploading ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowGallery((s) => !s)}
          className="rounded border px-4 py-2 text-sm"
        >
          {showGallery ? 'Hide library' : 'Choose from library'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showGallery && (
        <CloudinaryGallery
          folder={folder}
          selectedUrl={value}
          refreshKey={refreshKey}
          onSelect={(img) => onChange(img.url)}
        />
      )}
    </div>
  );
}