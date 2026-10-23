import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { CartItem, Coupon } from '../types/index.ts';
import { storeService } from '../services/storeService.ts';
import { formatPriceINR } from '../utils/formatters.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (couponCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const settings = storeService.getSettings();

  useEffect(() => {
    const update = () => {
      setCart(storeService.getCart());
    };
    update();
    return storeService.subscribe(update);
  }, []);

  if (!isOpen) return null;

  const subtotalPaise = cart.reduce((sum, item) => sum + item.sellingPricePaise * item.quantity, 0);

  // Apply discount if coupon present
  let discountPaise = 0;
  let couponWarning = '';
  if (appliedCoupon) {
    const check = storeService.validateCoupon(appliedCoupon.code, subtotalPaise);
    if (check.valid && check.coupon) {
      discountPaise = check.discountPaise;
    } else {
      couponWarning = check.message;
    }
  }

  const freeShippingNeededPaise = Math.max(0, settings.freeShippingThresholdPaise - subtotalPaise);
  const isFreeShipping = subtotalPaise >= settings.freeShippingThresholdPaise;
  const shippingChargePaise = subtotalPaise > 0 ? (isFreeShipping ? 0 : settings.standardShippingFeePaise) : 0;
  const taxableAmount = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round((taxableAmount * settings.taxPercentage) / 100);
  const finalTotalPaise = taxableAmount + shippingChargePaise + taxPaise;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) return;

    const res = storeService.validateCoupon(couponCode, subtotalPaise);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponSuccess(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E6E0D8] flex items-center justify-between bg-[#FAF7F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#641D32]" />
              <h2 className="text-base font-serif font-bold text-[#292522]">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#766B61] hover:text-[#292522] rounded-md transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF7F0] px-5 py-2.5 border-b border-[#E6E0D8] text-xs">
            <div className="flex items-center gap-1.5 text-[#292522] font-medium">
              <Truck className="w-3.5 h-3.5 text-[#641D32]" />
              {isFreeShipping ? (
                <span className="text-emerald-800 font-semibold">
                  You unlocked Free Insured Express Delivery across India!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#641D32]">{formatPriceINR(freeShippingNeededPaise)}</strong> more to get Free Express Shipping!
                </span>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto text-[#766B61] border border-[#E6E0D8]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#292522]">Your bag is empty</h3>
                  <p className="text-xs text-[#766B61] mt-1 max-w-xs mx-auto">
                    Explore our authentic Kolhapuri Paithani and bridal weaves to begin your collection.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#641D32] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#4A1223] transition-colors"
                >
                  Discover Handloom Sarees
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 p-3 rounded-lg border border-[#E6E0D8] bg-white hover:border-[#641D32]/30 transition-colors"
                >
                  <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-[#FAF7F0]">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#292522] font-serif line-clamp-2 leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => storeService.removeFromCart(item.productId, item.variantId)}
                          className="text-[#766B61] hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#766B61]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span>{item.colorName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="inline-flex items-center border border-[#E6E0D8] rounded bg-[#FAF7F0] text-xs">
                        <button
                          onClick={() => storeService.updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-white text-[#292522]"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => storeService.updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-white text-[#292522]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#641D32] tabular-nums font-sans">
                        {formatPriceINR(item.sellingPricePaise * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E6E0D8] bg-[#FAF7F0] space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatPriceINR(discountPaise)})</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. FESTIVE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#292522] hover:bg-black text-white text-xs font-medium rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && !appliedCoupon && <p className="text-[11px] text-emerald-700 mt-1">{couponSuccess}</p>}
              </div>

              {/* Subtotal Calculation Lines */}
              <div className="space-y-1.5 text-xs text-[#292522] pt-2 border-t border-[#E6E0D8]">
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Bag Subtotal</span>
                  <span className="tabular-nums font-semibold">{formatPriceINR(subtotalPaise)}</span>
                </div>
                {discountPaise > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Coupon Savings</span>
                    <span className="tabular-nums font-semibold">-{formatPriceINR(discountPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Insured Express Shipping</span>
                  <span className="tabular-nums">
                    {shippingChargePaise === 0 ? (
                      <span className="text-emerald-800 font-semibold">FREE</span>
                    ) : (
                      formatPriceINR(shippingChargePaise)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Estimated GST (5%)</span>
                  <span className="tabular-nums font-medium">{formatPriceINR(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E6E0D8] text-[#641D32]">
                  <span>Total Payable</span>
                  <span className="tabular-nums text-base">{formatPriceINR(finalTotalPaise)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(appliedCoupon?.code);
                }}
                className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
