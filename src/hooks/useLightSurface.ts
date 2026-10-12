import { useEffect } from "react";

/**
 * Pins the page to the light theme while a host page is open, so a host whose
 * system or site theme is dark still gets the clean white portal (the `dark:`
 * utility variants key off the `dark` class on <html>). The visitor's own
 * theme is restored when they leave the host area.
 */
export function useLightSurface() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    const prevScheme = root.style.colorScheme;
    const apply = () => {
      if (root.classList.contains("dark")) root.classList.remove("dark");
      root.style.colorScheme = "light";
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      if (hadDark) root.classList.add("dark");
      root.style.colorScheme = prevScheme;
    };
  }, []);
}
