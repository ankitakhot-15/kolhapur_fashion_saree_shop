// import React, { useState } from "react";
// import { X, Check, ShoppingBag, ShieldCheck } from "lucide-react";
// import { SareeProduct, SareeVariant } from "../types/index.ts";
// import {
//   formatPriceINR,
//   calculateDiscountPercent,
// } from "../utils/formatters.ts";
// import { storeService } from "../services/storeService.ts";

// interface ProductQuickViewModalProps {
//   product: SareeProduct | null;
//   onClose: () => void;
//   onViewFullDetails: (product: SareeProduct) => void;
//   onAddToCartSuccess?: (message: string) => void;
// }

// export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
//   product,
//   onClose,
//   onViewFullDetails,
//   onAddToCartSuccess,
// }) => {
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [selectedImage, setSelectedImage] = useState<string>(
//     product?.variants[0]?.images[0] || product?.primaryImage || "",
//   );
//   const [quantity, setQuantity] = useState(1);

//   if (!product) return null;

//   const variant: SareeVariant =
//     product.variants[selectedVariantIndex] || product.variants[0];
//   const originalPrice = variant.originalPricePaise;
//   const sellingPrice = variant.sellingPricePaise;
//   const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
//   const availableStock = variant.inventoryStock - variant.reservedStock;
//   const isOutOfStock = availableStock <= 0;

//   const handleVariantSelect = (idx: number) => {
//     setSelectedVariantIndex(idx);
//     const v = product.variants[idx];
//     if (v && v.images?.length > 0) {
//       setSelectedImage(v.images[0]);
//     }
//   };

//   const handleAddToCart = () => {
//     if (isOutOfStock) return;
//     storeService.addToCart({
//       productId: product.id,
//       variantId: variant.variantId,
//       productName: product.name,
//       colorName: variant.colorName,
//       colorHex: variant.colorHex,
//       image: selectedImage,
//       sellingPricePaise: variant.sellingPricePaise,
//       originalPricePaise: variant.originalPricePaise,
//       quantity,
//       sku: variant.sku,
//       fabric: product.fabric,
//     });
//     if (onAddToCartSuccess) {
//       onAddToCartSuccess(
//         `Added ${quantity} × ${product.name} (${variant.colorName}) to your shopping bag.`,
//       );
//     }
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
//       <div
//         className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] max-h-[90vh] flex flex-col md:flex-row"
//         role="dialog"
//         aria-modal="true"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#292522] shadow-sm transition-colors"
//           aria-label="Close modal"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {/* Left: Gallery preview */}
//         <div className="w-full md:w-1/2 bg-[#FAF7F0] p-6 flex flex-col justify-center items-center">
//           <div className="relative aspect-[3/4] w-full max-w-[280px] rounded-lg overflow-hidden border border-[#E6E0D8] shadow-sm">
//             <img
//               src={selectedImage}
//               alt={product.name}
//               referrerPolicy="no-referrer"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           {/* Thumbnails */}
//           {product.galleryImages.length > 1 && (
//             <div className="flex gap-2 mt-4">
//               {product.galleryImages.slice(0, 4).map((img, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSelectedImage(img)}
//                   className={`w-12 h-12 rounded border overflow-hidden transition-all ${
//                     selectedImage === img
//                       ? "ring-2 ring-[#641D32]"
//                       : "opacity-70 hover:opacity-100"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt="Thumbnail"
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right: Contiguous Purchase Module */}
//         <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
//           <div className="space-y-4">
//             <div className="text-xs text-[#766B61] flex items-center gap-1.5 font-medium">
//               <span>{product.fabric}</span>
//               <span aria-hidden="true">·</span>
//               <span>SKU: {variant.sku}</span>
//             </div>

//             <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] leading-snug">
//               {product.name}
//             </h2>

//             {/* Price display */}
//             <div className="flex items-baseline gap-3 pt-1">
//               <span className="text-2xl font-bold text-[#641D32] tabular-nums font-sans">
//                 {formatPriceINR(sellingPrice)}
//               </span>
//               {originalPrice > sellingPrice && (
//                 <>
//                   <span className="text-sm text-[#766B61] line-through tabular-nums">
//                     {formatPriceINR(originalPrice)}
//                   </span>
//                   <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
//                     Save {discountPercent}%
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Color selection */}
//             <div>
//               <label className="text-xs font-semibold text-[#292522] block mb-2">
//                 Color:{" "}
//                 <span className="font-normal text-[#766B61]">
//                   {variant.colorName}
//                 </span>
//               </label>
//               <div className="flex items-center gap-2">
//                 {product.variants.map((v, idx) => (
//                   <button
//                     key={v.variantId}
//                     onClick={() => handleVariantSelect(idx)}
//                     className={`relative w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
//                       idx === selectedVariantIndex
//                         ? "ring-2 ring-[#641D32] ring-offset-2 scale-105"
//                         : "border-[#E6E0D8]"
//                     }`}
//                     style={{ backgroundColor: v.colorHex }}
//                     title={v.colorName}
//                   >
//                     {idx === selectedVariantIndex && (
//                       <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity Selector */}
//             <div className="pt-2">
//               <label className="text-xs font-semibold text-[#292522] block mb-2">
//                 Quantity
//               </label>
//               <div className="flex items-center gap-3">
//                 <div className="inline-flex items-center border border-[#E6E0D8] rounded-md bg-[#FAF7F0]">
//                   <button
//                     type="button"
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     disabled={quantity <= 1}
//                     className="px-3 py-1 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
//                   >
//                     -
//                   </button>
//                   <span className="px-3 text-sm font-semibold tabular-nums">
//                     {quantity}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setQuantity(Math.min(availableStock, quantity + 1))
//                     }
//                     disabled={quantity >= availableStock}
//                     className="px-3 py-1 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
//                   >
//                     +
//                   </button>
//                 </div>
//                 <span className="text-xs text-[#766B61]">
//                   {availableStock > 0
//                     ? `${availableStock} units available`
//                     : "Out of stock"}
//                 </span>
//               </div>
//             </div>

//             {/* Highlights */}
//             <div className="pt-2 border-t border-[#E6E0D8] text-xs text-[#766B61] space-y-1.5">
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
//                 <span>Includes {product.blousePiece.toLowerCase()}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
//                 <span>
//                   Length: {product.lengthMeters} meters with running blouse
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action CTAs */}
//           <div className="pt-6 space-y-2 border-t border-[#E6E0D8] mt-4">
//             <button
//               onClick={handleAddToCart}
//               disabled={isOutOfStock}
//               className="w-full py-3 bg-[#641D32] text-white hover:bg-[#4A1223] font-semibold text-sm rounded-md shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
//             >
//               <ShoppingBag className="w-4 h-4" />
//               <span>{isOutOfStock ? "Sold Out" : "Add to Shopping Bag"}</span>
//             </button>

//             <button
//               onClick={() => {
//                 onClose();
//                 onViewFullDetails(product);
//               }}
//               className="w-full py-2.5 bg-transparent hover:bg-[#FAF7F0] text-xs font-semibold text-[#641D32] rounded-md transition-colors"
//             >
//               View Full Saree Specifications & Pallu Details →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useMemo, useState } from "react";
import { X, Check, ShoppingBag, ShieldCheck } from "lucide-react";
import { SareeProduct, SareeVariant } from "../types/index.ts";
import {
  formatPriceINR,
  calculateDiscountPercent,
} from "../utils/formatters.ts";
import { storeService } from "../services/storeService.ts";
import { ProductGallery } from "./ProductGallery.tsx";

interface ProductQuickViewModalProps {
  product: SareeProduct | null;
  onClose: () => void;
  onViewFullDetails: (product: SareeProduct) => void;
  onAddToCartSuccess?: (message: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
  onAddToCartSuccess,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // The modal stays mounted while `product` changes (null -> product -> null),
  // so state must be reset whenever a different saree is opened.
  useEffect(() => {
    setSelectedVariantIndex(0);
    setQuantity(1);
  }, [product?.id]);

  // Esc closes the modal and the page behind it does not scroll
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  const variant: SareeVariant | null = product
    ? product.variants[selectedVariantIndex] || product.variants[0]
    : null;

  // The selected colour's own photos (2-4). Falls back to the product gallery.
  const images = useMemo(() => {
    if (!product || !variant) return [];
    const own = (variant.images || []).filter(Boolean);
    const list =
      own.length >= 2
        ? own
        : [...own, ...product.galleryImages, product.primaryImage];
    return list
      .filter((img, i, arr) => !!img && arr.indexOf(img) === i)
      .slice(0, 4);
  }, [product, variant]);

  if (!product || !variant) return null;

  const originalPrice = variant.originalPricePaise;
  const sellingPrice = variant.sellingPricePaise;
  const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
  const availableStock = variant.inventoryStock - variant.reservedStock;
  const isOutOfStock = availableStock <= 0;

  const handleVariantSelect = (idx: number) => {
    setSelectedVariantIndex(idx);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    storeService.addToCart({
      productId: product.id,
      variantId: variant.variantId,
      productName: product.name,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      image: images[0] || product.primaryImage,
      sellingPricePaise: variant.sellingPricePaise,
      originalPricePaise: variant.originalPricePaise,
      quantity,
      sku: variant.sku,
      fabric: product.fabric,
    });
    if (onAddToCartSuccess) {
      onAddToCartSuccess(
        `Added ${quantity} × ${product.name} (${variant.colorName}) to your shopping bag.`,
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] max-h-[92vh] flex flex-col md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#292522] shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: photos of the selected colour (2-4, adaptive layouts) */}
        <div className="w-full md:w-1/2 bg-[#FAF7F0] p-4 sm:p-6 overflow-y-auto">
          <ProductGallery
            images={images}
            alt={product.name}
            seed={product.id}
            compact
            badge={discountPercent > 0 ? `${discountPercent}% OFF` : undefined}
          />
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="text-xs text-[#766B61] flex items-center gap-1.5 font-medium pr-10">
              <span>{product.fabric}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {variant.sku}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] leading-snug">
              {product.name}
            </h2>

            {/* Price display */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-[#641D32] tabular-nums font-sans">
                {formatPriceINR(sellingPrice)}
              </span>
              {originalPrice > sellingPrice && (
                <>
                  <span className="text-sm text-[#766B61] line-through tabular-nums">
                    {formatPriceINR(originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Color selection */}
            <div>
              <label className="text-xs font-semibold text-[#292522] block mb-2">
                Color:{" "}
                <span className="font-normal text-[#766B61]">
                  {variant.colorName}
                </span>
                <span className="font-normal text-[#766B61]">
                  {" "}
                  · {product.variants.length} shades
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {product.variants.map((v, idx) => {
                  const soldOut = v.inventoryStock - v.reservedStock <= 0;
                  return (
                    <button
                      key={v.variantId}
                      onClick={() => handleVariantSelect(idx)}
                      className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        idx === selectedVariantIndex
                          ? "ring-2 ring-[#641D32] ring-offset-2 scale-105"
                          : "border-[#E6E0D8] hover:scale-105"
                      } ${soldOut ? "opacity-50" : ""}`}
                      style={{ backgroundColor: v.colorHex }}
                      title={`${v.colorName}${soldOut ? " (sold out)" : ""}`}
                    >
                      {idx === selectedVariantIndex && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      )}
                      {soldOut && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-px bg-white rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-[#292522] block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[#E6E0D8] rounded-md bg-[#FAF7F0]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(Math.min(availableStock, quantity + 1))
                    }
                    disabled={quantity >= availableStock || isOutOfStock}
                    className="px-3 py-1 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#766B61]">
                  {availableStock > 0
                    ? `${availableStock} units available`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Highlights */}
            <div className="pt-2 border-t border-[#E6E0D8] text-xs text-[#766B61] space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
                <span>{product.blousePiece}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
                <span>
                  Length: {product.lengthMeters} meters with running blouse
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-2 border-t border-[#E6E0D8] mt-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3 bg-[#641D32] text-white hover:bg-[#4A1223] font-semibold text-sm rounded-md shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? "Sold Out" : "Add to Shopping Bag"}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full py-2.5 bg-transparent hover:bg-[#FAF7F0] text-xs font-semibold text-[#641D32] rounded-md transition-colors"
            >
              View Full Saree Specifications &amp; Pallu Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
