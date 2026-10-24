import React, { useEffect, useMemo, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Crown, X } from 'lucide-react';
import type { Order, OrderStatus } from '../../types/index.ts';
import { formatPriceINR } from '../../utils/formatters.ts';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending Payment',
  'Payment Confirmed',
  'Order Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded'
] as OrderStatus[];

// The order date field name is not visible in the types I was given,
// so we try the common names. Firestore Timestamps are supported too.
const DATE_KEYS = ['createdAt', 'orderDate', 'placedAt', 'orderedAt', 'timestamp', 'date'];

function getOrderDate(o: Order): Date | null {
  const rec = o as unknown as Record<string, any>;
  for (const k of DATE_KEYS) {
    const v = rec[k];
    if (v === undefined || v === null || v === '') continue;
    const d = typeof v?.toDate === 'function' ? v.toDate() : new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const getPhone = (o: Order) => String(o.customerPhone || o.shippingAddressSnapshot?.mobileNumber || '');

// Only paid orders that were not cancelled or refunded count as "purchases".
const NOT_COUNTED = ['Cancelled', 'Refunded', 'Refund Pending', 'Pending Payment'];
const isCounted = (o: Order) => o.paymentStatus === 'Paid' && !NOT_COUNTED.includes(String(o.orderStatus));

interface CustomerStat {
  key: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spentPaise: number;
  lastOrder: Date | null;
}

function buildCustomerStats(orders: Order[]): CustomerStat[] {
  const map = new Map<string, CustomerStat>();
  for (const o of orders) {
    if (!isCounted(o)) continue;
    const phone = getPhone(o);
    const email = String(o.customerEmail || '').toLowerCase();
    const key = email || phone.replace(/\D/g, '') || String(o.customerName).toLowerCase();
    const date = getOrderDate(o);

    const cur = map.get(key) ?? {
      key,
      name: o.customerName,
      phone,
      email,
      orders: 0,
      spentPaise: 0,
      lastOrder: null
    };
    cur.orders += 1;
    cur.spentPaise += Number(o.finalPayablePaise) || 0;
    if (date && (!cur.lastOrder || date > cur.lastOrder)) cur.lastOrder = date;
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => b.spentPaise - a.spentPaise || b.orders - a.orders);
}

function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface OrdersPanelProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onManage: (order: Order) => void;
  onAssignCourier: (order: Order) => void;
}

const field = 'p-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded text-xs';

export const OrdersPanel: React.FC<OrdersPanelProps> = ({
  orders,
  onStatusChange,
  onManage,
  onAssignCourier
}) => {
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(''); // '' = all months, otherwise YYYY-MM
  const [status, setStatus] = useState(''); // '' = all statuses
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showTop, setShowTop] = useState(true);

  // Months that actually have orders (newest first)
  const months = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      const d = getOrderDate(o);
      if (d) set.add(monthKey(d));
    });
    return [...set].sort().reverse();
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, '');
    const digits = q.replace(/\D/g, '');

    const list = orders.filter((o) => {
      if (status && o.orderStatus !== status) return false;

      if (month) {
        const d = getOrderDate(o);
        if (!d || monthKey(d) !== month) return false;
      }

      if (!q) return true;

      const byOrderNo = String(o.orderNumber).toLowerCase().includes(q);
      const byName =
        String(o.customerName || '').toLowerCase().includes(q) ||
        String(o.shippingAddressSnapshot?.fullName || '').toLowerCase().includes(q);
      const byEmail = String(o.customerEmail || '').toLowerCase().includes(q);
      const byPhone =
        digits.length >= 3 &&
        [o.customerPhone, o.shippingAddressSnapshot?.mobileNumber].some((p) =>
          String(p || '').replace(/\D/g, '').includes(digits)
        );

      return byOrderNo || byName || byEmail || byPhone;
    });

    // newest first when dates exist
    return [...list].sort(
      (a, b) => (getOrderDate(b)?.getTime() ?? 0) - (getOrderDate(a)?.getTime() ?? 0)
    );
  }, [orders, query, month, status]);

  // Back to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [query, month, status, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const topCustomers = useMemo(() => buildCustomerStats(filtered).slice(0, 5), [filtered]);
  const paidRevenuePaise = useMemo(
    () => filtered.filter(isCounted).reduce((s, o) => s + (Number(o.finalPayablePaise) || 0), 0),
    [filtered]
  );

  const filtersActive = !!(query || month || status);

  const clearFilters = () => {
    setQuery('');
    setMonth('');
    setStatus('');
  };

  /* -------------------------------- CSV export ------------------------------- */
  const exportCsv = () => {
    if (!filtered.length) return;

    const orderRows = filtered.map((o) => {
      const a = o.shippingAddressSnapshot;
      return {
        'Order No': o.orderNumber,
        Date: fmtDate(getOrderDate(o)),
        Customer: o.customerName,
        Mobile: getPhone(o),
        Email: o.customerEmail,
        Items: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        'Amount (INR)': Math.round((Number(o.finalPayablePaise) || 0) / 100),
        Payment: o.paymentStatus,
        'Order Status': o.orderStatus,
        Courier: o.shipment?.courierName || '',
        'Tracking No': o.shipment?.trackingNumber || '',
        Address: a?.addressLine1 || '',
        City: a?.city || '',
        State: a?.state || '',
        'Pin Code': a?.pinCode || ''
      };
    });

    const today = new Date().toISOString().slice(0, 10);
    const fileName = month
      ? `orders-${month}.csv`
      : filtersActive
        ? `orders-filtered-${today}.csv`
        : `orders-all-${today}.csv`;
    const headers = Object.keys(orderRows[0] ?? {});
    const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      headers.map(escapeCsv).join(','),
      ...orderRows.map((row) => {
        const values = row as Record<string, unknown>;
        return headers.map((header) => escapeCsv(values[header])).join(',');
      })
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <div className="space-y-4">
      {/* Filters + export */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E0D8] shadow-xs space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px]">
            <label className="font-semibold text-xs text-[#292522] block mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#766B61] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order no., mobile no. or customer name"
                className={`${field} w-full pl-8`}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-xs text-[#292522] block mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className={field}>
              <option value="">All months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-xs text-[#292522] block mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-xs text-[#292522] block mb-1">Per page</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className={field}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#641D32] border border-[#E6E0D8] rounded hover:bg-[#FAF7F0]"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded disabled:opacity-50"
            title="Downloads every order that matches the filters above"
          >
            <Download className="w-4 h-4" />
            Export CSV ({filtered.length})
          </button>
        </div>

        <p className="text-[11px] text-[#766B61]">
          {filtered.length} of {orders.length} orders
          {month ? ` · ${monthLabel(month)}` : ' · all months'}
          {' · '}Paid revenue {formatPriceINR(paidRevenuePaise)}
          {'. '}Export downloads exactly what is filtered (everything when no filter is set).
        </p>
      </div>

      {/* Top customers */}
      <div className="bg-white rounded-xl border border-[#E6E0D8] shadow-xs">
        <button
          type="button"
          onClick={() => setShowTop((s) => !s)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-serif font-bold text-[#292522]">
            <Crown className="w-4 h-4 text-[#C7A66A]" />
            Top customers by purchase
            <span className="text-[11px] font-sans font-normal text-[#766B61]">
              ({month ? monthLabel(month) : 'all time'}, paid orders only)
            </span>
          </span>
          <span className="text-[11px] font-semibold text-[#641D32]">{showTop ? 'Hide' : 'Show'}</span>
        </button>

        {showTop && (
          <div className="px-4 pb-4">
            {topCustomers.length === 0 ? (
              <p className="text-xs text-[#766B61]">No paid orders in this selection yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
                    <tr>
                      <th className="p-2.5 w-10">#</th>
                      <th className="p-2.5">Customer</th>
                      <th className="p-2.5">Mobile</th>
                      <th className="p-2.5">Orders</th>
                      <th className="p-2.5">Total spent</th>
                      <th className="p-2.5">Last order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E0D8]">
                    {topCustomers.map((c, idx) => (
                      <tr
                        key={c.key}
                        onClick={() => setQuery(c.phone || c.name)}
                        className="hover:bg-[#FAF7F0]/60 cursor-pointer"
                        title="Click to see this customer's orders"
                      >
                        <td className="p-2.5 font-bold text-[#641D32]">{idx + 1}</td>
                        <td className="p-2.5">
                          <span className="font-semibold text-[#292522] block">{c.name}</span>
                          <span className="text-[#766B61] text-[11px]">{c.email}</span>
                        </td>
                        <td className="p-2.5 font-mono">{c.phone}</td>
                        <td className="p-2.5 tabular-nums">{c.orders}</td>
                        <td className="p-2.5 font-bold tabular-nums font-sans text-[#641D32]">
                          {formatPriceINR(c.spentPaise)}
                        </td>
                        <td className="p-2.5">{fmtDate(c.lastOrder)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-[#E6E0D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Shipment</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D8]">
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#766B61]">
                    No orders match these filters.
                  </td>
                </tr>
              )}

              {pageRows.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF7F0]/60">
                  <td className="p-3 font-mono font-bold text-[#641D32]">#{o.orderNumber}</td>
                  <td className="p-3 whitespace-nowrap">{fmtDate(getOrderDate(o))}</td>
                  <td className="p-3">
                    <span className="font-semibold text-[#292522] block">{o.customerName}</span>
                    <span className="text-[#766B61] text-[11px]">{getPhone(o)}</span>
                  </td>
                  <td className="p-3 max-w-[200px] truncate">
                    {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="p-3 font-bold tabular-nums font-sans">
                    {formatPriceINR(o.finalPayablePaise)}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => onStatusChange(o.id, e.target.value as OrderStatus)}
                      className="text-xs p-1 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-semibold text-[#292522]"
                    >
                      {!STATUS_OPTIONS.includes(o.orderStatus) && (
                        <option value={o.orderStatus}>{o.orderStatus}</option>
                      )}
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    {o.shipment?.trackingNumber ? (
                      <span className="font-mono text-[11px] text-[#641D32] font-semibold">
                        {o.shipment.courierName}: {o.shipment.trackingNumber}
                      </span>
                    ) : (
                      <button
                        onClick={() => onAssignCourier(o)}
                        className="text-[11px] text-[#641D32] hover:underline font-semibold"
                      >
                        + Assign Courier
                      </button>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onManage(o)}
                      className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-white text-[#292522] border border-[#E6E0D8] rounded font-medium text-[11px]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-[#E6E0D8] text-xs">
            <span className="text-[#766B61]">
              Showing {start + 1} to {Math.min(start + pageSize, filtered.length)} of {filtered.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage <= 1}
                className="p-1.5 border border-[#E6E0D8] rounded hover:bg-[#FAF7F0] disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageList(safePage, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className="px-2 text-[#766B61]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`min-w-[30px] px-2 py-1.5 rounded border font-semibold ${
                      p === safePage
                        ? 'bg-[#641D32] text-white border-[#641D32]'
                        : 'border-[#E6E0D8] hover:bg-[#FAF7F0] text-[#292522]'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="p-1.5 border border-[#E6E0D8] rounded hover:bg-[#FAF7F0] disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPanel;