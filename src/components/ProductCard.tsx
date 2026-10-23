// import React, { useState } from "react";
// import { Heart, Eye, ShoppingBag } from "lucide-react";
// import { SareeProduct, SareeVariant } from "../types/index.ts";
// import {
//   formatPriceINR,
//   calculateDiscountPercent,
// } from "../utils/formatters.ts";
// import { storeService } from "../services/storeService.ts";

// interface ProductCardProps {
//   product: SareeProduct;
//   onSelectProduct: (product: SareeProduct) => void;
//   onQuickView: (product: SareeProduct) => void;
//   onAddToCartSuccess?: (message: string) => void;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   onSelectProduct,
//   onQuickView,
//   onAddToCartSuccess,
// }) => {
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [isWishlisted, setIsWishlisted] = useState(() => {
//     return storeService.getWishlist().includes(product.id);
//   });

//   const variant: SareeVariant =
//     product.variants[selectedVariantIndex] || product.variants[0];
//   const originalPrice = variant.originalPricePaise;
//   const sellingPrice = variant.sellingPricePaise;
//   const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
//   const availableStock = variant.inventoryStock - variant.reservedStock;
//   const isOutOfStock = availableStock <= 0;
//   const isLowStock = availableStock > 0 && availableStock <= 3;

//   const currentImage = variant.images?.[0] || product.primaryImage;

//   const handleToggleWishlist = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const state = storeService.toggleWishlist(product.id);
//     setIsWishlisted(state);
//   };

//   const handleQuickAdd = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (isOutOfStock) return;

//     storeService.addToCart({
//       productId: product.id,
//       variantId: variant.variantId,
//       productName: product.name,
//       colorName: variant.colorName,
//       colorHex: variant.colorHex,
//       image: currentImage,
//       sellingPricePaise: variant.sellingPricePaise,
//       originalPricePaise: variant.originalPricePaise,
//       quantity: 1,
//       sku: variant.sku,
//       fabric: product.fabric,
//     });

//     if (onAddToCartSuccess) {
//       onAddToCartSuccess(
//         `Added ${product.name} (${variant.colorName}) to your shopping bag.`,
//       );
//     }
//   };

//   return (
//     <div
//       onClick={() => onSelectProduct(product)}
//       className="group bg-white rounded-lg border border-[#E6E0D8] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
//     >
//       {/* Lead with imagery 65-70% height */}
//       <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F0]">
//         <img
//           src={currentImage}
//           alt={product.name}
//           referrerPolicy="no-referrer"
//           className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
//         />

//         {/* Minimal text-only label (no pill badge) */}
//         <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
//           {product.featured && (
//             <span className="text-[11px] font-bold tracking-wider uppercase text-[#641D32] bg-[#FAF7F0]/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs border border-[#E6E0D8]">
//               Royal Featured
//             </span>
//           )}
//           {discountPercent > 0 && (
//             <span className="text-[11px] font-bold text-[#641D32] bg-white/95 px-2 py-0.5 rounded shadow-xs border border-[#E6E0D8]">
//               {discountPercent}% OFF
//             </span>
//           )}
//         </div>

//         {/* Wishlist Button */}
//         <button
//           onClick={handleToggleWishlist}
//           className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#292522] shadow-sm transition-transform active:scale-90 z-10"
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <Heart
//             className={`w-4 h-4 ${isWishlisted ? "fill-[#641D32] text-[#641D32]" : "hover:text-[#641D32]"}`}
//           />
//         </button>

//         {/* Quick View & Quick Add floating bar */}
//         <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 z-10">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onQuickView(product);
//             }}
//             className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-xs font-semibold text-[#292522] rounded shadow-md flex items-center justify-center gap-1.5 transition-colors border border-[#E6E0D8]"
//           >
//             <Eye className="w-3.5 h-3.5 text-[#641D32]" />
//             <span>Quick View</span>
//           </button>

//           {!isOutOfStock && (
//             <button
//               onClick={handleQuickAdd}
//               className="py-2 px-3 bg-[#641D32] hover:bg-[#4A1223] text-white rounded shadow-md flex items-center justify-center transition-colors"
//               title="Add 1 to bag"
//             >
//               <ShoppingBag className="w-3.5 h-3.5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Product Content Details */}
//       <div className="p-4 flex flex-col flex-1 justify-between gap-3">
//         <div>
//           {/* Metadata: Fabric · Occasion */}
//           <div className="flex items-center gap-1.5 text-xs text-[#766B61] mb-1">
//             <span className="truncate">{product.fabric}</span>
//             <span aria-hidden="true">·</span>
//             <span className="truncate">
//               {product.categoryNames[0] || "Handloom"}
//             </span>
//           </div>

//           {/* Saree Title */}
//           <h3 className="text-sm font-semibold text-[#292522] line-clamp-2 leading-snug font-serif group-hover:text-[#641D32] transition-colors">
//             {product.name}
//           </h3>
//         </div>

//         {/* Color Swatches */}
//         {product.variants.length > 1 && (
//           <div
//             className="flex items-center gap-1.5 pt-1"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {product.variants.map((v, idx) => (
//               <button
//                 key={v.variantId}
//                 onClick={() => setSelectedVariantIndex(idx)}
//                 className={`w-4 h-4 rounded-full border transition-transform ${
//                   idx === selectedVariantIndex
//                     ? "ring-2 ring-[#641D32] ring-offset-1 scale-110"
//                     : "border-[#E6E0D8] hover:scale-105"
//                 }`}
//                 style={{ backgroundColor: v.colorHex }}
//                 title={v.colorName}
//                 aria-label={`Select color ${v.colorName}`}
//               />
//             ))}
//             <span className="text-[11px] text-[#766B61] ml-1">
//               {variant.colorName.split("&")[0]}
//             </span>
//           </div>
//         )}

//         {/* Pricing & Stock baseline */}
//         <div className="pt-2 border-t border-[#E6E0D8]/60 flex items-baseline justify-between">
//           <div className="flex items-baseline gap-2">
//             <span className="text-base font-bold text-[#641D32] tabular-nums font-sans">
//               {formatPriceINR(sellingPrice)}
//             </span>
//             {originalPrice > sellingPrice && (
//               <span className="text-xs text-[#766B61] line-through tabular-nums">
//                 {formatPriceINR(originalPrice)}
//               </span>
//             )}
//           </div>

//           {/* Stock availability indicator */}
//           <div className="text-right">
//             {isOutOfStock ? (
//               <span className="text-[11px] font-medium text-red-600">
//                 Out of Stock
//               </span>
//             ) : isLowStock ? (
//               <span className="text-[11px] font-medium text-amber-700">
//                 Only {availableStock} left
//               </span>
//             ) : (
//               <span className="text-[11px] text-[#766B61]">Handloom Stock</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { SareeProduct, SareeVariant } from "../types/index.ts";
import {
  formatPriceINR,
  calculateDiscountPercent,
} from "../utils/formatters.ts";
import { storeService } from "../services/storeService.ts";
import { cld } from "../lib/cloudinaryUrl.ts";
import { ShareButton } from "../components/Sharesareebutton.tsx";

interface ProductCardProps {
  product: SareeProduct;
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onAddToCartSuccess?: (message: string) => void;
}

const LOW_STOCK_LIMIT = 5; // same limit the admin dashboard uses

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickView,
  onAddToCartSuccess,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(() =>
    storeService.getWishlist().includes(product.id),
  );

  // Keep the heart correct if this card is reused for a different saree
  useEffect(() => {
    setIsWishlisted(storeService.getWishlist().includes(product.id));
    setSelectedVariantIndex(0);
  }, [product.id]);

  // Clamp in case the admin removed a colour while this card is on screen
  const safeIndex =
    selectedVariantIndex < product.variants.length ? selectedVariantIndex : 0;
  const variant: SareeVariant =
    product.variants[safeIndex] || product.variants[0];

  const originalPrice = variant.originalPricePaise;
  const sellingPrice = variant.sellingPricePaise;
  const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
  const availableStock = variant.inventoryStock - variant.reservedStock;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= LOW_STOCK_LIMIT;

  const currentImage = variant.images?.[0] || product.primaryImage;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = storeService.toggleWishlist(product.id);
    setIsWishlisted(state);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const fullyAdded = storeService.addToCart({
      productId: product.id,
      variantId: variant.variantId,
      productName: product.name,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      image: currentImage,
      sellingPricePaise: variant.sellingPricePaise,
      originalPricePaise: variant.originalPricePaise,
      quantity: 1,
      sku: variant.sku,
      fabric: product.fabric,
    });

    onAddToCartSuccess?.(
      fullyAdded
        ? `Added ${product.name} (${variant.colorName}) to your shopping bag.`
        : `Only ${availableStock} of ${product.name} (${variant.colorName}) available - your bag has the maximum.`,
    );
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-lg border border-[#E6E0D8] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
    >
      {/* Lead with imagery 65-70% height */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F0]">
        <img
          src={cld(currentImage, { w: 600, h: 750 })}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        />

        {/* Text labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {isOutOfStock && (
            <span className="text-[11px] font-bold tracking-wider uppercase text-white bg-[#292522]/90 px-2 py-0.5 rounded shadow-xs">
              Sold Out
            </span>
          )}
          {product.featured && (
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#641D32] bg-[#FAF7F0]/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs border border-[#E6E0D8]">
              Royal Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-[#641D32] bg-white/95 px-2 py-0.5 rounded shadow-xs border border-[#E6E0D8]">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist + Share buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#292522] shadow-sm transition-transform active:scale-90"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-[#641D32] text-[#641D32]" : "hover:text-[#641D32]"}`}
            />
          </button>
          <ShareButton product={product} variantIndex={safeIndex} />
        </div>

        {/* Quick View & Quick Add: always visible on phones, on hover for desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-xs font-semibold text-[#292522] rounded shadow-md flex items-center justify-center gap-1.5 transition-colors border border-[#E6E0D8]"
          >
            <Eye className="w-3.5 h-3.5 text-[#641D32]" />
            <span>Quick View</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="py-2 px-3 bg-[#641D32] hover:bg-[#4A1223] text-white rounded shadow-md flex items-center justify-center transition-colors"
              title="Add 1 to bag"
              aria-label="Add 1 to bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#766B61] mb-1">
            <span className="truncate">{product.fabric}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {product.categoryNames?.[0] || "Handloom"}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#292522] line-clamp-2 leading-snug font-serif group-hover:text-[#641D32] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Color Swatches */}
        {product.variants.length > 1 && (
          <div
            className="flex items-center gap-1.5 pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.variants.map((v, idx) => (
              <button
                key={v.variantId}
                onClick={() => setSelectedVariantIndex(idx)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  idx === safeIndex
                    ? "ring-2 ring-[#641D32] ring-offset-1 scale-110"
                    : "border-[#E6E0D8] hover:scale-105"
                }`}
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
                aria-label={`Select color ${v.colorName}`}
              />
            ))}
            <span className="text-[11px] text-[#766B61] ml-1">
              {variant.colorName.split("&")[0]}
            </span>
          </div>
        )}

        {/* Pricing & Stock */}
        <div className="pt-2 border-t border-[#E6E0D8]/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#641D32] tabular-nums font-sans">
              {formatPriceINR(sellingPrice)}
            </span>
            {originalPrice > sellingPrice && (
              <span className="text-xs text-[#766B61] line-through tabular-nums">
                {formatPriceINR(originalPrice)}
              </span>
            )}
          </div>

          <div className="text-right">
            {isOutOfStock ? (
              <span className="text-[11px] font-medium text-red-600">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-[11px] font-medium text-amber-700">
                Only {availableStock} left
              </span>
            ) : (
              <span className="text-[11px] text-[#766B61]">Handloom Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
