import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenisRef } from "@/lib/lenis";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A same-page hash change (e.g. the mobile tab bar linking to "/#why"
    // while already on "/") also needs to land on the target section, not
    // just reset to top — handle that before falling back to the plain
    // top-of-page reset used for every other navigation.
    if (hash) {
      const id = hash.slice(1);
      // The target section may not be mounted yet on the first render of a
      // fresh route change, so give it a tick before giving up.
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (!el) return false;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        }
        return true;
      };
      if (!scrollToHash()) {
        const timeout = setTimeout(scrollToHash, 50);
        return () => clearTimeout(timeout);
      }
      return;
    }

    // Lenis keeps its own internal scroll target — a plain window.scrollTo()
    // doesn't tell it, so on the next animation frame it can ease back toward
    // wherever it last was (e.g. mid-scroll on the previous page). Reset
    // through Lenis when it's running so both stay in sync.
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}
