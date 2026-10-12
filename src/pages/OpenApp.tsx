import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

// One link for emails, WhatsApp and texts: wayzyy.com/open/<app path>.
// Phone with the app: the app opens straight away. No app (or desktop): the
// matching page on the website opens instead.
//
//   /open/property/<id>          -> that listing      | website /property/<id>
//   /open/trips                  -> app               | website /trips
//   /open/inbox/<thread>         -> app               | website /inbox/<thread>
//   /open/review?bookingId=<id>  -> review screen     | website /trips
//   /open/host/bookings          -> app               | website /host/bookings
//   /open/host/booking/<id>      -> that booking      | website /host/bookings
//   /open/host?tab=draft         -> app               | website /host?tab=draft
//   anything else                -> app home          | website home

const websiteFor = (appPath: string, search: string): string => {
  if (appPath.startsWith("property/")) return `/${appPath}`;
  if (appPath === "trips" || appPath.startsWith("review")) return "/trips";
  if (appPath === "inbox" || appPath.startsWith("inbox/")) return `/${appPath}`;
  if (appPath === "host/pricing") return "/host/pricing";
  if (appPath.startsWith("host/booking")) return "/host/bookings";
  if (appPath === "host") return `/host${search}`;
  return "/";
};

export default function OpenApp() {
  const { pathname, search } = useLocation();
  const appPath = pathname.replace(/^\/open\/?/, "").replace(/\/+$/, "");
  const fallback = websiteFor(appPath, search);
  const appUrlPath = appPath + search;
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : null;
  const [tried, setTried] = useState(false);

  const openApp = () => {
    const target = `wayzyy://${appUrlPath}`;
    if (os === "android") {
      // Opens the app if installed, otherwise the website page.
      window.location.href =
        `intent://${appUrlPath}#Intent;scheme=wayzyy;package=com.wayzyy.app;` +
        `S.browser_fallback_url=${encodeURIComponent(window.location.origin + fallback)};end`;
      return;
    }
    window.location.href = target;
    window.setTimeout(() => {
      // Still on this page a moment later: the app isn't installed.
      if (document.visibilityState === "visible") window.location.replace(fallback);
    }, 1500);
  };

  useEffect(() => {
    if (!os) { window.location.replace(fallback); return; } // desktop: website
    openApp();
    const t = window.setTimeout(() => setTried(true), 2500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-gray-900">
      <SEO title="Opening Wayzyy" description="Opening the Wayzyy app." />
      <img src="/favicon.svg" alt="Wayzyy" className="h-14 w-14 rounded-2xl" />
      <h1 className="text-lg font-bold">Opening Wayzyy…</h1>
      {!tried && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
      <div className="flex flex-col gap-2">
        <button onClick={openApp} className="rounded-full bg-[#FF6B00] px-6 py-2.5 text-sm font-bold text-white">
          Open app
        </button>
        <a href={fallback} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700">
          Open on website
        </a>
      </div>
    </div>
  );
}
