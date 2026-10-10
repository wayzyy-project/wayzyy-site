import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Calendar, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Same bookings the host sees in the app. Accept/decline calls the same
// respond-to-booking function; the server works out who the host is from the
// sign-in, and a decline refunds the guest automatically.

interface Row {
  id: string;
  title: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  payout: number | null;
  status: string;
  createdAt: string;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const LABEL: Record<string, string> = {
  pending: "Needs your reply", confirmed: "Confirmed", cancelled: "Cancelled",
  completed: "Completed", not_approved: "Declined",
};

export default function HostBookings() {
  const { session, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const userId = session?.user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setError(false);
    const { data, error: err } = await supabase
      .from("bookings")
      .select("id, check_in, check_out, guests, total_price, host_payout_amount, status, created_at, properties(title)")
      .eq("host_id", userId)
      .order("created_at", { ascending: false });
    if (err) { setError(true); return; }
    setRows((data ?? []).map((b: any) => ({
      id: b.id, title: b.properties?.title ?? "Listing", checkIn: b.check_in, checkOut: b.check_out,
      guests: b.guests, total: Number(b.total_price) || 0,
      payout: b.host_payout_amount != null ? Number(b.host_payout_amount) : null,
      status: b.status, createdAt: b.created_at,
    })));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const respond = async (id: string, decision: "approve" | "decline") => {
    if (decision === "decline" && !window.confirm("Decline this request? The guest is refunded automatically.")) return;
    setBusy(id + decision);
    const { data, error: err } = await supabase.functions.invoke("respond-to-booking", { body: { bookingId: id, decision } });
    setBusy(null);
    if (err || (data as any)?.error) {
      toast({ title: "Couldn't update the booking", description: (data as any)?.error || err?.message, variant: "destructive" });
      return;
    }
    toast({ title: decision === "approve" ? "Booking accepted" : "Booking declined" });
    load();
  };

  const pending = (rows ?? []).filter((r) => r.status === "pending");
  const rest = (rows ?? []).filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Bookings | Wayzyy Host" description="Your Wayzyy bookings." path="/host/bookings" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/host" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to host dashboard
        </Link>
        <h1 className="font-display text-3xl mb-6">Bookings</h1>
        {authLoading ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        ) : !session ? (
          <p className="text-sm text-muted-foreground">Please <Link className="underline" to="/host">sign in to your host account</Link> first.</p>
        ) : error ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">We couldn't load your bookings.</p>
            <Button variant="outline" onClick={load}>Try again</Button>
          </div>
        ) : rows === null ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        ) : rows.length === 0 ? (
          <p className="rounded-lg border p-10 text-center text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="space-y-6">
            {[["Requests waiting for you", pending], ["All bookings", rest]].map(([heading, list]) =>
              (list as Row[]).length === 0 ? null : (
                <section key={heading as string}>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{heading as string}</h2>
                  <div className="space-y-3">
                    {(list as Row[]).map((r) => (
                      <div key={r.id} className="rounded-xl border p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold">{r.title}</p>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">{LABEL[r.status] ?? r.status}</span>
                        </div>
                        <p className="flex items-center gap-1 text-sm"><Calendar className="h-3.5 w-3.5" />{fmt(r.checkIn)} → {fmt(r.checkOut)}</p>
                        <p className="flex items-center gap-1 text-sm"><Users className="h-3.5 w-3.5" />{r.guests} guest{r.guests !== 1 ? "s" : ""} · you earn {inr(r.payout ?? r.total)}</p>
                        {r.status === "pending" && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" disabled={!!busy} onClick={() => respond(r.id, "approve")}>
                              {busy === r.id + "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                            </Button>
                            <Button size="sm" variant="outline" disabled={!!busy} onClick={() => respond(r.id, "decline")}>
                              {busy === r.id + "decline" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decline"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
