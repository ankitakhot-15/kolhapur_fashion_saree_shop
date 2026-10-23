import React from "react";
import { Share2 } from "lucide-react";
import { SareeProduct } from "../types/index.ts";
import { shareProduct } from "../utils/shareProduct.ts";

interface Props {
  product: SareeProduct;
  variantIndex?: number;
  className?: string;
}

export const ShareButton: React.FC<Props> = ({
  product,
  variantIndex = 0,
  className = "",
}) => {
  const variant = product.variants[variantIndex] ?? product.variants[0];
  return (
    <button
      type="button"
      title="Share on WhatsApp & more"
      aria-label={`Share ${product.name}`}
      onClick={(e) => {
        e.stopPropagation(); // don't open the product when tapping share on a card
        shareProduct({
          slug: product.slug || product.id,
          name: product.name,
          pricePaise: variant?.sellingPricePaise || 0,
          image: variant?.images?.[0] || product.primaryImage,
        });
      }}
      className={`p-2 bg-white/90 hover:bg-white text-[#25D366] rounded-full shadow ${className}`}
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
};
