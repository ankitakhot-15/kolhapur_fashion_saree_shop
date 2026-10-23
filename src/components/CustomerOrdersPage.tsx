import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  XCircle, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { Order } from '../types/index.ts';
import { storeService } from '../services/storeService.ts';
import { formatPriceINR, formatDate } from '../utils/formatters.ts';

interface CustomerOrdersPageProps {
  onBack: () => void;
  onNavigateHome: () => void;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({
  onBack,
  onNavigateHome
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of plan / Selected another saree');
  const [cancelError, setCancelError] = useState('');

  const [session, setSession] = useState<any>(() => storeService.getSession());

  useEffect(() => {
    const update = () => {
      const currentSession = storeService.getSession();
      setSession(currentSession);
      const list = storeService.getOrders(currentSession ? { userId: currentSession.email } : undefined);
      setOrders(list);
    };
    update();
    return storeService.subscribe(update);
  }, []);

  const handleCancelOrder = () => {
    if (!cancelModalOrder) return;
    try {
      storeService.updateOrderStatus(
        cancelModalOrder.id,
        'Cancelled',
        session?.email || 'Customer',
        cancelReason
      );
      setCancelModalOrder(null);
      setCancelError('');
    } catch (err: any) {
      setCancelError(err.message || 'Unable to cancel order.');
    }
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'Order Confirmed':
      case 'Processing':
      case 'Packed':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Cancelled':
      case 'Refunded':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-[#292522] bg-[#FAF7F0] border-[#E6E0D8]';
    }
  };

  const trackingSteps = [
    'Order Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getStepIndex = (status: string) => {
    const idx = trackingSteps.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
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
            My Saree Orders & Live Tracking
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E6E0D8] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto text-[#766B61] border border-[#E6E0D8]">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#292522]">No orders placed yet</h3>
            <p className="text-xs text-[#766B61] mt-1">
              When you purchase a handloom saree from our boutique, your delivery status and Blue Dart tracking will appear here.
            </p>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-[#641D32] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#4A1223] transition-colors"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order list (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#766B61]">Recent Orders ({orders.length})</h2>
            {orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id || (!selectedOrder && orders[0]?.id === ord.id);
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#641D32] ring-1 ring-[#641D32] shadow-sm'
                      : 'bg-white border-[#E6E0D8] hover:border-[#641D32]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#641D32] block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#766B61] mt-0.5 block">
                        {formatDate(ord.createdAt)}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E6E0D8]/60">
                    <div className="flex -space-x-2 overflow-hidden">
                      {ord.items.slice(0, 3).map((it, idx) => (
                        <img
                          key={idx}
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-12 object-cover rounded border-2 border-white shadow-xs"
                        />
                      ))}
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="text-[#292522] font-medium block truncate">
                        {ord.items.map(i => i.name).join(', ')}
                      </span>
                      <span className="text-xs font-bold text-[#641D32] tabular-nums font-sans">
                        {formatPriceINR(ord.finalPayablePaise)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details & Tracking Stepper (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E6E0D8] p-6 sm:p-8 space-y-6">
            {(() => {
              const active = selectedOrder || orders[0];
              if (!active) return null;

              const isEligibleForCancel = ['Pending Payment', 'Payment Confirmed', 'Order Confirmed', 'Processing', 'Packed'].includes(active.orderStatus);
              const currentStepIdx = getStepIndex(active.orderStatus);

              return (
                <div className="space-y-6">
                  {/* Title & Order Metadata */}
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E6E0D8]">
                    <div>
                      <span className="text-xs text-[#766B61]">Order Reference</span>
                      <h3 className="text-xl font-mono font-bold text-[#641D32] mt-0.5">
                        #{active.orderNumber}
                      </h3>
                      <span className="text-xs text-[#766B61] mt-1 block">
                        Placed on {formatDate(active.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${getStatusColor(active.orderStatus)}`}>
                        {active.orderStatus}
                      </span>
                      {isEligibleForCancel && (
                        <button
                          onClick={() => setCancelModalOrder(active)}
                          className="px-3 py-1 text-xs font-medium text-red-700 hover:text-red-900 border border-red-200 rounded hover:bg-red-50 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracking Timeline Stepper (if active not cancelled) */}
                  {!['Cancelled', 'Refund Pending', 'Refunded'].includes(active.orderStatus) && (
                    <div className="bg-[#FAF7F0] p-5 rounded-lg border border-[#E6E0D8] space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#292522]">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#641D32]" />
                          <span>Shipment Progress</span>
                        </span>
                        {active.shipment?.estimatedDeliveryDate && (
                          <span className="text-[#766B61]">
                            Estimated: {active.shipment.estimatedDeliveryDate}
                          </span>
                        )}
                      </div>

                      {/* Stepper Dots */}
                      <div className="grid grid-cols-6 gap-1 relative pt-2">
                        {trackingSteps.map((s, idx) => {
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          return (
                            <div key={s} className="flex flex-col items-center text-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                                  isCurrent
                                    ? 'bg-[#641D32] text-white ring-2 ring-[#C7A66A]'
                                    : isDone
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-[#E6E0D8] text-[#766B61]'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className="text-[10px] mt-1 leading-tight text-[#766B61] hidden sm:block">
                                {s}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Courier tracking info */}
                      {active.shipment?.trackingNumber && (
                        <div className="pt-3 border-t border-[#E6E0D8] flex flex-wrap items-center justify-between text-xs">
                          <div>
                            <span className="text-[#766B61]">Courier Partner: </span>
                            <strong>{active.shipment.courierName || 'Blue Dart'}</strong>
                          </div>
                          <div>
                            <span className="text-[#766B61]">Air Waybill / Tracking: </span>
                            <span className="font-mono font-bold text-[#641D32]">{active.shipment.trackingNumber}</span>
                          </div>
                          {active.shipment.trackingUrl && (
                            <a
                              href={active.shipment.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#641D32] hover:underline font-semibold flex items-center gap-1 ml-auto"
                            >
                              <span>Track on Carrier Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancelled Alert */}
                  {['Cancelled', 'Refund Pending', 'Refunded'].includes(active.orderStatus) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <AlertCircle className="w-4 h-4 text-red-700" />
                        <span>Order Cancelled</span>
                      </div>
                      <p>
                        Reason: {active.cancellation?.reason || 'Cancelled per customer request'}. All reserved handloom inventory has been released.
                      </p>
                      {active.cancellation?.refundAmountPaise ? (
                        <p className="font-semibold text-emerald-800">
                          Refund of {formatPriceINR(active.cancellation.refundAmountPaise)} initiated to original payment method.
                        </p>
                      ) : null}
                    </div>
                  )}

                  {/* Items list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#766B61]">Purchased Items</h4>
                    <div className="space-y-3">
                      {active.items.map((it) => (
                        <div key={`${it.productId}-${it.variantId}`} className="flex items-center gap-4 p-3 rounded-lg border border-[#E6E0D8]">
                          <img src={it.image} alt={it.name} className="w-14 h-16 object-cover rounded bg-[#FAF7F0]" />
                          <div className="flex-1">
                            <h5 className="text-xs font-semibold text-[#292522] font-serif">{it.name}</h5>
                            <span className="text-[11px] text-[#766B61] block">{it.colorName} · Qty: {it.quantity}</span>
                          </div>
                          <span className="text-xs font-bold text-[#641D32] tabular-nums font-sans">
                            {formatPriceINR(it.totalPaise)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Pricing Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E6E0D8] text-xs">
                    <div>
                      <h4 className="font-bold text-[#292522] mb-1">Delivery Address</h4>
                      <p className="text-[#766B61] leading-relaxed">
                        {active.shippingAddressSnapshot.fullName}<br />
                        {active.shippingAddressSnapshot.addressLine1}<br />
                        {active.shippingAddressSnapshot.city}, {active.shippingAddressSnapshot.state} - {active.shippingAddressSnapshot.pinCode}<br />
                        Phone: {active.shippingAddressSnapshot.mobileNumber}
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-[#FAF7F0] p-3 rounded-md border border-[#E6E0D8]">
                      <div className="flex justify-between text-[#766B61]">
                        <span>Subtotal:</span>
                        <span className="tabular-nums">{formatPriceINR(active.subtotalPaise)}</span>
                      </div>
                      {active.couponDiscountPaise > 0 && (
                        <div className="flex justify-between text-emerald-800">
                          <span>Coupon Discount:</span>
                          <span className="tabular-nums">-{formatPriceINR(active.couponDiscountPaise)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#766B61]">
                        <span>Shipping:</span>
                        <span className="tabular-nums">{active.shippingChargePaise === 0 ? 'FREE' : formatPriceINR(active.shippingChargePaise)}</span>
                      </div>
                      <div className="flex justify-between text-[#766B61]">
                        <span>GST (5%):</span>
                        <span className="tabular-nums">{formatPriceINR(active.taxPaise)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-[#641D32] pt-1 border-t border-[#E6E0D8]">
                        <span>Paid Total:</span>
                        <span className="tabular-nums">{formatPriceINR(active.finalPayablePaise)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline History */}
                  <div className="pt-4 border-t border-[#E6E0D8] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#766B61]">Audit Timeline</h4>
                    <div className="space-y-2">
                      {active.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#766B61]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#641D32] mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-[#292522]">{h.status}</span>
                            {h.note && <span className="ml-1 text-[#766B61]">({h.note})</span>}
                            <span className="ml-2 text-[11px] text-[#766B61]/70">· {formatDate(h.timestamp)} by {h.actor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E6E0D8] space-y-4">
            <h3 className="text-base font-serif font-bold text-[#292522]">
              Cancel Order #{cancelModalOrder.orderNumber}?
            </h3>
            <p className="text-xs text-[#766B61] leading-relaxed">
              Are you sure you want to cancel this handloom saree order? The reserved inventory will be restored to warehouse stock, and a refund will be queued.
            </p>

            <div>
              <label className="text-xs font-semibold text-[#292522] block mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none"
              >
                <option value="Change of plan / Selected another saree">Change of plan / Selected another saree</option>
                <option value="Delivery date no longer aligns with event">Delivery date no longer aligns with event</option>
                <option value="Ordered duplicate by mistake">Ordered duplicate by mistake</option>
                <option value="Other customer request">Other personal reason</option>
              </select>
            </div>

            {cancelError && <p className="text-xs text-red-600">{cancelError}</p>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2 text-xs font-medium border border-[#E6E0D8] rounded-md hover:bg-[#FAF7F0]"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2 text-xs font-semibold bg-red-700 hover:bg-red-800 text-white rounded-md transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
