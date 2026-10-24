// // import React, { useState, useEffect, useRef } from "react";
// // import { Sparkles, ArrowRight } from "lucide-react";
// // import { SareeProduct, CategoryItem, PromotionalOffer } from "./types/index.ts";
// // import { storeService } from "./services/storeService.ts";
// // import { AnnouncementBar } from "./components/AnnouncementBar.tsx";
// // import { Header } from "./components/Header.tsx";
// // import { Footer } from "./components/Footer.tsx";
// // import { HeroCarousel } from "./components/HeroCarousel.tsx";
// // import { CategoryCircles } from "./components/CategoryCircles.tsx";
// // import { ProductCard } from "./components/ProductCard.tsx";
// // import { ProductQuickViewModal } from "./components/ProductQuickViewModal.tsx";
// // import { ProductDetailsPage } from "./components/ProductDetailsPage.tsx";
// // import { CartDrawer } from "./components/CartDrawer.tsx";
// // import { CheckoutModal } from "./components/CheckoutModal.tsx";
// // import { CustomerOrdersPage } from "./components/CustomerOrdersPage.tsx";
// // import { WishlistPage } from "./components/WishlistPage.tsx";
// // import { AuthModal } from "./components/AuthModal.tsx";
// // import { AdminPortal } from "./components/AdminPortal/AdminPortal.tsx";

// // type View = "home" | "catalog" | "pdp" | "wishlist" | "orders" | "admin";

// // export default function App() {
// //   const [currentView, setCurrentView] = useState<View>("home");
// //   const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(
// //     null,
// //   );
// //   const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(
// //     null,
// //   );
// //   const [isCartOpen, setIsCartOpen] = useState(false);
// //   const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
// //   const [isAuthOpen, setIsAuthOpen] = useState(false);
// //   const [appliedCheckoutCoupon, setAppliedCheckoutCoupon] = useState<
// //     string | undefined
// //   >();
// //   const [toastMessage, setToastMessage] = useState<string | null>(null);
// //   const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// //   // Catalog filters & search state
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState<string>("All");
// //   const [sortBy, setSortBy] = useState<
// //     "newest" | "price-asc" | "price-desc" | "popularity" | "discount"
// //   >("newest");
// //   const [selectedFabric, setSelectedFabric] = useState<string>("All");
// //   const [minimumPrice, setMinimumPrice] = useState("");

// //   // Reactive data
// //   const [products, setProducts] = useState<SareeProduct[]>(() =>
// //     storeService.getProducts(),
// //   );
// //   const [categories, setCategories] = useState<CategoryItem[]>(() =>
// //     storeService.getCategories(),
// //   );
// //   const [offers, setOffers] = useState<PromotionalOffer[]>(() =>
// //     storeService.getOffers(true),
// //   );

// //   // Only categories the owner chose to show
// //   const visibleCategories = categories.filter((c) => c.isActive !== false);

// //   // Keep storefront in sync with Firestore loads and admin edits
// //   useEffect(() => {
// //     const update = () => {
// //       setProducts(storeService.getProducts());
// //       setCategories(storeService.getCategories());
// //       setOffers(storeService.getOffers(true));
// //       // Refresh the open product page (price / stock / photos may have changed)
// //       setSelectedProduct((prev) =>
// //         prev
// //           ? (storeService.getAllProductsAdmin().find((p) => p.id === prev.id) ??
// //             null)
// //           : prev,
// //       );
// //     };
// //     return storeService.subscribe(update);
// //   }, []);

// //   // If the product being viewed was deleted/unpublished, go back to the catalog
// //   useEffect(() => {
// //     if (
// //       currentView === "pdp" &&
// //       (!selectedProduct || !selectedProduct.isPublished)
// //     ) {
// //       setCurrentView("catalog");
// //     }
// //   }, [currentView, selectedProduct]);

// //   // Open a product directly from a shared link: /?product=<slug>
// //   useEffect(() => {
// //     let cancelled = false;
// //     storeService.ready.then(() => {
// //       if (cancelled) return;
// //       const slug = new URLSearchParams(window.location.search).get("product");
// //       if (!slug) return;
// //       const p = storeService.getProductBySlug(slug);
// //       if (p && p.isPublished) {
// //         setSelectedProduct(p);
// //         setCurrentView("pdp");
// //       }
// //       window.history.replaceState({}, "", window.location.pathname);
// //     });
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   useEffect(() => {
// //     return () => {
// //       if (toastTimer.current) clearTimeout(toastTimer.current);
// //     };
// //   }, []);

// //   const showToast = (msg: string) => {
// //     setToastMessage(msg);
// //     if (toastTimer.current) clearTimeout(toastTimer.current);
// //     toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
// //   };

// //   const handleNavigate = (view: string, param?: string) => {
// //     if (view === "catalog") {
// //       if (param) setSelectedCategory(param);
// //       setCurrentView("catalog");
// //     } else if (view === "pdp" && param) {
// //       const found = storeService.getProductBySlug(param);
// //       if (found) setSelectedProduct(found);
// //       setCurrentView("pdp");
// //     } else {
// //       setCurrentView(view as View);
// //     }
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const handleSelectProduct = (product: SareeProduct) => {
// //     setSelectedProduct(product);
// //     setCurrentView("pdp");
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   // Filtered catalog products
// //   const filteredProducts = storeService.getProducts({
// //     category: selectedCategory === "All" ? undefined : selectedCategory,
// //     fabric: selectedFabric === "All" ? undefined : selectedFabric,
// //     minPrice: minimumPrice ? Number(minimumPrice) : undefined,
// //     search: searchQuery || undefined,
// //     sort: sortBy,
// //   });

// //   const trendingProducts = products.filter((p) => p.trending);
// //   const newArrivalProducts = products.filter((p) => p.isNewArrival);

// //   // Owner portal (AdminPortal itself also checks the admin role)
// //   if (currentView === "admin") {
// //     return <AdminPortal onExitToStore={() => setCurrentView("home")} />;
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#292522]">
// //       {/* Toast Notification */}
// //       {toastMessage && (
// //         <div className="fixed bottom-6 right-6 z-50 bg-[#292522] text-[#FAF7F0] px-4 py-3 rounded-lg shadow-xl border border-[#C7A66A]/40 text-xs font-semibold flex items-center gap-2 transition-all">
// //           <Sparkles className="w-4 h-4 text-[#C7A66A]" />
// //           <span>{toastMessage}</span>
// //         </div>
// //       )}

// //       <AnnouncementBar />

// //       <Header
// //         currentView={currentView}
// //         onNavigate={handleNavigate}
// //         onOpenCart={() => setIsCartOpen(true)}
// //         onOpenAuth={() => setIsAuthOpen(true)}
// //         searchQuery={searchQuery}
// //         onSearchChange={(q) => {
// //           setSearchQuery(q);
// //           if (currentView !== "catalog") setCurrentView("catalog");
// //         }}
// //       />

// //       <main className="flex-1">
// //         {/* VIEW 1: HOME */}
// //         {currentView === "home" && (
// //           <div className="space-y-16">
// //             <HeroCarousel onNavigate={handleNavigate} />

// //             <section className="max-w-4xl mx-auto px-4 text-center space-y-3 pt-4">
// //               <span className="text-xs font-bold tracking-widest uppercase text-[#641D32]">
// //                 Woven in Kolhapur, Maharashtra
// //               </span>
// //               <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522]">
// //                 Generations of Royal Handloom Artistry
// //               </h2>
// //               <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed max-w-2xl mx-auto">
// //                 Kolhapuri Fashion Saree brings you genuine handloom Paithani,
// //                 Kanjivaram, and Banarasi silks. Each saree is woven with pure
// //                 mulberry yarn, authentic gold zari motifs, and timeless pride.
// //               </p>
// //               <div className="pt-2">
// //                 <button
// //                   onClick={() => handleNavigate("catalog")}
// //                   className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
// //                 >
// //                   <span>Explore Our Kolhapur Workshop Collections</span>
// //                   <ArrowRight className="w-3.5 h-3.5" />
// //                 </button>
// //               </div>
// //             </section>

// //             {/* Circular Saree Categories (hidden ones are not shown) */}
// //             <CategoryCircles
// //               categories={visibleCategories}
// //               selectedCategory={selectedCategory}
// //               onSelectCategory={(catName) => {
// //                 setSelectedCategory(catName);
// //                 setCurrentView("catalog");
// //                 window.scrollTo({ top: 0, behavior: "smooth" });
// //               }}
// //             />

// //             {/* Active Festive Offers */}
// //             {offers.length > 0 && (
// //               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
// //                 {offers.map((offer) => (
// //                   <div
// //                     key={offer.id}
// //                     className="bg-[#641D32] text-white rounded-2xl overflow-hidden shadow-lg border border-[#7E2841] grid grid-cols-1 md:grid-cols-12 items-center"
// //                   >
// //                     <div className="md:col-span-5 aspect-[16/10] md:h-full bg-black/20 overflow-hidden">
// //                       <img
// //                         src={offer.imageUrl}
// //                         alt={offer.title}
// //                         className="w-full h-full object-cover"
// //                       />
// //                     </div>
// //                     <div className="md:col-span-7 p-6 sm:p-10 space-y-3 text-left">
// //                       <span className="text-xs font-bold tracking-widest uppercase text-[#C7A66A]">
// //                         Limited Festive Privilege · Valid Until{" "}
// //                         {offer.validUntil}
// //                       </span>
// //                       <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F0]">
// //                         {offer.title}
// //                       </h3>
// //                       <p className="text-xs sm:text-sm text-[#FAF7F0]/85 leading-relaxed">
// //                         {offer.description}
// //                       </p>
// //                       <div className="pt-2">
// //                         <button
// //                           onClick={() =>
// //                             handleNavigate("catalog", "Wedding Sarees")
// //                           }
// //                           className="px-6 py-3 bg-[#C7A66A] hover:bg-[#DFCA9B] text-[#292522] font-semibold text-xs rounded-md shadow-md transition-colors inline-flex items-center gap-2"
// //                         >
// //                           <span>{offer.ctaText}</span>
// //                           <ArrowRight className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </section>
// //             )}

// //             {/* Trending */}
// //             {trendingProducts.length > 0 && (
// //               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //                 <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#E6E0D8]">
// //                   <div>
// //                     <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
// //                       Most Loved
// //                     </span>
// //                     <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
// //                       Trending Sarees
// //                     </h3>
// //                   </div>
// //                   <button
// //                     onClick={() => handleNavigate("catalog")}
// //                     className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
// //                   >
// //                     <span>View All Collection</span>
// //                     <ArrowRight className="w-3.5 h-3.5" />
// //                   </button>
// //                 </div>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //                   {trendingProducts.map((p) => (
// //                     <ProductCard
// //                       key={p.id}
// //                       product={p}
// //                       onSelectProduct={handleSelectProduct}
// //                       onQuickView={(prod) => setQuickViewProduct(prod)}
// //                       onAddToCartSuccess={showToast}
// //                     />
// //                   ))}
// //                 </div>
// //               </section>
// //             )}

// //             {/* New Arrivals */}
// //             {newArrivalProducts.length > 0 && (
// //               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
// //                 <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#E6E0D8]">
// //                   <div>
// //                     <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
// //                       Fresh Off The Loom
// //                     </span>
// //                     <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
// //                       New Festive Arrivals
// //                     </h3>
// //                   </div>
// //                   <button
// //                     onClick={() => handleNavigate("catalog")}
// //                     className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
// //                   >
// //                     <span>Explore New Sarees</span>
// //                     <ArrowRight className="w-3.5 h-3.5" />
// //                   </button>
// //                 </div>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //                   {newArrivalProducts.map((p) => (
// //                     <ProductCard
// //                       key={p.id}
// //                       product={p}
// //                       onSelectProduct={handleSelectProduct}
// //                       onQuickView={(prod) => setQuickViewProduct(prod)}
// //                       onAddToCartSuccess={showToast}
// //                     />
// //                   ))}
// //                 </div>
// //               </section>
// //             )}
// //           </div>
// //         )}

// //         {/* VIEW 2: FULL CATALOG */}
// //         {currentView === "catalog" && (
// //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
// //             <div className="pb-4 border-b border-[#E6E0D8]">
// //               <span className="text-xs font-semibold uppercase tracking-wider text-[#641D32]">
// //                 Kolhapuri Handloom Store
// //               </span>
// //               <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
// //                 {selectedCategory === "All"
// //                   ? "All Handloom Sarees"
// //                   : selectedCategory}{" "}
// //                 ({filteredProducts.length})
// //               </h1>
// //             </div>

// //             <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-[#E6E0D8] shadow-xs">
// //               <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
// //                 <button
// //                   onClick={() => setSelectedCategory("All")}
// //                   className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
// //                     selectedCategory === "All"
// //                       ? "bg-[#641D32] text-white shadow-xs"
// //                       : "text-[#292522] hover:bg-[#FAF7F0]"
// //                   }`}
// //                 >
// //                   All
// //                 </button>
// //                 {visibleCategories.map((c) => (
// //                   <button
// //                     key={c.id}
// //                     onClick={() => setSelectedCategory(c.name)}
// //                     className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
// //                       selectedCategory.toLowerCase() === c.name.toLowerCase()
// //                         ? "bg-[#641D32] text-white shadow-xs"
// //                         : "text-[#292522] hover:bg-[#FAF7F0]"
// //                     }`}
// //                   >
// //                     {c.name}
// //                   </button>
// //                 ))}
// //               </div>

// //               <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs">
// //                 <div className="flex items-center gap-1.5">
// //                   <span className="text-[#766B61] hidden sm:inline">
// //                     Fabric:
// //                   </span>
// //                   <select
// //                     value={selectedFabric}
// //                     onChange={(e) => setSelectedFabric(e.target.value)}
// //                     className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none"
// //                   >
// //                     <option value="All">All Fabrics</option>
// //                     <option value="Silk">Mulberry Silk</option>
// //                     <option value="Katan">Katan Silk</option>
// //                     <option value="Cotton">Handloom Cotton</option>
// //                     <option value="Georgette">Georgette</option>
// //                   </select>
// //                 </div>

// //                 <label className="flex items-center gap-1.5">
// //                   <span className="text-[#766B61] whitespace-nowrap">
// //                     Min price:
// //                   </span>
// //                   <span className="text-[#766B61]">₹</span>
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     step="100"
// //                     value={minimumPrice}
// //                     onChange={(e) => setMinimumPrice(e.target.value)}
// //                     placeholder="Any"
// //                     aria-label="Minimum price in rupees"
// //                     className="w-24 p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none"
// //                   />
// //                 </label>

// //                 <div className="flex items-center gap-1.5">
// //                   <span className="text-[#766B61] hidden sm:inline">Sort:</span>
// //                   <select
// //                     value={sortBy}
// //                     onChange={(e) => setSortBy(e.target.value as any)}
// //                     className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none"
// //                   >
// //                     <option value="newest">Newest Arrivals</option>
// //                     <option value="price-asc">Price: Low to High</option>
// //                     <option value="price-desc">Price: High to Low</option>
// //                     <option value="popularity">Most Popular</option>
// //                     <option value="discount">Highest Discount</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>

// //             {filteredProducts.length === 0 ? (
// //               <div className="bg-white rounded-xl border border-[#E6E0D8] p-12 text-center max-w-md mx-auto space-y-3">
// //                 <p className="text-sm font-semibold text-[#292522]">
// //                   No sarees matched your search or filters.
// //                 </p>
// //                 <p className="text-xs text-[#766B61]">
// //                   Try clearing your search terms or picking a different weave
// //                   category.
// //                 </p>
// //                 <button
// //                   onClick={() => {
// //                     setSelectedCategory("All");
// //                     setSelectedFabric("All");
// //                     setMinimumPrice("");
// //                     setSearchQuery("");
// //                   }}
// //                   className="px-4 py-2 bg-[#641D32] text-white text-xs font-semibold rounded hover:bg-[#4A1223]"
// //                 >
// //                   Reset Filters
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //                 {filteredProducts.map((p) => (
// //                   <ProductCard
// //                     key={p.id}
// //                     product={p}
// //                     onSelectProduct={handleSelectProduct}
// //                     onQuickView={(prod) => setQuickViewProduct(prod)}
// //                     onAddToCartSuccess={showToast}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* VIEW 3: PRODUCT DETAILS */}
// //         {currentView === "pdp" && selectedProduct && (
// //           <ProductDetailsPage
// //             product={selectedProduct}
// //             onBack={() => setCurrentView("catalog")}
// //             onSelectProduct={handleSelectProduct}
// //             onOpenCheckoutDirect={() => {
// //               setAppliedCheckoutCoupon(undefined);
// //               setIsCheckoutOpen(true);
// //             }}
// //             onAddToCartSuccess={showToast}
// //           />
// //         )}

// //         {/* VIEW 4: WISHLIST */}
// //         {currentView === "wishlist" && (
// //           <WishlistPage
// //             onBack={() => setCurrentView("catalog")}
// //             onSelectProduct={handleSelectProduct}
// //             onAddToCartSuccess={showToast}
// //           />
// //         )}

// //         {/* VIEW 5: CUSTOMER ORDERS */}
// //         {currentView === "orders" && (
// //           <CustomerOrdersPage
// //             onBack={() => setCurrentView("catalog")}
// //             onNavigateHome={() => setCurrentView("home")}
// //           />
// //         )}
// //       </main>

// //       <CartDrawer
// //         isOpen={isCartOpen}
// //         onClose={() => setIsCartOpen(false)}
// //         onProceedToCheckout={(coupon) => {
// //           setAppliedCheckoutCoupon(coupon);
// //           setIsCheckoutOpen(true);
// //         }}
// //       />

// //       <CheckoutModal
// //         isOpen={isCheckoutOpen}
// //         onClose={() => setIsCheckoutOpen(false)}
// //         couponCodeApplied={appliedCheckoutCoupon}
// //         onOrderSuccess={(order) => {
// //           showToast(`Order #${order.orderNumber} placed successfully!`);
// //           setCurrentView("orders");
// //         }}
// //       />

// //       <ProductQuickViewModal
// //         product={quickViewProduct}
// //         onClose={() => setQuickViewProduct(null)}
// //         onViewFullDetails={handleSelectProduct}
// //         onAddToCartSuccess={showToast}
// //       />

// //       <AuthModal
// //         isOpen={isAuthOpen}
// //         onClose={() => setIsAuthOpen(false)}
// //         onSuccess={(email) => {
// //           showToast(`Signed in successfully as ${email}`);
// //         }}
// //       />

// //       <Footer onNavigate={handleNavigate} />
// //     </div>
// //   );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import { Sparkles, ArrowRight } from "lucide-react";
// import { SareeProduct, CategoryItem, PromotionalOffer } from "./types/index.ts";
// import { storeService } from "./services/storeService.ts";
// import { AnnouncementBar } from "./components/AnnouncementBar.tsx";
// import { Header } from "./components/Header.tsx";
// import { Footer } from "./components/Footer.tsx";
// import { HeroCarousel } from "./components/HeroCarousel.tsx";
// import { CategoryCircles } from "./components/CategoryCircles.tsx";
// import { ProductCard } from "./components/ProductCard.tsx";
// import { ProductQuickViewModal } from "./components/ProductQuickViewModal.tsx";
// import { ProductDetailsPage } from "./components/ProductDetailsPage.tsx";
// import { CartDrawer } from "./components/CartDrawer.tsx";
// import { CheckoutModal } from "./components/CheckoutModal.tsx";
// import { CustomerOrdersPage } from "./components/CustomerOrdersPage.tsx";
// import { WishlistPage } from "./components/WishlistPage.tsx";
// import { AuthModal } from "./components/AuthModal.tsx";
// import { AdminPortal } from "./components/AdminPortal/AdminPortal.tsx";

// type View = "home" | "catalog" | "pdp" | "wishlist" | "orders" | "admin";

// export default function App() {
//   const [currentView, setCurrentView] = useState<View>("home");
//   const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(
//     null,
//   );
//   const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(
//     null,
//   );
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
//   const [isAuthOpen, setIsAuthOpen] = useState(false);
//   const [appliedCheckoutCoupon, setAppliedCheckoutCoupon] = useState<
//     string | undefined
//   >();
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // Catalog filters & search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [sortBy, setSortBy] = useState<
//     "newest" | "price-asc" | "price-desc" | "popularity" | "discount"
//   >("newest");
//   const [selectedFabric, setSelectedFabric] = useState<string>("All");
//   const [minimumPrice, setMinimumPrice] = useState("");

//   // Reactive data
//   const [products, setProducts] = useState<SareeProduct[]>(() =>
//     storeService.getProducts(),
//   );
//   const [categories, setCategories] = useState<CategoryItem[]>(() =>
//     storeService.getCategories(),
//   );
//   const [offers, setOffers] = useState<PromotionalOffer[]>(() =>
//     storeService.getOffers(true),
//   );

//   // Only categories the owner chose to show
//   const visibleCategories = categories.filter((c) => c.isActive !== false);

//   // Keep storefront in sync with Firestore loads and admin edits
//   useEffect(() => {
//     const update = () => {
//       setProducts(storeService.getProducts());
//       setCategories(storeService.getCategories());
//       setOffers(storeService.getOffers(true));
//       // Refresh the open product page (price / stock / photos may have changed)
//       setSelectedProduct((prev) =>
//         prev
//           ? (storeService.getAllProductsAdmin().find((p) => p.id === prev.id) ??
//             null)
//           : prev,
//       );
//     };
//     return storeService.subscribe(update);
//   }, []);

//   // If the product being viewed was deleted/unpublished, go back to the catalog
//   useEffect(() => {
//     if (
//       currentView === "pdp" &&
//       (!selectedProduct || !selectedProduct.isPublished)
//     ) {
//       setCurrentView("catalog");
//     }
//   }, [currentView, selectedProduct]);

//   // Open a product directly from a shared link: /?product=<slug>
//   useEffect(() => {
//     let cancelled = false;
//     storeService.ready.then(() => {
//       if (cancelled) return;
//       const slug = new URLSearchParams(window.location.search).get("product");
//       if (!slug) return;
//       const p = storeService.getProductBySlug(slug);
//       if (p && p.isPublished) {
//         setSelectedProduct(p);
//         setCurrentView("pdp");
//       }
//       window.history.replaceState({}, "", window.location.pathname);
//     });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (toastTimer.current) clearTimeout(toastTimer.current);
//     };
//   }, []);

//   const showToast = (msg: string) => {
//     setToastMessage(msg);
//     if (toastTimer.current) clearTimeout(toastTimer.current);
//     toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
//   };

//   const handleNavigate = (view: string, param?: string) => {
//     if (view === "catalog") {
//       if (param) setSelectedCategory(param);
//       setCurrentView("catalog");
//     } else if (view === "pdp" && param) {
//       const found = storeService.getProductBySlug(param);
//       if (found) setSelectedProduct(found);
//       setCurrentView("pdp");
//     } else {
//       setCurrentView(view as View);
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSelectProduct = (product: SareeProduct) => {
//     setSelectedProduct(product);
//     setCurrentView("pdp");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Filtered catalog products
//   const filteredProducts = storeService.getProducts({
//     category: selectedCategory === "All" ? undefined : selectedCategory,
//     fabric: selectedFabric === "All" ? undefined : selectedFabric,
//     minPrice: minimumPrice ? Number(minimumPrice) : undefined,
//     search: searchQuery || undefined,
//     sort: sortBy,
//   });

//   const trendingProducts = products.filter((p) => p.trending);
//   const newArrivalProducts = products.filter((p) => p.isNewArrival);

//   // Owner portal (AdminPortal itself also checks the admin role)
//   if (currentView === "admin") {
//     return <AdminPortal onExitToStore={() => setCurrentView("home")} />;
//   }

//   return (
//     // FIXED: was "overflow-x-hidden" (it created a scroll container and broke
//     // sticky header / normal page scroll). "overflow-x-clip" still prevents
//     // sideways scrolling without that side effect.
//     <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#292522] w-full max-w-full overflow-x-clip min-w-0">
//       {/* Toast Notification */}
//       {toastMessage && (
//         <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#292522] text-[#FAF7F0] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg shadow-xl border border-[#C7A66A]/40 text-xs font-semibold flex items-center gap-2 transition-all max-w-[calc(100vw-2rem)]">
//           <Sparkles className="w-4 h-4 text-[#C7A66A] shrink-0" />
//           <span className="truncate">{toastMessage}</span>
//         </div>
//       )}

//       <AnnouncementBar />

//       <Header
//         currentView={currentView}
//         onNavigate={handleNavigate}
//         onOpenCart={() => setIsCartOpen(true)}
//         onOpenAuth={() => setIsAuthOpen(true)}
//         searchQuery={searchQuery}
//         onSearchChange={(q) => {
//           setSearchQuery(q);
//           if (currentView !== "catalog") setCurrentView("catalog");
//         }}
//       />

//       <main className="flex-1 w-full max-w-full min-w-0">
//         {/* VIEW 1: HOME */}
//         {currentView === "home" && (
//           // CHANGED: was "space-y-12 sm:space-y-16" -> smaller gaps
//           <div className="space-y-6 sm:space-y-8">
//             <HeroCarousel onNavigate={handleNavigate} />

//             <section className="max-w-4xl mx-auto px-4 text-center space-y-3 pt-4">
//               <span className="text-xs font-bold tracking-widest uppercase text-[#641D32]">
//                 Woven in Kolhapur, Maharashtra
//               </span>
//               <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522]">
//                 Generations of Royal Handloom Artistry
//               </h2>
//               <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed max-w-2xl mx-auto">
//                 Kolhapuri Fashion Saree brings you genuine handloom Paithani,
//                 Kanjivaram, and Banarasi silks. Each saree is woven with pure
//                 mulberry yarn, authentic gold zari motifs, and timeless pride.
//               </p>
//               <div className="pt-2">
//                 <button
//                   onClick={() => handleNavigate("catalog")}
//                   className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
//                 >
//                   <span>Explore Our Kolhapur Workshop Collections</span>
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </section>

//             {/* Circular Saree Categories (hidden ones are not shown) */}
//             {/* CHANGED: wrapped in a div with negative top margin to pull it up */}
//             <div style={{ marginTop: "-2rem" }}>
//               <CategoryCircles
//                 categories={visibleCategories}
//                 selectedCategory={selectedCategory}
//                 onSelectCategory={(catName) => {
//                   setSelectedCategory(catName);
//                   setCurrentView("catalog");
//                   window.scrollTo({ top: 0, behavior: "smooth" });
//                 }}
//               />
//             </div>

//             {/* Active Festive Offers */}
//             {offers.length > 0 && (
//               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
//                 {offers.map((offer) => (
//                   <div
//                     key={offer.id}
//                     className="bg-[#641D32] text-white rounded-2xl overflow-hidden shadow-lg border border-[#7E2841] grid grid-cols-1 md:grid-cols-12 items-center"
//                   >
//                     <div className="md:col-span-5 aspect-[16/10] md:h-full bg-black/20 overflow-hidden">
//                       <img
//                         src={offer.imageUrl}
//                         alt={offer.title}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="md:col-span-7 p-5 sm:p-10 space-y-3 text-left">
//                       <span className="text-xs font-bold tracking-widest uppercase text-[#C7A66A]">
//                         Limited Festive Privilege · Valid Until{" "}
//                         {offer.validUntil}
//                       </span>
//                       <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#FAF7F0]">
//                         {offer.title}
//                       </h3>
//                       <p className="text-xs sm:text-sm text-[#FAF7F0]/85 leading-relaxed">
//                         {offer.description}
//                       </p>
//                       <div className="pt-2">
//                         <button
//                           onClick={() =>
//                             handleNavigate("catalog", "Wedding Sarees")
//                           }
//                           className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#C7A66A] hover:bg-[#DFCA9B] text-[#292522] font-semibold text-xs rounded-md shadow-md transition-colors inline-flex items-center gap-2"
//                         >
//                           <span>{offer.ctaText}</span>
//                           <ArrowRight className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </section>
//             )}

//             {/* Trending */}
//             {trendingProducts.length > 0 && (
//               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-baseline justify-between mb-6 sm:mb-8 pb-3 border-b border-[#E6E0D8]">
//                   <div>
//                     <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
//                       Most Loved
//                     </span>
//                     <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
//                       Trending Sarees
//                     </h3>
//                   </div>
//                   <button
//                     onClick={() => handleNavigate("catalog")}
//                     className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
//                   >
//                     <span>View All</span>
//                     <ArrowRight className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                   {trendingProducts.map((p) => (
//                     <ProductCard
//                       key={p.id}
//                       product={p}
//                       onSelectProduct={handleSelectProduct}
//                       onQuickView={(prod) => setQuickViewProduct(prod)}
//                       onAddToCartSuccess={showToast}
//                     />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* New Arrivals */}
//             {newArrivalProducts.length > 0 && (
//               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
//                 <div className="flex items-baseline justify-between mb-6 sm:mb-8 pb-3 border-b border-[#E6E0D8]">
//                   <div>
//                     <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
//                       Fresh Off The Loom
//                     </span>
//                     <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
//                       New Festive Arrivals
//                     </h3>
//                   </div>
//                   <button
//                     onClick={() => handleNavigate("catalog")}
//                     className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
//                   >
//                     <span>Explore New</span>
//                     <ArrowRight className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                   {newArrivalProducts.map((p) => (
//                     <ProductCard
//                       key={p.id}
//                       product={p}
//                       onSelectProduct={handleSelectProduct}
//                       onQuickView={(prod) => setQuickViewProduct(prod)}
//                       onAddToCartSuccess={showToast}
//                     />
//                   ))}
//                 </div>
//               </section>
//             )}
//           </div>
//         )}

//         {/* VIEW 2: FULL CATALOG */}
//         {currentView === "catalog" && (
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
//             <div className="pb-4 border-b border-[#E6E0D8]">
//               <span className="text-xs font-semibold uppercase tracking-wider text-[#641D32]">
//                 Kolhapuri Handloom Store
//               </span>
//               <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
//                 {selectedCategory === "All"
//                   ? "All Handloom Sarees"
//                   : selectedCategory}{" "}
//                 ({filteredProducts.length})
//               </h1>
//             </div>

//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-[#E6E0D8] shadow-xs">
//               <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto max-w-full overscroll-x-contain">
//                 <button
//                   onClick={() => setSelectedCategory("All")}
//                   className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
//                     selectedCategory === "All"
//                       ? "bg-[#641D32] text-white shadow-xs"
//                       : "text-[#292522] hover:bg-[#FAF7F0]"
//                   }`}
//                 >
//                   All
//                 </button>
//                 {visibleCategories.map((c) => (
//                   <button
//                     key={c.id}
//                     onClick={() => setSelectedCategory(c.name)}
//                     className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
//                       selectedCategory.toLowerCase() === c.name.toLowerCase()
//                         ? "bg-[#641D32] text-white shadow-xs"
//                         : "text-[#292522] hover:bg-[#FAF7F0]"
//                     }`}
//                   >
//                     {c.name}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs w-full lg:w-auto">
//                 <div className="flex items-center gap-1.5">
//                   <span className="text-[#766B61] hidden sm:inline">
//                     Fabric:
//                   </span>
//                   <select
//                     value={selectedFabric}
//                     onChange={(e) => setSelectedFabric(e.target.value)}
//                     className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
//                   >
//                     <option value="All">All Fabrics</option>
//                     <option value="Silk">Mulberry Silk</option>
//                     <option value="Katan">Katan Silk</option>
//                     <option value="Cotton">Handloom Cotton</option>
//                     <option value="Georgette">Georgette</option>
//                   </select>
//                 </div>

//                 <label className="flex items-center gap-1.5">
//                   <span className="text-[#766B61] whitespace-nowrap">Min:</span>
//                   <span className="text-[#766B61]">₹</span>
//                   <input
//                     type="number"
//                     min="0"
//                     step="100"
//                     value={minimumPrice}
//                     onChange={(e) => setMinimumPrice(e.target.value)}
//                     placeholder="Any"
//                     aria-label="Minimum price in rupees"
//                     className="w-20 sm:w-24 p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
//                   />
//                 </label>

//                 <div className="flex items-center gap-1.5">
//                   <span className="text-[#766B61] hidden sm:inline">Sort:</span>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value as any)}
//                     className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
//                   >
//                     <option value="newest">Newest Arrivals</option>
//                     <option value="price-asc">Price: Low to High</option>
//                     <option value="price-desc">Price: High to Low</option>
//                     <option value="popularity">Most Popular</option>
//                     <option value="discount">Highest Discount</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {filteredProducts.length === 0 ? (
//               <div className="bg-white rounded-xl border border-[#E6E0D8] p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
//                 <p className="text-sm font-semibold text-[#292522]">
//                   No sarees matched your search or filters.
//                 </p>
//                 <p className="text-xs text-[#766B61]">
//                   Try clearing your search terms or picking a different weave
//                   category.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSelectedCategory("All");
//                     setSelectedFabric("All");
//                     setMinimumPrice("");
//                     setSearchQuery("");
//                   }}
//                   className="px-4 py-2 bg-[#641D32] text-white text-xs font-semibold rounded hover:bg-[#4A1223]"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//                 {filteredProducts.map((p) => (
//                   <ProductCard
//                     key={p.id}
//                     product={p}
//                     onSelectProduct={handleSelectProduct}
//                     onQuickView={(prod) => setQuickViewProduct(prod)}
//                     onAddToCartSuccess={showToast}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* VIEW 3: PRODUCT DETAILS */}
//         {currentView === "pdp" && selectedProduct && (
//           <ProductDetailsPage
//             product={selectedProduct}
//             onBack={() => setCurrentView("catalog")}
//             onSelectProduct={handleSelectProduct}
//             onOpenCheckoutDirect={() => {
//               setAppliedCheckoutCoupon(undefined);
//               setIsCheckoutOpen(true);
//             }}
//             onAddToCartSuccess={showToast}
//           />
//         )}

//         {/* VIEW 4: WISHLIST */}
//         {currentView === "wishlist" && (
//           <WishlistPage
//             onBack={() => setCurrentView("catalog")}
//             onSelectProduct={handleSelectProduct}
//             onAddToCartSuccess={showToast}
//           />
//         )}

//         {/* VIEW 5: CUSTOMER ORDERS */}
//         {currentView === "orders" && (
//           <CustomerOrdersPage
//             onBack={() => setCurrentView("catalog")}
//             onNavigateHome={() => setCurrentView("home")}
//           />
//         )}
//       </main>

//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         onProceedToCheckout={(coupon) => {
//           setAppliedCheckoutCoupon(coupon);
//           setIsCheckoutOpen(true);
//         }}
//       />

//       <CheckoutModal
//         isOpen={isCheckoutOpen}
//         onClose={() => setIsCheckoutOpen(false)}
//         couponCodeApplied={appliedCheckoutCoupon}
//         onOrderSuccess={(order) => {
//           showToast(`Order #${order.orderNumber} placed successfully!`);
//           setCurrentView("orders");
//         }}
//       />

//       <ProductQuickViewModal
//         product={quickViewProduct}
//         onClose={() => setQuickViewProduct(null)}
//         onViewFullDetails={handleSelectProduct}
//         onAddToCartSuccess={showToast}
//       />

//       <AuthModal
//         isOpen={isAuthOpen}
//         onClose={() => setIsAuthOpen(false)}
//         onSuccess={(email) => {
//           showToast(`Signed in successfully as ${email}`);
//         }}
//       />

//       <Footer onNavigate={handleNavigate} />
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { SareeProduct, CategoryItem, PromotionalOffer } from "./types/index.ts";
import { storeService } from "./services/storeService.ts";
import { AnnouncementBar } from "./components/AnnouncementBar.tsx";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { HeroCarousel } from "./components/HeroCarousel.tsx";
import { CategoryCircles } from "./components/CategoryCircles.tsx";
import { ProductCard } from "./components/ProductCard.tsx";
import { ProductQuickViewModal } from "./components/ProductQuickViewModal.tsx";
import { ProductDetailsPage } from "./components/ProductDetailsPage.tsx";
import { CartDrawer } from "./components/CartDrawer.tsx";
import { CheckoutModal } from "./components/CheckoutModal.tsx";
import { CustomerOrdersPage } from "./components/CustomerOrdersPage.tsx";
import { WishlistPage } from "./components/WishlistPage.tsx";
import { AuthModal } from "./components/AuthModal.tsx";
import { AdminPortal } from "./components/AdminPortal/AdminPortal.tsx";
import PolicyPage from "./components/PolicyPages.tsx";

// CHANGED: added "privacy" | "shipping" | "exchange"
type View =
  | "home"
  | "catalog"
  | "pdp"
  | "wishlist"
  | "orders"
  | "admin"
  | "privacy"
  | "shipping"
  | "exchange";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(
    null,
  );
  const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(
    null,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [appliedCheckoutCoupon, setAppliedCheckoutCoupon] = useState<
    string | undefined
  >();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Catalog filters & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-asc" | "price-desc" | "popularity" | "discount"
  >("newest");
  const [selectedFabric, setSelectedFabric] = useState<string>("All");
  const [minimumPrice, setMinimumPrice] = useState("");

  // Reactive data
  const [products, setProducts] = useState<SareeProduct[]>(() =>
    storeService.getProducts(),
  );
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    storeService.getCategories(),
  );
  const [offers, setOffers] = useState<PromotionalOffer[]>(() =>
    storeService.getOffers(true),
  );

  // Only categories the owner chose to show
  const visibleCategories = categories.filter((c) => c.isActive !== false);

  // Keep storefront in sync with Firestore loads and admin edits
  useEffect(() => {
    const update = () => {
      setProducts(storeService.getProducts());
      setCategories(storeService.getCategories());
      setOffers(storeService.getOffers(true));
      // Refresh the open product page (price / stock / photos may have changed)
      setSelectedProduct((prev) =>
        prev
          ? (storeService.getAllProductsAdmin().find((p) => p.id === prev.id) ??
            null)
          : prev,
      );
    };
    return storeService.subscribe(update);
  }, []);

  // If the product being viewed was deleted/unpublished, go back to the catalog
  useEffect(() => {
    if (
      currentView === "pdp" &&
      (!selectedProduct || !selectedProduct.isPublished)
    ) {
      setCurrentView("catalog");
    }
  }, [currentView, selectedProduct]);

  // Open a product directly from a shared link: /?product=<slug>
  useEffect(() => {
    let cancelled = false;
    storeService.ready.then(() => {
      if (cancelled) return;
      const slug = new URLSearchParams(window.location.search).get("product");
      if (!slug) return;
      const p = storeService.getProductBySlug(slug);
      if (p && p.isPublished) {
        setSelectedProduct(p);
        setCurrentView("pdp");
      }
      window.history.replaceState({}, "", window.location.pathname);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  };

  // Handles "privacy" | "shipping" | "exchange" through the generic else branch
  const handleNavigate = (view: string, param?: string) => {
    if (view === "catalog") {
      if (param) setSelectedCategory(param);
      setCurrentView("catalog");
    } else if (view === "pdp" && param) {
      const found = storeService.getProductBySlug(param);
      if (found) setSelectedProduct(found);
      setCurrentView("pdp");
    } else {
      setCurrentView(view as View);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product: SareeProduct) => {
    setSelectedProduct(product);
    setCurrentView("pdp");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered catalog products
  const filteredProducts = storeService.getProducts({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    fabric: selectedFabric === "All" ? undefined : selectedFabric,
    minPrice: minimumPrice ? Number(minimumPrice) : undefined,
    search: searchQuery || undefined,
    sort: sortBy,
  });

  const trendingProducts = products.filter((p) => p.trending);
  const newArrivalProducts = products.filter((p) => p.isNewArrival);

  // Owner portal (AdminPortal itself also checks the admin role)
  if (currentView === "admin") {
    return <AdminPortal onExitToStore={() => setCurrentView("home")} />;
  }

  return (
    // <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#292522] w-full max-w-full overflow-x-clip min-w-0">
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#292522] w-full min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#292522] text-[#FAF7F0] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg shadow-xl border border-[#C7A66A]/40 text-xs font-semibold flex items-center gap-2 transition-all max-w-[calc(100vw-2rem)]">
          <Sparkles className="w-4 h-4 text-[#C7A66A] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      <AnnouncementBar />

      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== "catalog") setCurrentView("catalog");
        }}
      />

      <main className="flex-1 w-full max-w-full min-w-0">
        {/* VIEW 1: HOME */}
        {currentView === "home" && (
          <div className="space-y-6 sm:space-y-8">
            <HeroCarousel onNavigate={handleNavigate} />

            <section className="max-w-4xl mx-auto px-4 text-center space-y-3 pt-4">
              <span className="text-xs font-bold tracking-widest uppercase text-[#641D32]">
                Woven in Kolhapur, Maharashtra
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522]">
                Generations of Royal Handloom Artistry
              </h2>
              <p className="text-xs sm:text-sm text-[#766B61] leading-relaxed max-w-2xl mx-auto">
                Kolhapuri Fashion Saree brings you genuine handloom Paithani,
                Kanjivaram, and Banarasi silks. Each saree is woven with pure
                mulberry yarn, authentic gold zari motifs, and timeless pride.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleNavigate("catalog")}
                  className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Our Kolhapur Workshop Collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Circular Saree Categories (hidden ones are not shown) */}
            <div style={{ marginTop: "-2rem" }}>
              <CategoryCircles
                categories={visibleCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catName) => {
                  setSelectedCategory(catName);
                  setCurrentView("catalog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>

            {/* Active Festive Offers */}
            {offers.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-[#641D32] text-white rounded-2xl overflow-hidden shadow-lg border border-[#7E2841] grid grid-cols-1 md:grid-cols-12 items-center"
                  >
                    <div className="md:col-span-5 aspect-[16/10] md:h-full bg-black/20 overflow-hidden">
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-7 p-5 sm:p-10 space-y-3 text-left">
                      <span className="text-xs font-bold tracking-widest uppercase text-[#C7A66A]">
                        Limited Festive Privilege · Valid Until{" "}
                        {offer.validUntil}
                      </span>
                      <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#FAF7F0]">
                        {offer.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#FAF7F0]/85 leading-relaxed">
                        {offer.description}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() =>
                            handleNavigate("catalog", "Wedding Sarees")
                          }
                          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#C7A66A] hover:bg-[#DFCA9B] text-[#292522] font-semibold text-xs rounded-md shadow-md transition-colors inline-flex items-center gap-2"
                        >
                          <span>{offer.ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Trending */}
            {trendingProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between mb-6 sm:mb-8 pb-3 border-b border-[#E6E0D8]">
                  <div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
                      Most Loved
                    </span>
                    <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
                      Trending Sarees
                    </h3>
                  </div>
                  <button
                    onClick={() => handleNavigate("catalog")}
                    className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {trendingProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelectProduct={handleSelectProduct}
                      onQuickView={(prod) => setQuickViewProduct(prod)}
                      onAddToCartSuccess={showToast}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* New Arrivals */}
            {newArrivalProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="flex items-baseline justify-between mb-6 sm:mb-8 pb-3 border-b border-[#E6E0D8]">
                  <div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
                      Fresh Off The Loom
                    </span>
                    <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
                      New Festive Arrivals
                    </h3>
                  </div>
                  <button
                    onClick={() => handleNavigate("catalog")}
                    className="text-xs font-semibold text-[#641D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore New</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {newArrivalProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelectProduct={handleSelectProduct}
                      onQuickView={(prod) => setQuickViewProduct(prod)}
                      onAddToCartSuccess={showToast}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* VIEW 2: FULL CATALOG */}
        {currentView === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            <div className="pb-4 border-b border-[#E6E0D8]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#641D32]">
                Kolhapuri Handloom Store
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-0.5">
                {selectedCategory === "All"
                  ? "All Handloom Sarees"
                  : selectedCategory}{" "}
                ({filteredProducts.length})
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-[#E6E0D8] shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto max-w-full overscroll-x-contain">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === "All"
                      ? "bg-[#641D32] text-white shadow-xs"
                      : "text-[#292522] hover:bg-[#FAF7F0]"
                  }`}
                >
                  All
                </button>
                {visibleCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? "bg-[#641D32] text-white shadow-xs"
                        : "text-[#292522] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs w-full lg:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#766B61] hidden sm:inline">
                    Fabric:
                  </span>
                  <select
                    value={selectedFabric}
                    onChange={(e) => setSelectedFabric(e.target.value)}
                    className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
                  >
                    <option value="All">All Fabrics</option>
                    <option value="Silk">Mulberry Silk</option>
                    <option value="Katan">Katan Silk</option>
                    <option value="Cotton">Handloom Cotton</option>
                    <option value="Georgette">Georgette</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5">
                  <span className="text-[#766B61] whitespace-nowrap">Min:</span>
                  <span className="text-[#766B61]">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={minimumPrice}
                    onChange={(e) => setMinimumPrice(e.target.value)}
                    placeholder="Any"
                    aria-label="Minimum price in rupees"
                    className="w-20 sm:w-24 p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
                  />
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#766B61] hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded font-medium text-[#292522] focus:outline-none text-xs"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E6E0D8] p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
                <p className="text-sm font-semibold text-[#292522]">
                  No sarees matched your search or filters.
                </p>
                <p className="text-xs text-[#766B61]">
                  Try clearing your search terms or picking a different weave
                  category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedFabric("All");
                    setMinimumPrice("");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-[#641D32] text-white text-xs font-semibold rounded hover:bg-[#4A1223]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={handleSelectProduct}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                    onAddToCartSuccess={showToast}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAILS */}
        {currentView === "pdp" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setCurrentView("catalog")}
            onSelectProduct={handleSelectProduct}
            onOpenCheckoutDirect={() => {
              setAppliedCheckoutCoupon(undefined);
              setIsCheckoutOpen(true);
            }}
            onAddToCartSuccess={showToast}
          />
        )}

        {/* VIEW 4: WISHLIST */}
        {currentView === "wishlist" && (
          <WishlistPage
            onBack={() => setCurrentView("catalog")}
            onSelectProduct={handleSelectProduct}
            onAddToCartSuccess={showToast}
          />
        )}

        {/* VIEW 5: CUSTOMER ORDERS */}
        {currentView === "orders" && (
          <CustomerOrdersPage
            onBack={() => setCurrentView("catalog")}
            onNavigateHome={() => setCurrentView("home")}
          />
        )}

        {/* VIEW 6: POLICY PAGES (NEW) */}
        {(currentView === "privacy" ||
          currentView === "shipping" ||
          currentView === "exchange") && (
          <PolicyPage type={currentView} onNavigate={handleNavigate} />
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={(coupon) => {
          setAppliedCheckoutCoupon(coupon);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        couponCodeApplied={appliedCheckoutCoupon}
        onOrderSuccess={(order) => {
          showToast(`Order #${order.orderNumber} placed successfully!`);
          setCurrentView("orders");
        }}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleSelectProduct}
        onAddToCartSuccess={showToast}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => {
          showToast(`Signed in successfully as ${email}`);
        }}
      />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
