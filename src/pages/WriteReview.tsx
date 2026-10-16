import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

// Same record the app's WriteReviewScreen writes: a `reviews` row for the
// stay, then `bookings.guest_reviewed_at` so it isn't asked for twice.
export default function WriteReview() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<{ id: string; propertyId: string; title: string; image: string | null; checkIn: string; checkOut: string; reviewed: boolean } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !bookingId) { setState("missing"); return; }
    supabase
      .from("bookings")
      .select("id, check_in, check_out, guest_reviewed_at, properties ( id, title, images )")
      .eq("id", bookingId)
      .eq("guest_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setState("missing"); return; }
        const p: any = Array.isArray((data as any).properties) ? (data as any).properties[0] : (data as any).properties;
        setBooking({
          id: data.id,
          propertyId: p?.id,
          title: p?.title ?? "your stay",
          image: Array.isArray(p?.images) ? p.images[0] ?? null : null,
          checkIn: data.check_in,
          checkOut: data.check_out,
          reviewed: !!data.guest_reviewed_at,
        });
        setState("ready");
      });
  }, [authLoading, user, bookingId]);

  const submit = async () => {
    if (!booking || !user || rating === 0) return;
    setSubmitting(true);
    const now = new Date().toISOString();
    const { error } = await supabase.from("reviews").insert({
      property_id: booking.propertyId,
      booking_id: booking.id,
      reviewer_id: user.id,
      reviewer_name: (user.user_metadata?.name as string) ?? user.email?.split("@")[0] ?? "Guest",
      reviewer_avatar: (user.user_metadata?.avatar_url as string) ?? null,
      rating,
      comment: text.trim() || null,
      created_at: now,
    });
    if (error) {
      setSubmitting(false);
      toast({ title: "Couldn't post your review", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("bookings").update({ guest_reviewed_at: now }).eq("id", booking.id);
    setSubmitting(false);
    setDone(true);
  };

  const shown = hover || rating;

  return (
    <SEO title="Write a review - Wayzyy" description="Tell other travellers about your stay.">
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />
        <main className="mx-auto max-w-xl px-4 sm:px-6 py-12">
          {state === "loading" && <p className="text-sm text-muted-foreground">Loading your stay…</p>}

          {state === "missing" && (
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-bold font-display">We couldn't find that stay</h1>
              <p className="text-sm text-muted-foreground">
                {user ? "This review link isn't for a booking on your account." : "Sign in with the account you booked with, then open the link again."}
              </p>
              <Link to="/trips" className="btn-brand inline-flex">Go to your trips</Link>
            </div>
          )}

          {state === "ready" && booking && (done || booking.reviewed) && (
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-bold font-display">{done ? "Thanks for your review" : "You've already reviewed this stay"}</h1>
              <p className="text-sm text-muted-foreground">Your feedback helps other travellers choose well.</p>
              <button onClick={() => navigate("/trips")} className="btn-brand">Back to trips</button>
            </div>
          )}

          {state === "ready" && booking && !done && !booking.reviewed && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                {booking.image && <img src={booking.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />}
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold font-display">How was your stay?</h1>
                  <p className="truncate text-sm text-muted-foreground">
                    {booking.title} · {format(new Date(booking.checkIn), "d MMM")} – {format(new Date(booking.checkOut), "d MMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Overall rating</p>
                <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} className="p-1">
                      <Star className={`h-9 w-9 ${n <= shown ? "fill-[#FF6B00] text-[#FF6B00]" : "text-muted-foreground/40"}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-muted-foreground">{LABELS[shown]}</span>
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">Tell other travellers about it <span className="font-normal text-muted-foreground">(optional)</span></span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder="What did you love? Anything future guests should know?"
                  className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-foreground"
                />
              </label>

              <button onClick={submit} disabled={rating === 0 || submitting} className="btn-brand btn-brand-lg w-full disabled:opacity-50">
                {submitting ? "Posting…" : rating === 0 ? "Pick a star rating" : "Post review"}
              </button>
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
