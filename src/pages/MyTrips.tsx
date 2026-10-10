import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Luggage, MapPin, Calendar, Users, Compass, Info, Wallet, CreditCard } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SHORT_TERM_POLICIES } from "@/lib/cancellationPolicies";
import {
  quoteRefund, daysUntil, hoursSince,
  CASH_REFUND_GATEWAY_RATE, CASH_REFUND_FIXED_CHARGE,
} from "@/lib/refund";

// Same `bookings` table the mobile app's Trips tab reads. Cancelling calls the
// same cancel-booking function, which recomputes the refund on the server -
// the numbers shown here are a preview only.

type Status = "pending" | "confirmed" | "cancelled" | "completed" | "not_approved";

interface Trip {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  image: string | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: Status;
  createdAt: string;
  policy: string | null;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_LABEL: Record<Status, string> = {
  pending: "Awaiting host",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  not_approved: "Declined",
};

function SignInPrompt() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) toast({ title: "Couldn't sign in", description: error.message, variant: "destructive" });
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="font-display text-2xl">Sign in to see your trips</h1>
      <p className="text-sm text-muted-foreground">
        Your trips are the same ones you'd see in the Wayzyy app - sign in with the same account.
      </p>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label htmlFor="trip-email">Email</Label>
          <Input id="trip-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="trip-password">Password</Label>
          <Input id="trip-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function CancelDialog({
  trip, onClose, onDone,
}: { trip: Trip | null; onClose: () => void; onDone: () => void }) {
  const { toast } = useToast();
  const [method, setMethod] = useState<"credit" | "cash">("credit");
  const [showWhy, setShowWhy] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setMethod("credit"); setShowWhy(false); }, [trip?.id]);
  if (!trip) return null;

  const days = daysUntil(trip.checkIn);
  const quote = quoteRefund(trip.policy, days, trip.total, hoursSince(trip.createdAt));
  const policy = SHORT_TERM_POLICIES.find((p) => p.id === trip.policy) ?? SHORT_TERM_POLICIES[0];
  const noRefund = quote.refundableAmount <= 0;
  const when =
    days < 0 ? "Your check-in date has passed."
    : days === 0 ? "You are cancelling on the day of check-in."
    : `You are cancelling ${days} day${days !== 1 ? "s" : ""} before check-in.`;

  const confirm = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("cancel-booking", {
      body: { bookingId: trip.id, payoutMethod: noRefund ? "credit" : method },
    });
    setBusy(false);
    if (error || (data as any)?.error) {
      toast({ title: "Couldn't cancel", description: (data as any)?.error || error?.message || "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Booking cancelled", description: noRefund ? undefined : "Your refund is on its way." });
    onDone();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>Your stay starts on {fmtDate(trip.checkIn)}. Review your refund before confirming.</DialogDescription>
        </DialogHeader>

        {quote.withinGracePeriod && (
          <div className="rounded-lg bg-accent/10 p-3 text-sm">Your 24-hour booking grace period applies.</div>
        )}

        <div className="rounded-lg border p-3 text-sm space-y-1">
          <p className="font-semibold">This host's policy: {policy.label}</p>
          {policy.rules.map((r) => <p key={r} className="text-muted-foreground">• {r}</p>)}
          <p className="pt-1 text-muted-foreground">{when}</p>
        </div>

        {noRefund ? (
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold">No refund under this policy</p>
            <p className="text-muted-foreground">You can still cancel the booking, but no payment or wallet credit is due.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Choose how to receive your refund</p>
              <button type="button" onClick={() => setShowWhy((v) => !v)} aria-label="How is my refund worked out?">
                <Info className="h-4 w-4 text-primary" />
              </button>
            </div>
            {showWhy && (
              <div className="rounded-lg border p-3 text-sm space-y-1">
                <p>
                  You paid {inr(trip.total)}, so you get {quote.percent}% back: {inr(quote.refundableAmount)}. Taxes and
                  Wayzyy's fee are refunded in the same share.
                </p>
                <p>• Wayzyy credit: the full {inr(quote.creditAmount)}, instantly, with nothing deducted.</p>
                <p>
                  • Original payment method: {inr(quote.cashAmount)}. Our payment partner keeps a processing charge of{" "}
                  {inr(quote.processingCharge)} (about {Math.round(CASH_REFUND_GATEWAY_RATE * 100)}% plus GST, and up to ₹
                  {CASH_REFUND_FIXED_CHARGE} per refund) whatever we do, so we pass it on.
                </p>
              </div>
            )}
            {([
              ["credit", Wallet, `Wayzyy credit · ${inr(quote.creditAmount)}`, "Full refundable value, available instantly, with no processing charge."],
              ["cash", CreditCard, `Original payment method · ${inr(quote.cashAmount)}`, `Usually 5-7 business days. Includes a ${inr(quote.processingCharge)} processing charge.`],
            ] as const).map(([id, Icon, title, body]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${method === id ? "border-primary bg-primary/5" : ""}`}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{body}</span>
                </span>
              </button>
            ))}
          </>
        )}

        <Button variant="destructive" onClick={confirm} disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm cancellation"}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={busy} className="w-full">Keep booking</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function MyTrips() {
  const { session, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelling, setCancelling] = useState<Trip | null>(null);
  const userId = session?.user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setError(false);
    const { data, error: err } = await supabase
      .from("bookings")
      .select("id, property_id, check_in, check_out, guests, total_price, status, created_at, properties(title, location, images, cancel_policy)")
      .eq("guest_id", userId)
      .order("created_at", { ascending: false });
    if (err) { setError(true); return; }
    setTrips(
      (data ?? []).map((b: any) => ({
        id: b.id,
        propertyId: b.property_id,
        title: b.properties?.title ?? "Stay",
        location: b.properties?.location ?? "",
        image: b.properties?.images?.[0] ?? null,
        checkIn: b.check_in,
        checkOut: b.check_out,
        guests: b.guests,
        total: Number(b.total_price) || 0,
        status: b.status,
        createdAt: b.created_at,
        policy: b.properties?.cancel_policy ?? null,
      })),
    );
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const isUpcoming = (t: Trip) => (t.status === "pending" || t.status === "confirmed") && t.checkOut >= today;
  const shown = (trips ?? []).filter((t) => (tab === "upcoming" ? isUpcoming(t) : !isUpcoming(t)));

  return (
    <div className="min-h-screen bg-background">
      <SEO title="My trips | Wayzyy" description="Your Wayzyy bookings." path="/trips" />
      <AirbnbHeader />
      {authLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : !session ? (
        <SignInPrompt />
      ) : (
        <main className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="font-display text-3xl mb-4 flex items-center gap-2"><Luggage className="h-7 w-7" /> My trips</h1>
          <p className="mb-4 text-xs text-muted-foreground">Booking for business? Add your GSTIN at checkout in the Wayzyy app to get a GST invoice.</p>
          <div className="mb-6 flex gap-2">
            {(["upcoming", "past"] as const).map((t) => (
              <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)}>
                {t === "upcoming" ? "Upcoming" : "Past & cancelled"}
              </Button>
            ))}
          </div>

          {error ? (
            <div className="rounded-lg border p-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">We couldn't load your trips.</p>
              <Button variant="outline" onClick={load}>Try again</Button>
            </div>
          ) : trips === null ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : shown.length === 0 ? (
            <div className="rounded-lg border p-10 text-center">
              <Compass className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="mb-4 text-sm text-muted-foreground">
                {tab === "upcoming" ? "No upcoming trips yet." : "Nothing here yet."}
              </p>
              <Button asChild><Link to="/explore">Find a stay</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {shown.map((t) => (
                <div key={t.id} className="flex flex-col overflow-hidden rounded-xl border sm:flex-row">
                  {t.image && <img src={t.image} alt="" className="h-40 w-full object-cover sm:h-auto sm:w-48" loading="lazy" />}
                  <div className="flex-1 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/property/${t.propertyId}`} className="font-semibold hover:underline">{t.title}</Link>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">{STATUS_LABEL[t.status] ?? t.status}</span>
                    </div>
                    {t.location && <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{t.location}</p>}
                    <p className="flex items-center gap-1 text-sm"><Calendar className="h-3.5 w-3.5" />{fmtDate(t.checkIn)} → {fmtDate(t.checkOut)}</p>
                    <p className="flex items-center gap-1 text-sm"><Users className="h-3.5 w-3.5" />{t.guests} guest{t.guests !== 1 ? "s" : ""} · {inr(t.total)}</p>
                    {isUpcoming(t) && (
                      <Button variant="outline" size="sm" onClick={() => setCancelling(t)}>Cancel booking</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
      <CancelDialog
        trip={cancelling}
        onClose={() => setCancelling(null)}
        onDone={() => { setCancelling(null); load(); }}
      />
    </div>
  );
}
