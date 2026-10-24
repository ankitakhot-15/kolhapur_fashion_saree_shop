// // import React from 'react';
// // import { CategoryItem } from '../types/index.ts';

// // interface CategoryCirclesProps {
// //   categories: CategoryItem[];
// //   selectedCategory?: string;
// //   onSelectCategory: (categoryName: string) => void;
// // }

// // export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
// //   categories,
// //   selectedCategory,
// //   onSelectCategory
// // }) => {
// //   return (
// //     <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
// //       <div className="text-center mb-8">
// //         <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32] font-sans">
// //           Curated Weaves
// //         </span>
// //         <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-1">
// //           Explore Saree Categories
// //         </h2>
// //         <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-2.5" />
// //       </div>

// //       {/* Horizontal scroll on mobile, responsive grid on desktop */}
// //       <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-5 overflow-x-auto pb-4 pt-1 sm:pb-0 scrollbar-none items-center justify-start sm:justify-center">
// //         {categories.map((cat) => {
// //           const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

// //           return (
// //             <button
// //               key={cat.id}
// //               onClick={() => onSelectCategory(cat.name)}
// //               className="flex flex-col items-center gap-2.5 group shrink-0 w-24 sm:w-auto focus-visible:outline-none"
// //             >
// //               <div
// //                 className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden p-1 transition-all duration-300 ${
// //                   isSelected
// //                     ? 'ring-2 ring-[#641D32] ring-offset-2 ring-offset-[#FAF7F0] scale-105'
// //                     : 'group-hover:ring-2 group-hover:ring-[#C7A66A] group-hover:scale-105'
// //                 }`}
// //               >
// //                 <img
// //                   src={cat.imageUrl}
// //                   alt={cat.name}
// //                   referrerPolicy="no-referrer"
// //                   className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
// //                 />
// //                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-full" />
// //               </div>

// //               <span className={`text-xs text-center font-medium leading-tight max-w-[85px] transition-colors ${
// //                 isSelected ? 'text-[#641D32] font-bold' : 'text-[#292522] group-hover:text-[#641D32]'
// //               }`}>
// //                 {cat.name}
// //               </span>
// //             </button>
// //           );
// //         })}
// //       </div>
// //     </section>
// //   );
// // };

// import React from "react";
// import { CategoryItem } from "../types/index.ts";
// import paithaniImage from "../assets/images/hero_paithani_saree_1792591861414.jpg";
// import banarasiImage from "../assets/images/saree_banarasi_maroon_1792591862999.jpg";
// import designerImage from "../assets/images/saree_designer_emerald_1792591862844.jpg";
// import purpleImage from "../assets/images/saree_paithani_purple_1792591862050.jpg";

// interface CategoryCirclesProps {
//   categories: CategoryItem[];
//   selectedCategory?: string;
//   onSelectCategory: (categoryName: string) => void;
// }

// const getFallbackImage = (name: string): string => {
//   const category = name.toLowerCase();

//   if (category.includes("paithani")) return paithaniImage;
//   if (category.includes("banarasi")) return banarasiImage;
//   if (category.includes("designer")) return designerImage;
//   if (category.includes("silk")) return purpleImage;

//   return paithaniImage;
// };

// export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
//   categories,
//   selectedCategory,
//   onSelectCategory,
// }) => {
//   return (
//     <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//       <div className="text-center mb-8">
//         <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32]">
//           Curated Weaves
//         </span>
//         <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-1">
//           Explore Saree Categories
//         </h2>
//         <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-2.5" />
//       </div>

//       <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-5 overflow-x-auto pb-4 pt-1 sm:pb-0 items-center justify-start sm:justify-center">
//         {categories.map((cat) => {
//           const isSelected =
//             selectedCategory?.toLowerCase() === cat.name.toLowerCase();

//           return (
//             <button
//               key={cat.id}
//               onClick={() => onSelectCategory(cat.name)}
//               className="flex flex-col items-center gap-2.5 group shrink-0 w-24 sm:w-auto focus-visible:outline-none"
//             >
//               <div
//                 className={`relative w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden p-1 transition-all duration-300 ${
//                   isSelected
//                     ? "ring-2 ring-[#641D32] ring-offset-2 ring-offset-[#FAF7F0] scale-105"
//                     : "group-hover:ring-2 group-hover:ring-[#C7A66A] group-hover:scale-105"
//                 }`}
//               >
//                 <img
//                   src={cat.imageUrl || getFallbackImage(cat.name)}
//                   alt={cat.name}
//                   onError={(event) => {
//                     const img = event.currentTarget;
//                     const fallback = getFallbackImage(cat.name);

//                     if (
//                       img.src !== new URL(fallback, window.location.href).href
//                     ) {
//                       img.src = fallback;
//                     }
//                   }}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-full pointer-events-none" />
//               </div>

//               <span
//                 className={`text-xs text-center font-medium leading-tight max-w-[85px] transition-colors ${
//                   isSelected
//                     ? "text-[#641D32] font-bold"
//                     : "text-[#292522] group-hover:text-[#641D32]"
//                 }`}
//               >
//                 {cat.name}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </section>
//   );
// };
import React from "react";
import { CategoryItem } from "../types/index.ts";
import paithaniImage from "../assets/images/hero_paithani_saree_1792591861414.jpg";
import banarasiImage from "../assets/images/saree_banarasi_maroon_1792591862999.jpg";
import designerImage from "../assets/images/saree_designer_emerald_1792591862844.jpg";
import purpleImage from "../assets/images/saree_paithani_purple_1792591862050.jpg";

interface CategoryCirclesProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
}

// Editable heading text
const SECTION_TITLE = "Trending Collection";

// Old data may still contain the dev-only path "/src/assets/images/...".
// In production those files are served from "/images/...".
const fixSrc = (url?: string) =>
  url && url.startsWith("/src/assets/images/")
    ? url.replace("/src/assets/images/", "/images/")
    : url || "";

// These imports are bundled by Vite, so they always work in production
const getFallbackImage = (name: string): string => {
  const category = name.toLowerCase();

  if (category.includes("paithani")) return paithaniImage;
  if (category.includes("banarasi")) return banarasiImage;
  if (category.includes("designer")) return designerImage;
  if (category.includes("silk")) return purpleImage;

  return paithaniImage;
};

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-serif font-medium text-[#292522]">
          {SECTION_TITLE}
        </h2>
        <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-2.5" />
      </div>

      {/* Phones: one row you can swipe sideways. Tablet and desktop: centred rows */}
      <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory sm:snap-none">
        {categories.map((cat) => {
          const isSelected =
            selectedCategory?.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              aria-pressed={isSelected}
              aria-label={`Shop ${cat.name}`}
              className="group shrink-0 snap-center focus-visible:outline-none flex flex-col items-center gap-2.5 w-[6.5rem] sm:w-28 lg:w-32"
            >
              {/* Circle photo */}
              <div
                className={`relative aspect-square w-full rounded-full overflow-hidden border-2 bg-[#E6E0D8] shadow-sm transition-all duration-300 ${
                  isSelected
                    ? "border-[#C7A66A] ring-2 ring-[#641D32]/40 scale-105"
                    : "border-[#641D32] group-hover:border-[#C7A66A] group-hover:scale-105 group-hover:shadow-md"
                } group-focus-visible:ring-2 group-focus-visible:ring-[#C7A66A]`}
              >
                <img
                  src={fixSrc(cat.imageUrl) || getFallbackImage(cat.name)}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    const img = event.currentTarget;
                    if (img.dataset.fallback) return;
                    img.dataset.fallback = "1";
                    img.src = getFallbackImage(cat.name);
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Full category name below the circle (never clipped) */}
              <span
                className={`w-full text-center text-xs sm:text-sm font-serif leading-snug transition-colors break-words ${
                  isSelected
                    ? "text-[#641D32] font-bold"
                    : "text-[#292522] font-semibold group-hover:text-[#641D32]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
