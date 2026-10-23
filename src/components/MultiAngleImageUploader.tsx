import { useRef, useState } from 'react';
import { uploadImage, type UploadFolder } from '../lib/uploadImage';
import { compressImage } from '../lib/compressImage';
import { cld } from '../lib/cloudinaryUrl';

export const MIN_IMAGES = 2;
export const MAX_IMAGES = 4;

const ANGLE_LABELS = ['Front (full saree)', 'Pallu', 'Border close-up', 'Back / Detail'];

interface Props {
  value: string[]; // image URLs, in order. First one is the main photo.
  onChange: (urls: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  folder?: UploadFolder;
}

export default function MultiAngleImageUploader({
  value,
  onChange,
  onUploadingChange,
  folder = 'kolhapur-saree/products'
}: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceIndex = useRef<number>(-1);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const remaining = MAX_IMAGES - value.length;

  const setBusy = (busy: boolean) => {
    setUploading(busy);
    onUploadingChange?.(busy);
  };

  // Upload files one after another and append them in order.
  const addFiles = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    setError('');

    const files = Array.from(fileList);
    if (files.length > remaining) {
      setError(
        `You can add only ${remaining} more photo${remaining === 1 ? '' : 's'}. Extra photos were ignored.`
      );
    }
    const toUpload = files.slice(0, remaining);

    setBusy(true);
    let current = [...value];
    try {
      for (let i = 0; i < toUpload.length; i++) {
        setProgress(`Uploading ${i + 1} of ${toUpload.length}…`);
        const small = await compressImage(toUpload[i]);
        const { url } = await uploadImage(small, folder);
        current = [...current, url];
        onChange(current); // show each photo as soon as it finishes
      }
    } catch (e: any) {
      setError(e?.message || 'Upload failed. Please try again.');
    } finally {
      setProgress('');
      setBusy(false);
    }
  };

  const replaceFile = async (fileList: FileList | null) => {
    const index = replaceIndex.current;
    if (!fileList?.[0] || index < 0) return;
    setError('');
    setBusy(true);
    setProgress('Uploading…');
    try {
      const small = await compressImage(fileList[0]);
      const { url } = await uploadImage(small, folder);
      const next = [...value];
      next[index] = url;
      onChange(next);
    } catch (e: any) {
      setError(e?.message || 'Upload failed. Please try again.');
    } finally {
      replaceIndex.current = -1;
      setProgress('');
      setBusy(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const makeMain = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  };

  // Reset input value so choosing the same file again still fires onChange.
  const handleInput =
    (fn: (files: FileList | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      fn(files);
      e.target.value = '';
    };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">
          Saree photos ({value.length}/{MAX_IMAGES})
        </p>
        <p className="text-xs text-gray-500">
          Add {MIN_IMAGES} to {MAX_IMAGES} photos from different angles
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div key={url + i} className="space-y-1">
            <div className="relative overflow-hidden rounded border">
              <img
                src={cld(url, { w: 300, h: 400 })}
                alt={ANGLE_LABELS[i]}
                className="w-full aspect-[3/4] object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                  Main
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">{ANGLE_LABELS[i]}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  replaceIndex.current = i;
                  replaceRef.current?.click();
                }}
                className="underline disabled:opacity-40"
              >
                Replace
              </button>
              {i !== 0 && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => makeMain(i)}
                  className="underline disabled:opacity-40"
                >
                  Make main
                </button>
              )}
              <button
                type="button"
                disabled={uploading}
                onClick={() => removeAt(i)}
                className="text-red-600 underline disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Next empty slot */}
        {remaining > 0 && (
          <div className="space-y-1">
            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded border border-dashed p-2 text-center text-xs text-gray-500">
              {uploading ? (
                <span>{progress || 'Uploading…'}</span>
              ) : (
                <>
                  <span>{ANGLE_LABELS[value.length]}</span>
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="w-full rounded bg-black px-2 py-1.5 text-white"
                  >
                    Take photo
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="w-full rounded border px-2 py-1.5"
                  >
                    From gallery
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {value.length < MIN_IMAGES && !uploading && (
        <p className="text-xs text-amber-700">
          Please add at least {MIN_IMAGES} photos ({MIN_IMAGES - value.length} more).
        </p>
      )}

      {/* Hidden inputs. `capture` opens the rear camera on phones. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInput(addFiles)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleInput(addFiles)}
      />
      <input
        ref={replaceRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleInput(replaceFile)}
      />
    </div>
  );
}