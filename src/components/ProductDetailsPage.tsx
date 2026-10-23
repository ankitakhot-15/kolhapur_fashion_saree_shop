// // import React, { useState } from 'react';
// // import {
// //   Heart,
// //   ShoppingBag,
// //   Zap,
// //   Share2,
// //   ShieldCheck,
// //   Truck,
// //   ArrowLeft,
// //   Check,
// //   Sparkles
// // } from 'lucide-react';
// // import { SareeProduct, SareeVariant } from '../types/index.ts';
// // import { formatPriceINR, calculateDiscountPercent } from '../utils/formatters.ts';
// // import { storeService } from '../services/storeService.ts';

// // interface ProductDetailsPageProps {
// //   product: SareeProduct;
// //   onBack: () => void;
// //   onSelectProduct: (p: SareeProduct) => void;
// //   onOpenCheckoutDirect?: () => void;
// //   onAddToCartSuccess?: (message: string) => void;
// // }

// // export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
// //   product,
// //   onBack,
// //   onSelectProduct,
// //   onOpenCheckoutDirect,
// //   onAddToCartSuccess
// // }) => {
// //   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
// //   const [selectedImage, setSelectedImage] = useState<string>(
// //     product.variants[0]?.images[0] || product.primaryImage
// //   );
// //   const [quantity, setQuantity] = useState(1);
// //   const [isWishlisted, setIsWishlisted] = useState(() =>
// //     storeService.getWishlist().includes(product.id)
// //   );
// //   const [shareSuccess, setShareSuccess] = useState(false);

// //   const variant: SareeVariant = product.variants[selectedVariantIndex] || product.variants[0];
// //   const originalPrice = variant.originalPricePaise;
// //   const sellingPrice = variant.sellingPricePaise;
// //   const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
// //   const availableStock = variant.inventoryStock - variant.reservedStock;
// //   const isOutOfStock = availableStock <= 0;

// //   // Related products in same category
// //   const relatedProducts = storeService
// //     .getProducts({ category: product.categoryNames[0] })
// //     .filter((p) => p.id !== product.id)
// //     .slice(0, 3);

// //   const handleVariantSelect = (idx: number) => {
// //     setSelectedVariantIndex(idx);
// //     const v = product.variants[idx];
// //     if (v && v.images?.length > 0) {
// //       setSelectedImage(v.images[0]);
// //     }
// //   };

// //   const handleToggleWishlist = () => {
// //     const next = storeService.toggleWishlist(product.id);
// //     setIsWishlisted(next);
// //   };

// //   const handleAddToCart = () => {
// //     if (isOutOfStock) return;
// //     storeService.addToCart({
// //       productId: product.id,
// //       variantId: variant.variantId,
// //       productName: product.name,
// //       colorName: variant.colorName,
// //       colorHex: variant.colorHex,
// //       image: selectedImage,
// //       sellingPricePaise: variant.sellingPricePaise,
// //       originalPricePaise: variant.originalPricePaise,
// //       quantity,
// //       sku: variant.sku,
// //       fabric: product.fabric
// //     });

// //     if (onAddToCartSuccess) {
// //       onAddToCartSuccess(`Added ${quantity} × ${product.name} (${variant.colorName}) to your shopping bag.`);
// //     }
// //   };

// //   const handleBuyNow = () => {
// //     handleAddToCart();
// //     if (onOpenCheckoutDirect) {
// //       onOpenCheckoutDirect();
// //     }
// //   };

// //   const handleShare = () => {
// //     navigator.clipboard?.writeText(window.location.href);
// //     setShareSuccess(true);
// //     setTimeout(() => setShareSuccess(false), 2500);
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //       {/* Breadcrumb Back Button */}
// //       <button
// //         onClick={onBack}
// //         className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#766B61] hover:text-[#641D32] mb-6 transition-colors"
// //       >
// //         <ArrowLeft className="w-4 h-4" />
// //         <span>Back to Saree Catalog</span>
// //       </button>

// //       {/* Main 2-Column Contiguous Layout */}
// //       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

// //         {/* Left Column: Gallery & Zoom Showcase (7 Cols) */}
// //         <div className="lg:col-span-7 space-y-4">
// //           <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-white border border-[#E6E0D8] shadow-sm">
// //             <img
// //               src={selectedImage}
// //               alt={product.name}
// //               referrerPolicy="no-referrer"
// //               className="w-full h-full object-cover object-top"
// //             />
// //             {discountPercent > 0 && (
// //               <span className="absolute top-4 left-4 text-xs font-bold text-[#641D32] bg-white/95 px-3 py-1 rounded shadow-sm border border-[#E6E0D8]">
// //                 {discountPercent}% SPECIAL FESTIVE OFF
// //               </span>
// //             )}
// //           </div>

// //           {/* Thumbnail Strip */}
// //           <div className="flex items-center gap-3 overflow-x-auto pb-2">
// //             {[...product.galleryImages, ...(variant.images || [])]
// //               .filter((val, idx, self) => self.indexOf(val) === idx)
// //               .map((img, i) => (
// //                 <button
// //                   key={i}
// //                   onClick={() => setSelectedImage(img)}
// //                   className={`w-20 h-24 rounded-lg overflow-hidden border shrink-0 transition-all ${
// //                     selectedImage === img
// //                       ? 'ring-2 ring-[#641D32] ring-offset-1 border-transparent'
// //                       : 'border-[#E6E0D8] opacity-75 hover:opacity-100'
// //                   }`}
// //                 >
// //                   <img src={img} alt="Angle preview" className="w-full h-full object-cover" />
// //                 </button>
// //               ))}
// //           </div>

// //           {/* Saree Craftsmanship & Heritage Story */}
// //           <div className="bg-white rounded-xl p-6 border border-[#E6E0D8] space-y-4 mt-6">
// //             <h3 className="text-base font-serif font-bold text-[#292522] flex items-center gap-2">
// //               <Sparkles className="w-4 h-4 text-[#C7A66A]" />
// //               <span>Authentic Handloom Weaving Story</span>
// //             </h3>
// //             <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed">
// //               {product.description}
// //             </p>

// //             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6E0D8] text-xs">
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Fabric Quality</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">{product.fabric}</span>
// //               </div>
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Occasion</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">{product.occasion}</span>
// //               </div>
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Total Length</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">{product.lengthMeters} Meters</span>
// //               </div>
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Blouse Piece</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">{product.blousePiece}</span>
// //               </div>
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Care Recommendation</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">{product.careInstructions}</span>
// //               </div>
// //               <div>
// //                 <span className="text-[#766B61] block font-medium">Origin</span>
// //                 <span className="font-semibold text-[#292522] mt-0.5 block">Kolhapur, Maharashtra</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Column: Contiguous Purchase Module (5 Cols) */}
// //         <div className="lg:col-span-5 bg-white rounded-xl p-6 sm:p-8 border border-[#E6E0D8] shadow-sm sticky top-24 space-y-6">

// //           {/* Category & Title */}
// //           <div className="space-y-2">
// //             <div className="flex items-center justify-between text-xs text-[#766B61]">
// //               <span>{product.categoryNames.join(' · ')}</span>
// //               <span>SKU: {variant.sku}</span>
// //             </div>
// //             <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] leading-tight">
// //               {product.name}
// //             </h1>
// //           </div>

// //           {/* Pricing Module */}
// //           <div className="p-4 bg-[#FAF7F0] rounded-lg border border-[#E6E0D8] flex items-baseline justify-between">
// //             <div>
// //               <div className="flex items-baseline gap-3">
// //                 <span className="text-3xl font-bold text-[#641D32] tabular-nums font-sans">
// //                   {formatPriceINR(sellingPrice)}
// //                 </span>
// //                 {originalPrice > sellingPrice && (
// //                   <span className="text-sm text-[#766B61] line-through tabular-nums">
// //                     {formatPriceINR(originalPrice)}
// //                   </span>
// //                 )}
// //               </div>
// //               <span className="text-[11px] text-[#766B61] block mt-1">Inclusive of 5% GST taxes</span>
// //             </div>

// //             {discountPercent > 0 && (
// //               <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded">
// //                 Save {discountPercent}%
// //               </span>
// //             )}
// //           </div>

// //           {/* Color Selection */}
// //           <div className="space-y-3">
// //             <div className="flex items-center justify-between text-xs">
// //               <span className="font-semibold text-[#292522]">Selected Color Shade:</span>
// //               <span className="text-[#641D32] font-semibold">{variant.colorName}</span>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               {product.variants.map((v, idx) => (
// //                 <button
// //                   key={v.variantId}
// //                   onClick={() => handleVariantSelect(idx)}
// //                   className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
// //                     idx === selectedVariantIndex
// //                       ? 'ring-2 ring-[#641D32] ring-offset-2 scale-110 shadow-sm'
// //                       : 'border-[#E6E0D8] hover:scale-105'
// //                   }`}
// //                   style={{ backgroundColor: v.colorHex }}
// //                   title={v.colorName}
// //                 >
// //                   {idx === selectedVariantIndex && (
// //                     <Check className="w-4 h-4 text-white drop-shadow-md" />
// //                   )}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Inventory & Quantity */}
// //           <div className="space-y-3 pt-2">
// //             <div className="flex items-center justify-between text-xs">
// //               <span className="font-semibold text-[#292522]">Quantity</span>
// //               <span className="text-[#766B61]">
// //                 {isOutOfStock ? (
// //                   <span className="text-red-600 font-bold">Sold Out</span>
// //                 ) : availableStock <= 3 ? (
// //                   <span className="text-amber-700 font-semibold">Hurry, only {availableStock} left in stock</span>
// //                 ) : (
// //                   <span>{availableStock} units in warehouse</span>
// //                 )}
// //               </span>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               <div className="inline-flex items-center border border-[#E6E0D8] rounded-md bg-[#FAF7F0]">
// //                 <button
// //                   type="button"
// //                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //                   disabled={quantity <= 1 || isOutOfStock}
// //                   className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
// //                 >
// //                   -
// //                 </button>
// //                 <span className="px-4 text-sm font-semibold tabular-nums">{quantity}</span>
// //                 <button
// //                   type="button"
// //                   onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
// //                   disabled={quantity >= availableStock || isOutOfStock}
// //                   className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action CTAs */}
// //           <div className="space-y-3 pt-4 border-t border-[#E6E0D8]">
// //             <button
// //               onClick={handleAddToCart}
// //               disabled={isOutOfStock}
// //               className="w-full py-3.5 bg-[#FAF7F0] hover:bg-white border-2 border-[#641D32] text-[#641D32] hover:text-[#4A1223] font-semibold text-sm rounded-md shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
// //             >
// //               <ShoppingBag className="w-4 h-4" />
// //               <span>Add to Shopping Bag</span>
// //             </button>

// //             <button
// //               onClick={handleBuyNow}
// //               disabled={isOutOfStock}
// //               className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
// //             >
// //               <Zap className="w-4 h-4 text-[#C7A66A]" />
// //               <span>Buy Now with Express Razorpay</span>
// //             </button>

// //             <div className="flex items-center gap-3 pt-2">
// //               <button
// //                 onClick={handleToggleWishlist}
// //                 className={`flex-1 py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E6E0D8] transition-colors ${
// //                   isWishlisted ? 'text-[#641D32] bg-[#FAF7F0]' : 'text-[#292522] hover:bg-[#FAF7F0]'
// //                 }`}
// //               >
// //                 <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#641D32] text-[#641D32]' : ''}`} />
// //                 <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
// //               </button>

// //               <button
// //                 onClick={handleShare}
// //                 className="py-2.5 px-3 rounded-md text-xs font-semibold text-[#292522] hover:bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center gap-1.5 transition-colors"
// //                 title="Copy product link"
// //               >
// //                 <Share2 className="w-4 h-4" />
// //                 <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Shipping Assurance */}
// //           <div className="pt-4 border-t border-[#E6E0D8] space-y-2 text-xs text-[#766B61]">
// //             <div className="flex items-center gap-2">
// //               <Truck className="w-4 h-4 text-[#641D32] shrink-0" />
// //               <span>Dispatches within 24-48 hours with Blue Dart / Delhivery Express.</span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
// //               <span>Silk Mark India certified authentic handloom guarantee.</span>
// //             </div>
// //           </div>

// //         </div>
// //       </div>

// //       {/* Related Products Showcase */}
// //       {relatedProducts.length > 0 && (
// //         <div className="mt-20 pt-10 border-t border-[#E6E0D8]">
// //           <div className="flex items-baseline justify-between mb-8">
// //             <div>
// //               <span className="text-xs font-semibold uppercase tracking-widest text-[#641D32]">
// //                 Similar Weaves
// //               </span>
// //               <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] mt-1">
// //                 You May Also Admire
// //               </h3>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {relatedProducts.map((rel) => (
// //               <div
// //                 key={rel.id}
// //                 onClick={() => {
// //                   onSelectProduct(rel);
// //                   window.scrollTo({ top: 0, behavior: 'smooth' });
// //                 }}
// //                 className="bg-white rounded-lg border border-[#E6E0D8] p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
// //               >
// //                 <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-[#FAF7F0]">
// //                   <img
// //                     src={rel.primaryImage}
// //                     alt={rel.name}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>
// //                 <div className="flex flex-col justify-between">
// //                   <div>
// //                     <span className="text-[11px] text-[#766B61]">{rel.fabric}</span>
// //                     <h4 className="text-xs font-semibold text-[#292522] font-serif line-clamp-2 mt-0.5">
// //                       {rel.name}
// //                     </h4>
// //                   </div>
// //                   <span className="text-sm font-bold text-[#641D32] tabular-nums">
// //                     {formatPriceINR(rel.variants[0]?.sellingPricePaise || 0)}
// //                   </span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Heart,
//   ShoppingBag,
//   Zap,
//   Share2,
//   ShieldCheck,
//   Truck,
//   ArrowLeft,
//   Check,
//   Sparkles,
// } from "lucide-react";
// import { SareeProduct, SareeVariant } from "../types/index.ts";
// import {
//   formatPriceINR,
//   calculateDiscountPercent,
// } from "../utils/formatters.ts";
// import { storeService } from "../services/storeService.ts";
// import { ProductGallery } from "./ProductGallery.tsx";

// interface ProductDetailsPageProps {
//   product: SareeProduct;
//   onBack: () => void;
//   onSelectProduct: (p: SareeProduct) => void;
//   onOpenCheckoutDirect?: () => void;
//   onAddToCartSuccess?: (message: string) => void;
// }

// export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
//   product,
//   onBack,
//   onSelectProduct,
//   onOpenCheckoutDirect,
//   onAddToCartSuccess,
// }) => {
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(() =>
//     storeService.getWishlist().includes(product.id),
//   );
//   const [shareSuccess, setShareSuccess] = useState(false);

//   // Reset gallery state when a different product is opened (e.g. from "You May Also Admire")
//   useEffect(() => {
//     setSelectedVariantIndex(0);
//     setQuantity(1);
//     setIsWishlisted(storeService.getWishlist().includes(product.id));
//   }, [product.id]);

//   const variant: SareeVariant =
//     product.variants[selectedVariantIndex] || product.variants[0];
//   const originalPrice = variant.originalPricePaise;
//   const sellingPrice = variant.sellingPricePaise;
//   const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
//   const availableStock = variant.inventoryStock - variant.reservedStock;
//   const isOutOfStock = availableStock <= 0;

//   // The selected colour's own photos (2-4). Falls back to the product gallery.
//   const images = useMemo(() => {
//     const own = (variant.images || []).filter(Boolean);
//     const list =
//       own.length >= 2
//         ? own
//         : [...own, ...product.galleryImages, product.primaryImage];
//     return list
//       .filter((img, i, arr) => !!img && arr.indexOf(img) === i)
//       .slice(0, 4);
//   }, [product, variant]);
//   const activeImage = images[0] || product.primaryImage;

//   // Related products in same category
//   const relatedProducts = storeService
//     .getProducts({ category: product.categoryNames[0] })
//     .filter((p) => p.id !== product.id)
//     .slice(0, 3);

//   const handleVariantSelect = (idx: number) => {
//     setSelectedVariantIndex(idx);
//     setQuantity(1);
//   };

//   const handleToggleWishlist = () => {
//     const next = storeService.toggleWishlist(product.id);
//     setIsWishlisted(next);
//   };

//   const handleAddToCart = () => {
//     if (isOutOfStock) return;
//     storeService.addToCart({
//       productId: product.id,
//       variantId: variant.variantId,
//       productName: product.name,
//       colorName: variant.colorName,
//       colorHex: variant.colorHex,
//       image: activeImage,
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
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     if (onOpenCheckoutDirect) {
//       onOpenCheckoutDirect();
//     }
//   };

//   const handleShare = () => {
//     navigator.clipboard?.writeText(window.location.href);
//     setShareSuccess(true);
//     setTimeout(() => setShareSuccess(false), 2500);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Breadcrumb Back Button */}
//       <button
//         onClick={onBack}
//         className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#766B61] hover:text-[#641D32] mb-6 transition-colors"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         <span>Back to Saree Catalog</span>
//       </button>

//       {/* Main 2-Column Contiguous Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
//         {/* Left Column: Gallery & Zoom Showcase (7 Cols) */}
//         <div className="lg:col-span-7 space-y-4">
//           <ProductGallery
//             images={images}
//             alt={product.name}
//             seed={product.id}
//             badge={
//               discountPercent > 0
//                 ? `${discountPercent}% SPECIAL FESTIVE OFF`
//                 : undefined
//             }
//           />

//           {/* Saree Craftsmanship & Heritage Story */}
//           <div className="bg-white rounded-xl p-6 border border-[#E6E0D8] space-y-4 mt-6">
//             <h3 className="text-base font-serif font-bold text-[#292522] flex items-center gap-2">
//               <Sparkles className="w-4 h-4 text-[#C7A66A]" />
//               <span>Authentic Handloom Weaving Story</span>
//             </h3>
//             <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed">
//               {product.description}
//             </p>

//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6E0D8] text-xs">
//               <div>
//                 <span className="text-[#766B61] block font-medium">
//                   Fabric Quality
//                 </span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   {product.fabric}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[#766B61] block font-medium">
//                   Occasion
//                 </span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   {product.occasion}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[#766B61] block font-medium">
//                   Total Length
//                 </span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   {product.lengthMeters} Meters
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[#766B61] block font-medium">
//                   Blouse Piece
//                 </span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   {product.blousePiece}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[#766B61] block font-medium">
//                   Care Recommendation
//                 </span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   {product.careInstructions}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[#766B61] block font-medium">Origin</span>
//                 <span className="font-semibold text-[#292522] mt-0.5 block">
//                   Kolhapur, Maharashtra
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Contiguous Purchase Module (5 Cols) */}
//         <div className="lg:col-span-5 bg-white rounded-xl p-6 sm:p-8 border border-[#E6E0D8] shadow-sm sticky top-24 space-y-6">
//           {/* Category & Title */}
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-xs text-[#766B61]">
//               <span>{product.categoryNames.join(" · ")}</span>
//               <span>SKU: {variant.sku}</span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] leading-tight">
//               {product.name}
//             </h1>
//           </div>

//           {/* Pricing Module */}
//           <div className="p-4 bg-[#FAF7F0] rounded-lg border border-[#E6E0D8] flex items-baseline justify-between">
//             <div>
//               <div className="flex items-baseline gap-3">
//                 <span className="text-3xl font-bold text-[#641D32] tabular-nums font-sans">
//                   {formatPriceINR(sellingPrice)}
//                 </span>
//                 {originalPrice > sellingPrice && (
//                   <span className="text-sm text-[#766B61] line-through tabular-nums">
//                     {formatPriceINR(originalPrice)}
//                   </span>
//                 )}
//               </div>
//               <span className="text-[11px] text-[#766B61] block mt-1">
//                 Inclusive of 5% GST taxes
//               </span>
//             </div>

//             {discountPercent > 0 && (
//               <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded">
//                 Save {discountPercent}%
//               </span>
//             )}
//           </div>

//           {/* Color Selection */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between text-xs">
//               <span className="font-semibold text-[#292522]">
//                 Selected Color Shade:
//               </span>
//               <span className="text-[#641D32] font-semibold">
//                 {variant.colorName}
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               {product.variants.map((v, idx) => (
//                 <button
//                   key={v.variantId}
//                   onClick={() => handleVariantSelect(idx)}
//                   className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
//                     idx === selectedVariantIndex
//                       ? "ring-2 ring-[#641D32] ring-offset-2 scale-110 shadow-sm"
//                       : "border-[#E6E0D8] hover:scale-105"
//                   }`}
//                   style={{ backgroundColor: v.colorHex }}
//                   title={v.colorName}
//                 >
//                   {idx === selectedVariantIndex && (
//                     <Check className="w-4 h-4 text-white drop-shadow-md" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Inventory & Quantity */}
//           <div className="space-y-3 pt-2">
//             <div className="flex items-center justify-between text-xs">
//               <span className="font-semibold text-[#292522]">Quantity</span>
//               <span className="text-[#766B61]">
//                 {isOutOfStock ? (
//                   <span className="text-red-600 font-bold">Sold Out</span>
//                 ) : availableStock <= 3 ? (
//                   <span className="text-amber-700 font-semibold">
//                     Hurry, only {availableStock} left in stock
//                   </span>
//                 ) : (
//                   <span>{availableStock} units in warehouse</span>
//                 )}
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="inline-flex items-center border border-[#E6E0D8] rounded-md bg-[#FAF7F0]">
//                 <button
//                   type="button"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1 || isOutOfStock}
//                   className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 text-sm font-semibold tabular-nums">
//                   {quantity}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setQuantity(Math.min(availableStock, quantity + 1))
//                   }
//                   disabled={quantity >= availableStock || isOutOfStock}
//                   className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Action CTAs */}
//           <div className="space-y-3 pt-4 border-t border-[#E6E0D8]">
//             <button
//               onClick={handleAddToCart}
//               disabled={isOutOfStock}
//               className="w-full py-3.5 bg-[#FAF7F0] hover:bg-white border-2 border-[#641D32] text-[#641D32] hover:text-[#4A1223] font-semibold text-sm rounded-md shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//             >
//               <ShoppingBag className="w-4 h-4" />
//               <span>Add to Shopping Bag</span>
//             </button>

//             <button
//               onClick={handleBuyNow}
//               disabled={isOutOfStock}
//               className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//             >
//               <Zap className="w-4 h-4 text-[#C7A66A]" />
//               <span>Buy Now with Express Razorpay</span>
//             </button>

//             <div className="flex items-center gap-3 pt-2">
//               <button
//                 onClick={handleToggleWishlist}
//                 className={`flex-1 py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E6E0D8] transition-colors ${
//                   isWishlisted
//                     ? "text-[#641D32] bg-[#FAF7F0]"
//                     : "text-[#292522] hover:bg-[#FAF7F0]"
//                 }`}
//               >
//                 <Heart
//                   className={`w-4 h-4 ${isWishlisted ? "fill-[#641D32] text-[#641D32]" : ""}`}
//                 />
//                 <span>
//                   {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
//                 </span>
//               </button>

//               <button
//                 onClick={handleShare}
//                 className="py-2.5 px-3 rounded-md text-xs font-semibold text-[#292522] hover:bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center gap-1.5 transition-colors"
//                 title="Copy product link"
//               >
//                 <Share2 className="w-4 h-4" />
//                 <span>{shareSuccess ? "Link Copied!" : "Share"}</span>
//               </button>
//             </div>
//           </div>

//           {/* Shipping Assurance */}
//           <div className="pt-4 border-t border-[#E6E0D8] space-y-2 text-xs text-[#766B61]">
//             <div className="flex items-center gap-2">
//               <Truck className="w-4 h-4 text-[#641D32] shrink-0" />
//               <span>
//                 Dispatches within 24-48 hours with Blue Dart / Delhivery
//                 Express.
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
//               <span>
//                 Silk Mark India certified authentic handloom guarantee.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Products Showcase */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-20 pt-10 border-t border-[#E6E0D8]">
//           <div className="flex items-baseline justify-between mb-8">
//             <div>
//               <span className="text-xs font-semibold uppercase tracking-widest text-[#641D32]">
//                 Similar Weaves
//               </span>
//               <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] mt-1">
//                 You May Also Admire
//               </h3>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {relatedProducts.map((rel) => (
//               <div
//                 key={rel.id}
//                 onClick={() => {
//                   onSelectProduct(rel);
//                   window.scrollTo({ top: 0, behavior: "smooth" });
//                 }}
//                 className="bg-white rounded-lg border border-[#E6E0D8] p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
//               >
//                 <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-[#FAF7F0]">
//                   <img
//                     src={rel.primaryImage}
//                     alt={rel.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex flex-col justify-between">
//                   <div>
//                     <span className="text-[11px] text-[#766B61]">
//                       {rel.fabric}
//                     </span>
//                     <h4 className="text-xs font-semibold text-[#292522] font-serif line-clamp-2 mt-0.5">
//                       {rel.name}
//                     </h4>
//                   </div>
//                   <span className="text-sm font-bold text-[#641D32] tabular-nums">
//                     {formatPriceINR(rel.variants[0]?.sellingPricePaise || 0)}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Zap,
  Share2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { SareeProduct, SareeVariant } from "../types/index.ts";
import {
  formatPriceINR,
  calculateDiscountPercent,
} from "../utils/formatters.ts";
import { storeService } from "../services/storeService.ts";
import { ProductGallery } from "./ProductGallery.tsx";

interface ProductDetailsPageProps {
  product: SareeProduct;
  onBack: () => void;
  onSelectProduct: (p: SareeProduct) => void;
  onOpenCheckoutDirect?: () => void;
  onAddToCartSuccess?: (message: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onOpenCheckoutDirect,
  onAddToCartSuccess,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(() =>
    storeService.getWishlist().includes(product.id),
  );
  const [shareSuccess, setShareSuccess] = useState(false);

  // Reset state when a different product is opened (e.g. from "You May Also Admire")
  useEffect(() => {
    setSelectedVariantIndex(0);
    setQuantity(1);
    setIsWishlisted(storeService.getWishlist().includes(product.id));
  }, [product.id]);

  const variant: SareeVariant =
    product.variants[selectedVariantIndex] || product.variants[0];
  const originalPrice = variant.originalPricePaise;
  const sellingPrice = variant.sellingPricePaise;
  const discountPercent = calculateDiscountPercent(originalPrice, sellingPrice);
  const availableStock = variant.inventoryStock - variant.reservedStock;
  const isOutOfStock = availableStock <= 0;

  // Photos of the SELECTED colour only (different angles).
  // Falls back to the product's primary image only if the colour has none.
  const images = useMemo(() => {
    const own = (variant.images || []).filter(Boolean);
    const list = own.length > 0 ? own : [product.primaryImage];
    return list.filter((img, i, arr) => !!img && arr.indexOf(img) === i);
  }, [product, variant]);
  const activeImage = images[0] || product.primaryImage;

  // Related products in same category
  const relatedProducts = storeService
    .getProducts({ category: product.categoryNames[0] })
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const handleVariantSelect = (idx: number) => {
    setSelectedVariantIndex(idx);
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    const next = storeService.toggleWishlist(product.id);
    setIsWishlisted(next);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    storeService.addToCart({
      productId: product.id,
      variantId: variant.variantId,
      productName: product.name,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      image: activeImage,
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
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (onOpenCheckoutDirect) {
      onOpenCheckoutDirect();
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#766B61] hover:text-[#641D32] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Saree Catalog</span>
      </button>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <ProductGallery
            images={images}
            alt={`${product.name} - ${variant.colorName}`}
            seed={product.id}
            badge={
              discountPercent > 0
                ? `${discountPercent}% SPECIAL FESTIVE OFF`
                : undefined
            }
          />

          {/* Saree Craftsmanship & Heritage Story */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E0D8] space-y-4 mt-6">
            <h3 className="text-base font-serif font-bold text-[#292522] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C7A66A]" />
              <span>Authentic Handloom Weaving Story</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6E0D8] text-xs">
              <div>
                <span className="text-[#766B61] block font-medium">
                  Fabric Quality
                </span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  {product.fabric}
                </span>
              </div>
              <div>
                <span className="text-[#766B61] block font-medium">
                  Occasion
                </span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  {product.occasion}
                </span>
              </div>
              <div>
                <span className="text-[#766B61] block font-medium">
                  Total Length
                </span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  {product.lengthMeters} Meters
                </span>
              </div>
              <div>
                <span className="text-[#766B61] block font-medium">
                  Blouse Piece
                </span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  {product.blousePiece}
                </span>
              </div>
              <div>
                <span className="text-[#766B61] block font-medium">
                  Care Recommendation
                </span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  {product.careInstructions}
                </span>
              </div>
              <div>
                <span className="text-[#766B61] block font-medium">Origin</span>
                <span className="font-semibold text-[#292522] mt-0.5 block">
                  Kolhapur, Maharashtra
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 sm:p-8 border border-[#E6E0D8] shadow-sm sticky top-24 space-y-6">
          {/* Category & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#766B61]">
              <span>{product.categoryNames.join(" · ")}</span>
              <span>SKU: {variant.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Module */}
          <div className="p-4 bg-[#FAF7F0] rounded-lg border border-[#E6E0D8] flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#641D32] tabular-nums font-sans">
                  {formatPriceINR(sellingPrice)}
                </span>
                {originalPrice > sellingPrice && (
                  <span className="text-sm text-[#766B61] line-through tabular-nums">
                    {formatPriceINR(originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#766B61] block mt-1">
                Inclusive of 5% GST taxes
              </span>
            </div>

            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#292522]">
                Selected Color Shade:
              </span>
              <span className="text-[#641D32] font-semibold">
                {variant.colorName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {product.variants.map((v, idx) => (
                <button
                  key={v.variantId}
                  onClick={() => handleVariantSelect(idx)}
                  className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    idx === selectedVariantIndex
                      ? "ring-2 ring-[#641D32] ring-offset-2 scale-110 shadow-sm"
                      : "border-[#E6E0D8] hover:scale-105"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                  aria-label={`Select colour ${v.colorName}`}
                >
                  {idx === selectedVariantIndex && (
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory & Quantity */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#292522]">Quantity</span>
              <span className="text-[#766B61]">
                {isOutOfStock ? (
                  <span className="text-red-600 font-bold">Sold Out</span>
                ) : availableStock <= 3 ? (
                  <span className="text-amber-700 font-semibold">
                    Hurry, only {availableStock} left in stock
                  </span>
                ) : (
                  <span>{availableStock} units in warehouse</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#E6E0D8] rounded-md bg-[#FAF7F0]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(availableStock, quantity + 1))
                  }
                  disabled={quantity >= availableStock || isOutOfStock}
                  className="px-3 py-1.5 text-sm text-[#292522] hover:bg-white disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-[#E6E0D8]">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 bg-[#FAF7F0] hover:bg-white border-2 border-[#641D32] text-[#641D32] hover:text-[#4A1223] font-semibold text-sm rounded-md shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#C7A66A]" />
              <span>Buy Now with Express Razorpay</span>
            </button>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleToggleWishlist}
                className={`flex-1 py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E6E0D8] transition-colors ${
                  isWishlisted
                    ? "text-[#641D32] bg-[#FAF7F0]"
                    : "text-[#292522] hover:bg-[#FAF7F0]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-[#641D32] text-[#641D32]" : ""}`}
                />
                <span>
                  {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-md text-xs font-semibold text-[#292522] hover:bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center gap-1.5 transition-colors"
                title="Copy product link"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareSuccess ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Shipping Assurance */}
          <div className="pt-4 border-t border-[#E6E0D8] space-y-2 text-xs text-[#766B61]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#641D32] shrink-0" />
              <span>
                Dispatches within 24-48 hours with Blue Dart / Delhivery
                Express.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#641D32] shrink-0" />
              <span>
                Silk Mark India certified authentic handloom guarantee.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[#E6E0D8]">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#641D32]">
                Similar Weaves
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] mt-1">
                You May Also Admire
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white rounded-lg border border-[#E6E0D8] p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-[#FAF7F0]">
                  <img
                    src={rel.primaryImage}
                    alt={rel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#766B61]">
                      {rel.fabric}
                    </span>
                    <h4 className="text-xs font-semibold text-[#292522] font-serif line-clamp-2 mt-0.5">
                      {rel.name}
                    </h4>
                  </div>
                  <span className="text-sm font-bold text-[#641D32] tabular-nums">
                    {formatPriceINR(rel.variants[0]?.sellingPricePaise || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
