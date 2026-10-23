export type SareeCategory = 
  | 'Silk Sarees'
  | 'Paithani Sarees'
  | 'Traditional Sarees'
  | 'Designer Sarees'
  | 'Festive Sarees'
  | 'Wedding Sarees'
  | 'Cotton Sarees'
  | 'Party Wear Sarees';

export interface SareeVariant {
  variantId: string;
  colorName: string;
  colorHex: string;
  
  sku: string;
  originalPricePaise: number;
  sellingPricePaise: number;
  inventoryStock: number;
  reservedStock: number;
  images: string[];
}

export interface SareeProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryIds: string[];
  categoryNames: string[];
  fabric: string;
  occasion: string;
  lengthMeters: number;
  blousePiece: string;
  careInstructions: string;
  primaryImage: string;
  galleryImages: string[];
  variants: SareeVariant[];
  featured: boolean;
  trending: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface PromotionalBanner {
  id: string;
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  badgeText?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  validUntil: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  maxDiscountPaise: number;
  minOrderValuePaise: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  validUntil: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  image: string;
  sellingPricePaise: number;
  originalPricePaise: number;
  quantity: number;
  sku: string;
  fabric: string;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'Pending Payment'
  | 'Payment Confirmed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Pending'
  | 'Refunded'
  | 'Payment Failed';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  actor: string;
}

export interface OrderShipment {
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  colorName: string;
  sku: string;
  unitPricePaise: number;
  quantity: number;
  totalPaise: number;
  image: string;
  fabric: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddressSnapshot: DeliveryAddress;
  subtotalPaise: number;
  couponDiscountPaise: number;
  shippingChargePaise: number;
  taxPaise: number;
  finalPayablePaise: number;
  couponCodeApplied?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paidAt?: string;
    method?: string;
  };
  shipment: OrderShipment;
  cancellation?: {
    cancelledAt: string;
    reason: string;
    refundAmountPaise?: number;
    cancelledBy: string;
  };
  statusHistory: OrderStatusHistoryItem[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  sku: string;
  changeType: 'INITIAL' | 'RESTOCK' | 'RESERVE' | 'SALE' | 'CANCEL_RELEASE' | 'MANUAL_ADJUSTMENT';
  quantityChange: number;
  stockAfter: number;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: 'PRODUCT' | 'ORDER' | 'INVENTORY' | 'BANNER' | 'CATEGORY' | 'COUPON' | 'SETTINGS';
  entityId: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  businessPhone: string;
  whatsappContact: string;
  instagramHandle: string;
  businessAddress: string;
  supportEmail: string;
  announcementMessages: string[];
  announcementRotationSpeedSeconds: number;
  standardShippingFeePaise: number;
  freeShippingThresholdPaise: number;
  taxPercentage: number;
  logoUrl?: string;
}

export interface UserSession {
  email: string;
  fullName?: string;
  phone?: string;
  role: 'customer' | 'admin';
  token: string;
}
export { parseBill } from '../parseBill';