import { useEffect, useRef } from "react";
import { mp } from "@/lib/mixpanel";

/**
 * Fires a "Section Viewed" Mixpanel event once when the element
 * enters the viewport (threshold 30%).
 */
export function useTrackSection(sectionName: string) {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          mp.sectionViewed(sectionName);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
}
