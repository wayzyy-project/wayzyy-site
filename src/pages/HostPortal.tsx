import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Upload, X, Loader2, CheckCircle2, Star,
  Home, Building2, TreePine, Wheat, Landmark, MoreHorizontal,
  BedDouble, Users, Navigation, SlidersHorizontal,
  ShieldCheck, MessageCircle, CalendarSync, Wallet, Camera, FileText,
  Percent, RefreshCw, Headset, Lock, Eye, Droplet, TrendingUp,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { geocodePincode, reverseGeocode } from "@/lib/geocode";
import { LocationMap } from "@/components/host/LocationMap";
import { ListingManagePanel } from "@/components/host/ListingManagePanel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SHORT_TERM_POLICIES, LONG_TERM_POLICIES, ShortTermPolicyId, LongTermPolicyId } from "@/lib/cancellationPolicies";

// Same value sets as mobile/src/screens/host/BecomeHostScreen.tsx — keeps
// listings consistent regardless of which platform a host submits from.
const PLACE_TYPES = [
  { id: "villa", label: "Villa", icon: Home },
  { id: "apt", label: "Apartment", icon: Building2 },
  { id: "cottage", label: "Cottage", icon: TreePine },
  { id: "farm", label: "Farm Stay", icon: Wheat },
  { id: "heritage", label: "Heritage Home", icon: Landmark },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const SPACE_TYPES = [
  { id: "entire", label: "Entire place", icon: Home, desc: "Guests have the whole place to themselves" },
  { id: "private", label: "Private room", icon: BedDouble, desc: "Guests have their own room; some areas may be shared" },
  { id: "shared", label: "Shared room", icon: Users, desc: "Guests share a sleeping space with others" },
];

const AMENITIES = [
  "WiFi", "Kitchen", "Washer", "AC", "Heating", "Hot Water", "TV", "Pool",
  "Parking", "Breakfast", "Garden", "Beach Access", "Pet-friendly", "BBQ",
  "Workspace", "Gym", "EV Charger",
];

// Matches mobile's BecomeHostScreen.tsx per-bedroom bed-type breakdown.
const BED_TYPES = [
  "Single bed", "Double bed", "Queen bed", "King bed", "Sofa bed",
  "Bunk bed", "Floor mattress", "Airbed", "Crib", "Hammock",
];

const MIN_PHOTOS = 5;
const STEPS = ["Place", "Space", "Location", "Capacity", "Sleeping", "Amenities", "Details", "Cancellation", "Photos"];

interface BedroomArrangement {
  name: string;
  beds: { type: string; count: number }[];
}

interface ListingForm {
  title: string;
  description: string;
  price: string;
  weekendPrice: string;
  placeType: string;
  spaceType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  registrationNumber: string;
  latitude: number | null;
  longitude: number | null;
  maxGuests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  sleepingArrangements: BedroomArrangement[];
  cancelPolicy: ShortTermPolicyId;
  cancelPolicyLongTerm: LongTermPolicyId;
  amenities: string[];
}

const emptyForm: ListingForm = {
  title: "", description: "", price: "", weekendPrice: "",
  placeType: "", spaceType: "",
  street: "", city: "Goa", state: "Goa", pincode: "",
  registrationNumber: "",
  latitude: null, longitude: null,
  maxGuests: "2", bedrooms: "1", beds: "1", bathrooms: "1",
  sleepingArrangements: [{ name: "Bedroom 1", beds: [{ type: "Double bed", count: 1 }] }],
  cancelPolicy: "Flexible", cancelPolicyLongTerm: "Firm",
  amenities: [],
};

const WE_HANDLE = [
  { icon: FileText, label: "Listing review & approval", desc: "Every listing is checked before it goes live, so guests trust what they book." },
  { icon: ShieldCheck, label: "Guest ID verification", desc: "DigiLocker/Aadhaar verification for every guest — you're never hosting unverified strangers." },
  { icon: Lock, label: "Secure payments & fast payouts", desc: "Guest payments run through Razorpay; payouts land in your account within 24 hours of check-in." },
  { icon: MessageCircle, label: "In-app messaging", desc: "One clean inbox for every guest conversation and booking request." },
  { icon: CalendarSync, label: "Two-way iCal calendar sync", desc: "Connect existing calendars to eliminate double bookings across platforms automatically." },
  { icon: Headset, label: "Direct in-house host support", desc: "Reach our Indian team directly — no scripted bots or outsourced call centers reading scripts." },
];

const YOU_PROVIDE = [
  "Property details, address, and 5+ high-quality photos",
  "Your own price per night (weekday & weekend rates)",
  "An availability calendar",
  "Your state's tourism registration number (where legally required, e.g. Goa Tourism Dept)",
];

const REAL_HOST_QUOTES = [
  {
    author: "u/Tough-Kangaroo301",
    source: "r/airbnb_hosts",
    title: "Unilateral Policy & Cancellation Overrides",
    quote:
      "Woke up to find my 5br house now has a flexible cancellation policy after having strict set for years. Didn't even get an email about it... Airbnb clearly doesn't care that different properties have different realities. They shoved this new cancellation model through without asking anyone who actually manages these spaces.",
    solution:
      "Wayzyy Guarantee: Your cancellation policy belongs to you. Wayzyy never alters your cancellation terms without your explicit written consent.",
  },
  {
    author: "u/zorba_trvl",
    source: "r/AirBnBHosts",
    title: "The 15.5% Single Fee & Indian ADR Reality",
    quote:
      "Now the guest will only see that he is paying the entire 15.5% fee to you... For an inexperienced guest, he will feel he is not getting value for money, and is more likely to award a lower rating. Average Indian Airbnb ADR is ₹2,500–₹3,500 and 15% is a lot of money percentage wise.",
    solution:
      "Wayzyy Guarantee: No per-booking percentage commission. Guests see your true listed rate without a 15.5% platform cut baked in, protecting host ratings and margins.",
  },
  {
    author: "u/topgun22ice & u/discovery999",
    source: "r/airbnb_hosts",
    title: "Monopoly Frustration & Unhelpful Platform Fees",
    quote:
      "I ran the numbers and have paid ABNB $422k in fees since 2020. They have helped me zero ever... They are a monopoly or I'd run to VRBO or booking.com... Large companies don't care because they're saving money and can afford to lose a few clients.",
    solution:
      "Wayzyy Guarantee: Built by hosts for hosts to break the monopoly cycle in Goa. Our flat prepaid credit pack model brings your effective platform cost down to ~2%.",
  },
  {
    author: "u/DavidBrantleyFinance & u/AdBackground7748",
    source: "r/airbnb_hosts & r/IndiaBusiness",
    title: "Scripted Support & Unfair Guest Dispute Losses",
    quote:
      "Support ambassadors seem to repeat the few English phrases they have been taught over and over... Refunded my unreasonable guest their full amount... She said she has nowhere to go or complain, while guests can leave a low rating.",
    solution:
      "Wayzyy Guarantee: DigiLocker/Aadhaar identity verification for every guest, plus an evidence-based 3-tier dispute resolution system handled by an in-house team in India. Ratings of 3 stars or lower undergo manual human review before publishing.",
  },
];

function HostIntro({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-16">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl border border-ember/30 bg-card/60 p-8 sm:p-10 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ember/5 via-transparent to-transparent -z-10" />
        <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-semibold text-ember uppercase tracking-wider">
          Host-First Platform for Goa
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-foreground font-bold leading-tight">
          List Your Property with Zero Commission Cut
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Welcome to the hosting portal! Before you start listing, see exactly what Wayzyy handles for you, what you'll need to provide, how credit packs work, and why real hosts are switching to a direct platform built for Goa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Button onClick={onGetStarted} size="lg" className="w-full sm:w-auto bg-ember text-white hover:bg-ember/90 shadow-md">
            Create Host Account & List Property
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link
            to="/earnings-calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/40 text-sm font-medium text-foreground transition-colors"
          >
            Calculate Your Earnings
          </Link>
        </div>
      </div>

      {/* What We Handle */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">What We Take Care Of</h2>
          <p className="text-sm text-muted-foreground mt-1">Everything you need to host safely, legally, and profitably in Goa.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WE_HANDLE.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-3 rounded-2xl border border-border bg-card/30 p-5 hover:border-ember/40 transition-colors">
              <Icon className="h-5 w-5 shrink-0 text-ember mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What You Provide */}
      <section className="rounded-2xl border border-border bg-card/25 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">What You'll Need to Provide</h2>
        <p className="text-sm text-muted-foreground mb-6">Four basic requirements to get your listing published and verified:</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {YOU_PROVIDE.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground bg-background/50 border border-border/60 p-3.5 rounded-xl">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How Credit Packs & Pricing Work */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">How Pricing & Credit Packs Work</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Wayzyy never takes a percentage cut from your booking payout — you keep 100% of your listed nightly price. Instead of commission, hosts purchase prepaid credit packs that unlock booking volume. Your first listing receives a free credit pack to get started!
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { price: "Free", cap: "₹1,00,000", note: "your first listing starter pack" },
            { price: "₹600", cap: "₹20,000", note: "3.0% effective cost" },
            { price: "₹2,200", cap: "₹1,00,000", note: "2.2% effective cost" },
            { price: "₹10,000", cap: "₹5,00,000", note: "~2.0% effective cost" },
          ].map((pack) => (
            <div key={pack.cap + pack.price} className="rounded-2xl border border-border bg-card/40 p-5 text-center hover:border-ember/40 transition-colors">
              <p className="font-display text-xl font-bold text-foreground">{pack.price}</p>
              <p className="text-xs text-muted-foreground mt-1">unlocks {pack.cap} in bookings</p>
              <p className="mt-2 text-xs font-medium text-ember">{pack.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground max-w-2xl bg-muted/20 p-3 rounded-xl border border-border/60">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>
            <strong>Auto-extension safeguard:</strong> If a high-value booking exceeds your current credit pack headroom, we auto-extend it with the smallest tier needed so your listing never goes dark. That fee only comes out of that specific booking payout — never a surprise charge later.
          </span>
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground max-w-2xl bg-muted/20 p-3 rounded-xl border border-border/60">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>
            <strong>Goa pricing swings more than most hosts price for:</strong> across Anjuna, Calangute, and Candolim,
            December nightly rates run 45–60% above the June baseline — but even at that peak, occupancy tops out
            around 40–44%. Getting your seasonal pricing and cancellation policy right matters more here than in most markets.
          </span>
        </p>
      </section>

      {/* Why We Built Wayzyy — Real Reddit Host Community Citations & Quotes */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-ember/25 bg-ember/10 px-3 py-1 text-xs uppercase tracking-wider text-ember font-semibold mb-2">
            Why We Built Wayzyy
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Solving the Real Problems Facing Property Hosts
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            As hosts ourselves, we watched major platforms gradually shift from partner-first marketplaces to corporate monopolies. Here is what real hosts are reporting across online communities (such as r/airbnb_hosts and r/IndiaBusiness), and how Wayzyy directly fixes each issue:
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {REAL_HOST_QUOTES.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-border/80 bg-card/30 p-6 space-y-4 flex flex-col justify-between hover:border-border transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ember uppercase tracking-wider">{item.title}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">{item.source} · {item.author}</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-muted-foreground italic border-l-2 border-ember/40 pl-3 leading-relaxed">
                  "{item.quote}"
                </blockquote>
              </div>
              <div className="rounded-xl bg-ember/5 border border-ember/20 p-3 text-xs font-medium text-foreground">
                <span className="text-ember font-bold block mb-0.5">How Wayzyy Fixes This:</span>
                {item.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action CTA Footer */}
      <div className="rounded-3xl border border-border bg-card/50 p-8 sm:p-10 text-center space-y-4 shadow-lg">
        <h3 className="font-display text-2xl font-bold text-foreground">Ready to take control of your rental business?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Join over 50+ trusted Goa hosts listing their villas and apartments directly on Wayzyy.
        </p>
        <div className="pt-2">
          <Button onClick={onGetStarted} size="lg" className="bg-ember text-white hover:bg-ember/90 px-8 py-3 rounded-xl font-medium">
            Get started — create your host account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } =
        mode === "signup" ? await signUp(email, password, name) : await signIn(email, password);
      if (error) throw error;
      if (mode === "signup") {
        toast({ title: "Check your email", description: "Confirm your address, then log in to list your property." });
        setMode("login");
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex rounded-full border border-border p-1 text-sm">
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === "signup" ? "bg-ember text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === "login" ? "bg-ember text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full bg-ember hover:bg-ember/90 text-white">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Log in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        This is the same account system as the Wayzyy app — log in here with the same email and
        password you'd use on mobile, or create a new one either place.
      </p>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{STEPS[step]}</p>
      <div className="h-1 rounded-full bg-border">
        <div
          className="h-1 rounded-full bg-ember transition-all"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

interface HostListing {
  id: string;
  title: string;
  city: string;
  state: string;
  price_per_night: number;
  images: string[];
  status: string;
}

function statusMeta(status: string) {
  if (status === "active") return { label: "Live", className: "bg-green-500/10 text-green-600 dark:text-green-400" };
  if (status === "pending_review") return { label: "Pending review", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-500/10 text-red-600 dark:text-red-400" };
  return { label: status, className: "bg-muted text-muted-foreground" };
}

// The website's equivalent of the app's Host section listings screen — same
// `properties` table, same host_id, so a listing made on either platform
// shows up here identically.
function HostDashboard({ onAddNew, onManage }: { onAddNew: () => void; onManage: (id: string, title: string) => void }) {
  const { user } = useAuth();
  const [listings, setListings] = useState<HostListing[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("properties")
      .select("id, title, city, state, price_per_night, images, status")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setListings((data ?? []) as HostListing[]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (listings === null) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl">Your listings</h2>
        <Button onClick={onAddNew} className="gap-1.5 bg-ember text-white hover:bg-ember/90">
          <Home className="h-4 w-4" />
          List a new property
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Home className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">No listings yet</p>
          <p className="mb-4 text-xs text-muted-foreground">List your first property to start hosting on Wayzyy.</p>
          <Button onClick={onAddNew} className="bg-ember text-white hover:bg-ember/90">
            List a new property
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((p) => {
            const meta = statusMeta(p.status);
            return (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Home className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium">{p.title || "Untitled listing"}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{[p.city, p.state].filter(Boolean).join(", ")}</p>
                    <p className="mt-1 text-sm font-medium">
                      {p.price_per_night ? `₹${p.price_per_night.toLocaleString("en-IN")} / night` : "Price not set"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManage(p.id, p.title || "Untitled listing")}
                  className="mt-3 inline-flex w-auto justify-start gap-1.5 rounded-full border-ember text-ember hover:bg-ember/10 hover:text-ember"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Manage calendar, discounts & cancellation policy
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Phone-shaped "what a guest would see" preview — updates live from the
// wizard's in-progress state. Toggling it never navigates anywhere, so the
// host stays on exactly the step they were on.
function PhonePreview({ data, photos }: { data: ListingForm; photos: { file: File; preview: string }[] }) {
  const placeLabel = PLACE_TYPES.find((p) => p.id === data.placeType)?.label;
  const bedroomCount = data.sleepingArrangements.length || Number(data.bedrooms) || 0;
  const bedSummary = data.sleepingArrangements
    .flatMap((r) => r.beds)
    .reduce<Record<string, number>>((acc, b) => {
      acc[b.type] = (acc[b.type] ?? 0) + b.count;
      return acc;
    }, {});
  const bedSummaryText = Object.entries(bedSummary)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ");

  return (
    <div className="rounded-[2.5rem] border-4 border-foreground/10 bg-background p-2 shadow-xl">
      <div className="flex items-center justify-center gap-1 pb-1.5">
        <Eye className="h-3 w-3 text-ember" />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ember">Preview</span>
      </div>
      <div className="max-h-[600px] overflow-y-auto rounded-[1.75rem] border border-border">
        {photos.length > 0 ? (
          <img src={photos[0].preview} alt="" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-muted">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">No photos yet</span>
          </div>
        )}
        <div className="space-y-3 p-3">
          <div>
            <p className="text-sm font-semibold leading-tight">{data.title.trim() || "Untitled listing"}</p>
            <p className="text-xs text-muted-foreground">
              {placeLabel ?? "Place type not set"}
              {data.city ? ` · ${data.city}${data.state ? `, ${data.state}` : ""}` : " · Location not set"}
            </p>
          </div>

          <div>
            <span className="text-sm font-bold">{data.price ? `₹${data.price}` : "Price not set"}</span>
            {data.price && <span className="text-xs text-muted-foreground"> / night</span>}
            {data.weekendPrice && <p className="text-[11px] text-muted-foreground">₹{data.weekendPrice} / night weekends</p>}
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {data.maxGuests} guests
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" /> {bedroomCount} bed{bedroomCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5" /> {data.bathrooms} bath
            </span>
          </div>
          {bedSummaryText && <p className="text-[11px] text-muted-foreground">{bedSummaryText}</p>}

          <div className="border-t border-border pt-3">
            <p className="mb-1 text-xs font-semibold">About this place</p>
            <p className={`text-[11px] leading-relaxed ${data.description.trim() ? "text-muted-foreground" : "italic text-muted-foreground/70"}`}>
              {data.description.trim() || "No description added yet."}
            </p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="mb-1.5 text-xs font-semibold">What this place offers</p>
            {data.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-border px-2 py-0.5 text-[10px]">{a}</span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] italic text-muted-foreground/70">No amenities selected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingWizard({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ListingForm>(emptyForm);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const set = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (id: string) =>
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
    }));

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const next = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  // Keep the per-bedroom breakdown in sync with the bedroom count field —
  // grow with default rooms, shrink by dropping the last ones.
  useEffect(() => {
    const n = Math.max(0, parseInt(data.bedrooms || "0", 10) || 0);
    setData((prev) => {
      if (n === prev.sleepingArrangements.length) return prev;
      let arrangements = prev.sleepingArrangements;
      if (n > arrangements.length) {
        arrangements = [
          ...arrangements,
          ...Array.from({ length: n - arrangements.length }, (_, i) => ({
            name: `Bedroom ${arrangements.length + i + 1}`,
            beds: [{ type: "Double bed", count: 1 }],
          })),
        ];
      } else {
        arrangements = arrangements.slice(0, n);
      }
      return { ...prev, sleepingArrangements: arrangements };
    });
  }, [data.bedrooms]);

  const setBedCount = (roomIdx: number, bedType: string, delta: number) => {
    setData((prev) => {
      const arrangements = prev.sleepingArrangements.map((room, i) => {
        if (i !== roomIdx) return room;
        const beds = room.beds.filter((b) => b.type !== bedType);
        const existing = room.beds.find((b) => b.type === bedType);
        const newCount = Math.max(0, (existing?.count ?? 0) + delta);
        return { ...room, beds: newCount > 0 ? [...beds, { type: bedType, count: newCount }] : beds };
      });
      return { ...prev, sleepingArrangements: arrangements };
    });
  };

  const getBedCount = (roomIdx: number, bedType: string): number =>
    data.sleepingArrangements[roomIdx]?.beds.find((b) => b.type === bedType)?.count ?? 0;

  // The first photo in the array is the cover shown everywhere (search
  // cards, listing thumbnails) — same convention as the mobile app.
  const makeCover = (idx: number) =>
    setPhotos((prev) => {
      const next = [...prev];
      const [picked] = next.splice(idx, 1);
      return [picked, ...next];
    });

  const isGoa = data.state.trim().toLowerCase() === "goa";

  // ── Location handling — mirrors the mobile app: detect current location,
  // or type a pincode, and the map pans + address fields fill in. Dragging
  // or clicking the pin re-runs the same reverse-geocode. ──────────────────
  const applyReverseGeocode = async (lat: number, lng: number) => {
    try {
      const result = await reverseGeocode(lat, lng);
      if (!result) return;
      setData((prev) => ({
        ...prev,
        street: result.street || prev.street,
        city: result.city ?? prev.city,
        state: result.state ?? prev.state,
        pincode: result.pincode ?? prev.pincode,
      }));
    } catch {
      // Reverse geocoding can fail independently of placing the pin — leave
      // address fields as-is so the host can still fill them manually.
    }
  };

  const handleMapChange = (lat: number, lng: number) => {
    setData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    applyReverseGeocode(lat, lng);
  };

  const handlePincodeChange = async (val: string) => {
    set("pincode", val);
    if (val.length === 6 && /^\d{6}$/.test(val)) {
      setPincodeLoading(true);
      try {
        const result = await geocodePincode(val);
        if (result) {
          setData((prev) => ({ ...prev, latitude: result.lat, longitude: result.lng, pincode: val }));
          await applyReverseGeocode(result.lat, result.lng);
        }
      } catch {
        // stay on manual entry if geocoding fails
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Location not available", description: "Your browser doesn't support location detection.", variant: "destructive" });
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((prev) => ({ ...prev, latitude, longitude }));
        await applyReverseGeocode(latitude, longitude);
        setLocLoading(false);
      },
      () => {
        toast({ title: "Couldn't get your location", description: "Allow location access, or drop the pin manually on the map.", variant: "destructive" });
        setLocLoading(false);
      },
    );
  };

  // ── Per-step validation — mirrors mobile's getStepError, so a host can't
  // advance with something missing, and finds out exactly what's wrong. ────
  const stepError = (): string | null => {
    switch (step) {
      case 0:
        if (!data.placeType) return "Please select what kind of place you're listing.";
        if (!acceptedTerms) return "Please accept the Host Terms & Conditions to proceed to the next section.";
        return null;
      case 1: return data.spaceType ? null : "Please select what type of space guests will have.";
      case 2:
        if (!data.street.trim() || !data.city.trim() || !data.state.trim() || !data.pincode.trim()) return "Please complete the address.";
        if (isGoa && !data.registrationNumber.trim()) return "Goa Tourism Registration Number is required for Goa listings.";
        return null;
      case 3: {
        const price = parseFloat(data.price);
        if (!Number.isFinite(price) || price < 100 || price > 1000000) return "Price must be between ₹100 and ₹10,00,000 per night.";
        return null;
      }
      case 6:
        if (data.title.trim().length < 5) return "Listing title must be at least 5 characters.";
        if (!data.description.trim()) return "Please add a description.";
        return null;
      case 8:
        if (photos.length < MIN_PHOTOS) return `Please add at least ${MIN_PHOTOS} photos.`;
        return null;
      default: return null;
    }
  };

  const goNext = () => {
    const error = stepError();
    if (error) {
      toast({ title: "Almost there", description: error, variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const { file } of photos) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${user!.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    const error = stepError();
    if (error) {
      toast({ title: "Missing information", description: error, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const photoUrls = await uploadPhotos();

      const { data: result, error: fnError } = await supabase.functions.invoke("submit-listing", {
        body: {
          listingData: {
            title: data.title,
            description: data.description,
            price: data.price,
            weekendPrice: data.weekendPrice,
            placeType: data.placeType,
            spaceType: data.spaceType,
            street: data.street,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            registrationNumber: data.registrationNumber,
            latitude: data.latitude,
            longitude: data.longitude,
            maxGuests: Number(data.maxGuests),
            bedrooms: Number(data.bedrooms),
            beds: Number(data.beds),
            bathrooms: Number(data.bathrooms),
            sleepingArrangements: data.sleepingArrangements,
            cancelPolicy: data.cancelPolicy,
            cancelPolicyLongTerm: data.cancelPolicyLongTerm,
            amenities: data.amenities,
            photos: photoUrls,
            instantBook: false,
            selfCheckIn: false,
            cancelPolicy: "Flexible",
            checkInTime: "3:00 PM",
            checkOutTime: "11:00 AM",
          },
          hostEmail: user?.email ?? "",
          hostName: (user?.user_metadata?.name as string) ?? user?.email ?? "Host",
          hostId: user?.id ?? null,
        },
      });

      if (fnError) {
        let message = fnError.message ?? "Submission failed";
        try {
          const body = await (fnError as any).context?.json?.();
          if (body?.error) message = body.error;
        } catch {
          // ignore — fall back to generic message
        }
        throw new Error(message);
      }
      if (!result?.success) throw new Error(result?.error ?? "Submission failed");

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Couldn't submit listing",
        description: err instanceof Error ? err.message : "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md text-center py-16">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-ember" />
        <h2 className="font-display text-2xl mb-2">Submitted for review</h2>
        <p className="text-sm text-muted-foreground">
          You'll get a confirmation email shortly, and another once our team approves your listing —
          usually within 24 hours.
        </p>
        <Button onClick={onDone} variant="outline" className="mt-6">
          Back to your listings
        </Button>
      </div>
    );
  }

  return (
    <div className={`mx-auto ${previewOpen ? "max-w-5xl" : "max-w-2xl"}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onDone}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to your listings
        </button>
        <button
          type="button"
          onClick={() => setPreviewOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
            previewOpen ? "border-ember bg-ember/10 text-ember" : "border-border text-muted-foreground hover:border-foreground/30"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
      </div>

      <div className={previewOpen ? "flex items-start gap-8" : ""}>
      <div className={previewOpen ? "min-w-0 flex-1" : ""}>
      <ProgressBar step={step} />

      {step === 0 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-xl">What kind of place is it?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLACE_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("placeType", id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-sm transition-colors ${
                    data.placeType === id ? "border-ember bg-ember/10 text-ember" : "border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Terms & Conditions Agreement Box */}
          <div className="rounded-2xl border border-ember/30 bg-ember/5 p-4 space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="host-terms-agree"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                className="mt-0.5 border-ember/50 data-[state=checked]:bg-ember data-[state=checked]:text-white"
              />
              <label htmlFor="host-terms-agree" className="text-xs text-foreground leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <Link to="/host-terms" target="_blank" className="font-bold text-ember underline hover:text-ember/80">
                  Wayzyy Host Terms & Conditions
                </Link>,{" "}
                <Link to="/guest-terms" target="_blank" className="font-bold text-ember underline hover:text-ember/80">
                  Guest Terms
                </Link>, and{" "}
                <Link to="/policies/privacy-policy" target="_blank" className="font-bold text-ember underline hover:text-ember/80">
                  Privacy Policy
                </Link>.
                I confirm that I own or hold valid leasing/management authorization to list this property on Wayzyy.
              </label>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">What will guests have?</h2>
          <div className="space-y-3">
            {SPACE_TYPES.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => set("spaceType", id)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  data.spaceType === id ? "border-ember bg-ember/10" : "border-border hover:border-foreground/30"
                }`}
              >
                <Icon className={`h-6 w-6 shrink-0 ${data.spaceType === id ? "text-ember" : "text-muted-foreground"}`} strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Where is your place?</h2>
          <p className="text-sm text-muted-foreground">Your full address is only shared with confirmed guests.</p>

          <div>
            <Label htmlFor="street">Street address</Label>
            <Input id="street" value={data.street} onChange={(e) => set("street", e.target.value)} placeholder="e.g. 12 Calangute Beach Road" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={data.city} onChange={(e) => set("city", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" value={data.state} onChange={(e) => set("state", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <div className="relative">
                <Input
                  id="pincode" value={data.pincode} maxLength={6}
                  onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ""))}
                  required
                />
                {pincodeLoading && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </div>

          {isGoa && (
            <div>
              <Label htmlFor="reg">Goa Tourism Registration Number</Label>
              <Input id="reg" value={data.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="e.g. GTR/2026/00000" required />
              <p className="mt-1 text-xs text-muted-foreground">
                Required to publish a Goa listing.{" "}
                <Link to="/goa-host-compliance-checklist" className="text-ember hover:underline">
                  Don't have one yet? See the compliance checklist.
                </Link>
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locLoading}
            className="flex items-center gap-2 text-sm text-ember hover:underline disabled:opacity-60"
          >
            {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            Use my current location
          </button>

          <p className="text-xs text-muted-foreground">Tap the map or drag the pin to set your exact location.</p>
          <LocationMap lat={data.latitude} lng={data.longitude} onChange={handleMapChange} className="h-64 w-full overflow-hidden rounded-xl border border-border" />
          {data.latitude != null && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-ember" />
              Pin set · {data.latitude.toFixed(4)}, {data.longitude?.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Capacity & price</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="guests">Max guests</Label>
              <Input id="guests" type="number" min={1} max={50} value={data.maxGuests} onChange={(e) => set("maxGuests", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" min={0} max={50} value={data.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="beds">Beds</Label>
              <Input id="beds" type="number" min={0} max={50} value={data.beds} onChange={(e) => set("beds", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" min={0} max={50} value={data.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Weekday price (₹) — Sun–Thu</Label>
              <Input id="price" type="number" min={100} max={1000000} value={data.price} onChange={(e) => set("price", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="weekendPrice">Weekend price (₹) — Fri–Sat</Label>
              <Input
                id="weekendPrice" type="number" min={100} max={1000000}
                value={data.weekendPrice} onChange={(e) => set("weekendPrice", e.target.value)}
                placeholder="Same as weekday"
              />
              <p className="mt-1 text-xs text-muted-foreground">Optional — leave blank to use your weekday rate</p>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl">Sleeping arrangements</h2>
            <p className="text-sm text-muted-foreground">Make it clear to guests which type of bed is in each room.</p>
          </div>
          {data.sleepingArrangements.map((room, roomIdx) => (
            <div key={room.name} className="rounded-xl border border-border p-4">
              <p className="mb-3 font-medium text-sm">{room.name}</p>
              <div className="divide-y divide-border">
                {BED_TYPES.map((bedType) => {
                  const count = getBedCount(roomIdx, bedType);
                  return (
                    <div key={bedType} className="flex items-center justify-between py-2.5">
                      <span className="text-sm">{bedType}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setBedCount(roomIdx, bedType, -1)}
                          disabled={count <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{count}</span>
                        <button
                          type="button"
                          onClick={() => setBedCount(roomIdx, bedType, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <Checkbox checked={data.amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Title & description</h2>
          <div>
            <Label htmlFor="title">Listing title</Label>
            <Input id="title" value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Anjuna Bohemian Stone Villa" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={data.description} onChange={(e) => set("description", e.target.value)} rows={5} required />
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl">Cancellation policy</h2>
            <p className="text-sm text-muted-foreground">Choose a policy for shorter stays, and a separate one for 28+ night stays.</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">Under 28 nights</p>
            <div className="space-y-3">
              {SHORT_TERM_POLICIES.map((policy) => (
                <button
                  key={policy.id}
                  type="button"
                  onClick={() => set("cancelPolicy", policy.id)}
                  className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                    data.cancelPolicy === policy.id ? "border-ember bg-ember/10" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${data.cancelPolicy === policy.id ? "text-ember" : ""}`}>{policy.label}</p>
                    {policy.rules.map((rule) => (
                      <p key={rule} className="mt-1 text-xs text-muted-foreground">{rule}</p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">28+ nights</p>
            <div className="space-y-3">
              {LONG_TERM_POLICIES.map((policy) => (
                <button
                  key={policy.id}
                  type="button"
                  onClick={() => set("cancelPolicyLongTerm", policy.id)}
                  className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                    data.cancelPolicyLongTerm === policy.id ? "border-ember bg-ember/10" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${data.cancelPolicyLongTerm === policy.id ? "text-ember" : ""}`}>{policy.label}</p>
                    {policy.rules.map((rule) => (
                      <p key={rule} className="mt-1 text-xs text-muted-foreground">{rule}</p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Photos</h2>
          <p className="text-sm text-muted-foreground">
            At least {MIN_PHOTOS} photos required. The cover photo is what guests see first in search
            and on your listing card.
          </p>
          {photos.length === 0 ? (
            <label className="flex h-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground hover:border-ember hover:text-ember transition-colors">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Tap to add photos</span>
              <span className="text-xs">First photo becomes the cover</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
            </label>
          ) : (
            <>
              {/* Cover photo — large, above the grid, matching the mobile app */}
              <div className="relative">
                <img src={photos[0].preview} alt="" className="h-56 w-full rounded-xl border border-ember object-cover sm:h-72" />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-ember px-2.5 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-current" />
                  Cover photo
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(0)}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.slice(1).map((p, i) => {
                  const idx = i + 1;
                  return (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                      <img src={p.preview} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => makeCover(idx)}
                        className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-black/80 transition-colors"
                      >
                        Make cover
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground hover:border-ember hover:text-ember transition-colors">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Add photos</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        {step === STEPS.length - 1 ? (
          <Button type="button" onClick={handleSubmit} disabled={submitting} className="bg-ember hover:bg-ember/90 text-white">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit for review
          </Button>
        ) : (
          <Button type="button" onClick={goNext} className="bg-ember hover:bg-ember/90 text-white">
            Next
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        )}
      </div>
      </div>

      {previewOpen && (
        <div className="sticky top-24 w-[300px] shrink-0">
          <PhonePreview data={data} photos={photos} />
        </div>
      )}
      </div>
    </div>
  );
}

export default function HostPortal() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<"dashboard" | "wizard" | "manage">("dashboard");
  const [managing, setManaging] = useState<{ id: string; title: string } | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <SEO
      title="Host on Wayzyy"
      description="Manage your listings and list new properties on Wayzyy directly from the web — the same platform, database, and review process as the app."
      path="/host"
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Wayzyy
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className={`container ${!user && !showAuth ? "max-w-4xl" : "max-w-3xl"}`}>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              {user && view === "dashboard" ? "Your hosting" : !user && !showAuth ? "Host on Wayzyy" : "List your property"}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Same platform, same review process, same database as the Wayzyy app — host from
              wherever's easiest for you.
            </p>
          </div>
        </div>

        <div className={`container py-12 sm:py-16 ${!user && !showAuth ? "max-w-4xl" : "max-w-3xl"}`}>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            view === "dashboard" ? (
              <HostDashboard
                onAddNew={() => setView("wizard")}
                onManage={(id, title) => {
                  setManaging({ id, title });
                  setView("manage");
                }}
              />
            ) : view === "manage" && managing ? (
              <ListingManagePanel
                propertyId={managing.id}
                propertyTitle={managing.title}
                onBack={() => setView("dashboard")}
              />
            ) : (
              <ListingWizard onDone={() => setView("dashboard")} />
            )
          ) : (
            showAuth ? <AuthPanel /> : <HostIntro onGetStarted={() => setShowAuth(true)} />
          )}
        </div>
      </div>
    </SEO>
  );
}
