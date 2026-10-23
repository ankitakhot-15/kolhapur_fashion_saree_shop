import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { SareeProduct } from '../types/index.ts';
import { storeService } from '../services/storeService.ts';
import { formatPriceINR } from '../utils/formatters.ts';

interface WishlistPageProps {
  onBack: () => void;
  onSelectProduct: (p: SareeProduct) => void;
  onAddToCartSuccess?: (message: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onBack,
  onSelectProduct,
  onAddToCartSuccess
}) => {
  const [wishlistProducts, setWishlistProducts] = useState<SareeProduct[]>([]);

  useEffect(() => {
    const update = () => {
      const ids = storeService.getWishlist();
      const all = storeService.getProducts();
      setWishlistProducts(all.filter((p) => ids.includes(p.id)));
    };
    update();
    return storeService.subscribe(update);
  }, []);

  const handleRemove = (productId: string) => {
    storeService.toggleWishlist(productId);
  };

  const handleMoveToCart = (product: SareeProduct) => {
    const variant = product.variants[0];
    if (!variant) return;

    storeService.addToCart({
      productId: product.id,
      variantId: variant.variantId,
      productName: product.name,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      image: variant.images[0] || product.primaryImage,
      sellingPricePaise: variant.sellingPricePaise,
      originalPricePaise: variant.originalPricePaise,
      quantity: 1,
      sku: variant.sku,
      fabric: product.fabric
    });

    storeService.toggleWishlist(product.id);
    if (onAddToCartSuccess) {
      onAddToCartSuccess(`Moved ${product.name} to your shopping bag.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6E0D8]">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#766B61] hover:text-[#641D32] mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522]">
            My Saved Saree Wishlist ({wishlistProducts.length})
          </h1>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E6E0D8] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto text-[#766B61] border border-[#E6E0D8]">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#292522]">Your wishlist is empty</h3>
            <p className="text-xs text-[#766B61] mt-1">
              Tap the heart icon on any Paithani, Kanjivaram, or festive saree to save it for special occasions.
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#641D32] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#4A1223] transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => {
            const v = p.variants[0];
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-[#E6E0D8] overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-all"
              >
                <div
                  onClick={() => onSelectProduct(p)}
                  className="aspect-[4/5] bg-[#FAF7F0] relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={v?.images[0] || p.primaryImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(p.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <span className="text-[11px] text-[#766B61] block">{p.fabric}</span>
                    <h3
                      onClick={() => onSelectProduct(p)}
                      className="text-xs font-semibold text-[#292522] font-serif line-clamp-2 mt-1 cursor-pointer hover:text-[#641D32]"
                    >
                      {p.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#E6E0D8]">
                    <span className="text-sm font-bold text-[#641D32] tabular-nums font-sans">
                      {formatPriceINR(v?.sellingPricePaise || 0)}
                    </span>
                    <button
                      onClick={() => handleMoveToCart(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded shadow-xs transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
