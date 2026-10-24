// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   ArrowRight,
//   BadgeCheck,
//   Truck,
//   Store,
//   MapPin,
// } from "lucide-react";
// import { storeService } from "../services/storeService.ts";
// import { PromotionalBanner } from "../types/index.ts";

// interface HeroCarouselProps {
//   onNavigate: (view: string, param?: string) => void;
// }

// // Editable static text (not stored in banners)
// const FLAGSHIP_LABEL = "Flagship Store";
// const STORE_NAME = "Kolhapuri Fashion Saree";
// const STORE_LOCATION = "Kolhapur, Maharashtra";
// const AUTOPLAY_MS = 6000;
// const TRUST_POINTS = [
//   { icon: BadgeCheck, label: "Pure Handloom" },
//   { icon: Truck, label: "All-India & Global Shipping" },
// ];

// export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
//   const [banners, setBanners] = useState<PromotionalBanner[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [reduceMotion, setReduceMotion] = useState(false);
//   const touchStartX = useRef<number | null>(null);

//   useEffect(() => {
//     const update = () => setBanners(storeService.getBanners(true));
//     update();
//     return storeService.subscribe(update);
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined" || !window.matchMedia) return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduceMotion(mq.matches);
//     const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
//     mq.addEventListener?.("change", handler);
//     return () => mq.removeEventListener?.("change", handler);
//   }, []);

//   const autoplay = banners.length > 1 && !isPaused && !reduceMotion;

//   useEffect(() => {
//     if (!autoplay) return;
//     const t = setTimeout(() => {
//       setCurrentIndex((prev) => (prev + 1) % banners.length);
//     }, AUTOPLAY_MS);
//     return () => clearTimeout(t);
//   }, [autoplay, currentIndex, banners.length]);

//   const goPrev = useCallback(
//     () => setCurrentIndex((p) => (p - 1 + banners.length) % banners.length),
//     [banners.length],
//   );
//   const goNext = useCallback(
//     () => setCurrentIndex((p) => (p + 1) % banners.length),
//     [banners.length],
//   );

//   if (banners.length === 0) return null;

//   // Safety: if banners were removed in admin, never point past the end
//   const activeIndex = currentIndex < banners.length ? currentIndex : 0;

//   const handleCtaClick = (banner: PromotionalBanner) => {
//     if (banner.ctaLink && banner.ctaLink.includes("category=")) {
//       const match = banner.ctaLink.match(/category=([^&]+)/);
//       if (match) {
//         onNavigate("catalog", decodeURIComponent(match[1]));
//         return;
//       }
//     }
//     onNavigate("catalog");
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//   };
//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null || banners.length <= 1) return;
//     const diff = e.changedTouches[0].clientX - touchStartX.current;
//     if (Math.abs(diff) > 50) {
//       if (diff < 0) goNext();
//       else goPrev();
//     }
//     touchStartX.current = null;
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (banners.length <= 1) return;
//     if (e.key === "ArrowLeft") goPrev();
//     if (e.key === "ArrowRight") goNext();
//   };

//   const pad = (n: number) => String(n).padStart(2, "0");

//   return (
//     <section
//       className="relative w-full overflow-hidden bg-ivory text-charcoal border-b-2 border-gold/60"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//       onFocus={() => setIsPaused(true)}
//       onBlur={() => setIsPaused(false)}
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//       onKeyDown={handleKeyDown}
//       role="region"
//       aria-roledescription="carousel"
//       aria-label="Promotional Hero Banners"
//     >
//       <style>{`
//         @keyframes heroProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
//         @keyframes heroRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes heroPop { from { opacity: 0; transform: scale(.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
//         .hero-rise > * { opacity: 0; animation: heroRise .8s cubic-bezier(.2,.7,.2,1) forwards; }
//         .hero-rise > *:nth-child(1) { animation-delay: .05s; }
//         .hero-rise > *:nth-child(2) { animation-delay: .15s; }
//         .hero-rise > *:nth-child(3) { animation-delay: .25s; }
//         .hero-rise > *:nth-child(4) { animation-delay: .35s; }
//         .hero-rise > *:nth-child(5) { animation-delay: .45s; }
//         .hero-pop { opacity: 0; animation: heroPop .9s cubic-bezier(.2,.7,.2,1) .1s forwards; }
//         @media (prefers-reduced-motion: reduce) {
//           .hero-rise > *, .hero-pop { animation: none; opacity: 1; }
//         }
//       `}</style>

//       {/* Slides stacked in one grid cell so height adapts to content */}
//       <div className="grid">
//         {banners.map((banner, idx) => {
//           const isActive = idx === activeIndex;
//           return (
//             <div
//               key={banner.id ?? idx}
//               className={`relative col-start-1 row-start-1 w-full min-w-0 transition-opacity duration-1000 ease-in-out ${
//                 isActive
//                   ? "opacity-100 z-10"
//                   : "opacity-0 z-0 pointer-events-none"
//               }`}
//               aria-hidden={!isActive}
//               role="group"
//               aria-roledescription="slide"
//               aria-label={`${idx + 1} of ${banners.length}`}
//             >
//               {/* ---------- Background: soft light wash ---------- */}
//               <div
//                 aria-hidden="true"
//                 className="absolute inset-0 overflow-hidden"
//               >
//                 <img
//                   src={banner.imageUrl}
//                   alt=""
//                   referrerPolicy="no-referrer"
//                   className="absolute inset-0 h-full w-full object-cover object-center scale-125 blur-3xl opacity-25"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-b from-ivory/70 via-ivory/85 to-ivory lg:bg-linear-to-r lg:from-ivory lg:via-ivory/90 lg:to-ivory/60" />
//                 <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
//                 <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-maroon/10 blur-3xl" />
//               </div>

//               {/* ---------- Content ---------- */}
//               <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-28 sm:pt-12 sm:pb-32 lg:pt-16 lg:pb-28 lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
//                 {/* IMAGE: top on mobile, right on desktop. Full image, never cropped */}
//                 <div className="min-w-0 lg:col-span-5 lg:order-last flex flex-col items-center">
//                   <div
//                     key={isActive ? `img-${activeIndex}` : `img-idle-${idx}`}
//                     className={`relative isolate inline-block ${
//                       isActive ? "hero-pop" : ""
//                     }`}
//                   >
//                     {/* Outer dark border + inner gold line (like the reference) */}
//                     <div className="relative rounded-2xl sm:rounded-3xl p-[3px] bg-charcoal shadow-2xl shadow-charcoal/30">
//                       <div className="relative overflow-hidden rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] ring-1 ring-gold/80">
//                         <img
//                           src={banner.imageUrl}
//                           alt={banner.heading}
//                           referrerPolicy="no-referrer"
//                           loading={idx === 0 ? "eager" : "lazy"}
//                           decoding="async"
//                           className="block h-auto w-auto max-w-full max-h-[340px] sm:max-h-[440px] lg:max-h-[520px] object-contain"
//                         />

//                         {/* Bottom caption on image */}
//                         <div className="absolute inset-x-0 bottom-0 px-4 pt-14 pb-3 bg-linear-to-t from-black/85 via-black/50 to-transparent">
//                           <p className="text-sm sm:text-lg font-serif font-bold text-white leading-tight">
//                             {STORE_NAME}
//                           </p>
//                           <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white/85">
//                             <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
//                             {STORE_LOCATION}
//                           </p>
//                         </div>

//                         {/* Flagship label */}
//                         <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-gold/60 text-gold-light text-[11px] sm:text-xs font-semibold tracking-wide">
//                           <Store className="w-3.5 h-3.5 text-gold" />
//                           {FLAGSHIP_LABEL}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* TEXT */}
//                 <div
//                   key={isActive ? `txt-${activeIndex}` : `txt-idle-${idx}`}
//                   className={`min-w-0 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 ${
//                     isActive ? "hero-rise" : ""
//                   }`}
//                 >
//                   {banner.badgeText ? (
//                     <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gold text-maroon text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
//                       <Sparkles className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
//                       {banner.badgeText}
//                     </span>
//                   ) : (
//                     <span className="hidden" />
//                   )}

//                   {isActive ? (
//                     <h1
//                       className="font-serif font-bold tracking-tight text-charcoal leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
//                       style={{ textWrap: "balance" }}
//                     >
//                       {banner.heading}
//                     </h1>
//                   ) : (
//                     <p
//                       className="font-serif font-bold tracking-tight text-charcoal leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
//                       style={{ textWrap: "balance" }}
//                     >
//                       {banner.heading}
//                     </p>
//                   )}

//                   <p className="text-sm sm:text-base lg:text-lg text-muted leading-relaxed max-w-xl">
//                     {banner.subtitle}
//                   </p>

//                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
//                     {TRUST_POINTS.map(({ icon: Icon, label }) => (
//                       <span
//                         key={label}
//                         className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-white border border-border-subtle text-xs sm:text-sm font-medium text-charcoal shadow-sm"
//                       >
//                         <Icon className="w-4 h-4 text-maroon shrink-0" />
//                         {label}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="w-full sm:w-auto pt-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
//                     <button
//                       onClick={() => handleCtaClick(banner)}
//                       tabIndex={isActive ? 0 : -1}
//                       className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-maroon text-ivory hover:bg-maroon-light text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-maroon/25 transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap"
//                     >
//                       <span>{banner.ctaText}</span>
//                       <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                     </button>

//                     <button
//                       onClick={() => onNavigate("catalog")}
//                       tabIndex={isActive ? 0 : -1}
//                       className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-ivory text-charcoal text-sm sm:text-base font-medium rounded-xl border border-gold hover:border-gold-dark transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap"
//                     >
//                       <span>Explore All Sarees</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ---------- Controls (overlay at the bottom) ---------- */}
//       {banners.length > 1 && (
//         <div className="absolute z-20 bottom-5 sm:bottom-8 left-0 right-0">
//           <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
//             <div
//               className="flex items-center gap-2"
//               role="tablist"
//               aria-label="Choose banner"
//             >
//               {banners.map((_, idx) => {
//                 const isActive = idx === activeIndex;
//                 return (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentIndex(idx)}
//                     role="tab"
//                     aria-selected={isActive}
//                     aria-label={`Go to slide ${idx + 1}`}
//                     className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
//                       isActive
//                         ? "w-12 bg-charcoal/15"
//                         : "w-3 bg-charcoal/25 hover:bg-charcoal/50"
//                     }`}
//                   >
//                     {isActive && (
//                       <span
//                         key={`p-${activeIndex}`}
//                         className="absolute inset-0 origin-left bg-maroon"
//                         style={
//                           reduceMotion
//                             ? { transform: "scaleX(1)" }
//                             : {
//                                 animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
//                                 animationPlayState: isPaused
//                                   ? "paused"
//                                   : "running",
//                               }
//                         }
//                       />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="text-xs font-medium tracking-widest text-muted tabular-nums">
//                 <span className="text-maroon text-sm font-semibold">
//                   {pad(activeIndex + 1)}
//                 </span>
//                 <span className="mx-1.5 text-charcoal/30">/</span>
//                 <span>{pad(banners.length)}</span>
//               </div>
//               <button
//                 onClick={goPrev}
//                 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-maroon hover:text-ivory text-charcoal flex items-center justify-center border border-border-subtle shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
//                 aria-label="Previous banner"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={goNext}
//                 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-maroon hover:text-ivory text-charcoal flex items-center justify-center border border-border-subtle shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
//                 aria-label="Next banner"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Truck,
  Store,
  MapPin,
} from "lucide-react";
import { storeService } from "../services/storeService.ts";
import { PromotionalBanner } from "../types/index.ts";

interface HeroCarouselProps {
  onNavigate: (view: string, param?: string) => void;
}

// Editable static text (not stored in banners)
const FLAGSHIP_LABEL = "Flagship Store";
const STORE_NAME = "Kolhapuri Fashion Saree";
const STORE_LOCATION = "Kolhapur, Maharashtra";
const AUTOPLAY_MS = 6000;
const TRUST_POINTS = [
  { icon: BadgeCheck, label: "Pure Handloom" },
  { icon: Truck, label: "All-India & Global Shipping" },
];

// Old data may still contain the dev-only path "/src/assets/images/...".
// In production those files are served from "/images/...", so convert on the fly.
const fixSrc = (url?: string) =>
  url && url.startsWith("/src/assets/images/")
    ? url.replace("/src/assets/images/", "/images/")
    : url || "";

// Shown if a picture fails to load, so the card never collapses
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect width='600' height='800' fill='#641D32'/><text x='300' y='400' text-anchor='middle' fill='#C7A66A' font-size='34' font-family='Georgia, serif'>Kolhapuri Fashion Saree</text></svg>",
  );

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_IMAGE;
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setBanners(storeService.getBanners(true));
    update();
    return storeService.subscribe(update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const autoplay = banners.length > 1 && !isPaused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplay, currentIndex, banners.length]);

  const goPrev = useCallback(
    () => setCurrentIndex((p) => (p - 1 + banners.length) % banners.length),
    [banners.length],
  );
  const goNext = useCallback(
    () => setCurrentIndex((p) => (p + 1) % banners.length),
    [banners.length],
  );

  if (banners.length === 0) return null;

  // Safety: if banners were removed in admin, never point past the end
  const activeIndex = currentIndex < banners.length ? currentIndex : 0;

  const handleCtaClick = (banner: PromotionalBanner) => {
    if (banner.ctaLink && banner.ctaLink.includes("category=")) {
      const match = banner.ctaLink.match(/category=([^&]+)/);
      if (match) {
        onNavigate("catalog", decodeURIComponent(match[1]));
        return;
      }
    }
    onNavigate("catalog");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || banners.length <= 1) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (banners.length <= 1) return;
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-ivory text-charcoal border-b-2 border-gold/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Hero Banners"
    >
      <style>{`
        @keyframes heroProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes heroRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroPop { from { opacity: 0; transform: scale(.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .hero-rise > * { opacity: 0; animation: heroRise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .hero-rise > *:nth-child(1) { animation-delay: .05s; }
        .hero-rise > *:nth-child(2) { animation-delay: .15s; }
        .hero-rise > *:nth-child(3) { animation-delay: .25s; }
        .hero-rise > *:nth-child(4) { animation-delay: .35s; }
        .hero-rise > *:nth-child(5) { animation-delay: .45s; }
        .hero-pop { opacity: 0; animation: heroPop .9s cubic-bezier(.2,.7,.2,1) .1s forwards; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise > *, .hero-pop { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Slides stacked in one grid cell so height adapts to content */}
      <div className="grid">
        {banners.map((banner, idx) => {
          const isActive = idx === activeIndex;
          const imageSrc = fixSrc(banner.imageUrl);
          return (
            <div
              key={banner.id ?? idx}
              className={`relative col-start-1 row-start-1 w-full min-w-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${banners.length}`}
            >
              {/* ---------- Background: soft light wash ---------- */}
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden"
              >
                <img
                  src={imageSrc}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center scale-125 blur-3xl opacity-25"
                />
                <div className="absolute inset-0 bg-linear-to-b from-ivory/70 via-ivory/85 to-ivory lg:bg-linear-to-r lg:from-ivory lg:via-ivory/90 lg:to-ivory/60" />
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-maroon/10 blur-3xl" />
              </div>

              {/* ---------- Content ---------- */}
              <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-28 sm:pt-12 sm:pb-32 lg:pt-16 lg:pb-28 lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
                {/* IMAGE: top on mobile, right on desktop. Full image, never cropped */}
                <div className="min-w-0 lg:col-span-5 lg:order-last flex flex-col items-center">
                  <div
                    key={isActive ? `img-${activeIndex}` : `img-idle-${idx}`}
                    className={`relative isolate inline-block max-w-full ${
                      isActive ? "hero-pop" : ""
                    }`}
                  >
                    {/* Outer dark border + inner gold line */}
                    <div className="relative rounded-2xl sm:rounded-3xl p-[3px] bg-charcoal shadow-2xl shadow-charcoal/30">
                      <div className="relative overflow-hidden rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] ring-1 ring-gold/80 min-h-[280px] min-w-[220px] bg-maroon/10">
                        <img
                          src={imageSrc}
                          alt={banner.heading}
                          referrerPolicy="no-referrer"
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          onError={handleImgError}
                          className="block h-auto w-auto max-w-full max-h-[340px] sm:max-h-[440px] lg:max-h-[520px] object-contain"
                        />

                        {/* Bottom caption on image */}
                        <div className="absolute inset-x-0 bottom-0 px-4 pt-14 pb-3 bg-linear-to-t from-black/85 via-black/50 to-transparent">
                          <p className="text-sm sm:text-lg font-serif font-bold text-white leading-tight">
                            {STORE_NAME}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-white/85">
                            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            {STORE_LOCATION}
                          </p>
                        </div>

                        {/* Flagship label */}
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-gold/60 text-gold-light text-[11px] sm:text-xs font-semibold tracking-wide">
                          <Store className="w-3.5 h-3.5 text-gold" />
                          {FLAGSHIP_LABEL}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TEXT */}
                <div
                  key={isActive ? `txt-${activeIndex}` : `txt-idle-${idx}`}
                  className={`min-w-0 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 ${
                    isActive ? "hero-rise" : ""
                  }`}
                >
                  {banner.badgeText ? (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gold text-maroon text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                      {banner.badgeText}
                    </span>
                  ) : (
                    <span className="hidden" />
                  )}

                  {isActive ? (
                    <h1
                      className="font-serif font-bold tracking-tight text-charcoal leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
                      style={{ textWrap: "balance" }}
                    >
                      {banner.heading}
                    </h1>
                  ) : (
                    <p
                      className="font-serif font-bold tracking-tight text-charcoal leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
                      style={{ textWrap: "balance" }}
                    >
                      {banner.heading}
                    </p>
                  )}

                  <p className="text-sm sm:text-base lg:text-lg text-muted leading-relaxed max-w-xl">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                    {TRUST_POINTS.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-white border border-border-subtle text-xs sm:text-sm font-medium text-charcoal shadow-sm"
                      >
                        <Icon className="w-4 h-4 text-maroon shrink-0" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="w-full sm:w-auto pt-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => handleCtaClick(banner)}
                      tabIndex={isActive ? 0 : -1}
                      className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-maroon text-ivory hover:bg-maroon-light text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-maroon/25 transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap"
                    >
                      <span>{banner.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => onNavigate("catalog")}
                      tabIndex={isActive ? 0 : -1}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-ivory text-charcoal text-sm sm:text-base font-medium rounded-xl border border-gold hover:border-gold-dark transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap"
                    >
                      <span>Explore All Sarees</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Controls (overlay at the bottom) ---------- */}
      {banners.length > 1 && (
        <div className="absolute z-20 bottom-5 sm:bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Choose banner"
            >
              {banners.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
                      isActive
                        ? "w-12 bg-charcoal/15"
                        : "w-3 bg-charcoal/25 hover:bg-charcoal/50"
                    }`}
                  >
                    {isActive && (
                      <span
                        key={`p-${activeIndex}`}
                        className="absolute inset-0 origin-left bg-maroon"
                        style={
                          reduceMotion
                            ? { transform: "scaleX(1)" }
                            : {
                                animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                                animationPlayState: isPaused
                                  ? "paused"
                                  : "running",
                              }
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-xs font-medium tracking-widest text-muted tabular-nums">
                <span className="text-maroon text-sm font-semibold">
                  {pad(activeIndex + 1)}
                </span>
                <span className="mx-1.5 text-charcoal/30">/</span>
                <span>{pad(banners.length)}</span>
              </div>
              <button
                onClick={goPrev}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-maroon hover:text-ivory text-charcoal flex items-center justify-center border border-border-subtle shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-maroon hover:text-ivory text-charcoal flex items-center justify-center border border-border-subtle shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
