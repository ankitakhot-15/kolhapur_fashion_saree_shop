import React from 'react';
import { CategoryItem } from '../types/index.ts';

interface CategoryCirclesProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#641D32] font-sans">
          Curated Weaves
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292522] mt-1">
          Explore Saree Categories
        </h2>
        <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-2.5" />
      </div>

      {/* Horizontal scroll on mobile, responsive grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-5 overflow-x-auto pb-4 pt-1 sm:pb-0 scrollbar-none items-center justify-start sm:justify-center">
        {categories.map((cat) => {
          const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center gap-2.5 group shrink-0 w-24 sm:w-auto focus-visible:outline-none"
            >
              <div 
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-[#641D32] ring-offset-2 ring-offset-[#FAF7F0] scale-105' 
                    : 'group-hover:ring-2 group-hover:ring-[#C7A66A] group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-full" />
              </div>

              <span className={`text-xs text-center font-medium leading-tight max-w-[85px] transition-colors ${
                isSelected ? 'text-[#641D32] font-bold' : 'text-[#292522] group-hover:text-[#641D32]'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
