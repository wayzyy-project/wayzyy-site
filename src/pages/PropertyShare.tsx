import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export default function PropertyShare() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [appMissing, setAppMissing] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const attempted = useRef(false);

  const deepLink = `wayzyy://property/${propertyId}`;
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.wayzyy.app";
  const appStoreUrl  = "https://apps.apple.com/app/wayzyy/id000000000";

  useEffect(() => {
    if (!isMobile || attempted.current) return;
    attempted.current = true;

    // Try to open the app
    const openTime = Date.now();
    window.location.href = deepLink;

    // If still here after 2.5s the app isn't installed — show download buttons
    const timer = setTimeout(() => {
      if (Date.now() - openTime < 3500) {
        setAppMissing(true);
      }
    }, 2500);

    // If page was hidden the app opened — cancel the fallback
    const onVisibilityChange = () => {
      if (document.hidden) clearTimeout(timer);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [deepLink, isMobile]);

  const handleOpenApp = () => {
    window.location.href = deepLink;
    setTimeout(() => setAppMissing(true), 2000);
  };

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": `Wayzyy Homestay Listing #${propertyId}`,
      "description": "Premium vacation lodging shared on the Wayzyy platform.",
      "url": `https://wayzyy.com/property/${propertyId}`,
      "image": "https://wayzyy.com/og-image.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wayzyy.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Property Share",
          "item": `https://wayzyy.com/property/${propertyId}`
        }
      ]
    }
  ];

  return (
    <SEO
      title={`Property Share #${propertyId} — Wayzyy`}
      description="Check out this homestay share on Wayzyy. India's favorite getaway platform offering flat-free subscriptions."
      jsonLd={schemas}
      path={`/property/${propertyId}`}
    >

    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10 text-center"
      >
        <span className="text-4xl font-black tracking-tight text-ember">
          Wayzyy
        </span>
        <p className="text-sm text-muted-foreground mt-1">
          India's favourite getaway platform
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="w-full max-w-sm bg-background rounded-3xl shadow-xl border border-border p-8 text-center"
      >
        {/* Property icon */}
        <div className="w-16 h-16 rounded-2xl bg-ember/10 flex items-center justify-center mx-auto mb-5 text-3xl">
          🏡
        </div>

        <h1 className="text-xl font-bold text-foreground mb-2 leading-snug">
          Someone shared a property with you
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Open the Wayzyy app to see photos, pricing and book your stay.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleOpenApp}
          className="w-full py-4 bg-ember text-white font-bold rounded-2xl text-[15px] hover:opacity-90 active:scale-[0.98] transition-all mb-3"
        >
          Open in Wayzyy App
        </button>

        {/* Download links — shown when app isn't installed or on desktop */}
        {(appMissing || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mt-1"
          >
            {(isAndroid || !isMobile) && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🤖</span> Google Play
              </a>
            )}
            {(isIOS || !isMobile) && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🍎</span> App Store
              </a>
            )}
          </motion.div>
        )}

        {/* Status hint */}
        {isMobile && !appMissing && (
          <p className="text-xs text-muted-foreground mt-4">
            {/* subtle pulse dot */}
            <span className="inline-block w-2 h-2 rounded-full bg-ember animate-pulse mr-1.5 align-middle" />
            Opening app…
          </p>
        )}
        {appMissing && (
          <p className="text-xs text-muted-foreground mt-4">
            App not installed? Download it above.
          </p>
        )}
      </motion.div>

      <p className="text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} Wayzyy · All rights reserved
      </p>
    </div>
    </SEO>
  );
}
