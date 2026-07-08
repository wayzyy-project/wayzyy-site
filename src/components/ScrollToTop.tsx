import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenisRef } from "@/lib/lenis";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis keeps its own internal scroll target — a plain window.scrollTo()
    // doesn't tell it, so on the next animation frame it can ease back toward
    // wherever it last was (e.g. mid-scroll on the previous page). Reset
    // through Lenis when it's running so both stay in sync.
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
