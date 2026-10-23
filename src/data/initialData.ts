
import {
  SareeCategory,
  SareeProduct,
  CategoryItem,
  PromotionalBanner,
  PromotionalOffer,
  Coupon,
  StoreSettings
} from '../types/index.ts';

// High-fidelity image assets generated for Kolhapuri Fashion Saree
export const IMAGE_HERO_PAITHANI = '/src/assets/images/hero_paithani_saree_1792591861414.jpg';
export const IMAGE_SAREE_PURPLE = '/src/assets/images/saree_paithani_purple_1792591862050.jpg';
export const IMAGE_SAREE_MAROON = '/src/assets/images/saree_banarasi_maroon_1792591862999.jpg';
export const IMAGE_SAREE_EMERALD = '/src/assets/images/saree_designer_emerald_1792591862844.jpg';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-silk',
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Pure Mulberry and Katan silks with authentic lustrous drape and zari borders.',
    imageUrl: IMAGE_SAREE_PURPLE,
    isActive: true,
    sortOrder: 1,
    productCount: 12
  },
  {
    id: 'cat-paithani',
    name: 'Paithani Sarees',
    slug: 'paithani-sarees',
    description: 'Royal Maharashtrian heritage with handwoven peacock and parrot motifs on pallu.',
    imageUrl: IMAGE_HERO_PAITHANI,
    isActive: true,
    sortOrder: 2,
    productCount: 8
  },
  {
    id: 'cat-traditional',
    name: 'Traditional Sarees',
    slug: 'traditional-sarees',
    description: 'Timeless handloom weaves crafted by generational Kolhapur artisans.',
    imageUrl: IMAGE_SAREE_MAROON,
    isActive: true,
    sortOrder: 3,
    productCount: 14
  },
  {
    id: 'cat-designer',
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Contemporary silhouettes with opulent hand embroidery and modern hues.',
    imageUrl: IMAGE_SAREE_EMERALD,
    isActive: true,
    sortOrder: 4,
    productCount: 9
  },
  {
    id: 'cat-festive',
    name: 'Festive Sarees',
    slug: 'festive-sarees',
    description: 'Vibrant celebratory colors ideal for Diwali, Gudi Padwa, and festivals.',
    imageUrl: IMAGE_HERO_PAITHANI,
    isActive: true,
    sortOrder: 5,
    productCount: 11
  },
  {
    id: 'cat-wedding',
    name: 'Wedding Sarees',
    slug: 'wedding-sarees',
    description: 'Grand bridal weaves adorned with dense real-look gold zari and intricate meenakari.',
    imageUrl: IMAGE_SAREE_MAROON,
    isActive: true,
    sortOrder: 6,
    productCount: 7
  },
  {
    id: 'cat-cotton',
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Breathable, feather-light handloom cottons for daily grace and comfort.',
    imageUrl: IMAGE_SAREE_PURPLE,
    isActive: true,
    sortOrder: 7,
    productCount: 6
  },
  {
    id: 'cat-party',
    name: 'Party Wear Sarees',
    slug: 'party-wear-sarees',
    description: 'Shimmering georgette and organza sarees designed for evening celebrations.',
    imageUrl: IMAGE_SAREE_EMERALD,
    isActive: true,
    sortOrder: 8,
    productCount: 5
  }
];

export const INITIAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'banner-1',
    heading: 'Royal Kolhapuri Paithani Weaves',
    subtitle: 'Woven with centuries of Maharashtrian heritage and pure gold zari motifs.',
    ctaText: 'Explore Collection',
    ctaLink: '/catalog?category=Paithani Sarees',
    imageUrl: IMAGE_HERO_PAITHANI,
    badgeText: 'Festive Masterpieces',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'banner-2',
    heading: 'Rajwada Bridal Splendor 2026',
    subtitle: 'Handpicked bridal silks and traditional ensembles for auspicious celebrations.',
    ctaText: 'Shop Bridal Silks',
    ctaLink: '/catalog?category=Wedding Sarees',
    imageUrl: IMAGE_SAREE_MAROON,
    badgeText: 'Curated Heritage',
    isActive: true,
    sortOrder: 2
  }
];

export const INITIAL_OFFERS: PromotionalOffer[] = [
  {
    id: 'offer-1',
    title: 'Festive Bridal Elegance Offer',
    description: 'Flat 15% off on all authentic Paithani and Bridal silks with free insured shipping across India.',
    discountPercentage: 15,
    imageUrl: IMAGE_SAREE_MAROON,
    ctaText: 'Claim Festive Offer',
    ctaLink: '/catalog?category=Wedding Sarees',
    validUntil: '2026-11-30',
    isActive: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'FESTIVE10',
    description: 'Flat 10% discount on orders above ₹4,999',
    discountPercentage: 10,
    maxDiscountPaise: 200000,
    minOrderValuePaise: 499900,
    usageLimit: 500,
    usedCount: 42,
    isActive: true,
    validUntil: '2026-12-31'
  },
  {
    id: 'cpn-2',
    code: 'KOLHAPUR20',
    description: 'Special 20% discount for our valued customers',
    discountPercentage: 20,
    maxDiscountPaise: 350000,
    minOrderValuePaise: 799900,
    usageLimit: 200,
    usedCount: 18,
    isActive: true,
    validUntil: '2026-12-31'
  }
];

const FILTER_TEST_PRODUCTS: SareeProduct[] = [
  {
    id: 'filter-demo-cotton',
    name: 'Everyday Grace Handloom Cotton Saree',
    slug: 'everyday-grace-handloom-cotton-saree',
    sku: 'KFS-DEMO-COT-01',
    description: 'An affordable, breathable handloom cotton saree for daily wear and office use.',
    categoryIds: ['cat-cotton', 'cat-traditional'],
    categoryNames: ['Cotton Sarees', 'Traditional Sarees'],
    fabric: 'Handloom Cotton',
    occasion: 'Daily Wear, Office',
    lengthMeters: 6.3,
    blousePiece: 'Matching cotton blouse piece included (0.8m)',
    careInstructions: 'Gentle hand wash in cold water. Dry in shade.',
    primaryImage: IMAGE_SAREE_PURPLE,
    galleryImages: [IMAGE_SAREE_PURPLE],
    variants: [{
      variantId: 'var-demo-cotton',
      colorName: 'Leaf Green',
      colorHex: '#15803D',
      sku: 'KFS-DEMO-COT-01-GRN',
      originalPricePaise: 329900,
      sellingPricePaise: 249900,
      inventoryStock: 12,
      reservedStock: 0,
      images: [IMAGE_SAREE_PURPLE]
    }],
    featured: false,
    trending: false,
    isNewArrival: true,
    isPublished: true,
    rating: 4.4,
    reviewsCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'filter-demo-silk',
    name: 'Festive Bloom Silk Cotton Saree',
    slug: 'festive-bloom-silk-cotton-saree',
    sku: 'KFS-DEMO-SC-02',
    description: 'A colorful silk-cotton blend for festivals and poojas, offered at a budget-friendly price.',
    categoryIds: ['cat-festive', 'cat-cotton'],
    categoryNames: ['Festive Sarees', 'Cotton Sarees'],
    fabric: 'Silk Cotton Blend',
    occasion: 'Festival, Pooja',
    lengthMeters: 6.3,
    blousePiece: 'Matching blouse piece included (0.8m)',
    careInstructions: 'Gentle hand wash in cold water. Dry in shade.',
    primaryImage: IMAGE_HERO_PAITHANI,
    galleryImages: [IMAGE_HERO_PAITHANI],
    variants: [{
      variantId: 'var-demo-silk-cotton',
      colorName: 'Crimson Red',
      colorHex: '#B91C1C',
      sku: 'KFS-DEMO-SC-02-RED',
      originalPricePaise: 699900,
      sellingPricePaise: 549900,
      inventoryStock: 8,
      reservedStock: 0,
      images: [IMAGE_HERO_PAITHANI]
    }],
    featured: false,
    trending: true,
    isNewArrival: false,
    isPublished: true,
    rating: 4.6,
    reviewsCount: 21,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'filter-demo-georgette',
    name: 'Midnight Charm Georgette Party Saree',
    slug: 'midnight-charm-georgette-party-saree',
    sku: 'KFS-DEMO-GEO-03',
    description: 'A light georgette saree with a zari border for parties, receptions, and evening celebrations.',
    categoryIds: ['cat-party', 'cat-designer'],
    categoryNames: ['Party Wear Sarees', 'Designer Sarees'],
    fabric: 'Georgette with Zari Border',
    occasion: 'Party, Reception',
    lengthMeters: 6.3,
    blousePiece: 'Matching blouse piece included (0.8m)',
    careInstructions: 'Dry clean recommended. Do not wring.',
    primaryImage: IMAGE_SAREE_EMERALD,
    galleryImages: [IMAGE_SAREE_EMERALD],
    variants: [{
      variantId: 'var-demo-georgette',
      colorName: 'Teal Blue',
      colorHex: '#0F766E',
      sku: 'KFS-DEMO-GEO-03-TEL',
      originalPricePaise: 1099900,
      sellingPricePaise: 899900,
      inventoryStock: 0,
      reservedStock: 0,
      images: [IMAGE_SAREE_EMERALD]
    }],
    featured: false,
    trending: false,
    isNewArrival: true,
    isPublished: true,
    rating: 4.5,
    reviewsCount: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'filter-demo-paithani',
    name: 'Rang Rani Paithani Silk Saree',
    slug: 'rang-rani-paithani-silk-saree',
    sku: 'KFS-DEMO-PAI-04',
    description: 'A richly colored Paithani silk saree with traditional motifs for weddings and festive occasions.',
    categoryIds: ['cat-paithani', 'cat-wedding', 'cat-silk'],
    categoryNames: ['Paithani Sarees', 'Wedding Sarees', 'Silk Sarees'],
    fabric: 'Pure Mulberry Silk',
    occasion: 'Wedding, Festival',
    lengthMeters: 6.3,
    blousePiece: 'Contrast silk blouse piece included (0.8m)',
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth.',
    primaryImage: IMAGE_SAREE_MAROON,
    galleryImages: [IMAGE_SAREE_MAROON],
    variants: [{
      variantId: 'var-demo-paithani',
      colorName: 'Royal Maroon',
      colorHex: '#641D32',
      sku: 'KFS-DEMO-PAI-04-MRN',
      originalPricePaise: 1799900,
      sellingPricePaise: 1499900,
      inventoryStock: 4,
      reservedStock: 0,
      images: [IMAGE_SAREE_MAROON]
    }],
    featured: true,
    trending: true,
    isNewArrival: false,
    isPublished: true,
    rating: 4.8,
    reviewsCount: 34,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'filter-demo-kanjivaram',
    name: 'Maharani Kanjivaram Bridal Silk Saree',
    slug: 'maharani-kanjivaram-bridal-silk-saree',
    sku: 'KFS-DEMO-KAN-05',
    description: 'A premium Kanjivaram silk bridal saree with a contrasting zari border and a grand pallu.',
    categoryIds: ['cat-wedding', 'cat-silk'],
    categoryNames: ['Wedding Sarees', 'Silk Sarees'],
    fabric: 'Kanjivaram Pure Silk',
    occasion: 'Wedding, Reception',
    lengthMeters: 6.3,
    blousePiece: 'Contrast brocade blouse piece included (0.8m)',
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth.',
    primaryImage: IMAGE_SAREE_PURPLE,
    galleryImages: [IMAGE_SAREE_PURPLE],
    variants: [{
      variantId: 'var-demo-kanjivaram',
      colorName: 'Imperial Purple',
      colorHex: '#6D28D9',
      sku: 'KFS-DEMO-KAN-05-PUR',
      originalPricePaise: 2599900,
      sellingPricePaise: 2299900,
      inventoryStock: 2,
      reservedStock: 0,
      images: [IMAGE_SAREE_PURPLE]
    }],
    featured: true,
    trending: false,
    isNewArrival: true,
    isPublished: true,
    rating: 4.9,
    reviewsCount: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ---------------------------------------------------------------------------
// Test product builder
// ---------------------------------------------------------------------------
const buildTestProduct = (p: {
  n: string; // number/key, used in ids/skus
  description?: string;
  name: string;
  categoryIds: string[];
  fabric: string;
  occasion: string;
  image: string;
  variants: {
    color: string;
    hex: string;
    original: number;
    selling: number;
    stock: number;
    reserved?: number;
  }[];
  featured?: boolean;
  trending?: boolean;
  isNewArrival?: boolean;
  isPublished?: boolean;
  rating: number;
  reviewsCount: number;
}): SareeProduct => {
  const slug = p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    id: `filter-extra-${p.n}`,
    name: p.name,
    slug,
    sku: `KFS-EXTRA-${p.n}`,
    description: p.description ?? `Test product (${p.fabric}) for ${p.occasion}.`,
    categoryIds: p.categoryIds,
    categoryNames: p.categoryIds.map(
      (id) => INITIAL_CATEGORIES.find((c) => c.id === id)!.name as SareeCategory
    ),
    fabric: p.fabric,
    occasion: p.occasion,
    lengthMeters: 6.3,
    blousePiece: 'Matching blouse piece included (0.8m)',
    careInstructions: 'Follow care label.',
    primaryImage: p.image,
    galleryImages: [p.image],
    variants: p.variants.map((v, i) => ({
      variantId: `var-extra-${p.n}-${i + 1}`,
      colorName: v.color,
      colorHex: v.hex,
      sku: `KFS-EXTRA-${p.n}-V${i + 1}`,
      originalPricePaise: v.original,
      sellingPricePaise: v.selling,
      inventoryStock: v.stock,
      reservedStock: v.reserved ?? 0,
      images: [p.image]
    })),
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    isNewArrival: p.isNewArrival ?? false,
    isPublished: p.isPublished ?? true,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// ---------------------------------------------------------------------------
// Extra filter-test data (n = 01 .. 31)
// Covers: every category, many fabrics/occasions/colors, price extremes and
// boundaries, discount vs no discount, in/out of stock, reserved stock,
// rating range, featured/trending/new flags, and an unpublished product.
// ---------------------------------------------------------------------------
const EXTRA_FILTER_TEST_PRODUCTS: SareeProduct[] = [
  // Cheapest item (< ₹1,000), big discount, plenty of stock
  buildTestProduct({
    n: '01', name: 'Budget Daily Mulmul Cotton Saree', categoryIds: ['cat-cotton'],
    fabric: 'Mulmul Cotton', occasion: 'Daily Wear', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Sky Blue', hex: '#38BDF8', original: 129900, selling: 79900, stock: 25 }],
    rating: 3.9, reviewsCount: 7
  }),
  // No discount (original == selling), multi-colour, one colour out of stock
  buildTestProduct({
    n: '02', name: 'Classic Kolhapur Handloom Cotton Saree', categoryIds: ['cat-cotton', 'cat-traditional'],
    fabric: 'Handloom Cotton', occasion: 'Daily Wear, Office', image: IMAGE_SAREE_MAROON,
    variants: [
      { color: 'Mustard Yellow', hex: '#CA8A04', original: 129900, selling: 129900, stock: 15 },
      { color: 'Indigo', hex: '#3730A3', original: 129900, selling: 129900, stock: 0 },
      { color: 'Rust Orange', hex: '#C2410C', original: 129900, selling: 129900, stock: 6 }
    ],
    rating: 4.2, reviewsCount: 18
  }),
  // Stock fully reserved => effectively out of stock (available = stock - reserved)
  buildTestProduct({
    n: '03', name: 'Pearl Whisper Organza Party Saree', categoryIds: ['cat-party', 'cat-designer'],
    fabric: 'Organza', occasion: 'Party, Cocktail', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Blush Pink', hex: '#F9A8D4', original: 349900, selling: 249900, stock: 3, reserved: 3 }],
    trending: true, isNewArrival: true, rating: 4.3, reviewsCount: 11
  }),
  // Exactly ₹4,999 (price-range boundary + FESTIVE10 minimum order)
  buildTestProduct({
    n: '04', name: 'Boundary Price Designer Georgette Saree', categoryIds: ['cat-designer'],
    fabric: 'Georgette', occasion: 'Party, Festival', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Wine', hex: '#7F1D1D', original: 599900, selling: 499900, stock: 9 }],
    rating: 4.1, reviewsCount: 14
  }),
  // Mid-range festive, 3 colours all in stock
  buildTestProduct({
    n: '05', name: 'Bandhani Utsav Festive Saree', categoryIds: ['cat-festive', 'cat-traditional'],
    fabric: 'Bandhani Silk', occasion: 'Festival, Gudi Padwa', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Saffron', hex: '#F97316', original: 899900, selling: 799900, stock: 10 },
      { color: 'Magenta', hex: '#BE185D', original: 899900, selling: 799900, stock: 7 },
      { color: 'Parrot Green', hex: '#65A30D', original: 899900, selling: 799900, stock: 5 }
    ],
    trending: true, rating: 4.6, reviewsCount: 27
  }),
  // Premium (₹24,999), top rating, featured, very low stock
  buildTestProduct({
    n: '06', name: 'Maharaja Signature Gold Zari Bridal Kanjivaram', categoryIds: ['cat-wedding', 'cat-silk'],
    fabric: 'Kanjivaram Pure Silk', occasion: 'Bridal Wedding', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Bridal Red', hex: '#B91C1C', original: 2999900, selling: 2499900, stock: 1 }],
    featured: true, isNewArrival: true, rating: 5.0, reviewsCount: 3
  }),
  // Low rating + few reviews (rating filter)
  buildTestProduct({
    n: '07', name: 'Value Paithani Art Silk Saree', categoryIds: ['cat-paithani', 'cat-silk'],
    fabric: 'Art Silk', occasion: 'Festival, Pooja', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Peacock Blue', hex: '#0E7490', original: 499900, selling: 349900, stock: 14 }],
    rating: 3.4, reviewsCount: 2
  }),
  // Mid rating; featured / trending / new all false
  buildTestProduct({
    n: '08', name: 'Chanderi Silk Cotton Traditional Saree', categoryIds: ['cat-traditional', 'cat-silk'],
    fabric: 'Chanderi Silk Cotton', occasion: 'Pooja, Family Function', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Ivory & Gold', hex: '#FEF3C7', original: 349900, selling: 299900, stock: 20 }],
    rating: 4.0, reviewsCount: 40
  }),
  // UNPUBLISHED: must NOT appear anywhere on the storefront
  buildTestProduct({
    n: '09', name: 'Hidden Draft Saree (Unpublished)', categoryIds: ['cat-silk'],
    fabric: 'Pure Silk', occasion: 'Wedding', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Black', hex: '#111827', original: 999900, selling: 899900, stock: 10 }],
    isPublished: false, featured: true, rating: 4.7, reviewsCount: 5
  }),
  // All variants out of stock
  buildTestProduct({
    n: '10', name: 'Sequin Shimmer Net Party Saree', categoryIds: ['cat-party'],
    fabric: 'Net with Sequin Work', occasion: 'Party, Reception', image: IMAGE_SAREE_EMERALD,
    variants: [
      { color: 'Silver Grey', hex: '#9CA3AF', original: 449900, selling: 329900, stock: 0 },
      { color: 'Midnight Navy', hex: '#1E3A8A', original: 449900, selling: 329900, stock: 0 }
    ],
    trending: true, rating: 4.4, reviewsCount: 19
  }),
  // Single category, new arrival only
  buildTestProduct({
    n: '11', name: 'Diwali Glow Festive Silk Saree', categoryIds: ['cat-festive'],
    fabric: 'Pure Mulberry Silk', occasion: 'Diwali, Festival', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Golden Yellow', hex: '#EAB308', original: 1099900, selling: 899900, stock: 11 }],
    isNewArrival: true, rating: 4.7, reviewsCount: 25
  }),
  // Very long name + four categories (UI overflow + multi-category filter)
  buildTestProduct({
    n: '12',
    name: 'Grand Heritage Handwoven Pure Katan Silk Wedding Festive Collection Saree With Antique Zari',
    categoryIds: ['cat-silk', 'cat-wedding', 'cat-festive', 'cat-traditional'],
    fabric: 'Katan Pure Silk', occasion: 'Wedding, Festival, Reception', image: IMAGE_SAREE_MAROON,
    variants: [
      { color: 'Teal', hex: '#0F766E', original: 1999900, selling: 1599900, stock: 4 },
      { color: 'Plum', hex: '#6B21A8', original: 1999900, selling: 1599900, stock: 2 }
    ],
    featured: true, trending: true, rating: 4.8, reviewsCount: 52
  }),
  buildTestProduct({
    n: '13', name: 'Linen Cotton Office Wear Saree', categoryIds: ['cat-cotton'],
    fabric: 'Linen Cotton', occasion: 'Office, Daily Wear', image: IMAGE_SAREE_PURPLE,
    variants: [
      { color: 'Charcoal Grey', hex: '#4B5563', original: 189900, selling: 149900, stock: 18 },
      { color: 'Olive Green', hex: '#4D7C0F', original: 189900, selling: 149900, stock: 12 },
      { color: 'Dusty Rose', hex: '#BE7C8A', original: 189900, selling: 149900, stock: 9 }
    ],
    rating: 4.3, reviewsCount: 29
  }),
  buildTestProduct({
    n: '14', name: 'Kota Doria Summer Breeze Saree', categoryIds: ['cat-cotton', 'cat-traditional'],
    fabric: 'Kota Doria Cotton Silk', occasion: 'Summer, Casual, Pooja', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Lemon Cream', hex: '#FDE68A', original: 239900, selling: 189900, stock: 10 },
      { color: 'Mint', hex: '#6EE7B7', original: 239900, selling: 189900, stock: 0 }
    ],
    rating: 4.2, reviewsCount: 16
  }),
  buildTestProduct({
    n: '15', name: 'Khadi Handspun Cotton Saree', categoryIds: ['cat-cotton', 'cat-traditional'],
    fabric: 'Khadi Cotton', occasion: 'Daily Wear, Casual', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Natural Beige', hex: '#D6C3A5', original: 119900, selling: 119900, stock: 30 }],
    rating: 4.1, reviewsCount: 33
  }),
  buildTestProduct({
    n: '16', name: 'Floral Print Georgette Saree', categoryIds: ['cat-party'],
    fabric: 'Printed Georgette', occasion: 'Casual Party, Birthday', image: IMAGE_SAREE_EMERALD,
    variants: [
      { color: 'Coral', hex: '#FB7185', original: 249900, selling: 179900, stock: 16 },
      { color: 'Lavender', hex: '#A78BFA', original: 249900, selling: 179900, stock: 11 }
    ],
    isNewArrival: true, rating: 3.8, reviewsCount: 13
  }),
  buildTestProduct({
    n: '17', name: 'Chiffon Garden Floral Saree', categoryIds: ['cat-party', 'cat-designer'],
    fabric: 'Chiffon', occasion: 'Party, Outing', image: IMAGE_SAREE_PURPLE,
    variants: [
      { color: 'Peach', hex: '#FDBA74', original: 279900, selling: 199900, stock: 14 },
      { color: 'Sea Green', hex: '#34D399', original: 279900, selling: 199900, stock: 8 },
      { color: 'Powder Blue', hex: '#93C5FD', original: 279900, selling: 199900, stock: 5 }
    ],
    rating: 4.4, reviewsCount: 24
  }),
  buildTestProduct({
    n: '18', name: 'Satin Silk Cocktail Party Saree', categoryIds: ['cat-party'],
    fabric: 'Satin Silk', occasion: 'Cocktail, Party, Sangeet', image: IMAGE_SAREE_EMERALD,
    variants: [
      { color: 'Wine Red', hex: '#9F1239', original: 349900, selling: 279900, stock: 7 },
      { color: 'Royal Blue', hex: '#1D4ED8', original: 349900, selling: 279900, stock: 6 }
    ],
    trending: true, rating: 4.5, reviewsCount: 21
  }),
  buildTestProduct({
    n: '19', name: 'Ruffle Net Designer Saree', categoryIds: ['cat-designer', 'cat-party'],
    fabric: 'Net with Ruffle Border', occasion: 'Reception, Party', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Rose Gold', hex: '#E8B4A0', original: 499900, selling: 379900, stock: 6 }],
    isNewArrival: true, featured: true, rating: 4.6, reviewsCount: 17
  }),
  buildTestProduct({
    n: '20', name: 'Tussar Silk Festive Saree', categoryIds: ['cat-festive', 'cat-silk'],
    fabric: 'Tussar Silk', occasion: 'Festival, Pooja, Family Function', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Mustard Gold', hex: '#D4A017', original: 419900, selling: 329900, stock: 9 },
      { color: 'Brick Red', hex: '#B03A2E', original: 419900, selling: 329900, stock: 7 }
    ],
    rating: 4.4, reviewsCount: 26
  }),
  buildTestProduct({
    n: '21', name: 'Semi Paithani Silk Saree', categoryIds: ['cat-paithani', 'cat-festive'],
    fabric: 'Semi Silk', occasion: 'Festival, Gudi Padwa, Haldi Kunku', image: IMAGE_SAREE_PURPLE,
    variants: [
      { color: 'Rani Pink', hex: '#DB2777', original: 699900, selling: 549900, stock: 10 },
      { color: 'Parrot Green', hex: '#65A30D', original: 699900, selling: 549900, stock: 8 },
      { color: 'Firozi Blue', hex: '#0891B2', original: 699900, selling: 549900, stock: 6 }
    ],
    trending: true, rating: 4.6, reviewsCount: 41
  }),
  buildTestProduct({
    n: '22', name: 'Pure Paithani Peacock Mor Pallu Saree', categoryIds: ['cat-paithani', 'cat-silk', 'cat-wedding'],
    fabric: 'Pure Silk Paithani', occasion: 'Wedding, Engagement, Festival', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Magenta & Gold', hex: '#A21CAF', original: 1599900, selling: 1299900, stock: 3 },
      { color: 'Navy & Gold', hex: '#1E3A8A', original: 1599900, selling: 1299900, stock: 2, reserved: 1 }
    ],
    featured: true, rating: 4.9, reviewsCount: 36
  }),
  buildTestProduct({
    n: '23', name: 'Banarasi Georgette Festive Saree', categoryIds: ['cat-festive', 'cat-traditional'],
    fabric: 'Banarasi Georgette', occasion: 'Festival, Diwali, Family Function', image: IMAGE_SAREE_MAROON,
    variants: [
      { color: 'Bottle Green', hex: '#14532D', original: 599900, selling: 449900, stock: 8 },
      { color: 'Maroon', hex: '#7F1D1D', original: 599900, selling: 449900, stock: 6 }
    ],
    rating: 4.5, reviewsCount: 30
  }),
  buildTestProduct({
    n: '24', name: 'Patola Style Silk Saree', categoryIds: ['cat-silk', 'cat-traditional'],
    fabric: 'Patola Silk', occasion: 'Wedding Guest, Festival', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Orange & Green', hex: '#EA580C', original: 899900, selling: 699900, stock: 5 }],
    rating: 4.3, reviewsCount: 12
  }),
  buildTestProduct({
    n: '25', name: 'Mysore Crepe Silk Saree', categoryIds: ['cat-silk', 'cat-traditional'],
    fabric: 'Mysore Crepe Silk', occasion: 'Festival, Office Party, Pooja', image: IMAGE_SAREE_EMERALD,
    variants: [
      { color: 'Magenta', hex: '#C026D3', original: 949900, selling: 749900, stock: 9 },
      { color: 'Teal', hex: '#0F766E', original: 949900, selling: 749900, stock: 4 }
    ],
    featured: true, rating: 4.7, reviewsCount: 48
  }),
  buildTestProduct({
    n: '26', name: 'Kanjivaram Semi Silk Wedding Saree', categoryIds: ['cat-wedding', 'cat-silk'],
    fabric: 'Kanjivaram Semi Silk', occasion: 'Wedding, Reception', image: IMAGE_SAREE_MAROON,
    variants: [
      { color: 'Peacock Green', hex: '#047857', original: 1199900, selling: 899900, stock: 6 },
      { color: 'Temple Red', hex: '#B91C1C', original: 1199900, selling: 899900, stock: 5 }
    ],
    rating: 4.5, reviewsCount: 19
  }),
  buildTestProduct({
    n: '27', name: 'Bridal Banarasi Zari Silk Saree', categoryIds: ['cat-wedding', 'cat-silk', 'cat-traditional'],
    fabric: 'Banarasi Pure Silk', occasion: 'Bridal Wedding, Reception', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Bridal Red', hex: '#991B1B', original: 2399900, selling: 1899900, stock: 3 }],
    featured: true, isNewArrival: true, rating: 4.9, reviewsCount: 28
  }),
  buildTestProduct({
    n: '28', name: 'Velvet Border Reception Designer Saree', categoryIds: ['cat-wedding', 'cat-designer'],
    fabric: 'Silk Blend with Velvet Border', occasion: 'Reception, Engagement', image: IMAGE_SAREE_EMERALD,
    variants: [
      { color: 'Midnight Blue', hex: '#172554', original: 849900, selling: 649900, stock: 4 },
      { color: 'Emerald', hex: '#065F46', original: 849900, selling: 649900, stock: 3 }
    ],
    rating: 4.4, reviewsCount: 10
  }),
  buildTestProduct({
    n: '29', name: 'Gadwal Cotton Silk Saree', categoryIds: ['cat-traditional', 'cat-cotton'],
    fabric: 'Gadwal Cotton Silk', occasion: 'Pooja, Office, Family Function', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Maroon & Gold', hex: '#7C1D3A', original: 529900, selling: 429900, stock: 12 },
      { color: 'Navy & Gold', hex: '#1E3A8A', original: 529900, selling: 429900, stock: 10 }
    ],
    rating: 4.5, reviewsCount: 22
  }),
  buildTestProduct({
    n: '30', name: 'Pooja Special Cotton Silk Saree', categoryIds: ['cat-cotton', 'cat-festive'],
    fabric: 'Cotton Silk', occasion: 'Pooja, Festival', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Turmeric Yellow', hex: '#EAB308', original: 119900, selling: 89900, stock: 40 }],
    rating: 3.7, reviewsCount: 6
  }),
  buildTestProduct({
    n: '31', name: 'Ilkal Handloom Saree', categoryIds: ['cat-traditional', 'cat-cotton'],
    fabric: 'Ilkal Cotton Silk', occasion: 'Daily Wear, Pooja, Family Function', image: IMAGE_SAREE_MAROON,
    variants: [
      { color: 'Red & Green', hex: '#B91C1C', original: 269900, selling: 229900, stock: 14 },
      { color: 'Purple & Orange', hex: '#7E22CE', original: 269900, selling: 229900, stock: 1, reserved: 1 }
    ],
    rating: 4.3, reviewsCount: 20
  })
];

// n = 32 .. 55
const EXTRA_FILTER_TEST_PRODUCTS_2: SareeProduct[] = [
  buildTestProduct({
    n: '32', name: 'Katan Paithani Bridal Silk Saree', categoryIds: ['cat-paithani', 'cat-wedding', 'cat-silk'],
    fabric: 'Katan Silk Paithani', occasion: 'Wedding, Engagement', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Peacock Green', hex: '#0F766E', original: 2199900, selling: 1799900, stock: 5 }],
    featured: true, rating: 4.8, reviewsCount: 64
  }),
  buildTestProduct({
    n: '33', name: 'Katan Silk Digital Print Designer Saree', categoryIds: ['cat-designer', 'cat-silk'],
    fabric: 'Katan Silk with Digital Print', occasion: 'Party, Reception', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Ink Blue', hex: '#1E3A8A', original: 1099900, selling: 849900, stock: 7 }],
    isNewArrival: true, rating: 4.2, reviewsCount: 9
  }),
  buildTestProduct({
    n: '34', name: 'Katan Silk Blend Party Saree', categoryIds: ['cat-party', 'cat-silk'],
    fabric: 'Katan Silk Blend', occasion: 'Party, Anniversary', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Wine', hex: '#7F1D1D', original: 799900, selling: 629900, stock: 6 }],
    rating: 4.3, reviewsCount: 14
  }),
  buildTestProduct({
    n: '35', name: 'Katan Handloom Traditional Saree', categoryIds: ['cat-traditional', 'cat-festive'],
    fabric: 'Katan Handloom Silk', occasion: 'Festival, Family Function', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Mustard', hex: '#CA8A04', original: 1249900, selling: 999900, stock: 8 }],
    rating: 4.6, reviewsCount: 57
  }),
  buildTestProduct({
    n: '36', name: 'Katan Festive Zari Border Saree', categoryIds: ['cat-festive', 'cat-silk'],
    fabric: 'Katan Silk', occasion: 'Diwali, Navratri', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Rani Pink', hex: '#DB2777', original: 919900, selling: 729900, stock: 9 }],
    trending: true, rating: 4.5, reviewsCount: 33
  }),
  buildTestProduct({
    n: '37', name: 'Katan Brocade Heavy Wedding Saree', categoryIds: ['cat-wedding', 'cat-silk'],
    fabric: 'Katan Pure Silk Brocade', occasion: 'Bridal Wedding', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Bridal Maroon', hex: '#7F1D1D', original: 2699900, selling: 2199900, stock: 3 }],
    featured: true, rating: 4.9, reviewsCount: 41
  }),
  buildTestProduct({
    n: '38', name: 'Silk Georgette Wedding Guest Saree', categoryIds: ['cat-wedding', 'cat-silk', 'cat-party'],
    fabric: 'Silk Georgette', occasion: 'Wedding Guest, Reception', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Dusty Rose', hex: '#BE7C8A', original: 799900, selling: 599900, stock: 10 }],
    rating: 4.4, reviewsCount: 26
  }),
  buildTestProduct({
    n: '39', name: 'Bandhej Georgette Traditional Saree', categoryIds: ['cat-traditional', 'cat-festive'],
    fabric: 'Bandhej Georgette', occasion: 'Gudi Padwa, Haldi Kunku', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Orange', hex: '#EA580C', original: 359900, selling: 289900, stock: 15 }],
    rating: 4.1, reviewsCount: 18
  }),
  // Biggest discount (~42%)
  buildTestProduct({
    n: '40', name: 'Sequin Georgette Party Saree', categoryIds: ['cat-party'],
    fabric: 'Sequin Georgette', occasion: 'Party, Cocktail', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Black', hex: '#111827', original: 599900, selling: 349900, stock: 12 }],
    trending: true, rating: 4.0, reviewsCount: 31
  }),
  buildTestProduct({
    n: '41', name: 'Ombre Georgette Designer Saree', categoryIds: ['cat-designer'],
    fabric: 'Ombre Georgette', occasion: 'Party, Sangeet', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Pink to Purple', hex: '#C026D3', original: 279900, selling: 219900, stock: 11 }],
    rating: 4.2, reviewsCount: 12
  }),
  buildTestProduct({
    n: '42', name: 'Printed Georgette Festive Saree', categoryIds: ['cat-festive'],
    fabric: 'Printed Georgette', occasion: 'Festival, Pooja', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Teal', hex: '#0F766E', original: 199900, selling: 159900, stock: 20 }],
    rating: 3.9, reviewsCount: 8
  }),
  buildTestProduct({
    n: '43', name: 'Stone Work Georgette Reception Saree', categoryIds: ['cat-wedding', 'cat-party'],
    fabric: 'Heavy Georgette with Stone Work', occasion: 'Reception, Engagement', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Navy', hex: '#172554', original: 1499900, selling: 1149900, stock: 4 }],
    rating: 4.5, reviewsCount: 15
  }),
  // Cotton in Paithani
  buildTestProduct({
    n: '44', name: 'Cotton Silk Paithani Border Saree', categoryIds: ['cat-paithani', 'cat-cotton'],
    fabric: 'Paithani Cotton Silk', occasion: 'Pooja, Festival', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Parrot Green', hex: '#65A30D', original: 499900, selling: 399900, stock: 13 }],
    rating: 4.4, reviewsCount: 35
  }),
  // Cotton in Designer, NO discount
  buildTestProduct({
    n: '45', name: 'Block Print Cotton Designer Saree', categoryIds: ['cat-designer', 'cat-cotton'],
    fabric: 'Block Print Cotton', occasion: 'Casual, Office', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Indigo', hex: '#3730A3', original: 139900, selling: 139900, stock: 22 }],
    rating: 4.0, reviewsCount: 21
  }),
  buildTestProduct({
    n: '46', name: 'Cotton Silk Zari Wedding Guest Saree', categoryIds: ['cat-wedding', 'cat-cotton'],
    fabric: 'Cotton Silk with Zari', occasion: 'Wedding Guest, Pooja', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Peach', hex: '#FDBA74', original: 569900, selling: 459900, stock: 9 }],
    rating: 4.3, reviewsCount: 17
  }),
  buildTestProduct({
    n: '47', name: 'Silk Cotton Handloom Saree', categoryIds: ['cat-silk', 'cat-cotton'],
    fabric: 'Silk Cotton Handloom', occasion: 'Office, Pooja', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Bottle Green', hex: '#14532D', original: 399900, selling: 319900, stock: 16 }],
    rating: 4.2, reviewsCount: 28
  }),
  buildTestProduct({
    n: '48', name: 'Nauvari Paithani Silk Saree',
    description: 'Traditional nine-yard Nauvari Paithani drape worn in Maharashtra for festivals and cultural events.',
    categoryIds: ['cat-paithani', 'cat-traditional', 'cat-festive'],
    fabric: 'Pure Silk', occasion: 'Mangalagaur, Ganesh Chaturthi, Haldi Kunku', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Navy & Gold', hex: '#1E3A8A', original: 849900, selling: 679900, stock: 6 }],
    trending: true, rating: 4.7, reviewsCount: 44
  }),
  // Highest price among the original test items
  buildTestProduct({
    n: '49', name: 'Peshwai Heritage Paithani Saree',
    description: 'Peshwai-era inspired Paithani with a grand peacock pallu, the highest priced saree in the store.',
    categoryIds: ['cat-paithani', 'cat-wedding', 'cat-silk'],
    fabric: 'Pure Mulberry Silk', occasion: 'Wedding, Navratri', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Royal Purple', hex: '#4B0082', original: 2999900, selling: 2399900, stock: 2 }],
    featured: true, rating: 4.9, reviewsCount: 22
  }),
  buildTestProduct({
    n: '50', name: 'Karvati Kath Cotton Saree',
    description: 'Classic Kolhapur Karvati Kath border handloom cotton saree.',
    categoryIds: ['cat-traditional', 'cat-cotton'],
    fabric: 'Handloom Cotton', occasion: 'Daily Wear, Pooja', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Red & Black', hex: '#991B1B', original: 219900, selling: 179900, stock: 18 }],
    rating: 4.3, reviewsCount: 36
  }),
  buildTestProduct({
    n: '51', name: 'Shimmer Tissue Party Saree', categoryIds: ['cat-party', 'cat-designer'],
    fabric: 'Tissue Silk', occasion: 'Party, Wedding Guest', image: IMAGE_SAREE_EMERALD,
    variants: [{ color: 'Gold', hex: '#D4A017', original: 499900, selling: 399900, stock: 8 }],
    trending: true, isNewArrival: true, rating: 4.5, reviewsCount: 19
  }),
  buildTestProduct({
    n: '52', name: 'Digital Print Crepe Designer Saree', categoryIds: ['cat-designer'],
    fabric: 'Crepe', occasion: 'Office Party, Brunch', image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Mint', hex: '#6EE7B7', original: 329900, selling: 269900, stock: 14 }],
    rating: 3.8, reviewsCount: 6
  }),
  // VARIANTS WITH DIFFERENT PRICES (tests min/max price on any variant)
  buildTestProduct({
    n: '53', name: 'Border Upgrade Katan Silk Saree', categoryIds: ['cat-silk', 'cat-traditional'],
    fabric: 'Katan Silk', occasion: 'Wedding Guest, Festival', image: IMAGE_HERO_PAITHANI,
    variants: [
      { color: 'Basic Border (Ivory)', hex: '#F5F5DC', original: 879900, selling: 699900, stock: 10 },
      { color: 'Rich Zari Border (Maroon)', hex: '#7F1D1D', original: 1179900, selling: 949900, stock: 6 },
      { color: 'Full Zari Border (Emerald)', hex: '#046A38', original: 1499900, selling: 1199900, stock: 3 }
    ],
    rating: 4.6, reviewsCount: 23
  }),
  // Most reviews (Most Popular sort) + cheapest
  buildTestProduct({
    n: '54', name: 'Bestseller Everyday Cotton Saree', categoryIds: ['cat-cotton', 'cat-traditional'],
    fabric: 'Handloom Cotton', occasion: 'Daily Wear, Office', image: IMAGE_SAREE_MAROON,
    variants: [{ color: 'Sky Blue', hex: '#38BDF8', original: 149900, selling: 99900, stock: 60 }],
    rating: 4.7, reviewsCount: 318
  }),
  // Fewest reviews, new arrival
  buildTestProduct({
    n: '55', name: 'Just Launched Festive Silk Saree', categoryIds: ['cat-festive', 'cat-silk'],
    fabric: 'Pure Mulberry Silk', occasion: 'Diwali, Pooja', image: IMAGE_HERO_PAITHANI,
    variants: [{ color: 'Saffron', hex: '#F97316', original: 1099900, selling: 949900, stock: 10 }],
    isNewArrival: true, rating: 4.0, reviewsCount: 1
  })
];

// ---------------------------------------------------------------------------
// NEW: filter matrix - every category x 4 shared fabrics x 6 price tiers = 192
// sarees. So every "category + fabric" view (e.g. Festive + Handloom Cotton)
// has 6 sarees: 5 always in stock and published, the 6th is sometimes sold out
// or fully reserved. Prices, discounts, ratings and flags are spread out so
// every filter and sort has something to do.
// ---------------------------------------------------------------------------
const MATRIX_FABRICS = [
  { fabric: 'Handloom Cotton',    occasion: 'Daily Wear, Office', tiers: [699, 999, 1299, 1799, 2499, 3499] },
  { fabric: 'Cotton Silk',        occasion: 'Pooja, Festival',    tiers: [1499, 1999, 2999, 3999, 4999, 6499] },
  { fabric: 'Georgette',          occasion: 'Party, Reception',   tiers: [1999, 2999, 3999, 5999, 7999, 9999] },
  { fabric: 'Pure Mulberry Silk', occasion: 'Wedding, Festival',  tiers: [7999, 9999, 12999, 17999, 21999, 29999] }
];
const MATRIX_IMAGES = [IMAGE_SAREE_PURPLE, IMAGE_HERO_PAITHANI, IMAGE_SAREE_MAROON, IMAGE_SAREE_EMERALD];
const MATRIX_COLORS = [
  { color: 'Maroon', hex: '#7F1D1D' },
  { color: 'Teal', hex: '#0F766E' },
  { color: 'Mustard', hex: '#CA8A04' },
  { color: 'Navy', hex: '#1E3A8A' },
  { color: 'Rani Pink', hex: '#DB2777' },
  { color: 'Parrot Green', hex: '#65A30D' }
];
const TIER_NAMES = ['Budget', 'Everyday', 'Classic', 'Signature', 'Premium', 'Royal'];

const MATRIX_PRODUCTS: SareeProduct[] = INITIAL_CATEGORIES.flatMap((cat, ci) =>
  MATRIX_FABRICS.flatMap((f, fi) =>
    f.tiers.map((rupees, ti) => {
      const i = ci * 24 + fi * 6 + ti; // 0..191
      const combo = ci * 4 + fi; // one number per category + fabric
      const selling = rupees * 100; // paise
      const hasDiscount = i % 3 !== 0; // 1 in 3 has NO discount
      const original = hasDiscount
        ? Math.round((selling * (1.15 + (i % 5) * 0.07)) / 100) * 100
        : selling;

      // Only the LAST tier of a combo can be unavailable, so 5 stay in stock.
      let stock = 2 + (i % 12);
      let reserved = 0;
      if (ti === 5 && combo % 3 === 0) stock = 0; // sold out
      if (ti === 5 && combo % 3 === 1) reserved = stock; // fully reserved

      const c = MATRIX_COLORS[i % MATRIX_COLORS.length];
      const categoryIds =
        i % 7 === 0 && cat.id !== 'cat-silk' ? [cat.id, 'cat-silk'] : [cat.id];

      return buildTestProduct({
        n: `m${String(i + 1).padStart(3, '0')}`,
        name: `${TIER_NAMES[ti]} ${cat.name.replace(' Sarees', '')} ${f.fabric} Saree`,
        description: `${f.fabric} saree in the ${cat.name} range for ${f.occasion}.`,
        categoryIds,
        fabric: f.fabric,
        occasion: f.occasion,
        image: MATRIX_IMAGES[i % MATRIX_IMAGES.length],
        variants: [{ color: c.color, hex: c.hex, original, selling, stock, reserved }],
        featured: i % 6 === 0,
        trending: i % 4 === 0,
        isNewArrival: i % 5 === 0,
        rating: Math.round((3.2 + (i % 19) * 0.1) * 10) / 10, // 3.2 .. 5.0
        reviewsCount: 1 + ((i * 37) % 250)
      });
    })
  )
);

// Unpublished test saree in the Festive + Handloom Cotton view: must NEVER show.
const HIDDEN_TEST_PRODUCTS: SareeProduct[] = [
  buildTestProduct({
    n: 'hidden-1',
    name: 'Hidden Draft Festive Handloom Cotton Saree (Unpublished)',
    categoryIds: ['cat-festive'],
    fabric: 'Handloom Cotton',
    occasion: 'Festival',
    image: IMAGE_SAREE_PURPLE,
    variants: [{ color: 'Black', hex: '#111827', original: 199900, selling: 149900, stock: 10 }],
    isPublished: false,
    rating: 4.5,
    reviewsCount: 5
  })
];

// Exact price boundaries for the Min / Max price filter
const BOUNDARY_PRODUCTS: SareeProduct[] = [
  { n: 'b1', rupees: 999, cat: 'cat-cotton', fabric: 'Handloom Cotton' },
  { n: 'b2', rupees: 1000, cat: 'cat-cotton', fabric: 'Handloom Cotton' },
  { n: 'b3', rupees: 5000, cat: 'cat-designer', fabric: 'Georgette' },
  { n: 'b4', rupees: 10000, cat: 'cat-wedding', fabric: 'Pure Mulberry Silk' },
  { n: 'b5', rupees: 50000, cat: 'cat-wedding', fabric: 'Kanjivaram Pure Silk' }
].map((b, k) =>
  buildTestProduct({
    n: b.n,
    name: `Exact Price Rs ${b.rupees.toLocaleString('en-IN')} ${b.fabric} Saree`,
    categoryIds: [b.cat],
    fabric: b.fabric,
    occasion: 'Festival, Daily Wear',
    image: MATRIX_IMAGES[k % MATRIX_IMAGES.length],
    variants: [
      { color: 'Maroon', hex: '#7F1D1D', original: b.rupees * 100, selling: b.rupees * 100, stock: 5 }
    ],
    rating: 4.0,
    reviewsCount: 10 + k
  })
);

// ---------------------------------------------------------------------------
// Core catalogue + all test products
// ---------------------------------------------------------------------------
const RAW_PRODUCTS: SareeProduct[] = [
  {
    id: 'saree-01',
    name: 'Shahi Royal Purple Peacock Paithani Silk Saree',
    slug: 'shahi-royal-purple-peacock-paithani-silk-saree',
    sku: 'KFS-PAITH-001',
    description: 'An iconic symbol of Maharashtra royal grandeur, this handwoven pure Paithani silk saree features a rich purple body sprinkled with delicate gold coin butis and a signature kaleidoscopic peacock (mor) pallu hand-loomed with metallic gold thread work.',
    categoryIds: ['cat-paithani', 'cat-silk', 'cat-traditional'],
    categoryNames: ['Paithani Sarees', 'Silk Sarees', 'Traditional Sarees'],
    fabric: 'Pure Mulberry Silk',
    occasion: 'Weddings, Traditional Poojas, Gudi Padwa, Diwali',
    lengthMeters: 6.3,
    blousePiece: 'Running 0.8m unstitched pure silk blouse piece with gold zari border included',
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth away from direct sunlight.',
    primaryImage: IMAGE_SAREE_PURPLE,
    galleryImages: [IMAGE_SAREE_PURPLE, IMAGE_HERO_PAITHANI],
    variants: [
      {
        variantId: 'var-01-purple',
        colorName: 'Royal Purple & Antique Gold',
        colorHex: '#4B0082',
        sku: 'KFS-PAITH-001-PUR',
        originalPricePaise: 1899900,
        sellingPricePaise: 1449900,
        inventoryStock: 8,
        reservedStock: 0,
        images: [IMAGE_SAREE_PURPLE]
      },
      {
        variantId: 'var-01-crimson',
        colorName: 'Crimson Vermilion & Gold',
        colorHex: '#9E1B32',
        sku: 'KFS-PAITH-001-CRM',
        originalPricePaise: 1899900,
        sellingPricePaise: 1449900,
        inventoryStock: 6,
        reservedStock: 0,
        images: [IMAGE_HERO_PAITHANI]
      }
    ],
    featured: true,
    trending: true,
    isNewArrival: true,
    isPublished: true,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'saree-02',
    name: 'Rajwada Bridal Maroon Banarasi Katan Silk Saree',
    slug: 'rajwada-bridal-maroon-banarasi-katan-silk-saree',
    sku: 'KFS-BAN-002',
    description: 'Crafted for the unforgettable bride, this deep royal maroon Banarasi saree is woven with pure Katan silk and opulent Champagne Gold kadwa brocade. The heavy pallu showcases classical paisley motifs and an intricate temple architectural border.',
    categoryIds: ['cat-wedding', 'cat-silk', 'cat-traditional'],
    categoryNames: ['Wedding Sarees', 'Silk Sarees', 'Traditional Sarees'],
    fabric: 'Katan Pure Silk with Brocade Zari',
    occasion: 'Bridal Wedding, Sangeet, Reception',
    lengthMeters: 6.3,
    blousePiece: 'Contrast brocade blouse piece with heavy border included (0.8m)',
    careInstructions: 'Strictly professional dry clean only. Iron inside-out on low silk setting.',
    primaryImage: IMAGE_SAREE_MAROON,
    galleryImages: [IMAGE_SAREE_MAROON, IMAGE_HERO_PAITHANI],
    variants: [
      {
        variantId: 'var-02-maroon',
        colorName: 'Royal Maroon & Champagne Gold',
        colorHex: '#641D32',
        sku: 'KFS-BAN-002-MRN',
        originalPricePaise: 2249900,
        sellingPricePaise: 1799900,
        inventoryStock: 5,
        reservedStock: 0,
        images: [IMAGE_SAREE_MAROON]
      }
    ],
    featured: true,
    trending: true,
    isNewArrival: false,
    isPublished: true,
    rating: 5.0,
    reviewsCount: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'saree-03',
    name: 'Emerald Bloom Designer Festive Silk Saree',
    slug: 'emerald-bloom-designer-festive-silk-saree',
    sku: 'KFS-DES-003',
    description: 'An ethereal combination of rich jewel-toned emerald green and hand-woven golden floral vine borders. Lightweight yet intensely rich in sheen, creating effortless draping for long celebratory gatherings.',
    categoryIds: ['cat-designer', 'cat-festive', 'cat-silk'],
    categoryNames: ['Designer Sarees', 'Festive Sarees', 'Silk Sarees'],
    fabric: 'Tussar Art Silk with Zari',
    occasion: 'Diwali, Sangeet, Festive Dinners',
    lengthMeters: 6.3,
    blousePiece: 'Embroidered emerald silk blouse piece included (0.8m)',
    careInstructions: 'Dry clean recommended. Mild steam iron if required.',
    primaryImage: IMAGE_SAREE_EMERALD,
    galleryImages: [IMAGE_SAREE_EMERALD],
    variants: [
      {
        variantId: 'var-03-emerald',
        colorName: 'Emerald Jewel Green',
        colorHex: '#046A38',
        sku: 'KFS-DES-003-EMR',
        originalPricePaise: 1299900,
        sellingPricePaise: 989900,
        inventoryStock: 12,
        reservedStock: 0,
        images: [IMAGE_SAREE_EMERALD]
      }
    ],
    featured: true,
    trending: false,
    isNewArrival: true,
    isPublished: true,
    rating: 4.8,
    reviewsCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'saree-04',
    name: 'Kalyani Crimson & Pure Gold Temple Paithani Saree',
    slug: 'kalyani-crimson-pure-gold-temple-paithani-saree',
    sku: 'KFS-KANJ-004',
    description: 'Radiating eternal royal splendor, this authentic crimson silk body shimmers against a rich korvai zari border. Featuring intricate temple peacock motifs and heavy golden pallu detailing.',
    categoryIds: ['cat-wedding', 'cat-paithani', 'cat-silk'],
    categoryNames: ['Wedding Sarees', 'Paithani Sarees', 'Silk Sarees'],
    fabric: 'Pure Silk 3-ply with Silver & Gold Zari',
    occasion: 'Weddings, Engagements, Milestone Poojas',
    lengthMeters: 6.3,
    blousePiece: 'Crimson gold contrast blouse piece with temple border (0.8m)',
    careInstructions: 'Dry clean only. Roll in cotton muslin for preservation.',
    primaryImage: IMAGE_HERO_PAITHANI,
    galleryImages: [IMAGE_HERO_PAITHANI, IMAGE_SAREE_PURPLE],
    variants: [
      {
        variantId: 'var-04-crimson',
        colorName: 'Crimson Vermilion & Gold',
        colorHex: '#9E1B32',
        sku: 'KFS-KANJ-004-GLD',
        originalPricePaise: 2499900,
        sellingPricePaise: 1949900,
        inventoryStock: 4,
        reservedStock: 0,
        images: [IMAGE_HERO_PAITHANI]
      }
    ],
    featured: false,
    trending: true,
    isNewArrival: true,
    isPublished: true,
    rating: 4.9,
    reviewsCount: 31,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  ...FILTER_TEST_PRODUCTS,
  ...EXTRA_FILTER_TEST_PRODUCTS,
  ...EXTRA_FILTER_TEST_PRODUCTS_2,
  ...MATRIX_PRODUCTS,
  ...BOUNDARY_PRODUCTS,
  ...HIDDEN_TEST_PRODUCTS
];

// ---------------------------------------------------------------------------
// Colours + images for every saree
//  - every saree gets 3 or 4 colour shades (existing variants are kept)
//  - every colour has its own photo set; each saree shows 2, 3 or 4 photos
//  - only 4 real photos exist, so they are rotated per colour. Replace the
//    `images` arrays with real per-colour (Cloudinary) photos when you have
//    them, otherwise a "green" shade can show a maroon photo.
// ---------------------------------------------------------------------------
const ALL_GALLERY_IMAGES = [
  IMAGE_SAREE_PURPLE,
  IMAGE_HERO_PAITHANI,
  IMAGE_SAREE_MAROON,
  IMAGE_SAREE_EMERALD
];

const EXTRA_COLOR_SHADES = [
  { name: 'Royal Maroon', hex: '#641D32' },
  { name: 'Emerald Green', hex: '#046A38' },
  { name: 'Royal Purple', hex: '#4B0082' },
  { name: 'Peacock Blue', hex: '#0E7490' },
  { name: 'Mustard Gold', hex: '#D4A017' },
  { name: 'Rani Pink', hex: '#DB2777' },
  { name: 'Crimson Red', hex: '#B91C1C' },
  { name: 'Teal Green', hex: '#0F766E' }
];

const hashString = (value: string) =>
  value.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

// n photos starting at a given position of the 4 available photos
const photoSet = (start: number, n: number) =>
  Array.from({ length: n }, (_, j) => ALL_GALLERY_IMAGES[(start + j) % ALL_GALLERY_IMAGES.length]);

const withColorsAndPhotos = (p: SareeProduct): SareeProduct => {
  const hash = hashString(p.id);
  const photoCount = 2 + (hash % 3); // 2, 3 or 4 photos per saree
  const targetColors = 3 + (hash % 2); // 3 or 4 colours per saree

  const variants = [...p.variants];

  // FIX: if the saree is sold out, the colours we add must be sold out too
  const allSoldOut = p.variants.every((v) => v.inventoryStock - v.reservedStock <= 0);

  // Add extra colour shades (same price as the first variant)
  let shadeCursor = hash % EXTRA_COLOR_SHADES.length;
  while (variants.length < targetColors) {
    const shade = EXTRA_COLOR_SHADES[shadeCursor % EXTRA_COLOR_SHADES.length];
    shadeCursor += 1;
    const alreadyUsed = variants.some(
      (v) => v.colorHex.toLowerCase() === shade.hex.toLowerCase() || v.colorName === shade.name
    );
    if (alreadyUsed) continue;

    const index = variants.length + 1;
    variants.push({
      ...variants[0],
      variantId: `${p.id}-color-${index}`,
      colorName: shade.name,
      colorHex: shade.hex,
      sku: `${p.sku}-C${index}`,
      inventoryStock: allSoldOut ? 0 : 3 + ((hash + index * 5) % 9),
      reservedStock: 0,
      images: []
    });
  }

  // Each colour gets its own photo set (different first photo per colour)
  const baseStart = Math.max(ALL_GALLERY_IMAGES.indexOf(p.primaryImage), 0);
  const withPhotos = variants.map((v, k) => ({
    ...v,
    images: photoSet(baseStart + k, photoCount)
  }));

  const gallery = withPhotos
    .flatMap((v) => v.images)
    .filter((img, i, arr) => arr.indexOf(img) === i)
    .slice(0, 4);

  return {
    ...p,
    primaryImage: withPhotos[0].images[0],
    galleryImages: gallery,
    variants: withPhotos
  };
};

// Different created dates so the "Newest Arrivals" sort has something to sort.
// New arrivals are within the last 2 weeks, everything else is older.
const withCreatedDate = (p: SareeProduct, index: number): SareeProduct => {
  const hash = hashString(p.id);
  const daysAgo = p.isNewArrival ? (hash + index) % 14 : 15 + ((hash * 7 + index * 13) % 165);
  const date = new Date(Date.now() - daysAgo * 86_400_000 - index * 60_000).toISOString();
  return { ...p, createdAt: date, updatedAt: date };
};

export const INITIAL_PRODUCTS: SareeProduct[] = RAW_PRODUCTS.map((p, i) =>
  withCreatedDate(withColorsAndPhotos(p), i)
);

// export const INITIAL_SETTINGS: StoreSettings = {
//   storeName: 'Kolhapuri Fashion Saree',
//   businessPhone: '9096863092',
//   whatsappContact: '9096863092',
//   instagramHandle: '@ankita_wavecode',
//   businessAddress: 'Shivaji Nagar, Unchgaon, Kolhapur, Maharashtra, India.',
//   supportEmail: 'ankitakhot015@gmail.com',
//   announcementMessages: [
//     '✨ Handwoven Paithani & Bridal Silk Festive Showcase 2026',
//     '🚚 Free Insured Shipping across India on orders above ₹2,999',
//     '🎁 Use code FESTIVE10 for 10% off on your authentic handloom orders',
//     '🌿 100% Certified Authentic Weaves direct from Kolhapur weavers'
//   ],
//   announcementRotationSpeedSeconds: 4,
//   standardShippingFeePaise: 15000,
//   freeShippingThresholdPaise: 299900,
//   taxPercentage: 5,
//   logoUrl: ''
// };

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Kolhapuri Fashion Saree',
  businessPhone: '9096863092',
  whatsappContact: '9096863092',
  instagramHandle: '@ankita_wavecode',
  businessAddress: 'Shivaji Nagar, Unchgaon, Kolhapur, Maharashtra, India.',
  supportEmail: 'ankitakhot015@gmail.com',
  announcementMessages: [
    '✨ Handwoven Paithani & Bridal Silk Festive Showcase 2026  |  ✨ हस्तनिर्मित पैठणी आणि ब्रायडल सिल्क फेस्टिव्ह शोकेस २०२६',
    '🚚 Free Insured Shipping across India on orders above ₹2,999  |  🚚 ₹२,९९९ वरील ऑर्डरवर संपूर्ण भारतात मोफत विमाकृत शिपिंग',
    '🎁 Use code FESTIVE10 for 10% off on your authentic handloom orders  |  🎁 अस्सल हातमाग ऑर्डरवर १०% सवलतीसाठी FESTIVE10 कोड वापरा',
    '🌿 100% Certified Authentic Weaves direct from Kolhapur weavers  |  🌿 कोल्हापूरच्या विणकरांकडून थेट १००% प्रमाणित अस्सल विणकाम'
  ],
  announcementRotationSpeedSeconds: 4,
  standardShippingFeePaise: 15000,
  freeShippingThresholdPaise: 299900,
  taxPercentage: 5,
  logoUrl: ''
};