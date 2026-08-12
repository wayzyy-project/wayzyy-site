import type Lenis from "lenis";

/**
 * Shared handle to the single Lenis instance created by SmoothScroll.
 * Anything that needs to move scroll position (e.g. ScrollToTop on route
 * change) must go through Lenis, not window.scrollTo - Lenis keeps its own
 * internal scroll state and will fight/override a raw native scroll reset.
 */
export const lenisRef: { current: Lenis | null } = { current: null };
