import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { fallbackImageToOriginal, img, imgSet } from "@/lib/img";

// Full-screen "Show all photos" viewer.
//
// It used to reuse one <img> and only swap its src, so after tapping a
// thumbnail the old photo (or nothing) stayed up until the new one finished
// downloading - photos the image optimizer hadn't resized yet looked like the
// tap did nothing. Now every photo gets its own element with a shimmer until
// it loads, the neighbours load in the background, and a photo that fails
// can be retried.

const MAIN_WIDTHS = [900, 1400, 1800];
const MAIN_SIZES = "(min-width: 1024px) 80vw, 100vw";

/** Warm the browser cache for a photo, picking the same size the viewer will. */
function preload(url: string) {
  const set = imgSet(url, MAIN_WIDTHS);
  const el = new Image();
  el.decoding = "async";
  if (set.srcSet) {
    el.sizes = MAIN_SIZES;
    el.srcset = set.srcSet;
  }
  el.src = set.src;
}

interface Props {
  images: string[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

export function PhotoLightbox({ images, index, onIndexChange, onClose }: Props) {
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const [attempt, setAttempt] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = images.length;
  const go = (i: number) => onIndexChange((i + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  // Next two and previous photo load while this one is on screen.
  useEffect(() => {
    for (const offset of [1, 2, -1]) {
      const url = images[(index + offset + count) % count];
      if (url && count > 1) preload(url);
    }
  }, [index, images, count]);

  // Keep the current thumbnail in view, and allow arrow keys / Escape.
  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  const mark = (setter: typeof setLoaded, i: number) => setter((s) => (s.has(i) ? s : new Set(s).add(i)));
  const isLoaded = loaded.has(index);
  const isFailed = failed.has(index);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4 text-white animate-in fade-in duration-200 sm:p-8">
      <div className="flex items-center justify-between pb-4">
        <span className="text-xs font-bold text-white/70">
          Photo {index + 1} of {count}
        </span>
        <button
          onClick={onClose}
          aria-label="Close photos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {!isLoaded && !isFailed && (
          <div className="absolute inset-0 m-auto aspect-[3/2] max-h-full w-full max-w-5xl animate-pulse rounded-2xl bg-white/10" aria-hidden />
        )}
        {isFailed ? (
          <button
            type="button"
            onClick={() => { setFailed((s) => { const n = new Set(s); n.delete(index); return n; }); setAttempt((a) => a + 1); }}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-8 py-6 text-sm text-white/80 hover:bg-white/15"
          >
            <ImageOff className="h-6 w-6" />
            This photo didn't load. Tap to try again.
          </button>
        ) : (
          <img
            // A fresh element per photo (and per retry), so the previous photo
            // never lingers and onLoad always fires for the one on screen.
            key={`${index}-${attempt}`}
            {...imgSet(images[index], MAIN_WIDTHS)}
            sizes={MAIN_SIZES}
            decoding="async"
            alt={`Photo ${index + 1}`}
            onLoad={() => mark(setLoaded, index)}
            onError={(event) => {
              if (!fallbackImageToOriginal(event.currentTarget, images[index])) mark(setFailed, index);
            }}
            className={`relative max-h-full max-w-full rounded-2xl object-contain shadow-2xl transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails keep their size and scroll sideways; centred only when they fit. */}
      <div className="overflow-x-auto py-4">
        <div className="mx-auto flex w-max gap-2 px-1">
          {images.map((photo, i) => (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el; }}
              onClick={() => onIndexChange(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white/10 transition-all ${
                i === index ? "scale-105 border-[#FF6B00]" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img(photo, 200)}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(event) => fallbackImageToOriginal(event.currentTarget, photo)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
