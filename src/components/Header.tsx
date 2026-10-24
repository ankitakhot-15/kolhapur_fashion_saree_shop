// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Heart, 
//   ShoppingBag, 
//   User, 
//   Menu, 
//   X, 
//   ShieldCheck, 
//   LogOut 
// } from 'lucide-react';
// import { storeService } from '../services/storeService.ts';
// import { UserSession } from '../types/index.ts';

// interface HeaderProps {
//   currentView: string;
//   onNavigate: (view: string, param?: string) => void;
//   onOpenCart: () => void;
//   onOpenAuth: () => void;
//   searchQuery: string;
//   onSearchChange: (q: string) => void;
// }

// export const Header: React.FC<HeaderProps> = ({
//   currentView,
//   onNavigate,
//   onOpenCart,
//   onOpenAuth,
//   searchQuery,
//   onSearchChange
// }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [userSession, setUserSession] = useState<UserSession | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showSearchInput, setShowSearchInput] = useState(false);

//   useEffect(() => {
//     const update = () => {
//       const cart = storeService.getCart();
//       const count = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setCartCount(count);

//       const wishlist = storeService.getWishlist();
//       setWishlistCount(wishlist.length);

//       setUserSession(storeService.getSession());
//     };

//     update();
//     return storeService.subscribe(update);
//   }, []);

//   const handleLogout = () => {
//     storeService.setSession(null);
//   };

//   return (
//     <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E6E0D8]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          
//           {/* Zone 1: Single line brand wordmark */}
//           <div className="flex items-center gap-3 shrink-0">
//             <button 
//               onClick={() => onNavigate('home')} 
//               className="text-left group flex items-center gap-2.5 focus-visible:outline-none"
//             >
//               <div className="w-9 h-9 rounded-full bg-[#641D32] flex items-center justify-center text-[#C7A66A] font-serif font-bold text-lg shadow-sm border border-[#C7A66A]/30">
//                 K
//               </div>
//               <div>
//                 <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#641D32] font-serif whitespace-nowrap block leading-tight">
//                   Kolhapuri Fashion Saree
//                 </span>
//                 <span className="text-[10px] tracking-widest uppercase text-[#766B61] block font-sans">
//                   Authentic Handloom Heritage
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Zone 2: Primary navigation links */}
//           <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#292522]">
//             <button
//               onClick={() => onNavigate('home')}
//               className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
//                 currentView === 'home' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
//               }`}
//             >
//               Home
//             </button>
//             <button
//               onClick={() => onNavigate('catalog')}
//               className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
//                 currentView === 'catalog' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
//               }`}
//             >
//               Shop All
//             </button>
//             <button
//               onClick={() => onNavigate('catalog', 'Paithani Sarees')}
//               className="hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0"
//             >
//               Paithani Silks
//             </button>
//             <button
//               onClick={() => onNavigate('catalog', 'Wedding Sarees')}
//               className="hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0"
//             >
//               Bridal Weaves
//             </button>
//             <button
//               onClick={() => onNavigate('orders')}
//               className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
//                 currentView === 'orders' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
//               }`}
//             >
//               Track Order
//             </button>
//           </nav>

//           {/* Zone 3: Search, Actions, Wishlist, Cart & Profile */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//             {/* Live Search input */}
//             <div className="relative hidden md:block w-44 lg:w-56">
//               <input
//                 type="text"
//                 placeholder="Search sarees, silks..."
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 onFocus={() => {
//                   if (currentView !== 'catalog') onNavigate('catalog');
//                 }}
//                 className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/80 border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32] text-[#292522] placeholder:text-[#766B61]"
//               />
//               <Search className="w-3.5 h-3.5 text-[#766B61] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//             </div>

//             {/* Mobile Search Button */}
//             <button
//               onClick={() => {
//                 setShowSearchInput(!showSearchInput);
//                 if (currentView !== 'catalog') onNavigate('catalog');
//               }}
//               className="p-2 md:hidden text-[#292522] hover:text-[#641D32] transition-colors"
//               aria-label="Search"
//             >
//               <Search className="w-5 h-5" />
//             </button>

//             {/* Wishlist */}
//             <button
//               onClick={() => onNavigate('wishlist')}
//               className="relative p-2 text-[#292522] hover:text-[#641D32] transition-colors rounded-full focus-visible:outline-none"
//               aria-label={`Wishlist, ${wishlistCount} items`}
//             >
//               <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#641D32] text-[#641D32]' : ''}`} />
//               {wishlistCount > 0 && (
//                 <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#641D32] text-[#FAF7F0] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
//                   {wishlistCount}
//                 </span>
//               )}
//             </button>

//             {/* Shopping Bag / Cart */}
//             <button
//               onClick={onOpenCart}
//               className="relative p-2 text-[#292522] hover:text-[#641D32] transition-colors rounded-full focus-visible:outline-none"
//               aria-label={`Shopping Cart, ${cartCount} items`}
//             >
//               <ShoppingBag className="w-5 h-5" />
//               {cartCount > 0 && (
//                 <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C7A66A] text-[#292522] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             {/* User Account / Profile */}
//             {userSession ? (
//               <div className="flex items-center gap-1.5">
//                 <button
//                   onClick={() => onNavigate('orders')}
//                   className="hidden sm:flex items-center gap-1.5 text-xs text-[#292522] hover:text-[#641D32] px-2 py-1.5 rounded"
//                   title={userSession.email}
//                 >
//                   <User className="w-4 h-4 text-[#641D32]" />
//                   <span className="max-w-[80px] truncate">{userSession.email.split('@')[0]}</span>
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="p-1.5 text-[#766B61] hover:text-[#641D32] transition-colors"
//                   title="Logout"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={onOpenAuth}
//                 className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#292522] border border-[#E6E0D8] rounded-md hover:bg-white hover:border-[#641D32] transition-colors whitespace-nowrap shrink-0"
//               >
//                 <User className="w-3.5 h-3.5 text-[#641D32]" />
//                 <span>Sign In</span>
//               </button>
//             )}

//             {/* Admin Switcher */}
//             <button
//               onClick={() => onNavigate('admin')}
//               className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#FAF7F0] bg-[#641D32] rounded-md hover:bg-[#4A1223] transition-colors whitespace-nowrap shrink-0 shadow-sm"
//               title="Access Boutique Owner Admin Portal"
//             >
//               <ShieldCheck className="w-3.5 h-3.5 text-[#C7A66A]" />
//               <span className="hidden sm:inline">Admin Portal</span>
//             </button>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 lg:hidden text-[#292522] hover:text-[#641D32]"
//               aria-label="Toggle Navigation Menu"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search Input Row */}
//         {showSearchInput && (
//           <div className="py-2.5 px-1 md:hidden border-t border-[#E6E0D8]">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search sarees, silks, occasions..."
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                 autoFocus
//               />
//               <Search className="w-4 h-4 text-[#766B61] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//             </div>
//           </div>
//         )}

//         {/* Mobile Navigation Dropdown */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden border-t border-[#E6E0D8] py-4 space-y-2 bg-[#FAF7F0]">
//             <button
//               onClick={() => {
//                 onNavigate('home');
//                 setMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => {
//                 onNavigate('catalog');
//                 setMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
//             >
//               Shop All Sarees
//             </button>
//             <button
//               onClick={() => {
//                 onNavigate('catalog', 'Paithani Sarees');
//                 setMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
//             >
//               Paithani Silks
//             </button>
//             <button
//               onClick={() => {
//                 onNavigate('catalog', 'Wedding Sarees');
//                 setMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
//             >
//               Bridal Weaves
//             </button>
//             <button
//               onClick={() => {
//                 onNavigate('orders');
//                 setMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
//             >
//               My Orders & Tracking
//             </button>
//             {!userSession && (
//               <button
//                 onClick={() => {
//                   onOpenAuth();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="block w-full text-left px-3 py-2 text-sm font-medium text-[#641D32] hover:bg-white rounded"
//               >
//                 Sign In with Email OTP
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { storeService } from '../services/storeService.ts';
import { UserSession } from '../types/index.ts';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth,
  searchQuery,
  onSearchChange
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const update = () => {
      const cart = storeService.getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);

      const wishlist = storeService.getWishlist();
      setWishlistCount(wishlist.length);

      setUserSession(storeService.getSession());
    };

    update();
    return storeService.subscribe(update);
  }, []);

  const handleLogout = () => {
    storeService.setSession(null);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E6E0D8] w-full max-w-full">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 xl:gap-6">

          {/* Zone 1: Brand wordmark (can shrink so it never pushes buttons off screen) */}
          <div className="flex items-center gap-3 min-w-0 shrink">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group flex items-center gap-2.5 focus-visible:outline-none min-w-0"
            >
              <div className="w-9 h-9 rounded-full bg-[#641D32] flex items-center justify-center text-[#C7A66A] font-serif font-bold text-lg shadow-sm border border-[#C7A66A]/30 shrink-0">
                K
              </div>
              <div className="min-w-0">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#641D32] font-serif whitespace-nowrap truncate block leading-tight">
                  Kolhapuri Fashion Saree
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#766B61] block font-sans truncate">
                  Authentic Handloom Heritage
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Primary navigation links (desktop XL and up) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-7 text-sm font-medium text-[#292522]">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'catalog' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => onNavigate('catalog', 'Paithani Sarees')}
              className="hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0"
            >
              Paithani Silks
            </button>
            <button
              onClick={() => onNavigate('catalog', 'Wedding Sarees')}
              className="hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0"
            >
              Bridal Weaves
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className={`hover:text-[#641D32] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'orders' ? 'text-[#641D32] font-semibold border-b-2 border-[#641D32] pb-0.5' : ''
              }`}
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: Search, Actions, Wishlist, Cart & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Live Search input (only on very wide screens) */}
            <div className="relative hidden 2xl:block w-44">
              <input
                type="text"
                placeholder="Search sarees, silks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => {
                  if (currentView !== 'catalog') onNavigate('catalog');
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/80 border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32] text-[#292522] placeholder:text-[#766B61]"
              />
              <Search className="w-3.5 h-3.5 text-[#766B61] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search icon button (everywhere below 2XL) */}
            <button
              onClick={() => {
                setShowSearchInput(!showSearchInput);
                if (currentView !== 'catalog') onNavigate('catalog');
              }}
              className="p-2 2xl:hidden text-[#292522] hover:text-[#641D32] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-[#292522] hover:text-[#641D32] transition-colors rounded-full focus-visible:outline-none"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#641D32] text-[#641D32]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#641D32] text-[#FAF7F0] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#292522] hover:text-[#641D32] transition-colors rounded-full focus-visible:outline-none"
              aria-label={`Shopping Cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C7A66A] text-[#292522] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {userSession ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate('orders')}
                  className="hidden 2xl:flex items-center gap-1.5 text-xs text-[#292522] hover:text-[#641D32] px-2 py-1.5 rounded"
                  title={userSession.email}
                >
                  <User className="w-4 h-4 text-[#641D32]" />
                  <span className="max-w-[80px] truncate">{userSession.email.split('@')[0]}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#766B61] hover:text-[#641D32] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#292522] border border-[#E6E0D8] rounded-md hover:bg-white hover:border-[#641D32] transition-colors whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#641D32]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Admin Switcher (icon only below 2XL) */}
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#FAF7F0] bg-[#641D32] rounded-md hover:bg-[#4A1223] transition-colors whitespace-nowrap shrink-0 shadow-sm"
              title="Access Boutique Owner Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C7A66A]" />
              <span className="hidden 2xl:inline">Admin Portal</span>
            </button>

            {/* Mobile / tablet menu button (below XL) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden text-[#292522] hover:text-[#641D32]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Input Row (below 2XL) */}
        {showSearchInput && (
          <div className="py-2.5 px-1 2xl:hidden border-t border-[#E6E0D8]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sarees, silks, occasions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#766B61] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Navigation Dropdown (below XL) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E6E0D8] py-4 space-y-2 bg-[#FAF7F0]">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
            >
              Shop All Sarees
            </button>
            <button
              onClick={() => {
                onNavigate('catalog', 'Paithani Sarees');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
            >
              Paithani Silks
            </button>
            <button
              onClick={() => {
                onNavigate('catalog', 'Wedding Sarees');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
            >
              Bridal Weaves
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#292522] hover:bg-white rounded"
            >
              My Orders & Tracking
            </button>
            {!userSession && (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-[#641D32] hover:bg-white rounded"
              >
                Sign In with Email OTP
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};