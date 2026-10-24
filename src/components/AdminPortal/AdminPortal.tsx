import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Image,
  Tag,
  Settings,
  FileText,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";
import {
  SareeProduct,
  CategoryItem,
  PromotionalBanner,
  Coupon,
  Order,
  OrderStatus,
  InventoryMovement,
  StoreSettings,
  AuditLogItem,
} from "../../types/index.ts";
import { storeService } from "../../services/storeService.ts";
import { formatPriceINR, formatDate } from "../../utils/formatters.ts";
import { cld } from "../../lib/cloudinaryUrl.ts";
import { shareProduct } from "../../utils/shareProduct.ts";
import ProductVariantsEditor, {
  validateVariants,
} from "./ProductVariantsEditor.tsx";
import ImageUploadField from "./ImageUploadField.tsx";
import { OrdersPanel } from "./OrdersPanel.tsx";
import StockImport from "./StockImport.tsx";

interface AdminPortalProps {
  onExitToStore: () => void;
}

type Tab =
  | "dashboard"
  | "products"
  | "orders"
  | "inventory"
  | "categories"
  | "banners"
  | "coupons"
  | "settings"
  | "audit";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Overview & KPIs", icon: LayoutDashboard },
  { id: "orders", label: "Orders & Tracking", icon: ShoppingCart },
  { id: "products", label: "Saree Catalog", icon: Package },
  { id: "inventory", label: "Inventory & Stocks", icon: Layers },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "banners", label: "Hero Banners", icon: Image },
  { id: "coupons", label: "Coupons & Offers", icon: Tag },
  { id: "settings", label: "Store Configuration", icon: Settings },
  // { id: "audit", label: "Audit Logs", icon: FileText },
];

const LOW_STOCK_LIMIT = 5;
const inputCls =
  "w-full p-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded text-xs focus:outline-none focus:border-[#641D32]";
const oneYearFromNow = () =>
  new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitToStore }) => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [session, setSession] = useState(storeService.getSession());
  const [stats, setStats] = useState(storeService.getDashboardStats());
  const [cloud, setCloud] = useState(storeService.getCloudStatus());
  const [products, setProducts] = useState<SareeProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(
    storeService.getSettings(),
  );

  // Product modal
  const [editingProduct, setEditingProduct] =
    useState<Partial<SareeProduct> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  // Category modal
  const [editingCategory, setEditingCategory] =
    useState<Partial<CategoryItem> | null>(null);
  const [catUploading, setCatUploading] = useState(false);
  const [catError, setCatError] = useState("");

  // Banner modal
  const [editingBanner, setEditingBanner] =
    useState<Partial<PromotionalBanner> | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState("");

  // Stock / orders
  const [stockAdjustItem, setStockAdjustItem] = useState<{
    productId: string;
    variantId: string;
    productName: string;
    colorName: string;
    currentStock: number;
  } | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(5);
  const [adjustmentReason, setAdjustmentReason] = useState(
    "New handloom shipment arrived from Kolhapur weavers",
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierInput, setCourierInput] = useState("Blue Dart Express");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [trackingUrlInput] = useState("https://www.bluedart.com");

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(4999);
  const [newCouponValidUntil, setNewCouponValidUntil] =
    useState(oneYearFromNow());

  // Settings form
  const [announcementInput, setAnnouncementInput] = useState("");

  const by = session?.fullName || "Owner";

  useEffect(() => {
    const update = () => {
      setSession(storeService.getSession());
      setStats(storeService.getDashboardStats());
      setCloud(storeService.getCloudStatus());
      setProducts([...storeService.getAllProductsAdmin()]);
      setOrders([...storeService.getOrders()]);
      setCategories([...storeService.getCategories()]);
      setBanners([...storeService.getBanners(false)]);
      setCoupons([...storeService.getCoupons()]);
      setMovements([...storeService.getInventoryMovements()]);
      setAuditLogs([...storeService.getAuditLogs()]);
      setSettings(storeService.getSettings());
    };
    update();
    return storeService.subscribe(update);
  }, []);

  /* ---------------- Products ---------------- */
  const openNewProduct = () => {
    setFormError("");
    setUploading(false);
    setEditingProduct({
      name: "",
      fabric: "Pure Mulberry Silk",
      occasion: "Festive & Weddings",
      lengthMeters: 6.3,
      blousePiece: "Running 0.8m unstitched silk piece included",
      careInstructions: "Dry clean only",
      categoryIds: [],
      categoryNames: [],
      variants: [
        {
          variantId: `var-${Date.now()}-1`,
          colorName: "Royal Purple & Gold",
          colorHex: "#4B0082",
          sku: "KFS-SILK-" + Math.floor(100 + Math.random() * 900),
          originalPricePaise: 1699900,
          sellingPricePaise: 1299900,
          inventoryStock: 8,
          reservedStock: 0,
          images: [],
        },
      ],
      featured: true,
      isPublished: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p: SareeProduct) => {
    setFormError("");
    setUploading(false);
    setEditingProduct(JSON.parse(JSON.stringify(p)));
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    if (uploading && !confirm("Photos are still uploading. Close anyway?"))
      return;
    setUploading(false);
    setFormError("");
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const toggleProductCategory = (c: CategoryItem) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const ids = new Set(prev.categoryIds ?? []);
      if (ids.has(c.id)) ids.delete(c.id);
      else ids.add(c.id);
      const selected = categories.filter((x) => ids.has(x.id));
      return {
        ...prev,
        categoryIds: selected.map((x) => x.id),
        categoryNames: selected.map((x) => x.name),
      };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name?.trim()) return;
    if (uploading) {
      setFormError("Please wait until all photos finish uploading.");
      return;
    }
    if (
      !editingProduct.categoryIds ||
      editingProduct.categoryIds.length === 0
    ) {
      setFormError("Select at least one category for this saree.");
      return;
    }
    const variants = editingProduct.variants ?? [];
    const error = validateVariants(variants);
    if (error) {
      setFormError(error);
      return;
    }
    storeService.saveProduct(
      { ...editingProduct, name: editingProduct.name.trim(), variants },
      by,
    );

    setFormError("");
    setUploading(false);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this saree?"))
      storeService.deleteProduct(id, by);
  };

  /* ---------------- Categories (add / edit / delete) ---------------- */
  const openNewCategory = () => {
    setCatError("");
    setCatUploading(false);
    setEditingCategory({ name: "", imageUrl: "", isActive: true });
  };

  const openEditCategory = (c: CategoryItem) => {
    setCatError("");
    setCatUploading(false);
    setEditingCategory({ ...c });
  };

  const closeCategoryModal = () => {
    if (catUploading && !confirm("Image is still uploading. Close anyway?"))
      return;
    setCatUploading(false);
    setCatError("");
    setEditingCategory(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (catUploading)
      return setCatError("Please wait for the image to finish uploading.");
    if (!editingCategory.name?.trim())
      return setCatError("Category name is required.");
    if (!editingCategory.imageUrl)
      return setCatError("Please upload a category image.");
    storeService.saveCategory(
      { ...editingCategory, name: editingCategory.name.trim() },
      by,
    );
    setCatError("");
    setEditingCategory(null);
  };

  const handleDeleteCategory = (c: CategoryItem) => {
    const used = products.filter((p) => p.categoryIds?.includes(c.id)).length;
    const extra = used
      ? `\n\n${used} saree(s) use this category and will be removed from it.`
      : "";
    if (confirm(`Delete category "${c.name}"?${extra}`))
      storeService.deleteCategory(c.id, by);
  };

  /* ---------------- Banners ---------------- */
  const openNewBanner = () => {
    setBannerError("");
    setBannerUploading(false);
    setEditingBanner({
      heading: "",
      subtitle: "",
      badgeText: "",
      imageUrl: "",
      ctaText: "Shop Collection",
      ctaLink: "/catalog",
      isActive: true,
    });
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (bannerUploading)
      return setBannerError("Please wait for the image to finish uploading.");
    if (!editingBanner.heading?.trim())
      return setBannerError("Banner heading is required.");
    if (!editingBanner.imageUrl)
      return setBannerError("Please upload a banner image.");
    storeService.saveBanner(
      { ...editingBanner, heading: editingBanner.heading.trim() },
      by,
    );
    setEditingBanner(null);
  };

  const handleDeleteBanner = (b: PromotionalBanner) => {
    if (confirm(`Delete banner "${b.heading}"?`))
      storeService.deleteBanner(b.id, by);
  };

  /* ---------------- Stock / Orders / Coupons / Settings ---------------- */
  const handlePerformStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustItem) return;
    const result = storeService.adjustStock({
      productId: stockAdjustItem.productId,
      variantId: stockAdjustItem.variantId,
      adjustment: Number(adjustmentAmount),
      reason: adjustmentReason,
      performedBy: by,
    });
    if (!result.success) {
      alert(result.message);
      return;
    }
    setStockAdjustItem(null);
  };

  const refreshSelectedOrder = (orderId: string) => {
    if (selectedOrder?.id === orderId)
      setSelectedOrder(storeService.getOrderById(orderId) || null);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    try {
      storeService.updateOrderStatus(
        orderId,
        status,
        by,
        "Status updated in admin console",
      );
      refreshSelectedOrder(orderId);
    } catch (err: any) {
      alert(err?.message || "Could not update this order.");
    }
  };

  const handleAssignTracking = (orderId: string) => {
    if (!trackingNumberInput.trim()) return;
    const ok = storeService.updateShipmentDetails(
      orderId,
      {
        courierName: courierInput,
        trackingNumber: trackingNumberInput.trim(),
        trackingUrl: trackingUrlInput,
      },
      by,
    );
    if (!ok) {
      alert("This order is cancelled or refunded, so it cannot be shipped.");
      return;
    }
    refreshSelectedOrder(orderId);
    setTrackingNumberInput("");
  };

  const handleProcessRefund = (orderId: string, amountPaise: number) => {
    if (!confirm(`Confirm refund of ${formatPriceINR(amountPaise)}?`)) return;
    const ok = storeService.processOrderRefund(orderId, amountPaise, by);
    if (!ok) alert("This order cannot be refunded (it is not a paid order).");
    refreshSelectedOrder(orderId);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    storeService.saveCoupon(
      {
        code: newCouponCode.toUpperCase().trim(),
        description: `Save ${newCouponDiscount}% on orders above ₹${newCouponMinOrder}`,
        discountPercentage: Number(newCouponDiscount),
        minOrderValuePaise: Number(newCouponMinOrder) * 100,
        maxDiscountPaise: 300000,
        usageLimit: 200,
        isActive: true,
        validUntil: newCouponValidUntil,
      },
      by,
    );
    setNewCouponCode("");
  };

  const handleAddAnnouncement = () => {
    if (!announcementInput.trim()) return;
    const current = [
      ...(settings.announcementMessages || []),
      announcementInput.trim(),
    ];
    storeService.updateSettings({ announcementMessages: current }, by);
    setAnnouncementInput("");
  };

  const handleRemoveAnnouncement = (index: number) => {
    const current = (settings.announcementMessages || []).filter(
      (_, i) => i !== index,
    );
    storeService.updateSettings({ announcementMessages: current }, by);
  };

  /* ---------------- Access guard ---------------- */
  if (session?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border border-[#E6E0D8] rounded-xl p-6 sm:p-8 max-w-sm w-full text-center space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-[#292522]">
            Access denied
          </h2>
          <p className="text-xs text-[#766B61]">
            Please log in with the owner account to open the Owner Portal.
          </p>
          <button
            onClick={onExitToStore}
            className="w-full py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded"
          >
            Back to store
          </button>
        </div>
      </div>
    );
  }

  const sectionHeader = (
    title: string,
    sub: string,
    action?: React.ReactNode,
  ) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-[#E6E0D8]">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#292522] truncate">
          {title}
        </h2>
        <p className="text-xs text-[#766B61] mt-0.5">{sub}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );

  const addBtn = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="px-3.5 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
    >
      <Plus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const modalShell =
    "fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto";

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col w-full max-w-full overflow-x-hidden min-w-0">
      {/* Top Header */}
      <header className="bg-[#641D32] text-white px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-[#4A1223] shadow-sm z-30 sticky top-0 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-[#C7A66A] hover:text-white rounded border border-[#C7A66A]/30 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onExitToStore}
            className="flex items-center gap-1 text-xs text-[#C7A66A] hover:text-white transition-colors border border-[#C7A66A]/40 rounded px-2 sm:px-2.5 py-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer Website</span>
            <span className="sm:hidden text-[11px]">Store</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="font-serif font-bold text-sm sm:text-base lg:text-lg text-[#FAF7F0] truncate">
              Kolhapuri Saree
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#C7A66A] font-semibold bg-[#4A1223] px-1.5 sm:px-2 py-0.5 rounded shrink-0">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <span className="hidden md:inline text-white/80 text-xs truncate max-w-[150px]">
            {session.fullName}
          </span>
          <button
            onClick={onExitToStore}
            className="p-1.5 hover:text-[#C7A66A] transition-colors flex items-center gap-1"
            title="Exit Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Exit</span>
          </button>
        </div>
      </header>

      {/* Cloud sync warning banner */}
      {(cloud.error || !cloud.ready) && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 sm:px-6 py-2 text-xs text-amber-900 flex items-center justify-between gap-3 shrink-0">
          <span className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {cloud.error || "Connecting to cloud database..."} Saved locally
              until connected.
            </span>
          </span>
          <button
            onClick={() =>
              storeService
                .forceUploadAll()
                .catch((e: any) => alert(e?.message || "Sync failed"))
            }
            className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold shrink-0 text-xs"
          >
            Sync
          </button>
        </div>
      )}

      {/* Mobile Horizontal Fast-Tabs Strip */}
      <div className="md:hidden bg-white border-b border-[#E6E0D8] p-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 overscroll-x-contain shrink-0 sticky top-[45px] z-20 shadow-xs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              activeTab === id
                ? "bg-[#641D32] text-white shadow-xs"
                : "text-[#292522] hover:bg-[#FAF7F0] bg-[#FAF7F0]/60 border border-[#E6E0D8]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            {id === "orders" && orders.length > 0 && (
              <span className="bg-[#C7A66A] text-[#292522] px-1 rounded text-[9px] font-bold">
                {orders.length}
              </span>
            )}
            {id === "inventory" && stats.lowStockProducts > 0 && (
              <span className="bg-amber-100 text-amber-900 px-1 rounded text-[9px] font-bold">
                {stats.lowStockProducts}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Slide-in Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative bg-white w-64 max-w-[80vw] h-full p-4 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D8]">
                <span className="font-serif font-bold text-sm text-[#641D32]">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#766B61] hover:text-[#292522]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-md transition-colors ${
                      activeTab === id
                        ? "bg-[#641D32] text-white"
                        : "text-[#292522] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                    {id === "orders" && orders.length > 0 && (
                      <span className="bg-[#C7A66A] text-[#292522] px-1.5 rounded text-[10px] font-bold">
                        {orders.length}
                      </span>
                    )}
                    {id === "inventory" && stats.lowStockProducts > 0 && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 rounded text-[10px] font-bold">
                        {stats.lowStockProducts}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6E0D8] text-[11px] text-[#766B61]">
              <p>
                <strong>Boutique Address:</strong>
              </p>
              <p className="mt-0.5 leading-tight">{settings.businessAddress}</p>
              <p className="mt-1 font-semibold text-[#641D32]">
                Ph: {settings.businessPhone}
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden min-w-0 w-full">
        {/* Desktop Sidebar (hidden on mobile, visible from md up) */}
        <aside className="hidden md:flex w-56 lg:w-60 bg-white border-r border-[#E6E0D8] p-4 flex-col justify-between shrink-0">
          <div className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === id
                    ? "bg-[#641D32] text-white shadow-xs"
                    : "text-[#292522] hover:bg-[#FAF7F0]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
                {id === "orders" && orders.length > 0 && (
                  <span className="bg-[#C7A66A] text-[#292522] px-1.5 rounded text-[10px] font-bold shrink-0">
                    {orders.length}
                  </span>
                )}
                {id === "inventory" && stats.lowStockProducts > 0 && (
                  <span className="bg-amber-100 text-amber-900 px-1.5 rounded text-[10px] font-bold shrink-0">
                    {stats.lowStockProducts} Low
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E6E0D8] text-[11px] text-[#766B61]">
            <p>
              <strong>Boutique Address:</strong>
            </p>
            <p className="mt-0.5 leading-tight">{settings.businessAddress}</p>
            <p className="mt-1 font-semibold text-[#641D32]">
              Ph: {settings.businessPhone}
            </p>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 w-full max-w-full min-w-0 overflow-x-hidden">
          {/* 1. DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 sm:space-y-8 max-w-6xl">
              {sectionHeader(
                "Boutique Performance Dashboard",
                "Metrics calculated from your orders and stock movements.",
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] shadow-xs space-y-1">
                  <span className="text-xs text-[#766B61] font-medium">
                    Paid Revenue
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#641D32] tabular-nums font-sans">
                    {formatPriceINR(stats.confirmedPaidRevenuePaise)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    From orders marked Paid
                  </span>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] shadow-xs space-y-1">
                  <span className="text-xs text-[#766B61] font-medium">
                    Total Orders Placed
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#292522] tabular-nums font-sans">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[11px] text-[#766B61]">
                    {stats.processingOrders} processing / packing
                  </span>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] shadow-xs space-y-1">
                  <span className="text-xs text-[#766B61] font-medium">
                    Sarees in Catalog
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#292522] tabular-nums font-sans">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[11px] text-[#766B61]">
                    {stats.outOfStockProducts} out of stock
                  </span>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] shadow-xs space-y-1">
                  <span className="text-xs text-[#766B61] font-medium">
                    Low Stock Alerts
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-amber-700 tabular-nums font-sans">
                    {stats.lowStockProducts}
                  </div>
                  <span className="text-[11px] text-amber-800">
                    Requires weaver restocking
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E6E0D8] p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#292522]">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-[#641D32] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="overflow-x-auto scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-xs text-left min-w-[550px]">
                    <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
                      <tr>
                        <th className="p-2.5 sm:p-3">Order Number</th>
                        <th className="p-2.5 sm:p-3">Customer</th>
                        <th className="p-2.5 sm:p-3">Items</th>
                        <th className="p-2.5 sm:p-3">Total Amount</th>
                        <th className="p-2.5 sm:p-3">Payment</th>
                        <th className="p-2.5 sm:p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E0D8]">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-[#FAF7F0]/60">
                          <td className="p-2.5 sm:p-3 font-mono font-bold text-[#641D32]">
                            #{o.orderNumber}
                          </td>
                          <td className="p-2.5 sm:p-3">
                            <span className="font-semibold text-[#292522] block truncate max-w-[120px]">
                              {o.customerName}
                            </span>
                            <span className="text-[#766B61] text-[11px] truncate max-w-[120px] block">
                              {o.customerEmail}
                            </span>
                          </td>
                          <td className="p-2.5 sm:p-3 truncate max-w-[160px]">
                            {o.items
                              .map((i) => `${i.quantity}x ${i.name}`)
                              .join(", ")}
                          </td>
                          <td className="p-2.5 sm:p-3 font-bold tabular-nums font-sans">
                            {formatPriceINR(o.finalPayablePaise)}
                          </td>
                          <td className="p-2.5 sm:p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.paymentStatus === "Paid"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-2.5 sm:p-3">
                            <span className="font-semibold">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Saree Product Catalog Management",
                "Manage sarees, categories, colour variants, photos and prices.",
                addBtn("Add New Saree", openNewProduct),
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => {
                  const v = p.variants[0];
                  const totalStock = p.variants.reduce(
                    (s, i) => s + (i.inventoryStock - i.reservedStock),
                    0,
                  );
                  const mainImage =
                    p.primaryImage || p.variants[0]?.images?.[0];
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl border border-[#E6E0D8] overflow-hidden flex flex-col justify-between shadow-xs"
                    >
                      <div className="aspect-[4/3] bg-[#FAF7F0] relative overflow-hidden">
                        <img
                          src={cld(mainImage, { w: 600, h: 450 })}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() =>
                              shareProduct({
                                slug: p.slug || p.id,
                                name: p.name,
                                pricePaise: v?.sellingPricePaise || 0,
                                image: mainImage,
                              })
                            }
                            className="p-1.5 bg-white/90 hover:bg-white text-[#25D366] rounded shadow-xs"
                            title="Share on WhatsApp & more"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 bg-white/90 hover:bg-white text-[#292522] rounded shadow-xs"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 bg-white/90 hover:bg-white text-red-600 rounded shadow-xs"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3.5 sm:p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#766B61]">
                          <span className="truncate">{p.fabric}</span>
                          <span className="shrink-0">SKU: {p.sku}</span>
                        </div>
                        <h4 className="text-sm font-semibold font-serif text-[#292522] line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#766B61] line-clamp-1">
                          {p.categoryNames?.join(", ") || "No category"}
                        </p>
                        <div className="flex items-baseline justify-between pt-1 border-t border-[#E6E0D8]">
                          <span className="text-base font-bold text-[#641D32] tabular-nums font-sans">
                            {formatPriceINR(v?.sellingPricePaise || 0)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${totalStock <= LOW_STOCK_LIMIT ? "text-amber-700" : "text-emerald-700"}`}
                          >
                            Stock: {totalStock} units
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Order & Shipment Tracking Management",
                "Control order status lifecycle, dispatch shipments via Blue Dart/Delhivery, and handle authorized refunds.",
              )}

              <OrdersPanel
                orders={orders}
                onStatusChange={handleUpdateOrderStatus}
                onManage={(o: Order) => setSelectedOrder(o)}
                onAssignCourier={(o: Order) => {
                  setSelectedOrder(o);
                  setTrackingNumberInput(
                    `BDKOL${Date.now().toString().slice(-6)}`,
                  );
                }}
              />

              {selectedOrder && (
                <div className={modalShell}>
                  <div className="bg-white rounded-xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-[#E6E0D8] space-y-4 max-h-[90vh] overflow-y-auto my-auto min-w-0">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D8]">
                      <div>
                        <span className="text-xs text-[#766B61]">
                          Order Inspector
                        </span>
                        <h3 className="text-base sm:text-lg font-mono font-bold text-[#641D32]">
                          #{selectedOrder.orderNumber}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1 text-[#766B61] hover:text-[#292522]"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <strong className="block text-[#292522] mb-1">
                          Customer Delivery Address:
                        </strong>
                        <p className="text-[#766B61] leading-relaxed">
                          {selectedOrder.shippingAddressSnapshot.fullName}
                          <br />
                          {selectedOrder.shippingAddressSnapshot.addressLine1}
                          <br />
                          {selectedOrder.shippingAddressSnapshot.city},{" "}
                          {selectedOrder.shippingAddressSnapshot.state} -{" "}
                          {selectedOrder.shippingAddressSnapshot.pinCode}
                          <br />
                          Phone:{" "}
                          {selectedOrder.shippingAddressSnapshot.mobileNumber} ·
                          Email: {selectedOrder.customerEmail}
                        </p>
                      </div>

                      <div className="p-3 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md space-y-2">
                        <strong className="block text-[#292522]">
                          Shipment Tracking Assignment:
                        </strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Courier (e.g. Blue Dart)"
                            value={courierInput}
                            onChange={(e) => setCourierInput(e.target.value)}
                            className="p-2 bg-white border border-[#E6E0D8] rounded text-xs w-full"
                          />
                          <input
                            type="text"
                            placeholder="Tracking Number"
                            value={trackingNumberInput}
                            onChange={(e) =>
                              setTrackingNumberInput(e.target.value)
                            }
                            className="p-2 bg-white border border-[#E6E0D8] rounded text-xs font-mono w-full"
                          />
                        </div>
                        <button
                          onClick={() => handleAssignTracking(selectedOrder.id)}
                          className="w-full py-2 bg-[#641D32] text-white text-xs font-semibold rounded hover:bg-[#4A1223]"
                        >
                          Save & Mark Order Shipped
                        </button>
                      </div>

                      {selectedOrder.paymentStatus === "Paid" &&
                        selectedOrder.orderStatus !== "Refunded" && (
                          <div className="pt-2 border-t border-[#E6E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[#766B61]">
                              Need to cancel/refund?
                            </span>
                            <button
                              onClick={() =>
                                handleProcessRefund(
                                  selectedOrder.id,
                                  selectedOrder.finalPayablePaise,
                                )
                              }
                              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-medium text-xs text-center"
                            >
                              Process Refund (
                              {formatPriceINR(selectedOrder.finalPayablePaise)})
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Handloom Inventory Management",
                "Real-time tracking of available stock, reserved stock, and physical stock adjustments.",
              )}
              {/* Upload bill / Excel to add stock */}
              <StockImport products={products} by={by} />

              <div className="bg-white rounded-xl border border-[#E6E0D8] overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left min-w-[600px]">
                  <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
                    <tr>
                      <th className="p-3">Saree Name</th>
                      <th className="p-3">Color Variant</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">On Hand</th>
                      <th className="p-3">Reserved</th>
                      <th className="p-3">Available</th>
                      <th className="p-3 text-right">Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E0D8]">
                    {products.flatMap((p) =>
                      p.variants.map((v) => {
                        const available = v.inventoryStock - v.reservedStock;
                        return (
                          <tr
                            key={v.variantId}
                            className="hover:bg-[#FAF7F0]/60"
                          >
                            <td className="p-3 font-medium text-[#292522]">
                              {p.name}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-3 h-3 rounded-full border shrink-0"
                                  style={{ backgroundColor: v.colorHex }}
                                />
                                <span className="truncate">{v.colorName}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-[#766B61]">
                              {v.sku}
                            </td>
                            <td className="p-3 font-bold tabular-nums">
                              {v.inventoryStock}
                            </td>
                            <td className="p-3 tabular-nums text-amber-800">
                              {v.reservedStock}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold tabular-nums ${available <= LOW_STOCK_LIMIT ? "text-amber-700" : "text-emerald-700"}`}
                              >
                                {available} units
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  setStockAdjustItem({
                                    productId: p.id,
                                    variantId: v.variantId,
                                    productName: p.name,
                                    colorName: v.colorName,
                                    currentStock: v.inventoryStock,
                                  })
                                }
                                className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-white text-[#641D32] border border-[#E6E0D8] rounded font-semibold text-[11px] shrink-0"
                              >
                                Adjust Stock
                              </button>
                            </td>
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl border border-[#E6E0D8] p-4 sm:p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#292522]">
                  Stock Movement History
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {movements.slice(0, 15).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2 rounded bg-[#FAF7F0] text-xs gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-[#292522] truncate block">
                          {m.productName} ({m.colorName})
                        </span>
                        <span className="text-[#766B61] text-[11px] block truncate">
                          {m.reason} · {formatDate(m.timestamp)}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-bold tabular-nums ${m.quantityChange > 0 ? "text-emerald-700" : "text-red-700"}`}
                        >
                          {m.quantityChange > 0
                            ? `+${m.quantityChange}`
                            : m.quantityChange}
                        </span>
                        <span className="text-[11px] text-[#766B61] block">
                          Stock: {m.stockAfter}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Circular Saree Category Manager",
                "Add, edit or delete the categories shown on the customer homepage.",
                addBtn("Add Category", openNewCategory),
              )}

              {categories.length === 0 && (
                <p className="text-xs text-[#766B61]">
                  No categories yet. Click "Add Category" to create one.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {categories.map((c) => {
                  const count = products.filter((p) =>
                    p.categoryIds?.includes(c.id),
                  ).length;
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl border border-[#E6E0D8] p-3.5 sm:p-4 flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={cld(c.imageUrl, { w: 120, h: 120 })}
                        alt={c.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#292522] font-serif truncate">
                          {c.name}
                        </h4>
                        <span
                          className={`text-[11px] font-semibold block truncate ${c.isActive === false ? "text-[#766B61]" : "text-emerald-700"}`}
                        >
                          {c.isActive === false ? "Hidden" : "Active"} · {count}{" "}
                          saree{count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => openEditCategory(c)}
                          className="p-1.5 hover:bg-[#FAF7F0] rounded text-[#292522]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c)}
                          className="p-1.5 hover:bg-[#FAF7F0] rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. BANNERS */}
          {activeTab === "banners" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Promotional Hero Carousel Banners",
                "Add, edit or delete banners rotating on the storefront homepage.",
                addBtn("Add Banner", openNewBanner),
              )}

              {banners.length === 0 && (
                <p className="text-xs text-[#766B61]">
                  No banners yet. Click "Add Banner" to create one.
                </p>
              )}

              <div className="space-y-3 sm:space-y-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-[#E6E0D8] p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center shadow-xs"
                  >
                    <img
                      src={cld(b.imageUrl, { w: 320, h: 200 })}
                      alt={b.heading}
                      className="w-full sm:w-32 h-36 sm:h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0 w-full sm:w-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A66A]">
                        {b.badgeText}
                      </span>
                      <h4 className="text-sm font-bold font-serif text-[#292522] truncate">
                        {b.heading}
                      </h4>
                      <p className="text-xs text-[#766B61] line-clamp-2">
                        {b.subtitle}
                      </p>
                      {b.isActive === false && (
                        <span className="text-[11px] text-[#766B61] font-semibold block">
                          Hidden from store
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          setBannerError("");
                          setBannerUploading(false);
                          setEditingBanner({ ...b });
                        }}
                        className="p-2 hover:bg-[#FAF7F0] rounded text-[#292522] border border-[#E6E0D8] sm:border-transparent"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b)}
                        className="p-2 hover:bg-[#FAF7F0] rounded text-red-600 border border-[#E6E0D8] sm:border-transparent"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Discount Coupons & Offers",
                "Create coupon codes (e.g. FESTIVE10, KOLHAPUR20) with minimum order values.",
              )}

              <form
                onSubmit={handleAddCoupon}
                className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4 items-end shadow-xs text-xs"
              >
                <div className="flex-1 min-w-[140px]">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SPECIAL20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="p-2 border border-[#E6E0D8] rounded bg-[#FAF7F0] font-mono font-bold w-full"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newCouponDiscount}
                    onChange={(e) =>
                      setNewCouponDiscount(Number(e.target.value))
                    }
                    className="p-2 border border-[#E6E0D8] rounded bg-[#FAF7F0] w-full sm:w-24"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={(e) =>
                      setNewCouponMinOrder(Number(e.target.value))
                    }
                    className="p-2 border border-[#E6E0D8] rounded bg-[#FAF7F0] w-full sm:w-28"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newCouponValidUntil}
                    onChange={(e) => setNewCouponValidUntil(e.target.value)}
                    className="p-2 border border-[#E6E0D8] rounded bg-[#FAF7F0] w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded shrink-0"
                >
                  Create Coupon Code
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {coupons.map((cp) => (
                  <div
                    key={cp.id}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E0D8] space-y-2 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-sm sm:text-base text-[#641D32] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E6E0D8]">
                        {cp.code}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {cp.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-[#766B61]">{cp.description}</p>
                    <div className="text-[11px] text-[#766B61] pt-2 border-t border-[#E6E0D8]">
                      Min Order: ₹
                      {Math.round(cp.minOrderValuePaise / 100).toLocaleString(
                        "en-IN",
                      )}{" "}
                      · Used: {cp.usedCount}/{cp.usageLimit} · Until{" "}
                      {cp.validUntil}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-4xl">
              {sectionHeader(
                "Store Configuration & Policies",
                "Control announcement banner messages, business address, and contact details.",
              )}

              <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E6E0D8] space-y-4 shadow-xs">
                <h3 className="text-sm font-serif font-bold text-[#292522]">
                  Homepage Announcement Bar Messages
                </h3>
                <div className="space-y-2">
                  {(settings.announcementMessages || []).map((msg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-[#FAF7F0] rounded border border-[#E6E0D8] text-xs gap-2"
                    >
                      <span className="truncate">{msg}</span>
                      <button
                        onClick={() => handleRemoveAnnouncement(idx)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add promotional message for the top bar..."
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    className="flex-1 p-2 text-xs bg-[#FAF7F0] border border-[#E6E0D8] rounded focus:outline-none focus:border-[#641D32] w-full"
                  />
                  <button
                    onClick={handleAddAnnouncement}
                    className="px-4 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded shrink-0"
                  >
                    Add Message
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E6E0D8] space-y-4 shadow-xs text-xs">
                <h3 className="text-sm font-serif font-bold text-[#292522]">
                  Brand & Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="font-semibold block mb-1">
                      Business Phone & WhatsApp
                    </label>
                    <input
                      type="text"
                      value={settings.businessPhone}
                      onChange={(e) =>
                        storeService.updateSettings(
                          {
                            businessPhone: e.target.value,
                            whatsappContact: e.target.value,
                          },
                          by,
                        )
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={settings.instagramHandle}
                      onChange={(e) =>
                        storeService.updateSettings(
                          { instagramHandle: e.target.value },
                          by,
                        )
                      }
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">
                      Physical Boutique Address
                    </label>
                    <input
                      type="text"
                      value={settings.businessAddress}
                      onChange={(e) =>
                        storeService.updateSettings(
                          { businessAddress: e.target.value },
                          by,
                        )
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. AUDIT */}
          {/* {activeTab === "audit" && (
            <div className="space-y-6 max-w-6xl">
              {sectionHeader(
                "Security & Action Audit Logs",
                "Chronological record of every administrative action, stock mutation, and order transition.",
              )}
              <div className="bg-white rounded-xl border border-[#E6E0D8] p-4 sm:p-5 shadow-xs">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-[#FAF7F0] rounded border border-[#E6E0D8] text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-[#641D32] uppercase tracking-wider text-[10px]">
                          [{log.entityType}]
                        </span>
                        <p className="font-medium text-[#292522] mt-0.5">
                          {log.details}
                        </p>
                        <span className="text-[#766B61] text-[11px] block mt-0.5">
                          By: {log.performedBy}
                        </span>
                      </div>
                      <span className="text-[#766B61] text-[11px] shrink-0">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}
        </main>
      </div>

      {/* Stock Adjustment Dialog */}
      {stockAdjustItem && (
        <div className={modalShell}>
          <form
            onSubmit={handlePerformStockAdjustment}
            className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-[#E6E0D8] space-y-4 text-xs my-auto min-w-0"
          >
            <h3 className="text-base font-serif font-bold text-[#292522]">
              Adjust Handloom Stock: {stockAdjustItem.productName}
            </h3>
            <p className="text-[#766B61]">
              Color: {stockAdjustItem.colorName} · Current on-hand:{" "}
              {stockAdjustItem.currentStock} units
            </p>
            <div>
              <label className="font-semibold block mb-1">
                Quantity Change (+ to add, - to subtract)
              </label>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                className={`${inputCls} font-bold`}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">
                Reason for Adjustment
              </label>
              <input
                type="text"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStockAdjustItem(null)}
                className="flex-1 py-2 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded"
              >
                Confirm Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Modal (Add / Edit) */}
      {editingCategory && (
        <div className={modalShell}>
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-[#E6E0D8] space-y-4 text-xs my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D8]">
              <h3 className="text-base font-serif font-bold text-[#292522]">
                {editingCategory.id ? "Edit Category" : "Add Category"}
              </h3>
              <button
                type="button"
                onClick={closeCategoryModal}
                className="text-[#766B61]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1">Category Name</label>
              <input
                type="text"
                required
                value={editingCategory.name || ""}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditingCategory((prev) =>
                    prev ? { ...prev, name } : prev,
                  );
                }}
                placeholder="e.g. Paithani Sarees"
                className={inputCls}
              />
            </div>

            <ImageUploadField
              label="Category Image (round photo on homepage)"
              value={editingCategory.imageUrl || ""}
              onChange={(imageUrl) =>
                setEditingCategory((prev) =>
                  prev ? { ...prev, imageUrl } : prev,
                )
              }
              onUploadingChange={setCatUploading}
            />

            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={editingCategory.isActive !== false}
                onChange={(e) => {
                  const isActive = e.target.checked;
                  setEditingCategory((prev) =>
                    prev ? { ...prev, isActive } : prev,
                  );
                }}
              />
              Show on homepage
            </label>

            {catError && (
              <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                {catError}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t border-[#E6E0D8]">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="flex-1 py-2 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={catUploading}
                className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded disabled:opacity-50"
              >
                {catUploading
                  ? "Uploading…"
                  : editingCategory.id
                    ? "Update Category"
                    : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Modal */}
      {editingBanner && (
        <div className={modalShell}>
          <form
            onSubmit={handleSaveBanner}
            className="bg-white rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-[#E6E0D8] space-y-4 max-h-[90vh] overflow-y-auto text-xs my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D8]">
              <h3 className="text-base font-serif font-bold text-[#292522]">
                {editingBanner.id ? "Edit Banner" : "Add Banner"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-[#766B61]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1">Badge Text</label>
              <input
                type="text"
                value={editingBanner.badgeText || ""}
                onChange={(e) => {
                  const badgeText = e.target.value;
                  setEditingBanner((prev) =>
                    prev ? { ...prev, badgeText } : prev,
                  );
                }}
                placeholder="e.g. Festive Collection"
                className={inputCls}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Heading</label>
              <input
                type="text"
                required
                value={editingBanner.heading || ""}
                onChange={(e) => {
                  const heading = e.target.value;
                  setEditingBanner((prev) =>
                    prev ? { ...prev, heading } : prev,
                  );
                }}
                placeholder="e.g. Pure Paithani Silk Sarees"
                className={inputCls}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={editingBanner.subtitle || ""}
                onChange={(e) => {
                  const subtitle = e.target.value;
                  setEditingBanner((prev) =>
                    prev ? { ...prev, subtitle } : prev,
                  );
                }}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Button Text</label>
                <input
                  type="text"
                  value={editingBanner.ctaText || ""}
                  onChange={(e) => {
                    const ctaText = e.target.value;
                    setEditingBanner((prev) =>
                      prev ? { ...prev, ctaText } : prev,
                    );
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Button Link</label>
                <input
                  type="text"
                  value={editingBanner.ctaLink || ""}
                  onChange={(e) => {
                    const ctaLink = e.target.value;
                    setEditingBanner((prev) =>
                      prev ? { ...prev, ctaLink } : prev,
                    );
                  }}
                  placeholder="/catalog"
                  className={inputCls}
                />
              </div>
            </div>

            <ImageUploadField
              label="Banner Image (wide photo recommended)"
              value={editingBanner.imageUrl || ""}
              onChange={(imageUrl) =>
                setEditingBanner((prev) =>
                  prev ? { ...prev, imageUrl } : prev,
                )
              }
              onUploadingChange={setBannerUploading}
            />

            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={editingBanner.isActive !== false}
                onChange={(e) => {
                  const isActive = e.target.checked;
                  setEditingBanner((prev) =>
                    prev ? { ...prev, isActive } : prev,
                  );
                }}
              />
              Show on homepage
            </label>

            {bannerError && (
              <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                {bannerError}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t border-[#E6E0D8]">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="flex-1 py-2 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bannerUploading}
                className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded disabled:opacity-50"
              >
                {bannerUploading
                  ? "Uploading…"
                  : editingBanner.id
                    ? "Update Banner"
                    : "Save Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Saree Modal */}
      {isProductModalOpen && editingProduct && (
        <div className={modalShell}>
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-xl max-w-4xl w-full p-4 sm:p-6 lg:p-8 shadow-2xl border border-[#E6E0D8] space-y-4 max-h-[90vh] overflow-y-auto text-xs my-auto min-w-0"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D8]">
              <h3 className="text-base font-serif font-bold text-[#292522]">
                {editingProduct.id
                  ? "Edit Saree Specifications"
                  : "Add New Saree to Catalog"}
              </h3>
              <button
                type="button"
                onClick={closeProductModal}
                className="text-[#766B61]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Saree Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingProduct((prev) =>
                      prev ? { ...prev, name } : prev,
                    );
                  }}
                  placeholder="e.g. Royal Kolhapuri Paithani Pure Silk Saree"
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">
                  Categories (select at least one)
                </label>
                {categories.length === 0 ? (
                  <p className="text-amber-800">
                    Create a category first in the Categories tab.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const checked =
                        editingProduct.categoryIds?.includes(c.id) ?? false;
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border cursor-pointer text-xs ${
                            checked
                              ? "bg-[#641D32] text-white border-[#641D32]"
                              : "bg-[#FAF7F0] border-[#E6E0D8]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checked}
                            onChange={() => toggleProductCategory(c)}
                          />
                          {c.name}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">Fabric</label>
                <input
                  type="text"
                  value={editingProduct.fabric || ""}
                  onChange={(e) => {
                    const fabric = e.target.value;
                    setEditingProduct((prev) =>
                      prev ? { ...prev, fabric } : prev,
                    );
                  }}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Occasion</label>
                <input
                  type="text"
                  value={editingProduct.occasion || ""}
                  onChange={(e) => {
                    const occasion = e.target.value;
                    setEditingProduct((prev) =>
                      prev ? { ...prev, occasion } : prev,
                    );
                  }}
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="font-semibold block">
                  Colours, prices & photos (at least 1 photo per colour, add as
                  many as you like)
                </label>
                <ProductVariantsEditor
                  value={editingProduct.variants ?? []}
                  onChange={(variants) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, variants } : prev,
                    )
                  }
                  onUploadingChange={setUploading}
                  allowStockEdit={!editingProduct.id}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">
                  Detailed Weaving Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => {
                    const description = e.target.value;
                    setEditingProduct((prev) =>
                      prev ? { ...prev, description } : prev,
                    );
                  }}
                  className={inputCls}
                />
              </div>
            </div>

            {formError && (
              <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                {formError}
              </p>
            )}

            <div className="flex gap-2 pt-4 border-t border-[#E6E0D8]">
              <button
                type="button"
                onClick={closeProductModal}
                className="flex-1 py-2 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded disabled:opacity-50"
              >
                {uploading ? "Uploading photos…" : "Save Saree"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
