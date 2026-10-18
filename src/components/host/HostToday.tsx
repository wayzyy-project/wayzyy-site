import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Clock, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

// "Today" for hosts, like Airbnb's hosting home: who arrives and leaves
// today, who's coming this week, and requests waiting on a reply.
interface Row {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  guests: number | null;
  host_response_deadline: string | null;
  properties: { title: string | null } | { title: string | null }[] | null;
}

const istDate = (offsetDays = 0) => {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000 + offsetDays * 86400 * 1000);
  return d.toISOString().slice(0, 10);
};
const titleOf = (r: Row) => (Array.isArray(r.properties) ? r.properties[0]?.title : r.properties?.title) || "Your listing";
const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const left = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "deadline passed";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left to reply` : `${m}m left to reply`;
};

export function HostToday({ hostId }: { hostId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("bookings")
      .select("id, check_in, check_out, status, guests, host_response_deadline, properties(title)")
      .eq("host_id", hostId)
      .in("status", ["pending", "confirmed"])
      .gte("check_out", istDate(0))
      .lte("check_in", istDate(7))
      .order("check_in", { ascending: true })
      .then(({ data }) => { if (!cancelled) setRows((data ?? []) as Row[]); });
    return () => { cancelled = true; };
  }, [hostId]);

  if (!rows) return null;
  const today = istDate(0);
  const pending = rows.filter((r) => r.status === "pending");
  const arriving = rows.filter((r) => r.status === "confirmed" && r.check_in === today);
  const leaving = rows.filter((r) => r.status === "confirmed" && r.check_out === today);
  const upcoming = rows.filter((r) => r.status === "confirmed" && r.check_in > today);

  const Item = ({ r, note }: { r: Row; note: string }) => (
    <Link to="/host/bookings" className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5">
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">{titleOf(r)}</span>
        <span className="block text-xs text-white/60">{fmt(r.check_in)} → {fmt(r.check_out)} · {r.guests ?? 1} guest{(r.guests ?? 1) === 1 ? "" : "s"}</span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-ember">{note}</span>
    </Link>
  );

  const nothing = !pending.length && !arriving.length && !leaving.length && !upcoming.length;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5 space-y-4" aria-labelledby="host-today">
      <div className="flex items-baseline justify-between">
        <h2 id="host-today" className="font-display text-xl font-bold text-white">Today</h2>
        <Link to="/host/bookings" className="text-xs font-semibold text-ember hover:underline">All bookings</Link>
      </div>
      {nothing ? (
        <p className="text-sm text-white/60">Nothing needs you today. No check-ins, check-outs or requests in the next 7 days.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pending.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70"><Clock className="h-3.5 w-3.5" /> Waiting for your reply</p>
              {pending.map((r) => <Item key={r.id} r={r} note={r.host_response_deadline ? left(r.host_response_deadline) : "Reply"} />)}
            </div>
          )}
          {arriving.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70"><LogIn className="h-3.5 w-3.5" /> Checking in today</p>
              {arriving.map((r) => <Item key={r.id} r={r} note="Arrives today" />)}
            </div>
          )}
          {leaving.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70"><LogOut className="h-3.5 w-3.5" /> Checking out today</p>
              {leaving.map((r) => <Item key={r.id} r={r} note="Leaves today" />)}
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70"><CalendarCheck className="h-3.5 w-3.5" /> Arriving this week</p>
              {upcoming.map((r) => <Item key={r.id} r={r} note={fmt(r.check_in)} />)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
