import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

// Phone visitors get a small "Open in the Wayzyy app" prompt. Opening the app
// is the primary action; if the app isn't installed they simply stay on the
// website (or, on Android, are sent to Google Play).
//
// Flip IOS_APP_LIVE to true once the iOS app is public on the App Store, so
// iPhone visitors without the app are sent there instead of staying put.
const IOS_APP_LIVE = false;
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.wayzyy.app";
const APP_STORE_URL = "https://apps.apple.com/app/id6813786564";
const DISMISS_KEY = "wayzyy_open_in_app_dismissed";
const DISMISS_DAYS = 7;

// Host/admin tools and identity flows stay in the browser.
// "/host" itself is where the WhatsApp host-alert button lands, so it keeps the
// prompt; the host tools underneath it (/host/bookings, /host/payout) do not.
const HIDDEN_ON = ["/host/", "/admin", "/adminn", "/verify-identity", "/inbox", "/open"];

const platform = (): "android" | "ios" | null => {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return null;
};

const recentlyDismissed = (): boolean => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return !!at && Date.now() - at < DISMISS_DAYS * 86400000;
  } catch { return false; }
};

/** wayzyy.com/property/abc -> wayzyy://property/abc (the app's own scheme). */
// Only paths the app can open itself are passed through; anything else (like
// /host) opens the app's home screen.
const appPath = (pathname: string) => {
  const p = pathname.replace(/^\/+/, "");
  return /^(property\/|review|admin\/review\/)/.test(p) ? p : "";
};

// WhatsApp wraps template-button links in Meta's own redirect (w.meta.me), and
// iPhones only open an app straight from a link to the app's own website, never
// through a redirect. So a host tapping "Open Wayzyy" in WhatsApp lands in the
// browser. When we can tell that is how someone arrived, we try the app for
// them instead of waiting for a tap on the card.
const arrivedViaMeta = (): boolean => {
  try {
    const host = new URL(document.referrer).hostname;
    return /(^|\.)meta\.me$|(^|\.)wa\.me$|(^|\.)whatsapp\.com$|^l\.wl\.co$|(^|\.)facebook\.com$/.test(host);
  } catch {
    return false;
  }
};
const AUTO_TRIED_KEY = "wayzyy_auto_open_tried";

export function OpenInAppPrompt() {
  const { pathname } = useLocation();
  const [os] = useState(platform);
  const [dismissed, setDismissed] = useState(recentlyDismissed);
  const [notInstalled, setNotInstalled] = useState(false);

  // Installed-PWA / already-in-app visitors don't need the prompt.
  const standalone =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as any).standalone === true);

  useEffect(() => { setNotInstalled(false); }, [pathname]);

  const openApp = () => {
    const path = appPath(pathname);
    if (os === "android") {
      // Android opens the app if installed, otherwise falls back to Google Play.
      window.location.href =
        `intent://${path}#Intent;scheme=wayzyy;package=com.wayzyy.app;` +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
      return;
    }
    // iOS: try the app; if the page is still in front shortly after, it isn't installed.
    window.location.href = `wayzyy://${path}`;
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        if (IOS_APP_LIVE) window.location.href = APP_STORE_URL;
        else setNotInstalled(true);
      }
    }, 1500);
  };

  // Arrived from a WhatsApp alert button: try the app once, automatically.
  useEffect(() => {
    if (!os || standalone || pathname !== "/host" || !arrivedViaMeta()) return;
    try {
      if (sessionStorage.getItem(AUTO_TRIED_KEY)) return;
      sessionStorage.setItem(AUTO_TRIED_KEY, "1");
    } catch { /* private mode: still try once per load */ }
    openApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!os || dismissed || standalone || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* private mode */ }
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-3 bottom-[4.75rem] z-40 rounded-2xl border border-gray-200 bg-white p-3 text-gray-900 shadow-lg sm:hidden">
      <div className="flex items-start gap-3">
        <img src="/favicon.svg" alt="" className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Open in the Wayzyy app</p>
          <p className="text-xs text-gray-600">
            {notInstalled
              ? "The app isn't installed yet. You can keep browsing here on the website."
              : "Faster booking, messages and trip updates."}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {!notInstalled && (
              <button
                type="button"
                onClick={openApp}
                className="rounded-full bg-[#FF6B00] px-4 py-1.5 text-xs font-bold text-white"
              >
                Open app
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700"
            >
              {notInstalled ? "Continue on website" : "Stay on website"}
            </button>
          </div>
        </div>
        <button type="button" onClick={dismiss} aria-label="Close" className="text-gray-400">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
