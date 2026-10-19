import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Bell, CalendarDays, Heart, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { supabase } from "@/lib/supabase";

// /app - the page we send people to for installing the Wayzyy app.
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.wayzyy.app";
export const APP_STORE_URL = "https://apps.apple.com/app/id6813786564";
// Flip to true once iOS 1.0 is approved and released.
export const IOS_LIVE = false;

const GUEST_FEATURES = [
  { icon: BadgeCheck, title: "Verified stays in Goa", text: "Villas, homes and apartments, every listing reviewed by our team." },
  { icon: Wallet, title: "The full price, up front", text: "Taxes and fees shown before you book. No surprises at checkout." },
  { icon: Heart, title: "Wishlists that sync", text: "Save stays on your phone, pick up on the website, share with friends." },
  { icon: MessageCircle, title: "Chat with us any time", text: "Questions before you book or help during your stay, all in one inbox." },
];
const HOST_FEATURES = [
  { icon: CalendarDays, title: "Calendar and pricing", text: "Set prices, block dates and add festival rates from your phone." },
  { icon: Bell, title: "Instant booking alerts", text: "New requests on push and WhatsApp, so you reply within the window." },
  { icon: ShieldCheck, title: "Verified guests", text: "Guests verify with DigiLocker before their stay is confirmed." },
];

function StoreButtons({ size = "lg" }: { size?: "lg" | "sm" }) {
  const pad = size === "lg" ? "px-5 py-3" : "px-4 py-2.5";
  return (
    <div className="flex flex-wrap gap-3">
      <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" aria-label="Get Wayzyy on Google Play"
        className={`inline-flex items-center gap-3 rounded-2xl bg-foreground ${pad} text-background transition-transform hover:-translate-y-0.5`}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7"><path fill="#34A853" d="M3.6 1.8 13.5 12 3.6 22.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2z"/><path fill="#FBBC04" d="m16.8 8.7-3.3 3.3 3.3 3.3 3.8-2.2c.9-.5.9-1.7 0-2.2z"/><path fill="#4285F4" d="M3.6 22.2 13.5 12l3.3 3.3L5 22c-.5.3-1 .4-1.4.2z"/><path fill="#EA4335" d="M3.6 1.8c.4-.2.9-.1 1.4.2l11.8 6.7-3.3 3.3z"/></svg>
        <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wide opacity-70">Get it on</span><span className="block text-base font-semibold">Google Play</span></span>
      </a>
      {IOS_LIVE ? (
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download Wayzyy on the App Store"
          className={`inline-flex items-center gap-3 rounded-2xl bg-foreground ${pad} text-background transition-transform hover:-translate-y-0.5`}>
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.4z"/></svg>
          <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wide opacity-70">Download on the</span><span className="block text-base font-semibold">App Store</span></span>
        </a>
      ) : (
        <span className={`inline-flex items-center gap-3 rounded-2xl border border-border ${pad} text-muted-foreground`}>
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 fill-current opacity-60"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.4z"/></svg>
          <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wide">iPhone app</span><span className="block text-base font-semibold">Coming soon</span></span>
        </span>
      )}
    </div>
  );
}

export default function GetTheApp() {
  const [photos, setPhotos] = useState<string[]>([]);
  useEffect(() => {
    supabase.from("properties").select("images").eq("status", "active").limit(12).then(({ data }) => {
      const imgs = (data ?? []).map((p: any) => (Array.isArray(p.images) ? p.images[0] : null)).filter(Boolean) as string[];
      setPhotos(imgs.slice(0, 3));
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Wayzyy",
    alternateName: ["Wayzee", "Wayzy"],
    operatingSystem: "Android, iOS",
    applicationCategory: "TravelApplication",
    description: "Book verified villas, homes and stays in Goa, and manage your listing if you host.",
    url: "https://wayzyy.com/app",
    installUrl: PLAY_URL,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": "https://wayzyy.com/#organization" },
  };

  return (
    <SEO
      title="Wayzyy App - Book Goa Villas & Stays on Android and iPhone"
      description="Get the Wayzyy app (way-zee): verified villas and homes in Goa, the full price up front, wishlists that sync and instant chat. Free on Google Play."
      path="/app"
      jsonLd={jsonLd}
    >
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />
        <main>
          <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">The Wayzyy app</p>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl text-balance">Goa stays in your pocket.</h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Find a villa, see the full price before you book, and chat with our team, all from your phone. Hosts run their calendar, pricing and bookings from the same app.
              </p>
              <StoreButtons />
              <p className="text-sm text-muted-foreground">Free to download. Same account as wayzyy.com.</p>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              {/* Real listing photos in a phone-shaped frame - an illustration, not an app screenshot. */}
              <div className="relative mx-auto aspect-[9/19] w-64 overflow-hidden rounded-[2.5rem] border-[10px] border-foreground bg-muted shadow-2xl">
                <div className="flex h-full flex-col gap-2 p-2">
                  <div className="flex items-center gap-2 px-1 pt-1">
                    <img src="/favicon.svg" alt="" className="h-6 w-6 rounded-full" />
                    <span className="text-sm font-bold">Wayzyy</span>
                  </div>
                  {(photos.length ? photos : [null, null, null]).map((src, i) => (
                    <div key={i} className="flex-1 overflow-hidden rounded-2xl bg-muted-foreground/10">
                      {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6">
              <h2 className="font-display text-2xl font-bold">For travellers</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {GUEST_FEATURES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="space-y-2">
                    <Icon className="h-6 w-6 text-[#FF6B00]" />
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
              <h2 className="pt-6 font-display text-2xl font-bold">For hosts</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {HOST_FEATURES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="space-y-2">
                    <Icon className="h-6 w-6 text-[#FF6B00]" />
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl space-y-5 px-4 py-14 text-center sm:px-6">
            <h2 className="font-display text-3xl font-bold">Download Wayzyy</h2>
            <p className="text-muted-foreground">Wayzyy is pronounced <em>way-zee</em>. Search “Wayzyy” on Google Play.</p>
            <div className="flex justify-center"><StoreButtons size="sm" /></div>
            <p className="text-sm"><Link to="/" className="font-semibold underline">Or browse stays on the website</Link></p>
          </section>
        </main>
      </div>
    </SEO>
  );
}
