// src/services/storeService.ts
import {
  SareeProduct,
  CategoryItem,
  PromotionalBanner,
  PromotionalOffer,
  Coupon,
  CartItem,
  DeliveryAddress,
  Order,
  OrderItem,
  OrderStatus,
  InventoryMovement,
  AuditLogItem,
  StoreSettings,
  UserSession
} from '../types/index.ts';
import {
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_OFFERS,
  INITIAL_COUPONS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS
} from '../data/initialData.ts';
import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// localStorage keys (local cache + per-device data such as cart / session)
// ---------------------------------------------------------------------------
const STORAGE_KEY_PRODUCTS = 'kfs_products_v1';
const STORAGE_KEY_FILTER_SAMPLE_MIGRATION = 'kfs_filter_sample_migration_v1';
const STORAGE_KEY_CATEGORIES = 'kfs_categories_v1';
const STORAGE_KEY_BANNERS = 'kfs_banners_v1';
const STORAGE_KEY_OFFERS = 'kfs_offers_v1';
const STORAGE_KEY_COUPONS = 'kfs_coupons_v1';
const STORAGE_KEY_ORDERS = 'kfs_orders_v1';
const STORAGE_KEY_MOVEMENTS = 'kfs_movements_v1';
const STORAGE_KEY_AUDIT = 'kfs_audit_v1';
const STORAGE_KEY_SETTINGS = 'kfs_settings_v1';
const STORAGE_KEY_CART = 'kfs_cart_v1';
const STORAGE_KEY_WISHLIST = 'kfs_wishlist_v1';
const STORAGE_KEY_ADDRESSES = 'kfs_addresses_v1';
const STORAGE_KEY_USER = 'kfs_user_session_v1';

// True only while running `npm run dev` (avoids needing vite/client typings here).
const IS_DEV: boolean = (import.meta as any).env?.DEV === true;

// NOTE: client-side admin check is for demo only. A live store must verify roles on a server.
const ADMIN_EMAILS = ['ankitakhot015@gmail.com', 'akashkhot73@gmail.com'];

// How long an OTP stays valid. Change this ONE number (keep it between 1 and 60).
export const OTP_VALIDITY_MINUTES = 10;

// Unpaid orders hold stock only this long, then the stock is released automatically.
export const PENDING_ORDER_TTL_MINUTES = 15;

const MAX_AUDIT_LOGS = 300;
const MAX_MOVEMENTS = 1000;
const FIRESTORE_BATCH_LIMIT = 400; // Firestore allows 500 ops per batch

export interface DispatchedEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  sentAt: string;
  otp: string;
}

export interface OtpEmailResult {
  emailSent: boolean;
  emailError: string | null;
}

export interface OtpRequestResult {
  challengeId: string;
  expiresAt: number;
  // Resolves once the email server answers. Optional to await.
  emailResult: Promise<OtpEmailResult>;
}

export interface CloudStatus {
  ready: boolean;
  error: string | null;
}

type CloudCollection = {
  name: string; // Firestore collection name
  key: string; // localStorage key
  get: () => { id: string }[];
  set: (rows: any[]) => void;
  sort?: (a: any, b: any) => number;
};

const byNewest = (field: string) => (a: any, b: any) =>
  new Date(b[field] || 0).getTime() - new Date(a[field] || 0).getTime();
const bySortOrder = (a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

function secureRandomInt(min: number, maxExclusive: number): number {
  const range = maxExclusive - min;
  try {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return min + (buf[0] % range);
  } catch {
    return min + Math.floor(Math.random() * range);
  }
}

class StoreService {
  private products: SareeProduct[] = [];
  private categories: CategoryItem[] = [];
  private banners: PromotionalBanner[] = [];
  private offers: PromotionalOffer[] = [];
  private coupons: Coupon[] = [];
  private orders: Order[] = [];
  private inventoryMovements: InventoryMovement[] = [];
  private auditLogs: AuditLogItem[] = [];
  private settings: StoreSettings = { ...INITIAL_SETTINGS };
  private session: UserSession | null = null;
  private cart: CartItem[] = [];
  private wishlist: string[] = [];
  private addresses: DeliveryAddress[] = [];
  private listeners: Set<() => void> = new Set();
  private otpChallenges: Map<string, { email: string; otp: string; expiresAt: number; attempts: number }> = new Map();
  private lastDispatchedEmail: DispatchedEmail | null = null;

  // ---- Firestore sync state ----
  private cloudReady = false;
  private cloudError: string | null = null;
  private lastSynced = new Map<string, string>(); // "collection/id" -> JSON last written/read
  private syncQueues = new Map<string, Promise<void>>(); // per-collection write queue
  public ready: Promise<void>; // resolves when the first cloud load has finished (success or failure)

  private readonly cloudCollections: CloudCollection[] = [
    { name: 'products', key: STORAGE_KEY_PRODUCTS, get: () => this.products, set: r => (this.products = r), sort: byNewest('createdAt') },
    { name: 'categories', key: STORAGE_KEY_CATEGORIES, get: () => this.categories, set: r => (this.categories = r), sort: bySortOrder },
    { name: 'banners', key: STORAGE_KEY_BANNERS, get: () => this.banners, set: r => (this.banners = r), sort: bySortOrder },
    { name: 'offers', key: STORAGE_KEY_OFFERS, get: () => this.offers, set: r => (this.offers = r) },
    { name: 'coupons', key: STORAGE_KEY_COUPONS, get: () => this.coupons, set: r => (this.coupons = r) },
    { name: 'orders', key: STORAGE_KEY_ORDERS, get: () => this.orders, set: r => (this.orders = r), sort: byNewest('createdAt') },
    { name: 'inventoryMovements', key: STORAGE_KEY_MOVEMENTS, get: () => this.inventoryMovements, set: r => (this.inventoryMovements = r), sort: byNewest('timestamp') },
    { name: 'auditLogs', key: STORAGE_KEY_AUDIT, get: () => this.auditLogs, set: r => (this.auditLogs = r), sort: byNewest('timestamp') }
  ];

  constructor() {
    this.loadState();
    this.expireStalePendingOrders();
    this.sanitizeCart();

    this.ready = this.hydrateFromCloud();

    // Release stock held by abandoned checkouts even if the tab stays open.
    if (typeof window !== 'undefined') {
      setInterval(() => this.expireStalePendingOrders(), 60 * 1000);
    }
  }

  // =========================================================================
  // LOCAL LOAD + CLOUD SYNC
  // =========================================================================
  private loadState() {
    try {
      const p = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      this.products = p ? JSON.parse(p) : [...INITIAL_PRODUCTS];
      if (p && localStorage.getItem(STORAGE_KEY_FILTER_SAMPLE_MIGRATION) !== '1') {
        const existingIds = new Set(this.products.map(product => product.id));
        const sampleProducts = INITIAL_PRODUCTS.filter(
          product => product.id.startsWith('filter-demo-') && !existingIds.has(product.id)
        );
        this.products.push(...sampleProducts);
        try {
          if (sampleProducts.length > 0) {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
          }
          localStorage.setItem(STORAGE_KEY_FILTER_SAMPLE_MIGRATION, '1');
        } catch (error) {
          console.error('Failed to migrate filter sample products', error);
        }
      }

      const c = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      this.categories = c ? JSON.parse(c) : [...INITIAL_CATEGORIES];

      const b = localStorage.getItem(STORAGE_KEY_BANNERS);
      this.banners = b ? JSON.parse(b) : [...INITIAL_BANNERS];

      const o = localStorage.getItem(STORAGE_KEY_OFFERS);
      this.offers = o ? JSON.parse(o) : [...INITIAL_OFFERS];

      const cpn = localStorage.getItem(STORAGE_KEY_COUPONS);
      this.coupons = cpn ? JSON.parse(cpn) : [...INITIAL_COUPONS];

      const ord = localStorage.getItem(STORAGE_KEY_ORDERS);
      this.orders = ord ? JSON.parse(ord) : this.createInitialSampleOrders();

      const mov = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      this.inventoryMovements = mov ? JSON.parse(mov) : this.createInitialMovements();

      const aud = localStorage.getItem(STORAGE_KEY_AUDIT);
      this.auditLogs = aud ? JSON.parse(aud) : [];

      const set = localStorage.getItem(STORAGE_KEY_SETTINGS);
      this.settings = set ? JSON.parse(set) : { ...INITIAL_SETTINGS };

      const usr = localStorage.getItem(STORAGE_KEY_USER);
      this.session = usr ? JSON.parse(usr) : null;

      const crt = localStorage.getItem(STORAGE_KEY_CART);
      this.cart = crt ? JSON.parse(crt) : [];

      const wsh = localStorage.getItem(STORAGE_KEY_WISHLIST);
      this.wishlist = wsh ? JSON.parse(wsh) : [];

      const adr = localStorage.getItem(STORAGE_KEY_ADDRESSES);
      this.addresses = adr ? JSON.parse(adr) : [
        {
          id: 'addr-default-1',
          fullName: 'Pooja Kulkarni',
          mobileNumber: '9096863092',
          email: 'pooja.kulkarni@example.com',
          addressLine1: 'Shivaji Nagar, Unchgaon',
          landmark: 'Near Mahalaxmi Temple road',
          city: 'Kolhapur',
          state: 'Maharashtra',
          pinCode: '416005',
          country: 'India',
          isDefault: true
        }
      ];
    } catch (e) {
      console.warn('Error loading stored boutique state, fallback to seed data', e);
      this.products = [...INITIAL_PRODUCTS];
      this.categories = [...INITIAL_CATEGORIES];
      this.banners = [...INITIAL_BANNERS];
      this.offers = [...INITIAL_OFFERS];
      this.coupons = [...INITIAL_COUPONS];
      this.orders = this.createInitialSampleOrders();
      this.inventoryMovements = this.createInitialMovements();
      this.auditLogs = [];
      this.settings = { ...INITIAL_SETTINGS };
      this.session = null;
      this.cart = [];
      this.wishlist = [];
      this.addresses = [];
    }
  }

  /**
   * Loads shared data from Firestore.
   * - Collection has documents  -> cloud data replaces local data.
   * - Collection is empty       -> local/seed data is uploaded (first run).
   * Cloud WRITES stay disabled until this succeeds, so a failed load can never
   * overwrite the cloud with stale local data.
   * Can be called again at any time to refresh from the cloud.
   */
  public async hydrateFromCloud(): Promise<void> {
    if (!isFirebaseConfigured) {
      this.cloudError = 'Firebase is not configured (check VITE_FIREBASE_* in .env).';
      console.warn(this.cloudError);
      return;
    }

    try {
      const toUpload: CloudCollection[] = [];

      for (const col of this.cloudCollections) {
        const snap = await getDocs(collection(db, col.name));
        if (snap.empty) {
          toUpload.push(col);
          continue;
        }
        const rows = snap.docs.map(d => d.data() as any);
        if (col.sort) rows.sort(col.sort);

        for (const k of [...this.lastSynced.keys()]) {
          if (k.startsWith(col.name + '/')) this.lastSynced.delete(k);
        }
        rows.forEach(r => this.lastSynced.set(`${col.name}/${r.id}`, JSON.stringify(r)));

        col.set(rows);
        try {
          localStorage.setItem(col.key, JSON.stringify(rows));
        } catch {
          /* cache only */
        }
      }

      // Settings (single document: settings/global)
      const settingsSnap = await getDocs(collection(db, 'settings'));
      let settingsEmpty = true;
      settingsSnap.forEach(d => {
        if (d.id === 'global') {
          const { id: _ignored, ...rest } = d.data() as any;
          this.settings = { ...INITIAL_SETTINGS, ...rest };
          this.lastSynced.set('settings/global', JSON.stringify({ id: 'global', ...this.settings }));
          settingsEmpty = false;
          try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
          } catch {
            /* cache only */
          }
        }
      });

      this.cloudReady = true;
      this.cloudError = null;

      // First run: push seed data up to Firestore.
      for (const col of toUpload) this.queueSync(col.name, () => col.get());
      if (settingsEmpty) this.queueSync('settings', () => [{ id: 'global', ...this.settings }]);

      this.expireStalePendingOrders();
      this.sanitizeCart();
      this.notifyListeners();
    } catch (e: any) {
      this.cloudReady = false;
      this.cloudError = e?.message || 'Could not load data from Firestore.';
      console.error('Firestore hydrate failed - running on local data only.', e);
      this.notifyListeners();
    }
  }

  public getCloudStatus(): CloudStatus {
    return { ready: this.cloudReady, error: this.cloudError };
  }

  /** Forces every local document to be written to Firestore again (admin "Sync now"). */
  public async forceUploadAll(): Promise<void> {
    if (!this.cloudReady) throw new Error(this.cloudError || 'Cloud is not ready yet.');
    this.lastSynced.clear();
    for (const col of this.cloudCollections) this.queueSync(col.name, () => col.get());
    this.queueSync('settings', () => [{ id: 'global', ...this.settings }]);
    await Promise.all([...this.syncQueues.values()]);
  }

  // Writes run one after another per collection, always using the latest data.
  private queueSync(col: string, getItems: () => { id: string }[]) {
    const prev = this.syncQueues.get(col) || Promise.resolve();
    const next = prev.then(() => this.syncCollection(col, getItems()));
    this.syncQueues.set(col, next.catch(() => undefined));
  }

  private async syncCollection(col: string, items: { id: string }[]): Promise<void> {
    try {
      const writes: { id: string; json: string }[] = [];
      const currentIds = new Set<string>();

      for (const item of items) {
        currentIds.add(item.id);
        const json = JSON.stringify(item); // also strips `undefined`, which Firestore rejects
        if (this.lastSynced.get(`${col}/${item.id}`) !== json) writes.push({ id: item.id, json });
      }

      const deletes: string[] = [];
      for (const k of this.lastSynced.keys()) {
        if (k.startsWith(col + '/')) {
          const id = k.slice(col.length + 1);
          if (!currentIds.has(id)) deletes.push(id);
        }
      }

      type Op = { kind: 'set' | 'del'; id: string; json?: string };
      const ops: Op[] = [
        ...writes.map(w => ({ kind: 'set' as const, id: w.id, json: w.json })),
        ...deletes.map(id => ({ kind: 'del' as const, id }))
      ];

      for (let i = 0; i < ops.length; i += FIRESTORE_BATCH_LIMIT) {
        const chunk = ops.slice(i, i + FIRESTORE_BATCH_LIMIT);
        const batch = writeBatch(db);
        for (const op of chunk) {
          const ref = doc(db, col, op.id);
          if (op.kind === 'set') batch.set(ref, JSON.parse(op.json!));
          else batch.delete(ref);
        }
        await batch.commit();
        // Mark as synced only after the commit succeeded.
        for (const op of chunk) {
          const k = `${col}/${op.id}`;
          if (op.kind === 'set') this.lastSynced.set(k, op.json!);
          else this.lastSynced.delete(k);
        }
      }
    } catch (e: any) {
      this.cloudError = e?.message || `Firestore sync failed for ${col}`;
      console.error(`Firestore sync failed for "${col}"`, e);
    }
  }

  private persist(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }

    if (this.cloudReady) {
      const col = this.cloudCollections.find(c => c.key === key);
      if (col) {
        this.queueSync(col.name, () => col.get());
      } else if (key === STORAGE_KEY_SETTINGS) {
        this.queueSync('settings', () => [{ id: 'global', ...this.settings }]);
      }
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn());
  }

  private addMovement(m: InventoryMovement) {
    this.inventoryMovements.unshift(m);
    if (this.inventoryMovements.length > MAX_MOVEMENTS) this.inventoryMovements.length = MAX_MOVEMENTS;
  }

  private newMovementId() {
    return `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  private createInitialMovements(): InventoryMovement[] {
    const list: InventoryMovement[] = [];
    for (const p of INITIAL_PRODUCTS) {
      for (const v of p.variants) {
        list.push({
          id: this.newMovementId(),
          productId: p.id,
          productName: p.name,
          variantId: v.variantId,
          colorName: v.colorName,
          sku: v.sku,
          changeType: 'INITIAL',
          quantityChange: v.inventoryStock,
          stockAfter: v.inventoryStock,
          reason: 'Initial Kolhapur workshop warehouse stocking',
          performedBy: 'System / Owner',
          timestamp: new Date().toISOString()
        });
      }
    }
    return list;
  }

  private createInitialSampleOrders(): Order[] {
    const p = INITIAL_PRODUCTS[0];
    const v = p.variants[0];
    return [
      {
        id: 'ord-sample-1042',
        orderNumber: 'KFS-2026-1042',
        userId: 'pooja.kulkarni@example.com',
        customerName: 'Pooja Kulkarni',
        customerEmail: 'pooja.kulkarni@example.com',
        customerPhone: '9822012345',
        items: [
          {
            productId: p.id,
            variantId: v.variantId,
            name: p.name,
            colorName: v.colorName,
            sku: v.sku,
            unitPricePaise: v.sellingPricePaise,
            quantity: 1,
            totalPaise: v.sellingPricePaise,
            image: v.images[0] || p.primaryImage,
            fabric: p.fabric
          }
        ],
        shippingAddressSnapshot: {
          id: 'addr-sample-1',
          fullName: 'Pooja Kulkarni',
          mobileNumber: '9822012345',
          email: 'pooja.kulkarni@example.com',
          addressLine1: 'Bunglow No. 12, Tarabai Park',
          addressLine2: 'Near Circuit House',
          landmark: 'Opposite Dream World',
          city: 'Kolhapur',
          state: 'Maharashtra',
          pinCode: '416003',
          country: 'India',
          isDefault: true
        },
        subtotalPaise: v.sellingPricePaise,
        couponDiscountPaise: 0,
        shippingChargePaise: 0,
        taxPaise: Math.round(v.sellingPricePaise * 0.05),
        finalPayablePaise: Math.round(v.sellingPricePaise * 1.05),
        orderStatus: 'Processing',
        paymentStatus: 'Paid',
        paymentDetails: {
          razorpayOrderId: 'order_test_9876543210',
          razorpayPaymentId: 'pay_test_5432109876',
          paidAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          method: 'Razorpay UPI'
        },
        shipment: {
          courierName: 'Blue Dart Express',
          trackingNumber: 'BDKOL2026099182',
          trackingUrl: 'https://www.bluedart.com',
          shippedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          estimatedDeliveryDate: '2026-10-25'
        },
        statusHistory: [
          {
            status: 'Pending Payment',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            actor: 'Customer'
          },
          {
            status: 'Payment Confirmed',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            note: 'Razorpay payment signature verified (pay_test_5432109876)',
            actor: 'Razorpay Gateway'
          },
          {
            status: 'Order Confirmed',
            timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
            note: 'Inventory allocated and order verified',
            actor: 'Store Admin'
          },
          {
            status: 'Processing',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            note: 'Handloom quality inspection completed',
            actor: 'Warehouse Supervisor'
          }
        ],
        adminNotes: 'Customer requested festive silk gift wrap packaging.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];
  }

  // =========================================================================
  // CATALOG
  // =========================================================================
  public getProducts(filter?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    fabric?: string;
    occasion?: string;
    trending?: boolean;
    newArrivals?: boolean;
    featured?: boolean;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popularity' | 'discount';
  }): SareeProduct[] {
    let result = this.products.filter(p => p.isPublished);

    if (filter) {
      if (filter.category && filter.category !== 'All') {
        result = result.filter(p =>
          p.categoryNames.some(c => c.toLowerCase() === filter.category!.toLowerCase()) ||
          p.categoryIds.includes(filter.category!)
        );
      }
      if (filter.search) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.occasion.toLowerCase().includes(q)
        );
      }
      // Price range: ONE colour variant must satisfy BOTH min and max.
      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        const minP = filter.minPrice !== undefined ? filter.minPrice * 100 : -Infinity;
        const maxP = filter.maxPrice !== undefined ? filter.maxPrice * 100 : Infinity;
        result = result.filter(p => p.variants.some(v => v.sellingPricePaise >= minP && v.sellingPricePaise <= maxP));
      }
      if (filter.fabric) {
        result = result.filter(p => p.fabric.toLowerCase().includes(filter.fabric!.toLowerCase()));
      }
      if (filter.occasion) {
        result = result.filter(p => p.occasion.toLowerCase().includes(filter.occasion!.toLowerCase()));
      }
      if (filter.trending) {
        result = result.filter(p => p.trending);
      }
      if (filter.newArrivals) {
        result = result.filter(p => p.isNewArrival);
      }
      if (filter.featured) {
        result = result.filter(p => p.featured);
      }

      if (filter.sort) {
        switch (filter.sort) {
          case 'price-asc':
            result.sort((a, b) => (a.variants[0]?.sellingPricePaise || 0) - (b.variants[0]?.sellingPricePaise || 0));
            break;
          case 'price-desc':
            result.sort((a, b) => (b.variants[0]?.sellingPricePaise || 0) - (a.variants[0]?.sellingPricePaise || 0));
            break;
          case 'popularity':
            result.sort((a, b) => b.reviewsCount - a.reviewsCount);
            break;
          case 'discount':
            result.sort((a, b) => {
              const discA = a.variants[0] && a.variants[0].originalPricePaise
                ? (a.variants[0].originalPricePaise - a.variants[0].sellingPricePaise) / a.variants[0].originalPricePaise
                : 0;
              const discB = b.variants[0] && b.variants[0].originalPricePaise
                ? (b.variants[0].originalPricePaise - b.variants[0].sellingPricePaise) / b.variants[0].originalPricePaise
                : 0;
              return discB - discA;
            });
            break;
          case 'newest':
          default:
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
    }

    return result;
  }

  public getProductBySlug(slug: string): SareeProduct | undefined {
    return this.products.find(p => p.slug === slug || p.id === slug);
  }

  public getAllProductsAdmin(): SareeProduct[] {
    return this.products;
  }

  public saveProduct(productData: Partial<SareeProduct>, actor: string): SareeProduct {
    let saved: SareeProduct;
    if (productData.id) {
      const idx = this.products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        saved = {
          ...this.products[idx],
          ...productData,
          updatedAt: new Date().toISOString()
        };
        this.products[idx] = saved;
        this.logAudit('PRODUCT', saved.id, `Updated saree "${saved.name}"`, actor);
      } else {
        saved = this.createProductEntity(productData, actor);
      }
    } else {
      saved = this.createProductEntity(productData, actor);
    }

    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    return saved;
  }

  private createProductEntity(productData: Partial<SareeProduct>, actor: string): SareeProduct {
    const id = `saree-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = (productData.name || 'saree')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct: SareeProduct = {
      id,
      name: productData.name || 'Authentic Handloom Saree',
      slug,
      sku: productData.sku || `KFS-NEW-${Math.floor(100 + Math.random() * 900)}`,
      description: productData.description || 'Pure handloom saree woven with rich traditional motifs.',
      categoryIds: productData.categoryIds || ['cat-silk'],
      categoryNames: productData.categoryNames || ['Silk Sarees'],
      fabric: productData.fabric || 'Pure Silk',
      occasion: productData.occasion || 'Festivals & Weddings',
      lengthMeters: productData.lengthMeters || 6.3,
      blousePiece: productData.blousePiece || 'Matching unstitched 0.8m blouse piece included',
      careInstructions: productData.careInstructions || 'Dry clean only',
      primaryImage: productData.primaryImage || INITIAL_PRODUCTS[0].primaryImage,
      galleryImages: productData.galleryImages || [INITIAL_PRODUCTS[0].primaryImage],
      variants: productData.variants || [
        {
          variantId: `var-${id}-1`,
          colorName: 'Royal Maroon & Gold',
          colorHex: '#641D32',
          sku: `${productData.sku || 'KFS'}-MRN`,
          originalPricePaise: 1499900,
          sellingPricePaise: 1199900,
          inventoryStock: 8,
          reservedStock: 0,
          images: [productData.primaryImage || INITIAL_PRODUCTS[0].primaryImage]
        }
      ],
      featured: productData.featured ?? false,
      trending: productData.trending ?? false,
      isNewArrival: productData.isNewArrival ?? true,
      isPublished: productData.isPublished ?? true,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.unshift(newProduct);
    this.logAudit('PRODUCT', newProduct.id, `Created new saree "${newProduct.name}"`, actor);
    return newProduct;
  }

  public deleteProduct(id: string, actor: string): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const p = this.products[idx];
      this.products.splice(idx, 1);
      this.logAudit('PRODUCT', id, `Deleted saree "${p.name}"`, actor);
      this.persist(STORAGE_KEY_PRODUCTS, this.products);
      return true;
    }
    return false;
  }

  // =========================================================================
  // CATEGORIES
  // =========================================================================
  public getCategories(): CategoryItem[] {
    return this.categories;
  }

  public saveCategory(cat: Partial<CategoryItem>, actor: string): CategoryItem {
    let saved: CategoryItem;
    if (cat.id) {
      const idx = this.categories.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        this.categories[idx] = { ...this.categories[idx], ...cat };
        saved = this.categories[idx];
        this.logAudit('CATEGORY', cat.id, `Updated category ${cat.name}`, actor);
      } else {
        saved = this.createCategoryEntity(cat, actor);
      }
    } else {
      saved = this.createCategoryEntity(cat, actor);
    }
    this.persist(STORAGE_KEY_CATEGORIES, this.categories);
    return saved;
  }

  private createCategoryEntity(cat: Partial<CategoryItem>, actor: string): CategoryItem {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'New Collection',
      slug: (cat.name || 'collection').toLowerCase().replace(/\s+/g, '-'),
      description: cat.description || '',
      imageUrl: cat.imageUrl || INITIAL_CATEGORIES[0].imageUrl,
      isActive: cat.isActive ?? true,
      sortOrder: this.categories.length + 1
    };
    this.categories.push(newCat);
    this.logAudit('CATEGORY', newCat.id, `Created category ${newCat.name}`, actor);
    return newCat;
  }

  public deleteCategory(id: string, actor: string): boolean {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      const [c] = this.categories.splice(idx, 1);
      this.logAudit('CATEGORY', id, `Deleted category ${c.name}`, actor);
      this.persist(STORAGE_KEY_CATEGORIES, this.categories);
      return true;
    }
    return false;
  }

  // =========================================================================
  // BANNERS
  // =========================================================================
  public getBanners(activeOnly = true): PromotionalBanner[] {
    // Copy before sorting so we never reorder the stored array in place.
    const list = activeOnly ? this.banners.filter(b => b.isActive) : [...this.banners];
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public saveBanner(banner: Partial<PromotionalBanner>, actor: string): PromotionalBanner {
    let saved: PromotionalBanner;
    if (banner.id) {
      const idx = this.banners.findIndex(b => b.id === banner.id);
      if (idx !== -1) {
        this.banners[idx] = { ...this.banners[idx], ...banner };
        saved = this.banners[idx];
        this.logAudit('BANNER', banner.id, `Updated banner "${banner.heading}"`, actor);
      } else {
        saved = this.createBannerEntity(banner, actor);
      }
    } else {
      saved = this.createBannerEntity(banner, actor);
    }
    this.persist(STORAGE_KEY_BANNERS, this.banners);
    return saved;
  }

  private createBannerEntity(banner: Partial<PromotionalBanner>, actor: string): PromotionalBanner {
    const newBanner: PromotionalBanner = {
      id: `banner-${Date.now()}`,
      heading: banner.heading || 'Maharashtrian Royal Collection',
      subtitle: banner.subtitle || 'Exquisite handwoven luxury sarees',
      ctaText: banner.ctaText || 'Shop Collection',
      ctaLink: banner.ctaLink || '/catalog',
      imageUrl: banner.imageUrl || INITIAL_BANNERS[0].imageUrl,
      badgeText: banner.badgeText || 'Exclusive',
      isActive: banner.isActive ?? true,
      sortOrder: this.banners.length + 1
    };
    this.banners.push(newBanner);
    this.logAudit('BANNER', newBanner.id, `Created banner "${newBanner.heading}"`, actor);
    return newBanner;
  }

  public deleteBanner(id: string, actor: string): boolean {
    const idx = this.banners.findIndex(b => b.id === id);
    if (idx !== -1) {
      const [b] = this.banners.splice(idx, 1);
      this.logAudit('BANNER', id, `Deleted banner "${b.heading}"`, actor);
      this.persist(STORAGE_KEY_BANNERS, this.banners);
      return true;
    }
    return false;
  }

  // =========================================================================
  // OFFERS
  // =========================================================================
  public getOffers(activeOnly = true): PromotionalOffer[] {
    if (activeOnly) {
      return this.offers.filter(o => o.isActive);
    }
    return this.offers;
  }

  public saveOffer(offer: Partial<PromotionalOffer>, actor: string): PromotionalOffer {
    let saved: PromotionalOffer;
    if (offer.id) {
      const idx = this.offers.findIndex(o => o.id === offer.id);
      if (idx !== -1) {
        this.offers[idx] = { ...this.offers[idx], ...offer };
        saved = this.offers[idx];
        this.logAudit('SETTINGS', offer.id, `Updated offer "${offer.title}"`, actor);
      } else {
        saved = this.createOfferEntity(offer, actor);
      }
    } else {
      saved = this.createOfferEntity(offer, actor);
    }
    this.persist(STORAGE_KEY_OFFERS, this.offers);
    return saved;
  }

  private createOfferEntity(offer: Partial<PromotionalOffer>, actor: string): PromotionalOffer {
    const newOffer: PromotionalOffer = {
      id: `offer-${Date.now()}`,
      title: offer.title || 'Festive Discount',
      description: offer.description || '',
      discountPercentage: offer.discountPercentage || 10,
      imageUrl: offer.imageUrl || INITIAL_OFFERS[0].imageUrl,
      ctaText: offer.ctaText || 'Shop Now',
      ctaLink: offer.ctaLink || '/catalog',
      validUntil: offer.validUntil || '2026-12-31',
      isActive: offer.isActive ?? true
    };
    this.offers.push(newOffer);
    this.logAudit('SETTINGS', newOffer.id, `Created offer "${newOffer.title}"`, actor);
    return newOffer;
  }

  public deleteOffer(id: string, actor: string): boolean {
    const idx = this.offers.findIndex(o => o.id === id);
    if (idx !== -1) {
      const [o] = this.offers.splice(idx, 1);
      this.logAudit('SETTINGS', id, `Deleted offer "${o.title}"`, actor);
      this.persist(STORAGE_KEY_OFFERS, this.offers);
      return true;
    }
    return false;
  }

  // =========================================================================
  // COUPONS
  // =========================================================================
  public getCoupons(): Coupon[] {
    return this.coupons;
  }

  public validateCoupon(code: string, subtotalPaise: number): { valid: boolean; coupon?: Coupon; discountPaise: number; message: string } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, discountPaise: 0, message: 'Invalid coupon code.' };
    }
    if (!coupon.isActive) {
      return { valid: false, discountPaise: 0, message: 'This coupon is no longer active.' };
    }
    if (new Date(coupon.validUntil).getTime() < Date.now()) {
      return { valid: false, discountPaise: 0, message: 'This coupon has expired.' };
    }
    if (subtotalPaise < coupon.minOrderValuePaise) {
      const minINR = Math.round(coupon.minOrderValuePaise / 100);
      return { valid: false, discountPaise: 0, message: `Minimum order value of ₹${minINR.toLocaleString('en-IN')} required.` };
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discountPaise: 0, message: 'Coupon usage limit has been reached.' };
    }

    let calculatedDiscount = Math.round((subtotalPaise * coupon.discountPercentage) / 100);
    if (calculatedDiscount > coupon.maxDiscountPaise) {
      calculatedDiscount = coupon.maxDiscountPaise;
    }

    return {
      valid: true,
      coupon,
      discountPaise: calculatedDiscount,
      message: `Coupon ${coupon.code} applied! Saved ₹${Math.round(calculatedDiscount / 100).toLocaleString('en-IN')}`
    };
  }

  public saveCoupon(cpn: Partial<Coupon>, actor: string): Coupon {
    let saved: Coupon;
    if (cpn.id) {
      const idx = this.coupons.findIndex(c => c.id === cpn.id);
      if (idx !== -1) {
        this.coupons[idx] = { ...this.coupons[idx], ...cpn };
        saved = this.coupons[idx];
        this.logAudit('COUPON', cpn.id, `Updated coupon "${cpn.code}"`, actor);
      } else {
        saved = this.createCouponEntity(cpn, actor);
      }
    } else {
      saved = this.createCouponEntity(cpn, actor);
    }
    this.persist(STORAGE_KEY_COUPONS, this.coupons);
    return saved;
  }

  private createCouponEntity(cpn: Partial<Coupon>, actor: string): Coupon {
    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: (cpn.code || 'SAVE10').toUpperCase().trim(),
      description: cpn.description || 'Special store discount',
      discountPercentage: cpn.discountPercentage || 10,
      maxDiscountPaise: cpn.maxDiscountPaise || 200000,
      minOrderValuePaise: cpn.minOrderValuePaise || 300000,
      usageLimit: cpn.usageLimit || 100,
      usedCount: 0,
      isActive: cpn.isActive ?? true,
      validUntil: cpn.validUntil || '2026-12-31'
    };
    this.coupons.push(newCoupon);
    this.logAudit('COUPON', newCoupon.id, `Created coupon "${newCoupon.code}"`, actor);
    return newCoupon;
  }

  // =========================================================================
  // INVENTORY MANAGEMENT & RESERVATIONS
  // =========================================================================
  public adjustStock(params: {
    productId: string;
    variantId: string;
    adjustment: number;
    reason: string;
    performedBy: string;
  }): { success: boolean; newStock: number; message: string } {
    const product = this.products.find(p => p.id === params.productId);
    if (!product) return { success: false, newStock: 0, message: 'Product not found' };

    const variant = product.variants.find(v => v.variantId === params.variantId);
    if (!variant) return { success: false, newStock: 0, message: 'Variant not found' };

    const projected = variant.inventoryStock + params.adjustment;
    if (projected < 0) {
      return { success: false, newStock: variant.inventoryStock, message: 'Cannot reduce stock below 0' };
    }
    if (projected < variant.reservedStock) {
      return {
        success: false,
        newStock: variant.inventoryStock,
        message: `Cannot reduce stock below the ${variant.reservedStock} unit(s) reserved by pending orders.`
      };
    }

    variant.inventoryStock = projected;

    this.addMovement({
      id: this.newMovementId(),
      productId: product.id,
      productName: product.name,
      variantId: variant.variantId,
      colorName: variant.colorName,
      sku: variant.sku,
      changeType: params.adjustment > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT',
      quantityChange: params.adjustment,
      stockAfter: variant.inventoryStock,
      reason: params.reason,
      performedBy: params.performedBy,
      timestamp: new Date().toISOString()
    });
    this.logAudit('INVENTORY', product.id, `Stock adjusted by ${params.adjustment} (${params.reason}). Total on hand: ${projected}`, params.performedBy);

    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    this.persist(STORAGE_KEY_MOVEMENTS, this.inventoryMovements);

    return { success: true, newStock: variant.inventoryStock, message: 'Stock updated successfully' };
  }

  // Merges duplicate product/variant lines so stock checks use the combined quantity.
  private mergeItems(items: { productId: string; variantId: string; quantity: number }[]) {
    const map = new Map<string, { productId: string; variantId: string; quantity: number }>();
    for (const i of items) {
      const k = `${i.productId}|${i.variantId}`;
      const ex = map.get(k);
      if (ex) ex.quantity += i.quantity;
      else map.set(k, { ...i });
    }
    return [...map.values()];
  }

  public reserveStockForOrder(rawItems: { productId: string; variantId: string; quantity: number }[]): { success: boolean; message?: string } {
    const items = this.mergeItems(rawItems);

    for (const item of items) {
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        return { success: false, message: 'Invalid quantity in your bag.' };
      }
      const product = this.products.find(p => p.id === item.productId);
      if (!product) return { success: false, message: `Product not found: ${item.productId}` };
      const variant = product.variants.find(v => v.variantId === item.variantId);
      if (!variant) return { success: false, message: `Variant not found: ${item.variantId}` };

      const available = variant.inventoryStock - variant.reservedStock;
      if (available < item.quantity) {
        return {
          success: false,
          message: `Insufficient inventory for ${product.name} (${variant.colorName}). Only ${Math.max(0, available)} available in handloom stock. Please reduce the quantity in your bag.`
        };
      }
    }

    for (const item of items) {
      const product = this.products.find(p => p.id === item.productId)!;
      const variant = product.variants.find(v => v.variantId === item.variantId)!;
      variant.reservedStock += item.quantity;

      this.addMovement({
        id: this.newMovementId(),
        productId: product.id,
        productName: product.name,
        variantId: variant.variantId,
        colorName: variant.colorName,
        sku: variant.sku,
        changeType: 'RESERVE',
        quantityChange: item.quantity,
        stockAfter: variant.inventoryStock - variant.reservedStock,
        reason: 'Reserved during checkout initiation',
        performedBy: 'Checkout System',
        timestamp: new Date().toISOString()
      });
    }

    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    this.persist(STORAGE_KEY_MOVEMENTS, this.inventoryMovements);

    return { success: true };
  }

  // For orders that are NOT yet paid: give the reserved units back.
  public releaseOrderReservation(order: Order, reason = 'Order cancelled / Payment expired') {
    for (const item of order.items) {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) continue;
      const variant = product.variants.find(v => v.variantId === item.variantId);
      if (!variant) continue;

      variant.reservedStock = Math.max(0, variant.reservedStock - item.quantity);

      this.addMovement({
        id: this.newMovementId(),
        productId: product.id,
        productName: product.name,
        variantId: variant.variantId,
        colorName: variant.colorName,
        sku: variant.sku,
        changeType: 'CANCEL_RELEASE',
        quantityChange: item.quantity,
        stockAfter: variant.inventoryStock - variant.reservedStock,
        reason,
        performedBy: 'System / Cancellation',
        timestamp: new Date().toISOString()
      });
    }

    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    this.persist(STORAGE_KEY_MOVEMENTS, this.inventoryMovements);
  }

  // For orders that WERE paid: stock was already deducted, so add it back.
  private restockPaidOrder(order: Order, reason: string) {
    for (const item of order.items) {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) continue;
      const variant = product.variants.find(v => v.variantId === item.variantId);
      if (!variant) continue;

      variant.inventoryStock += item.quantity;

      this.addMovement({
        id: this.newMovementId(),
        productId: product.id,
        productName: product.name,
        variantId: variant.variantId,
        colorName: variant.colorName,
        sku: variant.sku,
        changeType: 'CANCEL_RELEASE',
        quantityChange: item.quantity,
        stockAfter: variant.inventoryStock,
        reason,
        performedBy: 'System / Cancellation',
        timestamp: new Date().toISOString()
      });
    }

    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    this.persist(STORAGE_KEY_MOVEMENTS, this.inventoryMovements);
  }

  /**
   * Marks an order as paid and converts the reservation into a real stock deduction.
   * SECURITY: in production this must only run after your SERVER has verified the
   * Razorpay signature. Never trust a payment id sent by the browser alone.
   */
  public finalizeOrderPayment(orderId: string, razorpayPaymentId: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    // Already paid: do nothing, so stock is never deducted twice.
    if (order.paymentStatus === 'Paid') return true;

    const nowIso = new Date().toISOString();

    // Customer paid AFTER the payment window expired (reservation was released).
    if (order.orderStatus === 'Cancelled') {
      const stillAvailable = order.items.every(
        i => this.getAvailableStock(i.productId, i.variantId) >= i.quantity
      );
      if (!stillAvailable) {
        // Money was taken but stock is gone: flag for refund instead of overselling.
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Refund Pending';
        order.paymentDetails = {
          razorpayOrderId: order.paymentDetails?.razorpayOrderId || `order_${orderId}`,
          razorpayPaymentId,
          paidAt: nowIso,
          method: 'Razorpay Verified (UPI/Card/NetBanking)'
        };
        order.cancellation = {
          cancelledAt: nowIso,
          reason: 'Payment received after the window expired and stock is no longer available.',
          refundAmountPaise: order.finalPayablePaise,
          cancelledBy: 'System'
        };
        order.statusHistory.push({
          status: 'Refund Pending',
          timestamp: nowIso,
          note: `Late payment (${razorpayPaymentId}); item sold out - refund required.`,
          actor: 'System'
        });
        order.updatedAt = nowIso;
        this.logAudit('ORDER', order.id, `Late payment on expired order ${order.orderNumber} - refund pending`, 'Payment Gateway');
        this.persist(STORAGE_KEY_ORDERS, this.orders);
        this.sendOrderStatusEmail(order, `Payment ID: ${razorpayPaymentId}`);
        return false;
      }
      // Stock is still there: re-reserve so the normal flow below works.
      for (const item of order.items) {
        const variant = this.products.find(p => p.id === item.productId)?.variants.find(v => v.variantId === item.variantId);
        if (variant) variant.reservedStock += item.quantity;
      }
    }

    for (const item of order.items) {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) continue;
      const variant = product.variants.find(v => v.variantId === item.variantId);
      if (!variant) continue;

      variant.inventoryStock = Math.max(0, variant.inventoryStock - item.quantity);
      variant.reservedStock = Math.max(0, variant.reservedStock - item.quantity);

      this.addMovement({
        id: this.newMovementId(),
        productId: product.id,
        productName: product.name,
        variantId: variant.variantId,
        colorName: variant.colorName,
        sku: variant.sku,
        changeType: 'SALE',
        quantityChange: -item.quantity,
        stockAfter: variant.inventoryStock,
        reason: `Order ${order.orderNumber} confirmed & paid`,
        performedBy: 'Razorpay Gateway',
        timestamp: nowIso
      });
    }

    // Count the coupon as used now that the order is paid.
    if (order.couponCodeApplied) {
      const coupon = this.coupons.find(c => c.code === order.couponCodeApplied);
      if (coupon) {
        coupon.usedCount += 1;
        this.persist(STORAGE_KEY_COUPONS, this.coupons);
      }
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = 'Order Confirmed';
    order.paymentDetails = {
      razorpayOrderId: order.paymentDetails?.razorpayOrderId || `order_${orderId}`,
      razorpayPaymentId,
      paidAt: nowIso,
      method: 'Razorpay Verified (UPI/Card/NetBanking)'
    };

    order.statusHistory.push({
      status: 'Order Confirmed',
      timestamp: nowIso,
      note: `Payment verified (${razorpayPaymentId}) and stock confirmed.`,
      actor: 'Razorpay Gateway'
    });
    order.updatedAt = nowIso;

    this.logAudit('ORDER', order.id, `Payment confirmed (${razorpayPaymentId}) for ${order.orderNumber}`, 'Payment Gateway');

    this.persist(STORAGE_KEY_ORDERS, this.orders);
    this.persist(STORAGE_KEY_PRODUCTS, this.products);
    this.persist(STORAGE_KEY_MOVEMENTS, this.inventoryMovements);

    this.sendOrderStatusEmail(order, `Payment ID: ${razorpayPaymentId}`);

    return true;
  }

  // Cancels unpaid orders and gives their reserved stock back.
  // Cancels orders older than PENDING_ORDER_TTL_MINUTES, plus (optionally) every
  // unpaid order of one customer, so retrying checkout never blocks their own stock.
  private expireStalePendingOrders(forEmail?: string) {
    const cutoff = Date.now() - PENDING_ORDER_TTL_MINUTES * 60 * 1000;
    const email = forEmail?.trim().toLowerCase();
    const nowIso = new Date().toISOString();
    let changed = false;

    for (const order of this.orders) {
      if (order.orderStatus !== 'Pending Payment' || order.paymentStatus !== 'Pending') continue;

      const isStale = new Date(order.createdAt).getTime() < cutoff;
      const isSameCustomer = !!email && order.customerEmail.toLowerCase() === email;
      if (!isStale && !isSameCustomer) continue;

      this.releaseOrderReservation(
        order,
        isStale ? 'Payment not completed in time - stock released' : 'Replaced by a new checkout attempt'
      );
      order.orderStatus = 'Cancelled';
      order.statusHistory.push({
        status: 'Cancelled',
        timestamp: nowIso,
        note: isStale ? 'Payment window expired; reserved stock released.' : 'Customer started a new checkout; old reservation released.',
        actor: 'System'
      });
      order.updatedAt = nowIso;
      changed = true;
    }

    if (changed) this.persist(STORAGE_KEY_ORDERS, this.orders);
  }

  // Emails the customer about the order's CURRENT status (runs in the background).
  // Result is written to the audit log so the admin can see if it was sent or failed.
  private sendOrderStatusEmail(order: Order, note?: string): void {
    const to = (order.customerEmail || '').trim();
    // Skip demo/sample addresses (they would only bounce).
    if (!to || /@example\.(com|org|net)$/i.test(to)) return;

    const addr = order.shippingAddressSnapshot;
    const status = order.orderStatus;
    const payload = {
      to,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status,
      note: note || '',
      items: order.items.map(i => ({
        name: i.name,
        colorName: i.colorName,
        quantity: i.quantity,
        totalPaise: i.totalPaise
      })),
      totalPaise: order.finalPayablePaise,
      address: addr
        ? [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pinCode].filter(Boolean).join(', ')
        : '',
      shipment: {
        courierName: order.shipment?.courierName || '',
        trackingNumber: order.shipment?.trackingNumber || '',
        trackingUrl: order.shipment?.trackingUrl || '',
        estimatedDeliveryDate: order.shipment?.estimatedDeliveryDate || ''
      }
    };

    fetch('/api/v1/send-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.sentOverSmtp) {
          this.logAudit('ORDER', order.id, `Customer emailed: "${status}" sent to ${to}`, 'Email System');
        } else {
          const why = data.smtpError || data.error || 'unknown error';
          console.warn(`Status email not sent to ${to}: ${why}`);
          this.logAudit('ORDER', order.id, `Customer email for "${status}" NOT sent to ${to}: ${why}`, 'Email System');
        }
      })
      .catch((e: any) => {
        this.logAudit('ORDER', order.id, `Customer email for "${status}" NOT sent to ${to}: ${e?.message || 'server unreachable'}`, 'Email System');
      });
  }

  // =========================================================================
  // PRICING QUOTE
  // =========================================================================
  public calculateQuote(params: {
    items: { productId: string; variantId: string; quantity: number }[];
    couponCode?: string;
  }): {
    subtotalPaise: number;
    couponDiscountPaise: number;
    shippingChargePaise: number;
    taxPaise: number;
    finalPayablePaise: number;
    couponApplied?: Coupon;
    itemSnapshots: OrderItem[];
  } {
    let subtotalPaise = 0;
    const itemSnapshots: OrderItem[] = [];

    for (const item of params.items) {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      const variant = product.variants.find(v => v.variantId === item.variantId);
      if (!variant) throw new Error(`Variant not found: ${item.variantId}`);

      const lineTotal = variant.sellingPricePaise * item.quantity;
      subtotalPaise += lineTotal;

      itemSnapshots.push({
        productId: product.id,
        variantId: variant.variantId,
        name: product.name,
        colorName: variant.colorName,
        sku: variant.sku,
        unitPricePaise: variant.sellingPricePaise,
        quantity: item.quantity,
        totalPaise: lineTotal,
        image: variant.images[0] || product.primaryImage,
        fabric: product.fabric
      });
    }

    let couponDiscountPaise = 0;
    let couponApplied: Coupon | undefined;
    if (params.couponCode) {
      const val = this.validateCoupon(params.couponCode, subtotalPaise);
      if (val.valid && val.coupon) {
        couponDiscountPaise = val.discountPaise;
        couponApplied = val.coupon;
      }
    }

    const discountedSubtotal = Math.max(0, subtotalPaise - couponDiscountPaise);
    const shippingChargePaise = discountedSubtotal >= this.settings.freeShippingThresholdPaise ? 0 : this.settings.standardShippingFeePaise;
    const taxPaise = Math.round((discountedSubtotal * this.settings.taxPercentage) / 100);
    const finalPayablePaise = discountedSubtotal + shippingChargePaise + taxPaise;

    return {
      subtotalPaise,
      couponDiscountPaise,
      shippingChargePaise,
      taxPaise,
      finalPayablePaise,
      couponApplied,
      itemSnapshots
    };
  }

  // =========================================================================
  // ORDERS
  // =========================================================================
  public createPendingOrder(params: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: { productId: string; variantId: string; quantity: number }[];
    shippingAddress: DeliveryAddress;
    couponCode?: string;
  }): { success: boolean; order?: Order; razorpayOrderId?: string; message?: string } {
    // Free stock held by abandoned / earlier unpaid attempts before reserving again.
    this.expireStalePendingOrders(params.customerEmail);

    const items = this.mergeItems(params.items);

    // Price the order FIRST so a bad item can never leave stock reserved with no order.
    let quote: ReturnType<StoreService['calculateQuote']>;
    try {
      quote = this.calculateQuote({ items, couponCode: params.couponCode });
    } catch (e: any) {
      return { success: false, message: e?.message || 'Could not price your order.' };
    }

    const reserveResult = this.reserveStockForOrder(items);
    if (!reserveResult.success) {
      return { success: false, message: reserveResult.message };
    }

    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `KFS-2026-${secureRandomInt(1000, 10000)}`;
    // Placeholder only. A live store must create this order on the server via the Razorpay Orders API.
    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      items: quote.itemSnapshots,
      shippingAddressSnapshot: params.shippingAddress,
      subtotalPaise: quote.subtotalPaise,
      couponDiscountPaise: quote.couponDiscountPaise,
      shippingChargePaise: quote.shippingChargePaise,
      taxPaise: quote.taxPaise,
      finalPayablePaise: quote.finalPayablePaise,
      couponCodeApplied: quote.couponApplied?.code,
      orderStatus: 'Pending Payment',
      paymentStatus: 'Pending',
      paymentDetails: {
        razorpayOrderId
      },
      shipment: {},
      statusHistory: [
        {
          status: 'Pending Payment',
          timestamp: new Date().toISOString(),
          actor: 'Checkout Initiation'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(order);
    this.logAudit('ORDER', order.id, `Created pending order ${orderNumber} for ${params.customerName}`, 'Customer');
    this.persist(STORAGE_KEY_ORDERS, this.orders);

    return {
      success: true,
      order,
      razorpayOrderId
    };
  }

  public getOrders(filter?: {
    userId?: string;
    status?: OrderStatus;
    search?: string;
  }): Order[] {
    let result = this.orders;
    if (filter?.userId) {
      const u = filter.userId.toLowerCase();
      result = result.filter(o => o.userId.toLowerCase() === u || o.customerEmail.toLowerCase() === u);
    }
    if (filter?.status) {
      result = result.filter(o => o.orderStatus === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return result;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, actor: string, note?: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    const previousStatus = order.orderStatus;

    if (newStatus === 'Cancelled') {
      if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
        throw new Error('Order cannot be cancelled after dispatch or shipment.');
      }
      // Guard against cancelling twice (would release / restock stock twice).
      if (['Cancelled', 'Refund Pending', 'Refunded'].includes(order.orderStatus)) {
        throw new Error('This order has already been cancelled.');
      }

      if (order.paymentStatus === 'Paid') {
        this.restockPaidOrder(order, `Cancelled by ${actor}`);
      } else {
        this.releaseOrderReservation(order, `Cancelled by ${actor}`);
      }

      order.cancellation = {
        cancelledAt: new Date().toISOString(),
        reason: note || 'Cancelled by admin/customer',
        refundAmountPaise: order.paymentStatus === 'Paid' ? order.finalPayablePaise : 0,
        cancelledBy: actor
      };
      order.orderStatus = order.paymentStatus === 'Paid' ? 'Refund Pending' : 'Cancelled';
    } else {
      order.orderStatus = newStatus;
    }

    order.statusHistory.push({
      status: order.orderStatus,
      timestamp: new Date().toISOString(),
      note,
      actor
    });
    order.updatedAt = new Date().toISOString();

    this.logAudit('ORDER', order.id, `Status updated to ${order.orderStatus}`, actor);
    this.persist(STORAGE_KEY_ORDERS, this.orders);

    // Tell the customer (only when the status really changed).
    if (order.orderStatus !== previousStatus) {
      this.sendOrderStatusEmail(order, note);
    }
    return true;
  }

  public updateShipmentDetails(orderId: string, shipment: Partial<Order['shipment']>, actor: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    // Never ship an order that is cancelled or refunded.
    if (['Cancelled', 'Refund Pending', 'Refunded'].includes(order.orderStatus)) return false;

    const previousTracking = order.shipment?.trackingNumber;
    let becameShipped = false;

    order.shipment = { ...order.shipment, ...shipment };
    if (shipment.trackingNumber && order.orderStatus !== 'Shipped' && order.orderStatus !== 'Delivered') {
      becameShipped = true;
      order.orderStatus = 'Shipped';
      order.shipment.shippedAt = new Date().toISOString();
      order.statusHistory.push({
        status: 'Shipped',
        timestamp: new Date().toISOString(),
        note: `Dispatched with ${shipment.courierName || 'Courier Partner'}. Tracking #${shipment.trackingNumber}`,
        actor
      });
    }
    order.updatedAt = new Date().toISOString();
    this.logAudit('ORDER', order.id, `Updated shipment tracking: ${shipment.trackingNumber}`, actor);
    this.persist(STORAGE_KEY_ORDERS, this.orders);

    const trackingChanged = !!shipment.trackingNumber && shipment.trackingNumber !== previousTracking;
    if (becameShipped || trackingChanged) {
      this.sendOrderStatusEmail(order, trackingChanged && !becameShipped ? 'Tracking details have been updated.' : undefined);
    }
    return true;
  }

  public processOrderRefund(orderId: string, refundAmountPaise: number, actor: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    // Only paid orders can be refunded, and never twice.
    if (order.paymentStatus !== 'Paid') return false;

    order.paymentStatus = 'Refunded';
    order.orderStatus = 'Refunded';
    order.statusHistory.push({
      status: 'Refunded',
      timestamp: new Date().toISOString(),
      note: `Refund of ₹${Math.round(refundAmountPaise / 100).toLocaleString('en-IN')} confirmed to source account.`,
      actor
    });
    order.updatedAt = new Date().toISOString();
    this.logAudit('ORDER', order.id, `Refunded ₹${refundAmountPaise / 100}`, actor);
    this.persist(STORAGE_KEY_ORDERS, this.orders);

    this.sendOrderStatusEmail(order, `Refund amount: ₹${Math.round(refundAmountPaise / 100).toLocaleString('en-IN')}`);
    return true;
  }

  // =========================================================================
  // OTP & AUTH
  // =========================================================================

  /**
   * Creates an OTP and returns IMMEDIATELY with challengeId + expiresAt.
   * The email is sent in the background; `await result.emailResult` if you want
   * to know whether it was delivered.
   * NOTE: OTP login is client-side only. For a real store use Firebase Auth.
   */
  public requestOTP(email: string): OtpRequestResult {
    const cleanEmail = email.trim().toLowerCase();

    // Remove expired challenges only (older valid ones stay valid so Resend / double-clicks can't break verify).
    for (const [id, c] of this.otpChallenges) {
      if (Date.now() > c.expiresAt) this.otpChallenges.delete(id);
    }

    const otp = secureRandomInt(100000, 1000000).toString();
    const challengeId = `otp-${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000;
    const subject = `✨ Your Kolhapuri Fashion Saree Verification Code: ${otp}`;

    this.otpChallenges.set(challengeId, { email: cleanEmail, otp, expiresAt, attempts: 0 });

    const emailResult: Promise<OtpEmailResult> = (async () => {
      let emailSent = false;
      let emailError: string | null = null;
      try {
        const res = await fetch('/api/v1/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: cleanEmail, subject, otp, validMinutes: OTP_VALIDITY_MINUTES })
        });
        const data = await res.json();
        emailSent = !!data.sentOverSmtp;
        emailError = data.smtpError || data.error || null;
      } catch (e: any) {
        emailError = e?.message || 'Could not reach the email server.';
      }

      // On-screen OTP preview: development fallback only, and only if the real email failed.
      this.lastDispatchedEmail =
        !emailSent && IS_DEV
          ? {
              id: `email-${Date.now()}`,
              to: cleanEmail,
              from: `Kolhapuri Fashion Saree <${this.settings.supportEmail || 'no-reply'}>`,
              subject,
              sentAt: new Date().toISOString(),
              otp
            }
          : null;
      this.notifyListeners();
      return { emailSent, emailError };
    })();

    return { challengeId, expiresAt, emailResult };
  }

  public getLastDispatchedEmail(targetEmail?: string): DispatchedEmail | null {
    if (!IS_DEV || !this.lastDispatchedEmail) return null;
    if (targetEmail && this.lastDispatchedEmail.to.toLowerCase() !== targetEmail.trim().toLowerCase()) {
      return null;
    }
    return this.lastDispatchedEmail;
  }

  public verifyOTP(challengeId: string, inputOtp: string): { success: boolean; email?: string; message: string; session?: UserSession } {
    const challenge = this.otpChallenges.get(challengeId);
    if (!challenge) {
      return { success: false, message: 'Invalid or expired OTP session. Please request a new OTP.' };
    }

    if (Date.now() > challenge.expiresAt) {
      this.otpChallenges.delete(challengeId);
      return { success: false, message: `OTP has expired (${OTP_VALIDITY_MINUTES}-minute limit). Please request a new code.` };
    }

    challenge.attempts++;
    if (challenge.attempts > 5) {
      this.otpChallenges.delete(challengeId);
      return { success: false, message: 'Too many incorrect attempts. Please generate a new code.' };
    }

    if (inputOtp.trim() !== challenge.otp) {
      return { success: false, message: `Incorrect 6-digit code. ${5 - challenge.attempts} attempts remaining.` };
    }

    this.otpChallenges.delete(challengeId);
    this.lastDispatchedEmail = null;

    let token: string;
    try {
      token = `kfs_${crypto.randomUUID()}`;
    } catch {
      token = `kfs_${Math.random().toString(36).substring(2, 12)}`;
    }

    const session: UserSession = {
      email: challenge.email,
      fullName: challenge.email.split('@')[0],
      role: ADMIN_EMAILS.includes(challenge.email) ? 'admin' : 'customer',
      token
    };

    // setSession updates BOTH memory and localStorage.
    this.setSession(session);

    return {
      success: true,
      email: challenge.email,
      message: 'Email successfully verified.',
      session
    };
  }

  public getSession(): UserSession | null {
    return this.session;
  }

  public setSession(session: UserSession | null) {
    this.session = session;
    if (session) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
    this.notifyListeners();
  }

  // =========================================================================
  // CART (per device - stays in localStorage only)
  // =========================================================================
  public getCart(): CartItem[] {
    return this.cart;
  }

  public saveCart(cart: CartItem[]) {
    this.cart = cart;
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    this.notifyListeners();
  }

  // Returns true if the full requested quantity was added, false if it was limited by stock.
  public addToCart(item: CartItem): boolean {
    const current = [...this.cart];
    const available = this.getAvailableStock(item.productId, item.variantId);
    const existingIdx = current.findIndex(c => c.productId === item.productId && c.variantId === item.variantId);
    const alreadyInCart = existingIdx !== -1 ? current[existingIdx].quantity : 0;
    const wanted = alreadyInCart + item.quantity;
    const finalQty = Math.min(wanted, available);

    if (finalQty <= 0) return false; // sold out

    if (existingIdx !== -1) {
      current[existingIdx] = { ...current[existingIdx], quantity: finalQty };
    } else {
      current.push({ ...item, quantity: finalQty });
    }
    this.saveCart(current);
    return finalQty === wanted;
  }

  public updateCartQuantity(productId: string, variantId: string, quantity: number) {
    let current = [...this.cart];
    if (quantity <= 0) {
      current = current.filter(c => !(c.productId === productId && c.variantId === variantId));
    } else {
      const idx = current.findIndex(c => c.productId === productId && c.variantId === variantId);
      if (idx !== -1) {
        const available = Math.max(1, this.getAvailableStock(productId, variantId));
        current[idx] = { ...current[idx], quantity: Math.min(quantity, available) };
      }
    }
    this.saveCart(current);
  }

  public removeFromCart(productId: string, variantId: string) {
    const current = this.cart.filter(c => !(c.productId === productId && c.variantId === variantId));
    this.saveCart(current);
  }

  public clearCart() {
    this.saveCart([]);
  }

  // Units that can still be bought for one colour variant (on hand minus reserved).
  public getAvailableStock(productId: string, variantId: string): number {
    const product = this.products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.variantId === variantId);
    return variant ? Math.max(0, variant.inventoryStock - variant.reservedStock) : 0;
  }

  // Lowers cart quantities that are above available stock and removes sold-out lines.
  // Returns a list of human-readable notes about what changed.
  public sanitizeCart(): string[] {
    const notes: string[] = [];
    const next: CartItem[] = [];

    for (const item of this.cart) {
      const available = this.getAvailableStock(item.productId, item.variantId);
      const productName = this.products.find(p => p.id === item.productId)?.name || 'An item';

      if (available <= 0) {
        notes.push(`${productName} is sold out and was removed from your bag.`);
        continue;
      }
      if (item.quantity > available) {
        notes.push(`${productName}: only ${available} in stock, quantity reduced.`);
        next.push({ ...item, quantity: available });
      } else {
        next.push(item);
      }
    }

    if (notes.length > 0) this.saveCart(next);
    return notes;
  }

  // =========================================================================
  // WISHLIST (per device)
  // =========================================================================
  public getWishlist(): string[] {
    return this.wishlist;
  }

  public toggleWishlist(productId: string): boolean {
    const exists = this.wishlist.includes(productId);
    let updated: string[];
    if (exists) {
      updated = this.wishlist.filter(id => id !== productId);
    } else {
      updated = [...this.wishlist, productId];
    }
    this.wishlist = updated;
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(updated));
    this.notifyListeners();
    return !exists;
  }

  // =========================================================================
  // ADDRESSES (per device)
  // =========================================================================
  public getAddresses(): DeliveryAddress[] {
    return this.addresses;
  }

  public saveAddress(addr: DeliveryAddress) {
    // Copy each address so we never mutate objects held elsewhere.
    let current = this.addresses.map(a => ({ ...a }));
    if (addr.isDefault) {
      current = current.map(a => ({ ...a, isDefault: false }));
    }
    const idx = current.findIndex(a => a.id === addr.id);
    if (idx !== -1) {
      current[idx] = addr;
    } else {
      current.push(addr);
    }
    this.addresses = current;
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(current));
    this.notifyListeners();
  }

  // =========================================================================
  // SETTINGS
  // =========================================================================
  public getSettings(): StoreSettings {
    return this.settings;
  }

  public updateSettings(partial: Partial<StoreSettings>, actor: string): StoreSettings {
    this.settings = { ...this.settings, ...partial };
    this.logAudit('SETTINGS', 'global', 'Updated store settings & announcement rules', actor);
    this.persist(STORAGE_KEY_SETTINGS, this.settings);
    return this.settings;
  }

  // =========================================================================
  // AUDIT LOGS
  // =========================================================================
  public logAudit(entityType: AuditLogItem['entityType'], entityId: string, details: string, performedBy: string) {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      action: entityType,
      entityType,
      entityId,
      details,
      performedBy,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > MAX_AUDIT_LOGS) this.auditLogs.length = MAX_AUDIT_LOGS;
    this.persist(STORAGE_KEY_AUDIT, this.auditLogs);
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.auditLogs;
  }

  public getInventoryMovements(): InventoryMovement[] {
    return this.inventoryMovements;
  }

  // =========================================================================
  // TESTING HELPERS
  // =========================================================================
  // Adds sample sarees (2 colours each, plenty of stock) so you can test the full checkout.
  public addTestSarees(count = 6, stockPerVariant = 25): SareeProduct[] {
    const templates = [
      { name: 'Royal Blue Kanjivaram Silk Saree', fabric: 'Kanjivaram Silk', occasion: 'Weddings', color: 'Royal Blue & Gold', hex: '#1F3A93', mrp: 1850000, sell: 1550000 },
      { name: 'Emerald Green Paithani Saree', fabric: 'Paithani Silk', occasion: 'Festivals & Weddings', color: 'Emerald Green & Gold', hex: '#0B6E4F', mrp: 2250000, sell: 1890000 },
      { name: 'Peach Banarasi Georgette Saree', fabric: 'Banarasi Georgette', occasion: 'Party Wear', color: 'Peach & Silver', hex: '#F4A98C', mrp: 1250000, sell: 999000 },
      { name: 'Mustard Festive Cotton Silk Saree', fabric: 'Cotton Silk', occasion: 'Festive', color: 'Mustard & Maroon', hex: '#D9A621', mrp: 650000, sell: 499000 },
      { name: 'Wine Red Bridal Silk Saree', fabric: 'Pure Silk', occasion: 'Bridal', color: 'Wine Red & Antique Gold', hex: '#6B1D34', mrp: 2850000, sell: 2390000 },
      { name: 'Teal Blue Designer Party Saree', fabric: 'Designer Georgette', occasion: 'Party Wear', color: 'Teal Blue & Rose Gold', hex: '#127C8A', mrp: 950000, sell: 749000 }
    ];

    const image = INITIAL_PRODUCTS[0].primaryImage; // reuses the first saree photo; change images in Admin
    const created: SareeProduct[] = [];

    for (let i = 0; i < count; i++) {
      const t = templates[i % templates.length];

      // Keep names (and therefore URLs) unique even if you run this more than once.
      let name = t.name;
      let n = 2;
      while (this.products.some(p => p.name === name)) name = `${t.name} ${n++}`;

      const cat = this.categories.length ? this.categories[i % this.categories.length] : undefined;
      const sku = `KFS-TEST-${Date.now().toString(36).toUpperCase()}-${i + 1}`;
      const id = `saree-test-${Date.now()}-${i}`;

      const product = this.saveProduct({
        name,
        sku,
        description: `${t.fabric} saree with traditional handloom weave. Test product for checkout.`,
        fabric: t.fabric,
        occasion: t.occasion,
        categoryIds: cat ? [cat.id] : undefined,
        categoryNames: cat ? [cat.name] : undefined,
        primaryImage: image,
        galleryImages: [image],
        featured: i < 2,
        trending: i % 2 === 0,
        isNewArrival: true,
        isPublished: true,
        variants: [
          {
            variantId: `var-${id}-a`,
            colorName: t.color,
            colorHex: t.hex,
            sku: `${sku}-A`,
            originalPricePaise: t.mrp,
            sellingPricePaise: t.sell,
            inventoryStock: stockPerVariant,
            reservedStock: 0,
            images: [image]
          },
          {
            variantId: `var-${id}-b`,
            colorName: 'Ivory & Gold',
            colorHex: '#F5EBD0',
            sku: `${sku}-B`,
            originalPricePaise: t.mrp,
            sellingPricePaise: t.sell,
            inventoryStock: stockPerVariant,
            reservedStock: 0,
            images: [image]
          }
        ]
      }, 'Test Seeder');

      created.push(product);
    }
    return created;
  }

  // Raises every colour variant that is below `minStock` up to `minStock` (logged in inventory history).
  public restockAllForTesting(minStock = 25): number {
    let updated = 0;
    for (const p of this.products) {
      for (const v of p.variants) {
        if (v.inventoryStock < minStock) {
          this.adjustStock({
            productId: p.id,
            variantId: v.variantId,
            adjustment: minStock - v.inventoryStock,
            reason: 'Testing restock',
            performedBy: 'Test Seeder'
          });
          updated++;
        }
      }
    }
    return updated;
  }

  // =========================================================================
  // DASHBOARD METRICS
  // =========================================================================
  public getDashboardStats() {
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.orderStatus === 'Pending Payment').length;
    const processingOrders = this.orders.filter(o => ['Order Confirmed', 'Processing', 'Packed'].includes(o.orderStatus)).length;
    const shippedOrders = this.orders.filter(o => ['Shipped', 'Out for Delivery'].includes(o.orderStatus)).length;
    const deliveredOrders = this.orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledOrders = this.orders.filter(o => o.orderStatus === 'Cancelled').length;

    const paidOrders = this.orders.filter(o => o.paymentStatus === 'Paid');
    // Gross sales = every order that was not cancelled or refunded.
    const grossSalesPaise = this.orders
      .filter(o => !['Cancelled', 'Refunded'].includes(o.orderStatus))
      .reduce((sum, o) => sum + o.finalPayablePaise, 0);
    const confirmedPaidRevenuePaise = paidOrders.reduce((sum, o) => sum + o.finalPayablePaise, 0);
    const pendingPaymentsPaise = this.orders
      .filter(o => o.paymentStatus === 'Pending' && o.orderStatus === 'Pending Payment')
      .reduce((sum, o) => sum + o.finalPayablePaise, 0);
    const refundTotalsPaise = this.orders.filter(o => o.paymentStatus === 'Refunded').reduce((sum, o) => sum + o.finalPayablePaise, 0);

    const totalProducts = this.products.length;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    for (const p of this.products) {
      const totalAvailable = p.variants.reduce((sum, v) => sum + (v.inventoryStock - v.reservedStock), 0);
      if (totalAvailable <= 0) {
        outOfStockProducts++;
      } else if (totalAvailable <= 5) {
        lowStockProducts++;
      }
    }

    // Distinct customers who have placed an order (replaces the old hard-coded 148).
    const totalRegisteredCustomers = new Set(this.orders.map(o => o.customerEmail.toLowerCase())).size;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      grossSalesPaise,
      confirmedPaidRevenuePaise,
      pendingPaymentsPaise,
      refundTotalsPaise,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalRegisteredCustomers
    };
  }
}

export const storeService = new StoreService();

// Development only: lets you run `kfs.addTestSarees()` in the browser console.
if (IS_DEV && typeof window !== 'undefined') {
  (window as any).kfs = storeService;
}