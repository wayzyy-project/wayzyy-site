import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

type Props = {
  /** 1280x720 MP4 made from the listing's photos */
  src: string;
  poster?: string | null;
  title: string;
  className?: string;
};

/**
 * "Watch walkthrough" pill + full-screen player.
 *
 * Nothing heavy loads with the page: the <video> element (and so the MP4 and
 * its poster) is only created after the guest taps the button. The MP4 is
 * encoded with faststart, so it begins playing after the first chunk.
 */
export function WalkthroughPlayer({ src, poster, title, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    videoRef.current?.play().catch(() => {});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Watch a walkthrough of ${title}`}
        className={`flex items-center gap-2 rounded-2xl bg-background/95 hover:bg-background text-foreground border border-border px-4 py-2 text-xs font-bold shadow-md transition-all hover:scale-105 ${className}`}
      >
        <Play className="h-3.5 w-3.5 fill-[#FF6B00] text-[#FF6B00]" />
        <span>Watch walkthrough</span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Walkthrough of ${title}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close walkthrough"
              className="absolute right-3 top-3 sm:right-5 sm:top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              ref={videoRef}
              src={src}
              poster={poster ?? undefined}
              preload="auto"
              controls
              playsInline
              muted
              autoPlay
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl aspect-video rounded-xl bg-black"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
