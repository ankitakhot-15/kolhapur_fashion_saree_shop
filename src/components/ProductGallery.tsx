import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ImageOff,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  GalleryHorizontal,
} from "lucide-react";
import { cld } from "../lib/cloudinaryUrl";

/* -------------------------------------------------------------------------- */
/* SafeImage: placeholder instead of a broken-image icon, and optional        */
/* Cloudinary resizing (f_auto, q_auto) when `cldWidth` is given.             */
/* -------------------------------------------------------------------------- */
export const SafeImage: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { cldWidth?: number }
> = ({ src, alt, className, cldWidth, ...rest }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`${className ?? ""} bg-[#F1EBDD] flex flex-col items-center justify-center gap-1 text-[#9A8F84]`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-6 h-6" />
        <span className="text-[10px] font-medium">Image unavailable</span>
      </div>
    );
  }

  // Non-Cloudinary URLs are returned unchanged by cld()
  const finalSrc = cldWidth ? cld(src, { w: cldWidth, crop: "limit" }) : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Layouts                                                                    */
/* -------------------------------------------------------------------------- */
type GalleryLayout = "classic" | "feature" | "grid" | "split" | "slider";

const LAYOUT_META: Record<
  GalleryLayout,
  { label: string; icon: React.ReactNode }
> = {
  classic: { label: "Classic", icon: <ImageIcon className="w-3.5 h-3.5" /> },
  feature: {
    label: "Mosaic",
    icon: <LayoutDashboard className="w-3.5 h-3.5" />,
  },
  grid: { label: "Grid", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  split: {
    label: "Side by side",
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
  },
  slider: {
    label: "Slider",
    icon: <GalleryHorizontal className="w-3.5 h-3.5" />,
  },
};

// Which layouts make sense for 1, 2, 3 or 4 images
const getLayoutOptions = (count: number): GalleryLayout[] => {
  if (count <= 1) return ["classic"];
  if (count === 2) return ["classic", "split", "slider"];
  if (count === 3) return ["classic", "feature", "slider"];
  return ["classic", "feature", "grid", "slider"];
};

interface ProductGalleryProps {
  /** ONLY the photos of the currently selected colour (different angles) */
  images: string[];
  alt: string;
  /** Any stable string (product id). Resets the layout when a new saree opens. */
  seed: string;
  badge?: string;
  /** Smaller sizing for use inside the quick-view modal */
  compact?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images: rawImages,
  alt,
  seed,
  badge,
  compact = false,
}) => {
  const images = useMemo(
    () =>
      rawImages
        .filter((img, i, arr) => !!img && arr.indexOf(img) === i)
        .slice(0, 8),
    [rawImages],
  );
  const imagesKey = images.join("|");

  const options = getLayoutOptions(images.length);
  const [chosenLayout, setChosenLayout] = useState<GalleryLayout | null>(null);

  // Default is always "classic" (big image + arrows + angle thumbnails)
  const layout: GalleryLayout =
    chosenLayout && options.includes(chosenLayout) ? chosenLayout : "classic";

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // New saree => back to default layout
  useEffect(() => {
    setChosenLayout(null);
    setLightboxIndex(null);
  }, [seed]);

  // New colour (new set of images) => back to first angle
  useEffect(() => {
    setActiveIndex(0);
  }, [imagesKey]);

  const count = images.length;
  const safeIndex = Math.min(activeIndex, Math.max(count - 1, 0));
  const goTo = (i: number) => setActiveIndex(((i % count) + count) % count);

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setLightboxIndex(null);
      }
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [lightboxIndex, count]);

  if (count === 0) {
    return (
      <SafeImage
        src=""
        alt={alt}
        className="w-full aspect-[4/5] rounded-xl border border-[#E6E0D8]"
      />
    );
  }

  const tile =
    "relative rounded-xl overflow-hidden border border-[#E6E0D8] bg-white shadow-sm cursor-zoom-in";
  const fill = "w-full h-full object-cover object-top";
  const hoverZoom = "hover:scale-105 transition-transform duration-500";

  const arrowBtn =
    "absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-[#292522]";

  const renderLayout = () => {
    switch (layout) {
      // Big image + arrows + thumbnails (other angles of the same colour)
      case "classic":
        return (
          <div className="space-y-3">
            <div
              className={`${tile} aspect-[4/5] ${compact ? "max-h-[56vh] mx-auto" : ""}`}
              onClick={() => setLightboxIndex(safeIndex)}
            >
              <SafeImage
                key={images[safeIndex]}
                src={images[safeIndex]}
                alt={`${alt} view ${safeIndex + 1}`}
                className={fill}
                cldWidth={1000}
              />

              {count > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(safeIndex - 1);
                    }}
                    className={`${arrowBtn} left-3`}
                    aria-label="Previous angle"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(safeIndex + 1);
                    }}
                    className={`${arrowBtn} right-3`}
                    aria-label="Next angle"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/70 px-3 py-1 rounded-full pointer-events-none">
                    {safeIndex + 1} / {count}
                  </span>
                </>
              )}
            </div>

            {count > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveIndex(i)}
                    className={`${compact ? "w-14 h-[72px]" : "w-20 h-24"} rounded-lg overflow-hidden border shrink-0 transition-all ${
                      safeIndex === i
                        ? "ring-2 ring-[#641D32] ring-offset-1 border-transparent"
                        : "border-[#E6E0D8] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${alt} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      cldWidth={200}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      // One large image + the rest stacked on the right (3 or 4 images)
      case "feature": {
        const rows = Math.max(count - 1, 1);
        return (
          <div
            className={`grid grid-cols-3 gap-3 ${compact ? "h-[420px]" : "h-[520px] sm:h-[640px]"}`}
            style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
          >
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setLightboxIndex(i)}
                className={`${tile} ${i === 0 ? "col-span-2" : "col-span-1"}`}
                style={
                  i === 0
                    ? { gridRow: `span ${rows} / span ${rows}` }
                    : undefined
                }
              >
                <SafeImage
                  src={img}
                  alt={`${alt} view ${i + 1}`}
                  className={`${fill} ${hoverZoom}`}
                  cldWidth={800}
                />
              </button>
            ))}
          </div>
        );
      }

      // Even 2-column grid
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setLightboxIndex(i)}
                className={`${tile} ${compact ? "aspect-square" : "aspect-[4/5]"}`}
              >
                <SafeImage
                  src={img}
                  alt={`${alt} view ${i + 1}`}
                  className={`${fill} ${hoverZoom}`}
                  cldWidth={700}
                />
              </button>
            ))}
          </div>
        );

      // Two tall images side by side
      case "split":
        return (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setLightboxIndex(i)}
                className={`${tile} ${compact ? "aspect-[3/5]" : "aspect-[3/4]"}`}
              >
                <SafeImage
                  src={img}
                  alt={`${alt} view ${i + 1}`}
                  className={`${fill} ${hoverZoom}`}
                  cldWidth={700}
                />
              </button>
            ))}
          </div>
        );

      // Swipeable slider with arrows + dots
      case "slider":
        return (
          <div
            className={`relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-white border border-[#E6E0D8] shadow-sm ${
              compact ? "max-h-[56vh] mx-auto" : ""
            }`}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const diff = e.changedTouches[0].clientX - touchStartX;
              if (Math.abs(diff) > 40) goTo(safeIndex + (diff < 0 ? 1 : -1));
              setTouchStartX(null);
            }}
          >
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {images.map((img, i) => (
                <div
                  key={img}
                  className="w-full h-full shrink-0 cursor-zoom-in"
                  onClick={() => setLightboxIndex(i)}
                >
                  <SafeImage
                    src={img}
                    alt={`${alt} view ${i + 1}`}
                    className={fill}
                    cldWidth={1000}
                  />
                </div>
              ))}
            </div>

            {count > 1 && (
              <>
                <button
                  onClick={() => goTo(safeIndex - 1)}
                  className={`${arrowBtn} left-3`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(safeIndex + 1)}
                  className={`${arrowBtn} right-3`}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        safeIndex === i ? "w-6 bg-[#641D32]" : "w-2 bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Header: photo count + layout switcher */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#766B61]">
          {count} {count === 1 ? "photo" : "photos"} · tap to zoom
        </span>
        {options.length > 1 && (
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-[#E6E0D8] rounded-lg">
            {options.map((id) => (
              <button
                key={id}
                onClick={() => setChosenLayout(id)}
                title={`${LAYOUT_META[id].label} layout`}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                  layout === id
                    ? "bg-[#641D32] text-white"
                    : "text-[#766B61] hover:bg-[#FAF7F0]"
                }`}
              >
                {LAYOUT_META[id].icon}
                <span className="hidden sm:inline">
                  {LAYOUT_META[id].label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {badge && (
          <span className="absolute top-3 left-3 z-10 text-[11px] font-bold text-[#641D32] bg-white/95 px-2.5 py-1 rounded shadow-sm border border-[#E6E0D8] pointer-events-none">
            {badge}
          </span>
        )}
        {renderLayout()}
      </div>

      {/* Fullscreen viewer */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[70] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {count > 1 && (
            <button
              className="absolute left-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + count) % count);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <SafeImage
            src={images[lightboxIndex]}
            alt={`${alt} view ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-full object-contain rounded-lg"
            cldWidth={1600}
            onClick={(e) => e.stopPropagation()}
          />

          {count > 1 && (
            <button
              className="absolute right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % count);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80">
            {lightboxIndex + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
};
