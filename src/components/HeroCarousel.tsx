// // // import React, { useState, useEffect } from 'react';
// // // import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
// // // import { storeService } from '../services/storeService.ts';
// // // import { PromotionalBanner } from '../types/index.ts';

// // // interface HeroCarouselProps {
// // //   onNavigate: (view: string, param?: string) => void;
// // // }

// // // export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
// // //   const [banners, setBanners] = useState<PromotionalBanner[]>([]);
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [isPaused, setIsPaused] = useState(false);

// // //   useEffect(() => {
// // //     const update = () => {
// // //       const list = storeService.getBanners(true);
// // //       setBanners(list);
// // //     };
// // //     update();
// // //     return storeService.subscribe(update);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (banners.length <= 1 || isPaused) return;
// // //     const interval = setInterval(() => {
// // //       setCurrentIndex((prev) => (prev + 1) % banners.length);
// // //     }, 5500);
// // //     return () => clearInterval(interval);
// // //   }, [banners, isPaused]);

// // //   if (banners.length === 0) return null;

// // //   const currentBanner = banners[currentIndex];

// // //   const handleCtaClick = () => {
// // //     if (currentBanner.ctaLink.includes('category=')) {
// // //       const match = currentBanner.ctaLink.match(/category=([^&]+)/);
// // //       if (match) {
// // //         onNavigate('catalog', decodeURIComponent(match[1]));
// // //         return;
// // //       }
// // //     }
// // //     onNavigate('catalog');
// // //   };

// // //   return (
// // //     <div
// // //       className="relative w-full overflow-hidden bg-[#292522]"
// // //       onMouseEnter={() => setIsPaused(true)}
// // //       onMouseLeave={() => setIsPaused(false)}
// // //       role="region"
// // //       aria-roledescription="carousel"
// // //       aria-label="Promotional Hero Banners"
// // //     >
// // //       <div className="relative h-[480px] sm:h-[560px] lg:h-[620px] w-full">
// // //         {/* Background Editorial Image */}
// // //         <img
// // //           src={currentBanner.imageUrl}
// // //           alt={currentBanner.heading}
// // //           referrerPolicy="no-referrer"
// // //           className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
// // //         />

// // //         {/* Measured Scrim Gradient for text contrast */}
// // //         <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
// // //         <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

// // //         {/* Content Container */}
// // //         <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
// // //           <div className="max-w-xl text-[#FAF7F0] space-y-4">

// // //             {/* Subtle editorial kicker without pills */}
// // //             {currentBanner.badgeText && (
// // //               <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#C7A66A]">
// // //                 <Sparkles className="w-3.5 h-3.5" />
// // //                 <span>{currentBanner.badgeText}</span>
// // //                 <span aria-hidden="true">·</span>
// // //                 <span>Kolhapur Heritage</span>
// // //               </div>
// // //             )}

// // //             {/* Headline */}
// // //             <h1
// // //               className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight"
// // //               style={{ textWrap: 'balance' }}
// // //             >
// // //               {currentBanner.heading}
// // //             </h1>

// // //             {/* Subtitle */}
// // //             <p className="text-sm sm:text-base text-[#FAF7F0]/85 font-sans leading-relaxed max-w-lg">
// // //               {currentBanner.subtitle}
// // //             </p>

// // //             {/* CTAs */}
// // //             <div className="pt-2 flex flex-wrap items-center gap-4">
// // //               <button
// // //                 onClick={handleCtaClick}
// // //                 className="inline-flex items-center gap-2 px-6 py-3 bg-[#641D32] text-[#FAF7F0] hover:bg-[#7E2841] text-sm font-semibold rounded-md shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A66A] whitespace-nowrap"
// // //               >
// // //                 <span>{currentBanner.ctaText}</span>
// // //                 <ArrowRight className="w-4 h-4" />
// // //               </button>

// // //               <button
// // //                 onClick={() => onNavigate('catalog')}
// // //                 className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-md border border-white/20 transition-all whitespace-nowrap"
// // //               >
// // //                 <span>Explore All Sarees</span>
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Carousel Controls */}
// // //         {banners.length > 1 && (
// // //           <>
// // //             <button
// // //               onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
// // //               className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors"
// // //               aria-label="Previous banner"
// // //             >
// // //               <ChevronLeft className="w-5 h-5" />
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
// // //               className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors"
// // //               aria-label="Next banner"
// // //             >
// // //               <ChevronRight className="w-5 h-5" />
// // //             </button>

// // //             {/* Indicators */}
// // //             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
// // //               {banners.map((_, idx) => (
// // //                 <button
// // //                   key={idx}
// // //                   onClick={() => setCurrentIndex(idx)}
// // //                   className={`h-1.5 transition-all rounded-full ${
// // //                     idx === currentIndex ? 'w-8 bg-[#C7A66A]' : 'w-2 bg-white/40 hover:bg-white/70'
// // //                   }`}
// // //                   aria-label={`Go to slide ${idx + 1}`}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // import React, { useState, useEffect, useRef } from "react";
// // // import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
// // // import { storeService } from "../services/storeService.ts";
// // // import { PromotionalBanner } from "../types/index.ts";

// // // interface HeroCarouselProps {
// // //   onNavigate: (view: string, param?: string) => void;
// // // }

// // // export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
// // //   const [banners, setBanners] = useState<PromotionalBanner[]>([]);
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [isPaused, setIsPaused] = useState(false);
// // //   const touchStartX = useRef<number | null>(null);

// // //   useEffect(() => {
// // //     const update = () => {
// // //       const list = storeService.getBanners(true);
// // //       setBanners(list);
// // //     };
// // //     update();
// // //     return storeService.subscribe(update);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (banners.length <= 1 || isPaused) return;
// // //     const interval = setInterval(() => {
// // //       setCurrentIndex((prev) => (prev + 1) % banners.length);
// // //     }, 5500);
// // //     return () => clearInterval(interval);
// // //   }, [banners, isPaused]);

// // //   if (banners.length === 0) return null;

// // //   // Safety: if banners were removed in admin, never point past the end
// // //   const activeIndex = currentIndex < banners.length ? currentIndex : 0;

// // //   const goPrev = () =>
// // //     setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
// // //   const goNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

// // //   const handleCtaClick = (banner: PromotionalBanner) => {
// // //     if (banner.ctaLink && banner.ctaLink.includes("category=")) {
// // //       const match = banner.ctaLink.match(/category=([^&]+)/);
// // //       if (match) {
// // //         onNavigate("catalog", decodeURIComponent(match[1]));
// // //         return;
// // //       }
// // //     }
// // //     onNavigate("catalog");
// // //   };

// // //   // Swipe support for mobile
// // //   const handleTouchStart = (e: React.TouchEvent) => {
// // //     touchStartX.current = e.touches[0].clientX;
// // //   };
// // //   const handleTouchEnd = (e: React.TouchEvent) => {
// // //     if (touchStartX.current === null || banners.length <= 1) return;
// // //     const diff = e.changedTouches[0].clientX - touchStartX.current;
// // //     if (Math.abs(diff) > 50) {
// // //       if (diff < 0) goNext();
// // //       else goPrev();
// // //     }
// // //     touchStartX.current = null;
// // //   };

// // //   const pad = (n: number) => String(n).padStart(2, "0");

// // //   return (
// // //     <div
// // //       className="relative w-full overflow-hidden bg-[#292522]"
// // //       onMouseEnter={() => setIsPaused(true)}
// // //       onMouseLeave={() => setIsPaused(false)}
// // //       onFocus={() => setIsPaused(true)}
// // //       onBlur={() => setIsPaused(false)}
// // //       onTouchStart={handleTouchStart}
// // //       onTouchEnd={handleTouchEnd}
// // //       role="region"
// // //       aria-roledescription="carousel"
// // //       aria-label="Promotional Hero Banners"
// // //     >
// // //       <div className="relative h-[540px] sm:h-[600px] lg:h-[680px] w-full">
// // //         {/* Slides (all rendered, cross-fade between them) */}
// // //         {banners.map((banner, idx) => {
// // //           const isActive = idx === activeIndex;
// // //           return (
// // //             <div
// // //               key={banner.id ?? idx}
// // //               className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
// // //                 isActive
// // //                   ? "opacity-100 z-10"
// // //                   : "opacity-0 z-0 pointer-events-none"
// // //               }`}
// // //               aria-hidden={!isActive}
// // //               role="group"
// // //               aria-roledescription="slide"
// // //               aria-label={`${idx + 1} of ${banners.length}`}
// // //             >
// // //               {/* Background image with slow zoom */}
// // //               <img
// // //                 src={banner.imageUrl}
// // //                 alt={banner.heading}
// // //                 referrerPolicy="no-referrer"
// // //                 className={`absolute inset-0 w-full h-full object-cover object-center transition-transform ease-out ${
// // //                   isActive
// // //                     ? "scale-100 duration-[6000ms]"
// // //                     : "scale-110 duration-0"
// // //                 }`}
// // //               />

// // //               {/* Scrims: bottom-heavy on mobile, left-heavy on desktop */}
// // //               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/50 lg:to-transparent" />
// // //               <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

// // //               {/* Content */}
// // //               <div className="relative max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-10 flex flex-col justify-end lg:justify-center pb-24 sm:pb-28 lg:pb-0">
// // //                 <div
// // //                   className={`max-w-xl text-[#FAF7F0] space-y-4 sm:space-y-5 transition-all duration-1000 ease-out ${
// // //                     isActive
// // //                       ? "translate-y-0 opacity-100"
// // //                       : "translate-y-6 opacity-0"
// // //                   }`}
// // //                 >
// // //                   {/* Kicker */}
// // //                   {banner.badgeText && (
// // //                     <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#C7A66A]">
// // //                       <span className="hidden sm:block w-8 h-px bg-[#C7A66A]" />
// // //                       <Sparkles className="w-3.5 h-3.5 shrink-0" />
// // //                       <span>{banner.badgeText}</span>
// // //                       <span aria-hidden="true">·</span>
// // //                       <span className="hidden sm:inline">
// // //                         Kolhapur Heritage
// // //                       </span>
// // //                     </div>
// // //                   )}

// // //                   {/* Headline */}
// // //                   {isActive ? (
// // //                     <h1
// // //                       className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]"
// // //                       style={{ textWrap: "balance" }}
// // //                     >
// // //                       {banner.heading}
// // //                     </h1>
// // //                   ) : (
// // //                     <p
// // //                       className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]"
// // //                       style={{ textWrap: "balance" }}
// // //                     >
// // //                       {banner.heading}
// // //                     </p>
// // //                   )}

// // //                   {/* Subtitle */}
// // //                   <p className="text-sm sm:text-base lg:text-lg text-[#FAF7F0]/85 font-sans leading-relaxed max-w-lg">
// // //                     {banner.subtitle}
// // //                   </p>

// // //                   {/* CTAs */}
// // //                   <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
// // //                     <button
// // //                       onClick={() => handleCtaClick(banner)}
// // //                       tabIndex={isActive ? 0 : -1}
// // //                       className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C7A66A] text-[#292522] hover:bg-[#DFCA9B] text-sm font-semibold rounded-md shadow-lg shadow-black/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
// // //                     >
// // //                       <span>{banner.ctaText}</span>
// // //                       <ArrowRight className="w-4 h-4" />
// // //                     </button>

// // //                     <button
// // //                       onClick={() => onNavigate("catalog")}
// // //                       tabIndex={isActive ? 0 : -1}
// // //                       className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-md border border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
// // //                     >
// // //                       <span>Explore All Sarees</span>
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           );
// // //         })}

// // //         {/* Controls */}
// // //         {banners.length > 1 && (
// // //           <>
// // //             {/* Arrows */}
// // //             <button
// // //               onClick={goPrev}
// // //               className="hidden sm:flex absolute z-20 left-4 lg:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-[#C7A66A] hover:text-[#292522] text-white items-center justify-center backdrop-blur-sm border border-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
// // //               aria-label="Previous banner"
// // //             >
// // //               <ChevronLeft className="w-5 h-5" />
// // //             </button>
// // //             <button
// // //               onClick={goNext}
// // //               className="hidden sm:flex absolute z-20 right-4 lg:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-[#C7A66A] hover:text-[#292522] text-white items-center justify-center backdrop-blur-sm border border-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
// // //               aria-label="Next banner"
// // //             >
// // //               <ChevronRight className="w-5 h-5" />
// // //             </button>

// // //             {/* Bottom bar: counter + indicators */}
// // //             <div className="absolute z-20 bottom-6 sm:bottom-8 left-0 right-0">
// // //               <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
// // //                 <div
// // //                   className="flex items-center gap-2"
// // //                   role="tablist"
// // //                   aria-label="Choose banner"
// // //                 >
// // //                   {banners.map((_, idx) => (
// // //                     <button
// // //                       key={idx}
// // //                       onClick={() => setCurrentIndex(idx)}
// // //                       role="tab"
// // //                       aria-selected={idx === activeIndex}
// // //                       className={`h-1.5 transition-all duration-500 rounded-full ${
// // //                         idx === activeIndex
// // //                           ? "w-10 bg-[#C7A66A]"
// // //                           : "w-3 bg-white/40 hover:bg-white/70"
// // //                       }`}
// // //                       aria-label={`Go to slide ${idx + 1}`}
// // //                     />
// // //                   ))}
// // //                 </div>

// // //                 <div className="text-xs font-medium tracking-widest text-white/80 tabular-nums">
// // //                   <span className="text-[#C7A66A] text-sm font-semibold">
// // //                     {pad(activeIndex + 1)}
// // //                   </span>
// // //                   <span className="mx-1.5 text-white/40">/</span>
// // //                   <span>{pad(banners.length)}</span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };
// // import React, { useState, useEffect, useRef, useCallback } from "react";
// // import {
// //   ChevronLeft,
// //   ChevronRight,
// //   Sparkles,
// //   ArrowRight,
// //   BadgeCheck,
// //   Truck,
// //   Store,
// //   MapPin,
// // } from "lucide-react";
// // import { storeService } from "../services/storeService.ts";
// // import { PromotionalBanner } from "../types/index.ts";

// // interface HeroCarouselProps {
// //   onNavigate: (view: string, param?: string) => void;
// // }

// // // Editable static text (not stored in banners)
// // const FLAGSHIP_LABEL = "Flagship Store";
// // const STORE_NAME = "Kolhapuri Fashion Saree";
// // const STORE_LOCATION = "Kolhapur, Maharashtra";
// // const AUTOPLAY_MS = 6000;
// // const TRUST_POINTS = [
// //   { icon: BadgeCheck, label: "Pure Handloom" },
// //   { icon: Truck, label: "All-India & Global Shipping" },
// // ];

// // export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
// //   const [banners, setBanners] = useState<PromotionalBanner[]>([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [isPaused, setIsPaused] = useState(false);
// //   const [reduceMotion, setReduceMotion] = useState(false);
// //   const touchStartX = useRef<number | null>(null);

// //   useEffect(() => {
// //     const update = () => setBanners(storeService.getBanners(true));
// //     update();
// //     return storeService.subscribe(update);
// //   }, []);

// //   useEffect(() => {
// //     if (typeof window === "undefined" || !window.matchMedia) return;
// //     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
// //     setReduceMotion(mq.matches);
// //     const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
// //     mq.addEventListener?.("change", handler);
// //     return () => mq.removeEventListener?.("change", handler);
// //   }, []);

// //   const autoplay = banners.length > 1 && !isPaused && !reduceMotion;

// //   useEffect(() => {
// //     if (!autoplay) return;
// //     const t = setTimeout(() => {
// //       setCurrentIndex((prev) => (prev + 1) % banners.length);
// //     }, AUTOPLAY_MS);
// //     return () => clearTimeout(t);
// //   }, [autoplay, currentIndex, banners.length]);

// //   const goPrev = useCallback(
// //     () => setCurrentIndex((p) => (p - 1 + banners.length) % banners.length),
// //     [banners.length],
// //   );
// //   const goNext = useCallback(
// //     () => setCurrentIndex((p) => (p + 1) % banners.length),
// //     [banners.length],
// //   );

// //   if (banners.length === 0) return null;

// //   // Safety: if banners were removed in admin, never point past the end
// //   const activeIndex = currentIndex < banners.length ? currentIndex : 0;

// //   const handleCtaClick = (banner: PromotionalBanner) => {
// //     if (banner.ctaLink && banner.ctaLink.includes("category=")) {
// //       const match = banner.ctaLink.match(/category=([^&]+)/);
// //       if (match) {
// //         onNavigate("catalog", decodeURIComponent(match[1]));
// //         return;
// //       }
// //     }
// //     onNavigate("catalog");
// //   };

// //   const handleTouchStart = (e: React.TouchEvent) => {
// //     touchStartX.current = e.touches[0].clientX;
// //   };
// //   const handleTouchEnd = (e: React.TouchEvent) => {
// //     if (touchStartX.current === null || banners.length <= 1) return;
// //     const diff = e.changedTouches[0].clientX - touchStartX.current;
// //     if (Math.abs(diff) > 50) {
// //       if (diff < 0) goNext();
// //       else goPrev();
// //     }
// //     touchStartX.current = null;
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (banners.length <= 1) return;
// //     if (e.key === "ArrowLeft") goPrev();
// //     if (e.key === "ArrowRight") goNext();
// //   };

// //   const pad = (n: number) => String(n).padStart(2, "0");

// //   return (
// //     <section
// //       className="relative w-full overflow-hidden bg-charcoal text-ivory"
// //       onMouseEnter={() => setIsPaused(true)}
// //       onMouseLeave={() => setIsPaused(false)}
// //       onFocus={() => setIsPaused(true)}
// //       onBlur={() => setIsPaused(false)}
// //       onTouchStart={handleTouchStart}
// //       onTouchEnd={handleTouchEnd}
// //       onKeyDown={handleKeyDown}
// //       role="region"
// //       aria-roledescription="carousel"
// //       aria-label="Promotional Hero Banners"
// //     >
// //       <style>{`
// //         @keyframes heroProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
// //         @keyframes heroRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// //         @keyframes heroPop { from { opacity: 0; transform: scale(.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
// //         .hero-rise > * { opacity: 0; animation: heroRise .8s cubic-bezier(.2,.7,.2,1) forwards; }
// //         .hero-rise > *:nth-child(1) { animation-delay: .05s; }
// //         .hero-rise > *:nth-child(2) { animation-delay: .15s; }
// //         .hero-rise > *:nth-child(3) { animation-delay: .25s; }
// //         .hero-rise > *:nth-child(4) { animation-delay: .35s; }
// //         .hero-rise > *:nth-child(5) { animation-delay: .45s; }
// //         .hero-pop { opacity: 0; animation: heroPop .9s cubic-bezier(.2,.7,.2,1) .1s forwards; }
// //         @media (prefers-reduced-motion: reduce) {
// //           .hero-rise > *, .hero-pop { animation: none; opacity: 1; }
// //         }
// //       `}</style>

// //       {/* Slides stacked in one grid cell so height adapts to content */}
// //       <div className="grid">
// //         {banners.map((banner, idx) => {
// //           const isActive = idx === activeIndex;
// //           return (
// //             <div
// //               key={banner.id ?? idx}
// //               className={`relative col-start-1 row-start-1 w-full min-w-0 transition-opacity duration-1000 ease-in-out ${
// //                 isActive
// //                   ? "opacity-100 z-10"
// //                   : "opacity-0 z-0 pointer-events-none"
// //               }`}
// //               aria-hidden={!isActive}
// //               role="group"
// //               aria-roledescription="slide"
// //               aria-label={`${idx + 1} of ${banners.length}`}
// //             >
// //               {/* ---------- Background: blurred photo + scrims ---------- */}
// //               <div
// //                 aria-hidden="true"
// //                 className="absolute inset-0 overflow-hidden"
// //               >
// //                 <img
// //                   src={banner.imageUrl}
// //                   alt=""
// //                   referrerPolicy="no-referrer"
// //                   className="absolute inset-0 h-full w-full object-cover object-center scale-125 blur-2xl opacity-55"
// //                 />
// //                 <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/70 to-charcoal/40 lg:bg-linear-to-r lg:from-charcoal lg:via-charcoal/85 lg:to-charcoal/30" />
// //                 <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-maroon/40 blur-3xl" />
// //                 <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
// //               </div>

// //               {/* ---------- Content ---------- */}
// //               <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-28 sm:pt-12 sm:pb-32 lg:pt-16 lg:pb-28 lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
// //                 {/* IMAGE: top on mobile, right on desktop. Full image, never cropped */}
// //                 <div className="min-w-0 lg:col-span-5 lg:order-last flex flex-col items-center">
// //                   <div
// //                     key={isActive ? `img-${activeIndex}` : `img-idle-${idx}`}
// //                     className={`relative isolate inline-block ${
// //                       isActive ? "hero-pop" : ""
// //                     }`}
// //                   >
// //                     {/* gold offset frame */}
// //                     <div
// //                       aria-hidden="true"
// //                       className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 sm:translate-x-4 sm:translate-y-4 rounded-2xl sm:rounded-3xl border-2 border-gold/70"
// //                     />
// //                     <img
// //                       src={banner.imageUrl}
// //                       alt={banner.heading}
// //                       referrerPolicy="no-referrer"
// //                       loading={idx === 0 ? "eager" : "lazy"}
// //                       decoding="async"
// //                       className="block h-auto w-auto max-w-full max-h-[340px] sm:max-h-[440px] lg:max-h-[520px] rounded-2xl sm:rounded-3xl object-contain shadow-2xl shadow-black/50 ring-1 ring-white/15"
// //                     />

// //                     {/* Flagship label */}
// //                     <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/25 text-white text-[11px] sm:text-xs font-semibold tracking-wide">
// //                       <Store className="w-3.5 h-3.5 text-gold" />
// //                       {FLAGSHIP_LABEL}
// //                     </span>
// //                   </div>

// //                   {/* Caption under the image (never covers it) */}
// //                   <div className="mt-5 sm:mt-7 text-center">
// //                     <p className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
// //                       {STORE_NAME}
// //                     </p>
// //                     <p className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/75">
// //                       <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
// //                       {STORE_LOCATION}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {/* TEXT */}
// //                 <div
// //                   key={isActive ? `txt-${activeIndex}` : `txt-idle-${idx}`}
// //                   className={`min-w-0 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 ${
// //                     isActive ? "hero-rise" : ""
// //                   }`}
// //                 >
// //                   {banner.badgeText ? (
// //                     <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/50 text-gold-light text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
// //                       <Sparkles className="w-3.5 h-3.5 shrink-0" />
// //                       {banner.badgeText}
// //                     </span>
// //                   ) : (
// //                     <span className="hidden" />
// //                   )}

// //                   {isActive ? (
// //                     <h1
// //                       className="font-serif font-bold tracking-tight text-white leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
// //                       style={{ textWrap: "balance" }}
// //                     >
// //                       {banner.heading}
// //                     </h1>
// //                   ) : (
// //                     <p
// //                       className="font-serif font-bold tracking-tight text-white leading-[1.08] text-[length:clamp(2rem,5.5vw,3.75rem)]"
// //                       style={{ textWrap: "balance" }}
// //                     >
// //                       {banner.heading}
// //                     </p>
// //                   )}

// //                   <p className="text-sm sm:text-base lg:text-lg text-ivory/80 leading-relaxed max-w-xl">
// //                     {banner.subtitle}
// //                   </p>

// //                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
// //                     {TRUST_POINTS.map(({ icon: Icon, label }) => (
// //                       <span
// //                         key={label}
// //                         className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium text-white"
// //                       >
// //                         <Icon className="w-4 h-4 text-gold shrink-0" />
// //                         {label}
// //                       </span>
// //                     ))}
// //                   </div>

// //                   <div className="w-full sm:w-auto pt-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
// //                     <button
// //                       onClick={() => handleCtaClick(banner)}
// //                       tabIndex={isActive ? 0 : -1}
// //                       className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-charcoal hover:bg-gold-light text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
// //                     >
// //                       <span>{banner.ctaText}</span>
// //                       <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
// //                     </button>

// //                     <button
// //                       onClick={() => onNavigate("catalog")}
// //                       tabIndex={isActive ? 0 : -1}
// //                       className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm sm:text-base font-medium rounded-xl border border-white/30 transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
// //                     >
// //                       <span>Explore All Sarees</span>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* ---------- Controls (overlay at the bottom) ---------- */}
// //       {banners.length > 1 && (
// //         <div className="absolute z-20 bottom-5 sm:bottom-8 left-0 right-0">
// //           <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
// //             <div
// //               className="flex items-center gap-2"
// //               role="tablist"
// //               aria-label="Choose banner"
// //             >
// //               {banners.map((_, idx) => {
// //                 const isActive = idx === activeIndex;
// //                 return (
// //                   <button
// //                     key={idx}
// //                     onClick={() => setCurrentIndex(idx)}
// //                     role="tab"
// //                     aria-selected={isActive}
// //                     aria-label={`Go to slide ${idx + 1}`}
// //                     className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
// //                       isActive
// //                         ? "w-12 bg-white/25"
// //                         : "w-3 bg-white/40 hover:bg-white/70"
// //                     }`}
// //                   >
// //                     {isActive && (
// //                       <span
// //                         key={`p-${activeIndex}`}
// //                         className="absolute inset-0 origin-left bg-gold"
// //                         style={
// //                           reduceMotion
// //                             ? { transform: "scaleX(1)" }
// //                             : {
// //                                 animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
// //                                 animationPlayState: isPaused
// //                                   ? "paused"
// //                                   : "running",
// //                               }
// //                         }
// //                       />
// //                     )}
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             <div className="flex items-center gap-3 sm:gap-4">
// //               <div className="text-xs font-medium tracking-widest text-white/80 tabular-nums">
// //                 <span className="text-gold text-sm font-semibold">
// //                   {pad(activeIndex + 1)}
// //                 </span>
// //                 <span className="mx-1.5 text-white/40">/</span>
// //                 <span>{pad(banners.length)}</span>
// //               </div>
// //               <button
// //                 onClick={goPrev}
// //                 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center backdrop-blur-sm border border-white/25 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
// //                 aria-label="Previous banner"
// //               >
// //                 <ChevronLeft className="w-5 h-5" />
// //               </button>
// //               <button
// //                 onClick={goNext}
// //                 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center backdrop-blur-sm border border-white/25 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
// //                 aria-label="Next banner"
// //               >
// //                 <ChevronRight className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   );
// // };
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
//       className="relative w-full overflow-hidden bg-ivory text-charcoal"
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
//                     {/* gold offset frame */}
//                     <div
//                       aria-hidden="true"
//                       className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 sm:translate-x-4 sm:translate-y-4 rounded-2xl sm:rounded-3xl border-2 border-gold"
//                     />
//                     <img
//                       src={banner.imageUrl}
//                       alt={banner.heading}
//                       referrerPolicy="no-referrer"
//                       loading={idx === 0 ? "eager" : "lazy"}
//                       decoding="async"
//                       className="block h-auto w-auto max-w-full max-h-[340px] sm:max-h-[440px] lg:max-h-[520px] rounded-2xl sm:rounded-3xl object-contain shadow-xl shadow-charcoal/15 ring-1 ring-border-subtle"
//                     />

//                     {/* Flagship label */}
//                     <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-border-subtle text-charcoal text-[11px] sm:text-xs font-semibold tracking-wide shadow-sm">
//                       <Store className="w-3.5 h-3.5 text-maroon" />
//                       {FLAGSHIP_LABEL}
//                     </span>
//                   </div>

//                   {/* Caption under the image (never covers it) */}
//                   <div className="mt-5 sm:mt-7 text-center">
//                     <p className="text-base sm:text-lg font-serif font-bold text-charcoal leading-tight">
//                       {STORE_NAME}
//                     </p>
//                     <p className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted">
//                       <MapPin className="w-3.5 h-3.5 text-maroon shrink-0" />
//                       {STORE_LOCATION}
//                     </p>
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
      className="relative w-full overflow-hidden bg-ivory text-charcoal border-b-2 border-gold/60"
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
                  src={banner.imageUrl}
                  alt=""
                  referrerPolicy="no-referrer"
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
                    className={`relative isolate inline-block ${
                      isActive ? "hero-pop" : ""
                    }`}
                  >
                    {/* Outer dark border + inner gold line (like the reference) */}
                    <div className="relative rounded-2xl sm:rounded-3xl p-[3px] bg-charcoal shadow-2xl shadow-charcoal/30">
                      <div className="relative overflow-hidden rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] ring-1 ring-gold/80">
                        <img
                          src={banner.imageUrl}
                          alt={banner.heading}
                          referrerPolicy="no-referrer"
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
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
