import { Link } from "react-router-dom";
import { BadgeCheck, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Home, MapPin, Users, MessageCircle, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import heroBg from "@/assets/goa-cinematic/zoom-wide.webp";

// /app - the page we send people to for installing the Wayzyy app.
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.wayzyy.app";
export const APP_STORE_URL = "https://apps.apple.com/app/id6813786564";

// Real screenshots from the App Store listing (public/app/).
const SHOT = {
  welcome: "/app/welcome.webp",
  explore: "/app/explore.webp",
  detail: "/app/property_detail.webp",
  map: "/app/property_amenities_map.webp",
  listings: "/app/listings_host.webp",
  calendar: "/app/calendar_host.webp",
};

const TOUR = [
  {
    shot: SHOT.explore,
    eyebrow: "Explore",
    title: "Browse real Goa stays",
    text: "Villas, cottages and apartments from Siolim and Vagator to Colva and Candolim. Filter by beach, heritage, farm stay or cliff top, and flip to the map when you want to see where everything is.",
    points: ["Genuine photos, no stock shots", "Beach, heritage, farm stay and cliff-top filters", "Save favourites to your wishlist"],
  },
  {
    shot: SHOT.detail,
    eyebrow: "Every listing",
    title: "Know the host before you book",
    text: "See who runs the place, how long they've hosted and what other guests said. Every host is verified with Aadhaar, and the price you see is the price you pay.",
    points: ["Aadhaar-verified hosts", "Taxes and fees shown up front", "Reserve in a couple of taps"],
  },
  {
    shot: SHOT.map,
    eyebrow: "Where you'll be",
    title: "Amenities and the neighbourhood",
    text: "WiFi, AC, kitchen, parking, pool: it's all listed. The map shows the cafés, beaches and markets around the stay. The exact address unlocks after you book.",
    points: ["Full amenity list", "Map of nearby cafés and beaches", "Exact location shared after booking"],
  },
];

const HOST_FEATURES = [
  { icon: CalendarDays, title: "Calendar in your pocket", text: "Block dates, change prices and see every booking across your listings." },
  { icon: RefreshCw, title: "Syncs with Airbnb and Booking.com", text: "List once. Your calendars stay in step, so you never double-book." },
  { icon: BadgeCheck, title: "Get Wayzyy Verified", text: "Verify your listing from the app and get the badge guests look for." },
  { icon: ShieldCheck, title: "Verified guests", text: "Guests verify with DigiLocker before their stay is confirmed." },
];

const FAQ = [
  { q: "Is the Wayzyy app free?", a: "Yes. The app is free on the App Store and Google Play. You only pay for the stay you book, with taxes and fees shown before you pay." },
  { q: "Can I use my wayzyy.com account?", a: "Yes. It's the same account. Your wishlists, trips and messages show up on your phone and on the website." },
  { q: "Where does Wayzyy have stays?", a: "Across North and South Goa right now: Anjuna, Assagao, Siolim, Vagator, Baga, Candolim, Colva and more. We're in early access and adding stays every week." },
  { q: "I'm a host. Can I run my listing from the app?", a: "Yes. Switch to hosting to edit listings, manage your calendar, sync with Airbnb and Booking.com, and reply to guests." },
];

const AppleLogo = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={`fill-current ${className}`}><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.4z"/></svg>
);
const PlayLogo = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className}><path fill="#34A853" d="M3.6 1.8 13.5 12 3.6 22.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2z"/><path fill="#FBBC04" d="m16.8 8.7-3.3 3.3 3.3 3.3 3.8-2.2c.9-.5.9-1.7 0-2.2z"/><path fill="#4285F4" d="M3.6 22.2 13.5 12l3.3 3.3L5 22c-.5.3-1 .4-1.4.2z"/><path fill="#EA4335" d="M3.6 1.8c.4-.2.9-.1 1.4.2l11.8 6.7-3.3 3.3z"/></svg>
);

function StoreButtons({ light = false, center = false }: { light?: boolean; center?: boolean }) {
  const cls = `inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-transform hover:-translate-y-0.5 ${
    light ? "bg-white text-black" : "bg-foreground text-background"
  }`;
  return (
    <div className={`flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download Wayzyy on the App Store" className={cls}>
        <AppleLogo className="h-7 w-7" />
        <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wide opacity-70">Download on the</span><span className="block text-base font-semibold">App Store</span></span>
      </a>
      <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" aria-label="Get Wayzyy on Google Play" className={cls}>
        <PlayLogo className="h-7 w-7" />
        <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wide opacity-70">Get it on</span><span className="block text-base font-semibold">Google Play</span></span>
      </a>
    </div>
  );
}

/** White-bezel phone around a real app screenshot (screenshots are 600x1300). */
function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-[2.6rem] bg-white p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/50 ${className}`}>
      <img src={src} alt={alt} width={600} height={1300} loading="lazy" className="block aspect-[6/13] w-full rounded-[2.1rem] object-cover" />
    </div>
  );
}

/** Native-style screens drawn in code (same cards, pills and orange accents as the app). */
function PhoneShell({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2.6rem] bg-white p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/50 ${className}`}>
      <div className="aspect-[6/13] overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-[#FFE9D6] via-[#FFD2A8] to-[#FF9F5A] p-3">
        <div className="flex items-center justify-between pt-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF6B00]/40 bg-white/40"><ChevronLeft className="h-4 w-4" /></span>
          <span className="text-sm font-semibold text-black">{title}</span>
          <span className="h-8 w-8 rounded-full border border-[#FF6B00]/40 bg-white/40" />
        </div>
        <div className="mt-3 space-y-2">{children}</div>
      </div>
    </div>
  );
}

const Row = ({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1E5]"><Icon className="h-4 w-4 text-[#FF6B00]" /></span>
    <span className="min-w-0 flex-1 text-left text-[11px] leading-tight"><span className="block font-semibold text-black">{label}</span><span className="block text-black/60">{value}</span></span>
    <ChevronDown className="h-3.5 w-3.5 text-black/40" />
  </div>
);

function DatePhone({ className = "" }: { className?: string }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <PhoneShell title="Choose dates" className={className}>
      <Row icon={Home} label="Stay" value="Anjuna Bohemian Stone Villa" />
      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-black"><ChevronLeft className="h-3 w-3" />November 2026<ChevronRight className="h-3 w-3" /></div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-[9px] text-black/70">
          {["M","T","W","T","F","S","S"].map((d, i) => <span key={i} className="font-semibold text-black/40">{d}</span>)}
          {days.map((d) => (
            <span key={d} className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full ${d === 12 || d === 17 ? "bg-[#FF6B00] font-bold text-white" : d > 12 && d < 17 ? "bg-[#FFE3CC]" : ""}`}>{d}</span>
          ))}
        </div>
      </div>
      <Row icon={Users} label="Guests" value="4 Adults" />
      <div className="rounded-full bg-[#FF6B00] py-2.5 text-center text-xs font-semibold text-white">Reserve</div>
    </PhoneShell>
  );
}

function PlacePhone({ className = "" }: { className?: string }) {
  return (
    <PhoneShell title="Location" className={className}>
      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <p className="text-[10px] font-semibold text-black/60">Price per night</p>
        <p className="font-display text-3xl font-bold leading-none text-black">₹4,815</p>
        <div className="my-3 flex h-24 items-center justify-center rounded-xl bg-[#E4F1E0]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B00] shadow-lg"><MapPin className="h-4 w-4 text-white" /></span></div>
        <p className="text-[10px] font-semibold text-black/60">Distance to the beach</p>
        <p className="font-display text-3xl font-bold leading-none text-black">1.2 km</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Pool", "WiFi", "AC", "Kitchen"].map((a) => <span key={a} className="rounded-full border border-[#FF6B00]/40 bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-black">{a}</span>)}
      </div>
    </PhoneShell>
  );
}

const Chip = ({ children, className = "" }: { children: string; className?: string }) => (
  <span className={`absolute z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/60 bg-black/35 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md ${className}`}>
    <span className="h-2.5 w-2.5 rotate-45 rounded-[3px] bg-[#FFB36B]" />
    {children}
  </span>
);

export default function GetTheApp() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Wayzyy",
    alternateName: ["Wayzee", "Wayzy"],
    operatingSystem: "Android, iOS",
    applicationCategory: "TravelApplication",
    description: "Book verified villas, homes and stays in Goa, and manage your listing if you host.",
    url: "https://wayzyy.com/app",
    installUrl: [APP_STORE_URL, PLAY_URL],
    sameAs: [APP_STORE_URL, PLAY_URL],
    screenshot: Object.values(SHOT).map((s) => `https://wayzyy.com${s}`),
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": "https://wayzyy.com/#organization" },
  };

  return (
    <SEO
      title="Wayzyy App - Book Goa Villas & Stays on iPhone and Android"
      description="The Wayzyy app (way-zee) is live on the App Store and Google Play: verified villas and homes in Goa, the full price up front, and host tools with Airbnb calendar sync."
      path="/app"
      jsonLd={jsonLd}
    >
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />
        <main>
          {/* Hero: landscape backdrop with three phones, after the reference layout */}
          <section className="relative overflow-hidden">
            <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />

            <div className="relative mx-auto max-w-6xl px-4 pt-14 text-center text-white sm:px-6 lg:pt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Live on iPhone and Android
              </span>
              <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-balance sm:text-6xl">
                Find your perfect stay in Goa.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                Verified villas and homes, honest prices and real hosts. Book in a few taps, and host from the same app.
              </p>
              <div className="mt-7"><StoreButtons light center /></div>
            </div>

            <div className="relative mx-auto mt-14 flex max-w-5xl items-end justify-center gap-6 px-4 pb-16 sm:px-6 lg:gap-10">
              <PlacePhone className="hidden w-56 translate-y-10 -rotate-3 md:block lg:w-64" />
              <div className="relative w-64 sm:w-72">
                <Chip className="-left-10 top-[30%] sm:-left-16">Verified hosts</Chip>
                <Chip className="-right-8 top-[48%] sm:-right-14">No hidden fees</Chip>
                <Chip className="-left-6 top-[68%] sm:-left-12">Airbnb calendar sync</Chip>
                <Phone src={SHOT.welcome} alt="Wayzyy app welcome screen" />
              </div>
              <DatePhone className="hidden w-56 translate-y-10 rotate-3 md:block lg:w-64" />
            </div>
          </section>

          {/* Quick value strip */}
          <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
            {[
              { icon: BadgeCheck, title: "Verified stays", text: "Every listing reviewed by our team, every host Aadhaar-verified." },
              { icon: Wallet, title: "The full price, up front", text: "Taxes and fees before you book. No surprises at checkout." },
              { icon: MessageCircle, title: "A real person replies", text: "Chat with the host or with us, before and during your stay." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-border bg-muted/30 p-6">
                <Icon className="h-6 w-6 text-[#FF6B00]" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </section>

          {/* Tour of the guest side */}
          <section className="mx-auto max-w-6xl space-y-20 px-4 py-10 sm:px-6">
            <h2 className="text-center font-display text-3xl font-bold">Inside the app</h2>
            {TOUR.map((t, i) => (
              <div key={t.title} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="mx-auto w-60 sm:w-64">
                  <Phone src={t.shot} alt={`Wayzyy app: ${t.title}`} className="bg-muted ring-border" />
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">{t.eyebrow}</p>
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">{t.title}</h3>
                  <p className="text-muted-foreground">{t.text}</p>
                  <ul className="space-y-2">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm"><BadgeCheck className="h-4 w-4 shrink-0 text-[#FF6B00]" /> {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>

          {/* Host side */}
          <section className="mt-16 bg-foreground text-background">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="flex justify-center gap-4">
                <Phone src={SHOT.listings} alt="Wayzyy app: host listings" className="w-44 -rotate-2 sm:w-52" />
                <Phone src={SHOT.calendar} alt="Wayzyy app: host calendar" className="w-44 translate-y-8 rotate-2 sm:w-52" />
              </div>
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB36B]">For hosts</p>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">Run your listing from your phone.</h2>
                <p className="opacity-75">List once and manage everything in one place: listings, calendar, pricing and guest messages. 0% booking commission for hosts.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  {HOST_FEATURES.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="space-y-1.5">
                      <Icon className="h-5 w-5 text-[#FFB36B]" />
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-sm opacity-70">{text}</p>
                    </div>
                  ))}
                </div>
                <Link to="/host" className="inline-flex rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white">List your property</Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="mb-6 text-center font-display text-3xl font-bold">Questions</h2>
            <div className="divide-y divide-border rounded-3xl border border-border">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {q}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Final CTA, extra bottom padding clears the MobileTabBar */}
          <section className="relative mx-4 mb-28 overflow-hidden rounded-[2rem] sm:mx-6 sm:mb-16 lg:mx-auto lg:max-w-6xl">
            <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative space-y-5 px-6 py-14 text-center text-white">
              <MapPin className="mx-auto h-7 w-7 text-[#FFB36B]" />
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Figure out Goa with Wayzyy.</h2>
              <p className="text-white/80">Search “Wayzyy” (way-zee) on the App Store or Google Play.</p>
              <StoreButtons light center />
              <p className="text-sm"><Link to="/" className="font-semibold underline">Or browse stays on the website</Link></p>
            </div>
          </section>
        </main>
      </div>
    </SEO>
  );
}
