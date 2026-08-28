import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenisRef } from "@/lib/lenis";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A same-page hash change (e.g. the mobile tab bar linking to "/#why"
    // while already on "/") also needs to land on the target section, not
    // just reset to top - handle that before falling back to the plain
    // top-of-page reset used for every other navigation.
    if (hash) {
      const id = hash.slice(1);
      // A single scrollTo call here isn't trustworthy on a fresh full-page
      // load: this site's hero is a huge, image-heavy scroll-driven
      // section, so the page's total scrollable height is still growing as
      // assets load in. Calling lenisRef.current.scrollTo(el, {immediate})
      // the moment Lenis exists can land before Lenis has measured the
      // real (final) document height, which silently clamps the jump to
      // whatever height it saw at that instant - short of the target, with
      // nothing forcing a second attempt once the real height is known.
      // Landing on "/#why" via a plain <a> tag (a full reload, not a
      // client-side route change) hit exactly this: the element existed
      // immediately, an early scrollTo fired, and the page never actually
      // reached it. Verifying the result and retrying - not just retrying
      // until Lenis exists - is what actually closes the gap.
      let attempts = 0;
      const MAX_ATTEMPTS = 20;
      let timeout: ReturnType<typeof setTimeout> | undefined;

      // Anchor targets carry `scroll-smooth-anchor` (scroll-margin-top: 6rem,
      // see index.css) so they land with breathing room below the fixed
      // nav instead of flush against it - the correct landing spot is
      // ~96px, not 0, so "close enough" has to be judged against that
      // computed value, not a bare zero.
      const closeEnough = (el: Element) => {
        const target = parseFloat(getComputedStyle(el).scrollMarginTop || "0");
        return Math.abs(el.getBoundingClientRect().top - target) < 8;
      };

      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (!el) {
          attempts++;
          if (attempts < MAX_ATTEMPTS) timeout = setTimeout(scrollToHash, 80);
          return;
        }
        if (closeEnough(el)) return;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { immediate: true });
        } else {
          // Lenis isn't up yet - jump natively so there's no flash of the
          // wrong content while waiting for it.
          el.scrollIntoView({ behavior: "auto", block: "start" });
        }
        attempts++;
        if (attempts < MAX_ATTEMPTS) timeout = setTimeout(scrollToHash, 80);
      };
      scrollToHash();
      return () => clearTimeout(timeout);
    }

    // Lenis keeps its own internal scroll target - a plain window.scrollTo()
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
