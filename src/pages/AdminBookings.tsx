import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarCheck, ExternalLink, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "hello@wayzyy.com";

// shortcut: newest 300 rows only (there are a few dozen today), add paging when bookings pass that.
const LIMIT = 300;

const STATUS_LABEL: Record<string, string> = {
  pending: "Waiting for host",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  not_approved: "Host didn't respond",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  confirmed: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  not_approved: "bg-red-500/10 text-red-600 dark:text-red-400",
};

type Tab = "action" | "upcoming" | "all" | "enquiries";

interface Booking {
  id: string;
  property_id: string;
  guest_id: string | null;
  host_email: string | null;
  check_in: string;
  check_out: string;
  guests: number | null;
  total_price: number | null;
  status: string;
  payment_id: string | null;
  special_requests: string | null;
  created_at: string;
  host_response_deadline: string | null;
  property: { title: string; city: string | null; images: string[] | null } | null;
}

interface Guest {
  id: string;
  name: string | null;
  phone: string | null;
}

interface Enquiry {
  id: string;
  created_at: string;
  property_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  message: string | null;
  status: string | null;
}

const today = () => new Date().toISOString().slice(0, 10);
const inr = (n: number | null) => (n == null ? "-" : `₹${Number(n).toLocaleString("en-IN")}`);
const day = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const nights = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
const ago = (iso: string) => {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3600000);
  return h < 1 ? "just now" : h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};
const digits = (p: string | null) => (p ?? "").replace(/\D/g, "");

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 px-4">
        <h1 className="font-display text-2xl">Admin sign in</h1>
        <p className="text-sm text-muted-foreground">This page is restricted to the Wayzyy admin account.</p>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            const { error } = await signIn(email, password);
            setSubmitting(false);
            if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
          }}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

function ContactLinks({ name, phone, email }: { name: string; phone: string | null; email?: string | null }) {
  const d = digits(phone);
  const link = "inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs transition-colors hover:border-ember/50 hover:text-ember";
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {d && (
        <>
          <a className={link} href={`https://wa.me/${d.length === 10 ? `91${d}` : d}`} target="_blank" rel="noreferrer">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp {name}
          </a>
          <a className={link} href={`tel:+${d.length === 10 ? `91${d}` : d}`}>
            <Phone className="h-3.5 w-3.5" /> {phone}
          </a>
        </>
      )}
      {email && (
        <a className={link} href={`mailto:${email}`}>
          <Mail className="h-3.5 w-3.5" /> {email}
        </a>
      )}
    </div>
  );
}

function BookingsPanel() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("action");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [guests, setGuests] = useState<Record<string, Guest>>({});
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);

  const load = useCallback(async () => {
    setBookings(null);
    setEnquiries(null);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, property_id, guest_id, host_email, check_in, check_out, guests, total_price, status, payment_id, special_requests, created_at, host_response_deadline, property:properties(title, city, images)",
      )
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    if (error) {
      toast({ title: "Could not load bookings", description: error.message, variant: "destructive" });
      setBookings([]);
    } else {
      const rows = (data ?? []) as unknown as Booking[];
      setBookings(rows);
      const ids = [...new Set(rows.map((b) => b.guest_id).filter(Boolean))] as string[];
      if (ids.length) {
        const { data: profiles } = await supabase.from("profiles").select("id, name, phone").in("id", ids);
        setGuests(Object.fromEntries(((profiles ?? []) as Guest[]).map((p) => [p.id, p])));
      }
    }
    const { data: enq } = await supabase.from("property_enquiries").select("*").order("created_at", { ascending: false }).limit(LIMIT);
    setEnquiries((enq ?? []) as Enquiry[]);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => {
    if (!bookings) return [];
    if (tab === "action") return bookings.filter((b) => b.status === "pending");
    if (tab === "upcoming") {
      return bookings
        .filter((b) => b.status === "confirmed" && b.check_out >= today())
        .sort((a, b) => a.check_in.localeCompare(b.check_in));
    }
    return bookings;
  }, [bookings, tab]);

  const counts = {
    action: bookings?.filter((b) => b.status === "pending").length ?? 0,
    upcoming: bookings?.filter((b) => b.status === "confirmed" && b.check_out >= today()).length ?? 0,
    all: bookings?.length ?? 0,
    enquiries: enquiries?.length ?? 0,
  };

  const tabs: [Tab, string][] = [
    ["action", "Needs action"],
    ["upcoming", "Upcoming stays"],
    ["all", "All bookings"],
    ["enquiries", "Enquiries"],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Bookings & requests</h1>
        <div className="flex flex-wrap rounded-full border border-border p-1 text-sm">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={`rounded-full px-3 py-1 transition-colors ${tab === key ? "bg-ember text-white" : "text-muted-foreground"}`}
              onClick={() => setTab(key)}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {bookings === null || enquiries === null ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tab === "enquiries" ? (
        enquiries.length === 0 ? (
          <Empty text="No enquiries yet." />
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{e.name || "Guest"}</p>
                  <span className="text-xs text-muted-foreground">{ago(e.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {e.check_in && e.check_out ? `${day(e.check_in)} → ${day(e.check_out)} · ` : ""}
                  {e.guests ? `${e.guests} guests` : "guests not given"}
                </p>
                {e.message && <p className="mt-1 text-sm">{e.message}</p>}
                <ContactLinks name={e.name?.split(" ")[0] || "guest"} phone={e.phone} email={e.email} />
                {e.property_id && (
                  <Link to={`/property/${e.property_id}`} target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-ember hover:underline">
                    Open listing <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )
      ) : shown.length === 0 ? (
        <Empty text={tab === "action" ? "No booking requests waiting on a host." : tab === "upcoming" ? "No upcoming confirmed stays." : "No bookings yet."} />
      ) : (
        <div className="space-y-3">
          {shown.map((b) => {
            const g = b.guest_id ? guests[b.guest_id] : undefined;
            return (
              <div key={b.id} className="flex gap-4 rounded-xl border border-border p-4">
                <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
                  {b.property?.images?.[0] && <img src={b.property.images[0]} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium">{b.property?.title ?? "Listing removed"}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[b.status] ?? "bg-muted text-muted-foreground"}`}>
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {day(b.check_in)} → {day(b.check_out)} · {nights(b.check_in, b.check_out)} nights · {b.guests ?? 1} guests
                  </p>
                  <p className="mt-0.5 text-sm">
                    <span className="font-medium">{inr(b.total_price)}</span>
                    <span className="text-muted-foreground">
                      {" · "}
                      {b.payment_id ? "paid" : "no payment"} · requested {ago(b.created_at)} · ref {b.id.slice(0, 8).toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Guest: {g?.name || "unknown"} · Host: {b.host_email || "unknown"}
                  </p>
                  {b.status === "pending" && b.host_response_deadline && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">Host must reply by {new Date(b.host_response_deadline).toLocaleString("en-IN")}</p>
                  )}
                  {b.special_requests && <p className="mt-1 text-sm">“{b.special_requests}”</p>}
                  <ContactLinks name={g?.name?.split(" ")[0] || "guest"} phone={g?.phone ?? null} />
                  <Link to={`/property/${b.property_id}`} target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-ember hover:underline">
                    Open listing <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <CalendarCheck className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default function AdminBookings() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Bookings & requests - Wayzyy Admin" description="Every booking and booking request on Wayzyy." noindex />
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link to="/adminn" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
        </Link>
        <ThemeToggle />
      </header>
      <AuthGate>
        <BookingsPanel />
      </AuthGate>
    </div>
  );
}
