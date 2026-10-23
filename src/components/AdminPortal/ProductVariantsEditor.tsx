// import { useRef } from "react";
// import type { SareeProduct } from "../../types/index.ts";
// import MultiAngleImageUploader, {
//   MIN_IMAGES,
// } from "../MultiAngleImageUploader";
// export type Variant = SareeProduct["variants"][number];

// export function newVariant(initialStock = 0): Variant {
//   return {
//     variantId: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//     colorName: "",
//     colorHex: "#641D32",
//     sku: "KFS-" + Math.floor(1000 + Math.random() * 9000),
//     originalPricePaise: 0,
//     sellingPricePaise: 0,
//     inventoryStock: initialStock,
//     reservedStock: 0,
//     images: [],
//   } as Variant;
// }

// /** Returns an error message, or '' when everything is valid. */
// export function validateVariants(variants: Variant[] | undefined): string {
//   if (!variants || variants.length === 0)
//     return "Add at least one colour variant.";

//   for (let i = 0; i < variants.length; i++) {
//     const v = variants[i];
//     const label = v.colorName?.trim() ? `"${v.colorName}"` : `Colour ${i + 1}`;

//     if (!v.colorName?.trim()) return `Colour ${i + 1}: enter a colour name.`;
//     if (!v.sku?.trim()) return `${label}: enter a SKU.`;
//     if (!(v.sellingPricePaise > 0)) return `${label}: enter a selling price.`;
//     if (!(v.originalPricePaise > 0))
//       return `${label}: enter the original price.`;
//     if (v.sellingPricePaise > v.originalPricePaise) {
//       return `${label}: selling price cannot be higher than the original price.`;
//     }
//     const photos = (v.images || []).filter(Boolean);
//     if (photos.length < MIN_IMAGES) {
//       return `${label}: add at least ${MIN_IMAGES} photos (different angles).`;
//     }
//   }

//   const skus = variants.map((v) => v.sku.trim().toLowerCase());
//   if (new Set(skus).size !== skus.length)
//     return "Two colours have the same SKU. SKUs must be unique.";

//   return "";
// }

// interface Props {
//   value: Variant[];
//   onChange: (variants: Variant[]) => void;
//   /** true while any colour is uploading photos */
//   onUploadingChange?: (uploading: boolean) => void;
//   /** Stock is editable only for a brand-new saree. Later changes go through the Inventory tab (audit log). */
//   allowStockEdit: boolean;
// }

// const input = "w-full p-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded";

// export default function ProductVariantsEditor({
//   value,
//   onChange,
//   onUploadingChange,
//   allowStockEdit,
// }: Props) {
//   // Refs keep async photo uploads from using stale data.
//   const latest = useRef(value);
//   latest.current = value;
//   const onChangeRef = useRef(onChange);
//   onChangeRef.current = onChange;
//   const busyCount = useRef(0);

//   const update = (index: number, patch: Partial<Variant>) => {
//     onChangeRef.current(
//       latest.current.map((v, i) => (i === index ? { ...v, ...patch } : v)),
//     );
//   };

//   const handleBusy = (busy: boolean) => {
//     busyCount.current = Math.max(0, busyCount.current + (busy ? 1 : -1));
//     onUploadingChange?.(busyCount.current > 0);
//   };

//   const rupees = (paise: number) => (paise > 0 ? Math.round(paise / 100) : "");
//   const toPaise = (text: string) =>
//     Math.max(0, Math.round(Number(text) || 0)) * 100;

//   return (
//     <div className="space-y-4">
//       {value.map((v, index) => (
//         <div
//           key={v.variantId}
//           className="space-y-3 rounded-lg border border-[#E6E0D8] p-4"
//         >
//           <div className="flex items-center justify-between">
//             <h4 className="font-serif text-sm font-bold text-[#292522]">
//               Colour {index + 1}
//               {v.colorName ? ` · ${v.colorName}` : ""}
//             </h4>
//             {value.length > 1 && (
//               <button
//                 type="button"
//                 disabled={(v.reservedStock || 0) > 0}
//                 title={
//                   (v.reservedStock || 0) > 0
//                     ? "Has reserved stock, cannot remove"
//                     : "Remove this colour"
//                 }
//                 onClick={() =>
//                   onChangeRef.current(
//                     latest.current.filter((_, i) => i !== index),
//                   )
//                 }
//                 className="text-[11px] font-semibold text-red-600 underline disabled:opacity-40"
//               >
//                 Remove colour
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//             <div className="col-span-2">
//               <label className="mb-1 block font-semibold">Colour name</label>
//               <input
//                 type="text"
//                 value={v.colorName || ""}
//                 onChange={(e) => update(index, { colorName: e.target.value })}
//                 placeholder="e.g. Royal Purple & Gold"
//                 className={input}
//               />
//             </div>

//             <div>
//               <label className="mb-1 block font-semibold">Swatch</label>
//               <input
//                 type="color"
//                 value={v.colorHex || "#641D32"}
//                 onChange={(e) => update(index, { colorHex: e.target.value })}
//                 className="h-9 w-full rounded border border-[#E6E0D8]"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block font-semibold">SKU</label>
//               <input
//                 type="text"
//                 value={v.sku || ""}
//                 onChange={(e) => update(index, { sku: e.target.value })}
//                 className={`${input} font-mono`}
//               />
//             </div>

//             <div>
//               <label className="mb-1 block font-semibold">
//                 Original price (₹)
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 value={rupees(v.originalPricePaise)}
//                 onChange={(e) =>
//                   update(index, { originalPricePaise: toPaise(e.target.value) })
//                 }
//                 className={input}
//               />
//             </div>

//             <div>
//               <label className="mb-1 block font-semibold">
//                 Selling price (₹)
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 value={rupees(v.sellingPricePaise)}
//                 onChange={(e) =>
//                   update(index, { sellingPricePaise: toPaise(e.target.value) })
//                 }
//                 className={input}
//               />
//             </div>

//             <div className="col-span-2">
//               <label className="mb-1 block font-semibold">Stock</label>
//               {allowStockEdit ? (
//                 <input
//                   type="number"
//                   min={0}
//                   value={v.inventoryStock ?? 0}
//                   onChange={(e) =>
//                     update(index, {
//                       inventoryStock: Math.max(
//                         0,
//                         Math.floor(Number(e.target.value) || 0),
//                       ),
//                     })
//                   }
//                   className={input}
//                 />
//               ) : (
//                 <p className="rounded border border-[#E6E0D8] bg-[#FAF7F0] p-2 text-[#766B61]">
//                   {v.inventoryStock ?? 0} on hand. Change it in the{" "}
//                   <strong>Inventory</strong> tab.
//                 </p>
//               )}
//             </div>
//           </div>

//           <MultiAngleImageUploader
//             value={(v.images || []).filter(Boolean)}
//             onChange={(urls) => update(index, { images: urls })}
//             onUploadingChange={handleBusy}
//           />
//         </div>
//       ))}

//       <button
//         type="button"
//         onClick={() =>
//           onChangeRef.current([
//             ...latest.current,
//             newVariant(allowStockEdit ? 1 : 0),
//           ])
//         }
//         className="rounded border border-dashed border-[#641D32] px-4 py-2 font-semibold text-[#641D32] hover:bg-[#FAF7F0]"
//       >
//         + Add another colour
//       </button>
//     </div>
//   );
// }
import { useRef } from "react";
import type { SareeProduct } from "../../types/index.ts";
import MultiAngleImageUploader, {
  MIN_IMAGES,
} from "../MultiAngleImageUploader";

// Uses YOUR variant type, so field names always match the store.
export type Variant = SareeProduct["variants"][number];

export function newVariant(initialStock = 0): Variant {
  return {
    variantId: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    colorName: "",
    colorHex: "#641D32",
    sku: "KFS-" + Math.floor(1000 + Math.random() * 9000),
    originalPricePaise: 0,
    sellingPricePaise: 0,
    inventoryStock: initialStock,
    reservedStock: 0,
    images: [],
  } as Variant;
}

/** Returns an error message, or '' when everything is valid. */
export function validateVariants(variants: any[]): string {
  if (!variants.length) return "Add at least one colour.";
  for (const v of variants) {
    if (!v.colorName?.trim()) return "Every colour needs a name.";
    if (!v.images || v.images.length < 1)
      return `Add at least 1 photo for "${v.colorName}".`;
    if (!(v.sellingPricePaise > 0))
      return `Set a selling price for "${v.colorName}".`;
  }
  return "";
}
// export function validateVariants(variants: Variant[] | undefined): string {
//   if (!variants || variants.length === 0)
//     return "Add at least one colour variant.";

//   for (let i = 0; i < variants.length; i++) {
//     const v = variants[i];
//     const label = v.colorName?.trim() ? `"${v.colorName}"` : `Colour ${i + 1}`;

//     if (!v.colorName?.trim()) return `Colour ${i + 1}: enter a colour name.`;
//     if (!v.sku?.trim()) return `${label}: enter a SKU.`;
//     if (!(v.sellingPricePaise > 0)) return `${label}: enter a selling price.`;
//     if (!(v.originalPricePaise > 0))
//       return `${label}: enter the original price.`;
//     if (v.sellingPricePaise > v.originalPricePaise) {
//       return `${label}: selling price cannot be higher than the original price.`;
//     }
//     const photos = (v.images || []).filter(Boolean);
//     if (photos.length < MIN_IMAGES) {
//       return `${label}: add at least ${MIN_IMAGES} photos (different angles).`;
//     }
//   }

//   const skus = variants.map((v) => v.sku.trim().toLowerCase());
//   if (new Set(skus).size !== skus.length)
//     return "Two colours have the same SKU. SKUs must be unique.";

//   return "";
// }

interface Props {
  value: Variant[];
  onChange: (variants: Variant[]) => void;
  /** true while any colour is uploading photos */
  onUploadingChange?: (uploading: boolean) => void;
  /** Stock is editable only for a brand-new saree. Later changes go through the Inventory tab (audit log). */
  allowStockEdit: boolean;
}

const input = "w-full p-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded";

export default function ProductVariantsEditor({
  value,
  onChange,
  onUploadingChange,
  allowStockEdit,
}: Props) {
  // Refs keep async photo uploads from using stale data.
  const latest = useRef(value);
  latest.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const busyCount = useRef(0);

  const update = (index: number, patch: Partial<Variant>) => {
    const next = latest.current.map((v, i) =>
      i === index ? { ...v, ...patch } : v,
    );
    latest.current = next; // keep ref current for back-to-back updates
    onChangeRef.current(next);
  };

  const handleBusy = (busy: boolean) => {
    busyCount.current = Math.max(0, busyCount.current + (busy ? 1 : -1));
    onUploadingChange?.(busyCount.current > 0);
  };

  const rupees = (paise: number) => (paise > 0 ? Math.round(paise / 100) : "");
  const toPaise = (text: string) =>
    Math.max(0, Math.round(Number(text) || 0)) * 100;

  return (
    <div className="space-y-4">
      {value.map((v, index) => (
        <div
          key={v.variantId}
          className="space-y-3 rounded-lg border border-[#E6E0D8] p-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-[#292522]">
              Colour {index + 1}
              {v.colorName ? ` · ${v.colorName}` : ""}
            </h4>
            {value.length > 1 && (
              <button
                type="button"
                disabled={(v.reservedStock || 0) > 0}
                title={
                  (v.reservedStock || 0) > 0
                    ? "Has reserved stock, cannot remove"
                    : "Remove this colour"
                }
                onClick={() => {
                  const next = latest.current.filter((_, i) => i !== index);
                  latest.current = next;
                  onChangeRef.current(next);
                }}
                className="text-[11px] font-semibold text-red-600 underline disabled:opacity-40"
              >
                Remove colour
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2">
              <label className="mb-1 block font-semibold">Colour name</label>
              <input
                type="text"
                value={v.colorName || ""}
                onChange={(e) => update(index, { colorName: e.target.value })}
                placeholder="e.g. Royal Purple & Gold"
                className={input}
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold">Swatch</label>
              <input
                type="color"
                value={v.colorHex || "#641D32"}
                onChange={(e) => update(index, { colorHex: e.target.value })}
                className="h-9 w-full rounded border border-[#E6E0D8]"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold">SKU</label>
              <input
                type="text"
                value={v.sku || ""}
                onChange={(e) => update(index, { sku: e.target.value })}
                className={`${input} font-mono`}
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold">
                Original price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={rupees(v.originalPricePaise)}
                onChange={(e) =>
                  update(index, { originalPricePaise: toPaise(e.target.value) })
                }
                className={input}
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold">
                Selling price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={rupees(v.sellingPricePaise)}
                onChange={(e) =>
                  update(index, { sellingPricePaise: toPaise(e.target.value) })
                }
                className={input}
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block font-semibold">Stock</label>
              {allowStockEdit ? (
                <input
                  type="number"
                  min={0}
                  value={v.inventoryStock ?? 0}
                  onChange={(e) =>
                    update(index, {
                      inventoryStock: Math.max(
                        0,
                        Math.floor(Number(e.target.value) || 0),
                      ),
                    })
                  }
                  className={input}
                />
              ) : (
                <p className="rounded border border-[#E6E0D8] bg-[#FAF7F0] p-2 text-[#766B61]">
                  {v.inventoryStock ?? 0} on hand. Change it in the{" "}
                  <strong>Inventory</strong> tab.
                </p>
              )}
            </div>
          </div>

          <MultiAngleImageUploader
            value={(v.images || []).filter(Boolean)}
            onChange={(urls) => update(index, { images: urls })}
            onUploadingChange={handleBusy}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const next = [...latest.current, newVariant(allowStockEdit ? 1 : 0)];
          latest.current = next;
          onChangeRef.current(next);
        }}
        className="rounded border border-dashed border-[#641D32] px-4 py-2 font-semibold text-[#641D32] hover:bg-[#FAF7F0]"
      >
        + Add another colour
      </button>
    </div>
  );
}
