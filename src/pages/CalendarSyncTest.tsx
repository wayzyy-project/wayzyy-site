// Calendar Sync — online TEST page (branch test/calendar-sync only; never merged to main).
// Talks to the separate test Supabase project's `calendar-sync` edge function, which talks to
// Channex STAGING. One dummy property. No live Wayzyy data is read or written.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NotFound from "./NotFound";

const FN_URL = import.meta.env.VITE_CALSYNC_TEST_URL || "https://vidnmynzewffpdicyhoa.supabase.co/functions/v1/calendar-sync";
const PASS_KEY = "calsync-test-passcode";
const TICK_MS = 20_000;

type Reservation = {
  id: string; source: string; kind: "booking" | "block"; status: string; channel: string | null;
  checkIn: string; checkOut: string; guestName: string | null; note: string | null; conflictNights?: string[];
};
type Day = { date: string; free: boolean; reservationId?: string; overbookedBy: string[] };
type Channel = {
  channel: string; connected: boolean; lastSyncedAt?: number | null; lastError?: string | null;
  consecutiveFailures?: number; pendingPush?: boolean; nextRetryAt?: number | null;
};
type Note = { id: number; type: string; severity: string; title: string; body: string; createdAt: number; read: boolean };
type State = {
  unit: { name: string }; today: string;
  calendar: { days: Day[]; reservations: Reservation[] };
  channels: Channel[]; warnings: { kind: string; message: string }[]; notifications: Note[];
  channexView: Record<string, number> | null; channexError: string | null;
};

const SOURCE: Record<string, { label: string; cls: string }> = {
  wayzyy: { label: "Wayzyy", cls: "bg-[#FF6B35] text-white border-[#FF6B35]" },
  airbnb: { label: "Airbnb", cls: "bg-[#BE185D] text-white border-[#BE185D]" },
  manual: { label: "Blocked", cls: "bg-slate-200 text-slate-700 border-slate-400 [background-image:repeating-linear-gradient(135deg,transparent_0_6px,rgba(100,116,139,.25)_6px_12px)]" },
};
const sourceStyle = (s: string) => SOURCE[s] ?? { label: s, cls: "bg-violet-600 text-white border-violet-600" };

const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const ago = (ms?: number | null) => {
  if (!ms) return "never";
  const s = Math.round((Date.now() - ms) / 1000);
  return s < 5 ? "just now" : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
};

export default function CalendarSyncTest() {
  const onLiveSite = typeof window !== "undefined" && /(^|\.)wayzyy\.com$/.test(window.location.hostname);
  const [pass, setPass] = useState(() => { try { return sessionStorage.getItem(PASS_KEY) ?? ""; } catch { return ""; } });
  const [passDraft, setPassDraft] = useState("");
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [book, setBook] = useState({ checkIn: "", checkOut: "", guestName: "Kavya Nair" });
  const [block, setBlock] = useState({ from: "", to: "", note: "" });
  const seenNote = useRef<number | null>(null);

  const api = useCallback(async (path: string, body?: unknown) => {
    const res = await fetch(`${FN_URL}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { "content-type": "application/json", "x-test-passcode": pass },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 401) { setPass(""); try { sessionStorage.removeItem(PASS_KEY); } catch { /* ignore */ } }
    if (!res.ok) throw Object.assign(new Error(json.error || res.statusText), json);
    return json;
  }, [pass]);

  const refresh = useCallback(async () => {
    try {
      const s: State = await api("/state");
      setState(s);
      setError(null);
      const newest = s.notifications[0]?.id ?? 0;
      if (seenNote.current !== null) {
        s.notifications.filter((n) => n.id > (seenNote.current ?? 0)).reverse()
          .forEach((n) => (n.severity === "critical" ? toast.error : toast)(n.title, { description: n.body }));
      }
      seenNote.current = newest;
      setBook((b) => (b.checkIn ? b : { ...b, checkIn: addDays(s.today, 20), checkOut: addDays(s.today, 23) }));
      setBlock((b) => (b.from ? b : { ...b, from: addDays(s.today, 30), to: addDays(s.today, 32) }));
    } catch (e) { setError((e as Error).message); }
  }, [api]);

  // Serverless backend: this tick is what pushes pending changes and polls Channex for bookings.
  useEffect(() => {
    if (!pass || onLiveSite) return;
    let stop = false;
    const tick = async () => {
      try { await api("/tick", {}); } catch { /* shown via state */ }
      if (!stop) await refresh();
    };
    refresh();
    tick();
    const t = setInterval(tick, TICK_MS);
    return () => { stop = true; clearInterval(t); };
  }, [pass, api, refresh, onLiveSite]);

  const act = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true);
    try { await fn(); if (ok) toast.success(ok); await refresh(); }
    catch (e) {
      const err = e as Error & { code?: string };
      toast.error(err.code === "DATES_UNAVAILABLE" ? "Those dates are taken" : "Something went wrong", { description: err.message });
    } finally { setBusy(false); }
  };

  const months = useMemo(() => {
    if (!state) return [];
    const byDate = new Map(state.calendar.days.map((d) => [d.date, d]));
    const byId = new Map(state.calendar.reservations.map((r) => [r.id, r]));
    const first = new Date(`${state.today.slice(0, 8)}01T00:00:00Z`);
    first.setUTCMonth(first.getUTCMonth() + monthOffset);
    return [0, 1].map((m) => {
      const start = new Date(first);
      start.setUTCMonth(first.getUTCMonth() + m);
      const lead = (start.getUTCDay() + 6) % 7;
      const cells: ({ date: string; day?: Day; res?: Reservation } | null)[] = Array(lead).fill(null);
      for (const d = new Date(start); d.getUTCMonth() === start.getUTCMonth(); d.setUTCDate(d.getUTCDate() + 1)) {
        const date = d.toISOString().slice(0, 10);
        const day = byDate.get(date);
        cells.push({ date, day, res: day?.reservationId ? byId.get(day.reservationId) : undefined });
      }
      return { title: start.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }), cells };
    });
  }, [state, monthOffset]);

  if (onLiveSite) return <NotFound />;

  if (!pass) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
        <SEO title="Calendar Sync test" description="Internal test page" noindex />
        <h1 className="font-display text-3xl">Calendar Sync · test</h1>
        <p className="mt-2 text-sm text-muted-foreground">Internal test against Channex staging. Enter the test passcode.</p>
        <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); try { sessionStorage.setItem(PASS_KEY, passDraft); } catch { /* ignore */ } setPass(passDraft); }}>
          <Input type="password" value={passDraft} onChange={(e) => setPassDraft(e.target.value)} placeholder="Passcode" aria-label="Passcode" autoFocus />
          <Button type="submit">Open</Button>
        </form>
      </main>
    );
  }

  const ch = state?.channels.find((c) => c.channel === "channex");
  const connected = !!ch?.connected;
  const pill = !connected ? ["bg-muted text-muted-foreground", "Not connected"]
    : ch?.lastError ? ["bg-red-100 text-red-800", "Sync failing · retrying"]
    : ch?.pendingPush ? ["bg-amber-100 text-amber-800", "Syncing…"]
    : ["bg-green-100 text-green-800", `In sync · ${ago(ch?.lastSyncedAt)}`];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
      <SEO title="Calendar Sync test" description="Internal test page" noindex />
      <div className="mb-4 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        Test page on a preview branch. Dummy property, Channex <b>staging</b>, separate test database. Nothing here is on wayzyy.com.
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Calendar Sync</h1>
          <p className="text-muted-foreground">{state?.unit.name ?? "Loading…"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${pill[0]}`}>{pill[1]}</span>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">Can't reach the test backend: {error}</div>}
      {state?.warnings.map((w, i) => (
        <div key={i} className={`mt-3 rounded-xl border p-3 text-sm ${w.kind === "overbooking" ? "border-red-300 bg-red-50 text-red-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
          <b>{w.kind === "overbooking" ? "Double booking" : w.kind === "channel" ? "Channex isn't receiving updates" : "Calendar link problem"}:</b> {w.message}
        </div>
      ))}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {["wayzyy", "airbnb", "manual"].map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5"><i className={`inline-block h-3 w-3 rounded border ${sourceStyle(s).cls}`} />{sourceStyle(s).label}</span>
              ))}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={monthOffset <= 0} onClick={() => setMonthOffset((m) => m - 1)} aria-label="Previous month">‹</Button>
              <Button size="sm" variant="outline" disabled={monthOffset >= 2} onClick={() => setMonthOffset((m) => m + 1)} aria-label="Next month">›</Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {months.map((m) => (
              <div key={m.title}>
                <h3 className="mb-2 font-semibold">{m.title}</h3>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="text-center text-[11px] text-muted-foreground">{d}</div>)}
                  {m.cells.map((c, i) => {
                    if (!c) return <div key={i} />;
                    const past = state ? c.date < state.today : false;
                    const r = c.res;
                    const cls = past ? "border-transparent text-muted-foreground/40"
                      : r ? (r.status === "held" ? "border-[#FF6B35] bg-orange-50 text-orange-800" : sourceStyle(r.source).cls)
                      : "bg-background hover:border-[#FF6B35]";
                    const first = r && (r.checkIn === c.date || c.date === state?.today);
                    return (
                      <button key={c.date} type="button" disabled={past || !r}
                        onClick={() => r && setSelected(r)}
                        className={`relative min-h-12 overflow-hidden rounded-lg border p-1 text-left text-xs ${cls} ${c.day?.overbookedBy.length ? "ring-2 ring-red-600" : ""} ${c.date === state?.today ? "outline outline-2 outline-foreground" : ""}`}
                        aria-label={`${fmt(c.date)}${r ? `, ${sourceStyle(r.source).label}` : ", open"}`}>
                        <span className="font-semibold">{Number(c.date.slice(8))}</span>
                        {first && <span className="block truncate text-[10px]">{r.kind === "block" ? r.note || "Blocked" : r.guestName || sourceStyle(r.source).label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Each coloured box is a night; checkout days stay open. Tap a stay to see or cancel it.</p>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border bg-card p-4">
            <h2 className="font-semibold">Channex (staging)</h2>
            <p className="text-sm text-muted-foreground">{connected ? (ch?.lastError ? `Failing ${ch.consecutiveFailures}× — ${ch.lastError}` : `Last synced ${ago(ch?.lastSyncedAt)}`) : "Not connected"}</p>
            <div className="mt-3 flex gap-2">
              {!connected
                ? <Button disabled={busy} onClick={() => act(() => api("/connect", {}), "Connected. Sending the calendar to Channex…")}>Connect Channex</Button>
                : <Button variant="ghost" disabled={busy} onClick={() => act(() => api("/disconnect", {}))}>Disconnect</Button>}
              <Button variant="outline" disabled={busy || !connected} onClick={() => act(() => api("/tick", {}), "Checked Channex for new bookings")}>Sync now</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Checks every 20s while this page is open. Test bookings: Booking CRS app in staging.channex.io (Demo Double).</p>
          </section>

          <section className="rounded-2xl border bg-card p-4">
            <h2 className="font-semibold">Guest books on Wayzyy</h2>
            <form className="mt-2 space-y-2" onSubmit={(e) => { e.preventDefault(); act(() => api("/book", book), "Booking confirmed"); }}>
              <div className="grid grid-cols-2 gap-2">
                <div><Label htmlFor="bi">Check-in</Label><Input id="bi" type="date" value={book.checkIn} onChange={(e) => setBook({ ...book, checkIn: e.target.value })} required /></div>
                <div><Label htmlFor="bo">Check-out</Label><Input id="bo" type="date" value={book.checkOut} onChange={(e) => setBook({ ...book, checkOut: e.target.value })} required /></div>
              </div>
              <Input value={book.guestName} onChange={(e) => setBook({ ...book, guestName: e.target.value })} aria-label="Guest name" />
              <Button type="submit" disabled={busy} className="w-full bg-[#FF6B35] hover:bg-[#f25a22]">Book &amp; pay (test)</Button>
            </form>
          </section>

          <section className="rounded-2xl border bg-card p-4">
            <h2 className="font-semibold">Block dates</h2>
            <form className="mt-2 space-y-2" onSubmit={(e) => { e.preventDefault(); act(() => api("/block", block), "Nights blocked"); }}>
              <div className="grid grid-cols-2 gap-2">
                <div><Label htmlFor="bf">First night</Label><Input id="bf" type="date" value={block.from} onChange={(e) => setBlock({ ...block, from: e.target.value })} required /></div>
                <div><Label htmlFor="bt">Open again</Label><Input id="bt" type="date" value={block.to} onChange={(e) => setBlock({ ...block, to: e.target.value })} required /></div>
              </div>
              <Input value={block.note} onChange={(e) => setBlock({ ...block, note: e.target.value })} placeholder="Note (only you see this)" aria-label="Note" />
              <Button type="submit" variant="outline" disabled={busy} className="w-full">Block these nights</Button>
            </form>
          </section>

          <section className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Updates</h2>
              <Button size="sm" variant="ghost" onClick={() => act(() => api("/notifications/read", {}))}>Mark read</Button>
            </div>
            <ul className="mt-2 max-h-80 space-y-3 overflow-auto text-sm">
              {state?.notifications.length ? state.notifications.map((n) => (
                <li key={n.id} className="flex gap-2">
                  <i className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.severity === "critical" ? "bg-red-600" : n.severity === "warning" ? "bg-amber-500" : "bg-green-600"}`} />
                  <div><div className={n.read ? "" : "font-semibold"}>{n.title}</div><div className="text-muted-foreground">{n.body}</div><div className="text-xs text-muted-foreground">{ago(n.createdAt)}</div></div>
                </li>
              )) : <li className="text-muted-foreground">Nothing yet.</li>}
            </ul>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">What Channex staging holds (next 60 nights)</h2>
          <Button size="sm" variant="outline" disabled={busy || !connected} onClick={() => act(async () => {
            const r = await api("/reconcile", {});
            toast(r.issueCount ? `${r.issueCount} difference(s) found` : "Everything matches", { description: "Daily check, run on demand." });
          })}>Run daily check now</Button>
        </div>
        {state?.channexError && <p className="mt-2 text-sm text-red-700">Couldn't read Channex: {state.channexError}</p>}
        {state?.channexView ? (
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-0.5">
            {Object.entries(state.channexView).slice(0, 60).map(([d, v]) => (
              <div key={d} title={`${d}: ${v ? "open" : "closed"}`} className={`grid h-8 place-items-center rounded text-[10px] ${v ? "border bg-background text-muted-foreground" : "bg-rose-800 text-white"}`}>{Number(d.slice(8))}</div>
            ))}
          </div>
        ) : <p className="mt-2 text-sm text-muted-foreground">Connect to see it.</p>}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="text-lg font-semibold">{selected.kind === "block" ? "Blocked nights" : selected.guestName || "Guest"}</h3>
            <p className="text-sm text-muted-foreground">{sourceStyle(selected.source).label}{selected.channel ? " · manage on the channel" : ""}</p>
            <p className="mt-3 text-sm">{fmt(selected.checkIn)} → {fmt(selected.checkOut)}{selected.note ? ` · ${selected.note}` : ""}</p>
            {selected.conflictNights?.length ? <p className="mt-1 text-sm text-red-700">Double booked: {selected.conflictNights.map(fmt).join(", ")}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              {!selected.channel && (
                <Button disabled={busy} onClick={() => { const id = selected.id; setSelected(null); act(() => api("/cancel", { reservationId: id }), selected.kind === "block" ? "Unblocked" : "Cancelled"); }}>
                  {selected.kind === "block" ? "Unblock" : "Cancel booking"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
