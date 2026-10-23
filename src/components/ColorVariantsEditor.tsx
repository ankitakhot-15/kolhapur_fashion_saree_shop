import { useRef } from "react";
import MultiAngleImageUploader, { MIN_IMAGES } from "./MultiAngleImageUploader";

export interface ColorVariant {
  name: string;
  hex: string; 
  stock: number;
  images: string[]; 
}

export const emptyColor = (): ColorVariant => ({
  name: "",
  hex: "#641D32",
  stock: 0,
  images: [],
});

/** Returns an error message, or '' when all colours are valid. */
export function validateColors(colors: ColorVariant[]): string {
  if (colors.length === 0) return "Add at least one colour.";
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    if (!c.name.trim()) return `Colour ${i + 1}: enter a colour name.`;
    if (!Number.isFinite(c.stock) || c.stock < 0)
      return `Colour "${c.name}": stock must be 0 or more.`;
    if (c.images.length < MIN_IMAGES) {
      return `Colour "${c.name}": add at least ${MIN_IMAGES} photos.`;
    }
  }
  return "";
}

interface Props {
  value: ColorVariant[];
  onChange: (colors: ColorVariant[]) => void;
  /** true while ANY colour is uploading. Use it to disable the Save button. */
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ColorVariantsEditor({
  value,
  onChange,
  onUploadingChange,
}: Props) {
  // Always read the newest list inside async upload callbacks.
  const latest = useRef(value);
  latest.current = value;

  // How many colours are uploading right now.
  const busyCount = useRef(0);

  const update = (index: number, patch: Partial<ColorVariant>) => {
    onChange(
      latest.current.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  };

  const handleBusy = (busy: boolean) => {
    busyCount.current = Math.max(0, busyCount.current + (busy ? 1 : -1));
    onUploadingChange?.(busyCount.current > 0);
  };

  return (
    <div className="space-y-6">
      {value.map((color, index) => (
        <div key={index} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Colour {index + 1}</h4>
            {value.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  onChange(latest.current.filter((_, i) => i !== index))
                }
                className="text-xs text-red-600 underline"
              >
                Remove colour
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs text-gray-600">
                Colour name
              </span>
              <input
                type="text"
                value={color.name}
                onChange={(e) => update(index, { name: e.target.value })}
                placeholder="e.g. Maroon"
                className="w-full rounded border px-3 py-2"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block text-xs text-gray-600">Swatch</span>
              <input
                type="color"
                value={color.hex}
                onChange={(e) => update(index, { hex: e.target.value })}
                className="h-10 w-full rounded border"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block text-xs text-gray-600">Stock</span>
              <input
                type="number"
                min={0}
                value={Number.isFinite(color.stock) ? color.stock : 0}
                onChange={(e) =>
                  update(index, {
                    stock: Math.max(0, Math.floor(Number(e.target.value) || 0)),
                  })
                }
                className="w-full rounded border px-3 py-2"
              />
            </label>
          </div>

          <MultiAngleImageUploader
            value={color.images}
            onChange={(urls) => update(index, { images: urls })}
            onUploadingChange={handleBusy}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...latest.current, emptyColor()])}
        className="rounded border border-dashed px-4 py-2 text-sm"
      >
        + Add another colour
      </button>
    </div>
  );
}
