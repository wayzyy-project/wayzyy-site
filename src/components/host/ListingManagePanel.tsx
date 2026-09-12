import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Copy, Loader2, Trash2, Minus, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PropertyCalendar } from "@/components/host/PropertyCalendar";
import { PropertyOverview } from "@/components/host/PropertyOverview";
import { DISCOUNT_TYPES, DISCOUNT_LABELS, SUGGESTED_DISCOUNT_PERCENTAGE, DiscountType } from "@/lib/discounts";
import { SHORT_TERM_POLICIES, LONG_TERM_POLICIES, ShortTermPolicyId, LongTermPolicyId, DEFAULT_SHORT_TERM_POLICY, DEFAULT_LONG_TERM_POLICY, LONG_TERM_NIGHTS_THRESHOLD } from "@/lib/cancellationPolicies";

const SUPABASE_URL = "https://eitpwcnsoshweoqzusdk.supabase.co";

interface Props {
  propertyId: string;
  propertyTitle: string;
  onBack: () => void;
  /** Opens directly on a given tab - used to jump straight to "details"
   * from the missing-registration nudge on the listing card. */
  defaultTab?: string;
}

// The website's equivalent of the app's ConnectCalendarScreen + HostDiscountsScreen +
// cancellation-policy cards - same tables and edge functions as mobile, so a
// change made here shows up in the app instantly and vice versa.
/** What each tab is for, in the host's terms. A single fixed subtitle
 *  described the whole panel and so described none of the tabs; someone
 *  landing on Discounts got a sentence about calendars. */
const TAB_BLURB: Record<string, string> = {
  listing:
    "Everything a guest sees: your photos, title, description, what the place sleeps, and your standard rates. Change any of it and hit save.",
  calendar:
    "Set what you charge and when you're free. Click a night to select it, click another to take everything in between, then set a rate for those nights or block them off.",
  sync:
    "Keep Airbnb, Booking.com and anywhere else you list in step with Wayzyy so the same night can't be booked twice. Paste the calendar link from each platform once and it stays in sync on its own.",
  discounts:
    "The same weekly and monthly discounts you'd set on any other platform, just clearer about what a guest actually pays. Choose how much comes off, see the effect before you commit, and save.",
  cancellation:
    "How much a guest gets back if they cancel, and how late they can do it. Pick one policy for short stays and one for long ones — guests see this before they book.",
  details:
    "Your minimum-stay requirement, plus licensing and registration details for this property. Licensing is never a blocker to getting listed.",
};

export function ListingManagePanel({ propertyId, propertyTitle, onBack, defaultTab }: Props) {
  const [tab, setTab] = useState(defaultTab ?? "listing");
  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to your listings
      </button>

      <h2 className="font-display text-2xl text-white">{propertyTitle}</h2>
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/60">{TAB_BLURB[tab] ?? TAB_BLURB.listing}</p>

      {/* Calendar and channel sync are separate concerns and used at
          different moments: the calendar is day-to-day pricing and
          availability, iCal is a one-time plumbing job to keep other
          platforms from double-booking. They were sharing one tab, which
          buried the calendar behind a URL field. */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 flex w-full justify-start overflow-x-auto bg-white/10 text-white/60">
          <TabsTrigger value="listing" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Listing</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Calendar</TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Channel sync</TabsTrigger>
          <TabsTrigger value="discounts" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Discounts</TabsTrigger>
          <TabsTrigger value="cancellation" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Cancellation</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="listing">
          <PropertyOverview propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarTab propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="sync">
          <CalendarSection propertyId={propertyId} propertyTitle={propertyTitle} />
        </TabsContent>
        <TabsContent value="discounts">
          <DiscountsSection propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="cancellation">
          <CancellationSection propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="details">
          <DetailsSection propertyId={propertyId} />
        </TabsContent>
      </Tabs>

      <DeleteListing propertyId={propertyId} propertyTitle={propertyTitle} onDeleted={onBack} />
    </div>
  );
}

/**
 * Deleting a listing, kept out of the tab strip on purpose - tabs are for
 * things you move between while working, and this is not that.
 *
 * The real safety net is a database trigger (guard_property_deletion), not
 * this dialog: bookings.property_id is `on delete set null`, so deleting a
 * booked listing leaves the guest's paid reservation pointing at nothing and
 * the delete still reports success. The trigger refuses those and returns a
 * sentence meant to be read, which is surfaced verbatim below rather than
 * replaced with a generic failure message.
 */
function DeleteListing({
  propertyId,
  propertyTitle,
  onDeleted,
}: {
  propertyId: string;
  propertyTitle: string;
  onDeleted: () => void;
}) {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    const { error } = await supabase.from("properties").delete().eq("id", propertyId);
    setDeleting(false);

    if (error) {
      // The guard's messages already explain what to do; anything else is a
      // genuine failure and its own message is more useful than ours.
      toast({ title: "Can't delete this listing", description: error.message, variant: "destructive" });
      setConfirming(false);
      return;
    }

    toast({ title: "Listing deleted", description: `"${propertyTitle}" has been removed.` });
    onDeleted();
  };

  return (
    <div className="mt-12 rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-5">
      {!confirming ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Delete this listing</p>
            <p className="mt-0.5 text-xs text-white/50">
              Removes it from Wayzyy for good. Imported twice by mistake? Delete the copy here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="shrink-0 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10"
          >
            Delete listing
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-white">Delete "{propertyTitle}"?</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            This cannot be undone. Your photos, pricing, calendar and availability for this listing
            are removed with it. Listings with bookings against them can't be deleted here.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {deleting && <Loader2 className="h-3 w-3 animate-spin" />}
              Yes, delete permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Calendar: availability + per-night pricing ─────────────────────────────

function CalendarTab({ propertyId }: { propertyId: string }) {
  const [rates, setRates] = useState<{ price_per_night: number | null; weekend_price: number | null } | null>(null);

  useEffect(() => {
    supabase
      .from("properties")
      .select("price_per_night, weekend_price")
      .eq("id", propertyId)
      .maybeSingle()
      .then(({ data }) => setRates(data as any));
  }, [propertyId]);

  if (!rates) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
        <p className="text-xs text-white/60">
          Your standard rate is{" "}
          <span className="font-semibold text-white">
            {rates.price_per_night ? `₹${rates.price_per_night.toLocaleString("en-IN")}` : "not set"}
          </span>
          {rates.weekend_price ? (
            <> a night, <span className="font-semibold text-white">₹{rates.weekend_price.toLocaleString("en-IN")}</span> at weekends</>
          ) : (
            " a night"
          )}
          . Anything you set below overrides it for those dates only.
        </p>
      </div>
      <PropertyCalendar
        propertyId={propertyId}
        basePrice={rates.price_per_night}
        weekendPrice={rates.weekend_price}
      />
    </div>
  );
}

// ── Listing details (registration number today; room for more later) ───────

function DetailsSection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [state, setState] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [minNights, setMinNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMinNights, setSavingMinNights] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("state, registration_number, min_nights")
      .eq("id", propertyId)
      .single()
      .then(({ data }) => {
        setState(data?.state ?? null);
        setRegistrationNumber(data?.registration_number ?? "");
        setMinNights(data?.min_nights ?? 1);
        setLoading(false);
      });
  }, [propertyId]);

  const isGoa = state?.trim().toLowerCase() === "goa";

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({ registration_number: registrationNumber.trim() || null })
        .eq("id", propertyId);
      if (error) throw error;
      toast({ title: "Saved", description: "Registration number updated." });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveMinNights = async (value: number) => {
    const clamped = Math.min(90, Math.max(1, value));
    setMinNights(clamped);
    setSavingMinNights(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({ min_nights: clamped })
        .eq("id", propertyId);
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Couldn't save minimum stay", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSavingMinNights(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-white/50">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Minimum stay - not location-specific, always shown. Enforced
          server-side in create-booking, not just here. */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4">
        <div>
          <Label className="text-xs font-semibold text-white/80">Minimum nights</Label>
          <p className="mt-0.5 text-xs text-white/50">
            Guests must book at least this many nights - enforced at checkout, not just a suggestion.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => saveMinNights(minNights - 1)}
            disabled={savingMinNights || minNights <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-white">
            {savingMinNights ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" /> : minNights}
          </span>
          <button
            type="button"
            onClick={() => saveMinNights(minNights + 1)}
            disabled={savingMinNights || minNights >= 90}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isGoa ? (
        <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4">
          <div>
            <Label className="text-xs font-semibold text-white/80">Goa Tourism Registration Number</Label>
            <p className="mt-0.5 text-xs text-white/50">
              Required to actually operate in Goa - doesn't block reviews or publishing, but add it
              when you have it.
            </p>
          </div>
          <Input
            placeholder="e.g. GT/SDE/123/2026"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="border-white/15 bg-white/10 text-sm text-white placeholder:text-white/40"
          />
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="gap-1.5 bg-ember text-white hover:bg-ember/90"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-white/50">No other location-specific requirements for this listing right now.</p>
      )}
    </div>
  );
}

// ── Calendar sync ──────────────────────────────────────────────────────────

interface ExternalCalendar {
  id: string;
  source_name: string;
  ics_url: string;
  last_synced_at: string | null;
  last_sync_status: "success" | "error" | null;
  last_sync_error: string | null;
}

function CalendarSection({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { toast } = useToast();
  const [exportToken, setExportToken] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<ExternalCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUrl, setOtherUrl] = useState("");
  const [calendarName, setCalendarName] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: property }, { data: cals }] = await Promise.all([
      supabase.from("properties").select("calendar_export_token").eq("id", propertyId).single(),
      supabase
        .from("external_calendars")
        .select("id, source_name, ics_url, last_synced_at, last_sync_status, last_sync_error")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true }),
    ]);
    setExportToken(property?.calendar_export_token ?? null);
    setCalendars((cals ?? []) as ExternalCalendar[]);
    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    load();
  }, [load]);

  const exportUrl = exportToken
    ? `${SUPABASE_URL}/functions/v1/export-calendar-ics?propertyId=${propertyId}&token=${exportToken}`
    : null;

  const handleCopy = async () => {
    if (!exportUrl) return;
    await navigator.clipboard.writeText(exportUrl);
    toast({ title: "Copied", description: "Calendar link copied to clipboard." });
  };

  const handleAdd = async () => {
    if (!otherUrl.trim() || !calendarName.trim()) return;
    setAdding(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const hostId = userData.user?.id;
      if (!hostId) throw new Error("Not signed in");

      const { data: inserted, error } = await supabase
        .from("external_calendars")
        .insert({ property_id: propertyId, host_id: hostId, source_name: calendarName.trim(), ics_url: otherUrl.trim() })
        .select("id")
        .single();
      if (error || !inserted) throw new Error(error?.message ?? "Could not add calendar");

      await supabase.functions.invoke("sync-ical-calendars", { body: { calendarId: inserted.id } });

      setOtherUrl("");
      setCalendarName("");
      await load();
    } catch (err) {
      toast({
        title: "Couldn't add calendar",
        description: err instanceof Error ? err.message : "Please check the link and try again.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    await supabase.from("external_calendars").delete().eq("id", id);
    setCalendars((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/60">
        This two-way connection will update both calendars when a night is booked for{" "}
        <span className="font-medium text-white">{propertyTitle}</span>.
      </p>

      <div>
        <p className="mb-2 text-sm font-semibold text-white">Step 1 - add this link to the other website</p>
        <div className="liquid-glass flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 p-4">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-white/60">Wayzyy calendar link</p>
            <p className="truncate text-sm text-white">{exportUrl ?? " - "}</p>
          </div>
          <Button size="sm" onClick={handleCopy} disabled={!exportUrl} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-white">Step 2 - paste the other website's .ics link</p>
        <div className="space-y-3 rounded-xl border border-white/15 p-4">
          <div>
            <Label htmlFor="other-cal-url" className="text-white">Other website link</Label>
            <Input id="other-cal-url" value={otherUrl} onChange={(e) => setOtherUrl(e.target.value)} placeholder="https://…/calendar.ics" className="border-white/20 bg-black/30 text-white placeholder:text-white/40" />
          </div>
          <div>
            <Label htmlFor="other-cal-name" className="text-white">Calendar name</Label>
            <Input id="other-cal-name" value={calendarName} onChange={(e) => setCalendarName(e.target.value)} placeholder="e.g. Airbnb" className="border-white/20 bg-black/30 text-white placeholder:text-white/40" />
          </div>
          <Button onClick={handleAdd} disabled={!otherUrl.trim() || !calendarName.trim() || adding} className="w-full bg-ember text-white hover:bg-ember/90">
            {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add calendar
          </Button>
        </div>
      </div>

      {calendars.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-white">Connected calendars</p>
          <div className="divide-y divide-white/10 rounded-xl border border-white/15">
            {calendars.map((cal) => (
              <div key={cal.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{cal.source_name}</p>
                  <p className="truncate text-xs text-white/60">
                    {cal.last_sync_status === "error"
                      ? `Sync failed${cal.last_sync_error ? `: ${cal.last_sync_error}` : ""}`
                      : cal.last_synced_at
                      ? `Last synced ${new Date(cal.last_synced_at).toLocaleString()}`
                      : "Not synced yet"}
                  </p>
                </div>
                <button type="button" onClick={() => handleRemove(cal.id)} className="text-white/50 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Discounts ───────────────────────────────────────────────────────────────

interface Row {
  type: DiscountType;
  percentage: string;
  enabled: boolean;
}

function DiscountsSection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(DISCOUNT_TYPES.map((type) => ({ type, percentage: "", enabled: false })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("property_discounts").select("discount_type, percentage, enabled").eq("property_id", propertyId);
      const byType = new Map((data ?? []).map((d: any) => [d.discount_type, d]));
      if (!cancelled) {
        setRows(
          DISCOUNT_TYPES.map((type) => {
            const existing = byType.get(type);
            return { type, percentage: existing ? String(existing.percentage) : "", enabled: existing?.enabled ?? false };
          }),
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const setRow = (type: DiscountType, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.type === type ? { ...r, ...patch } : r)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const row of rows) {
        const pct = parseFloat(row.percentage);
        const validPct = Number.isFinite(pct) && pct > 0 && pct <= 100;
        if (!row.enabled || !validPct) {
          await supabase.from("property_discounts").delete().eq("property_id", propertyId).eq("discount_type", row.type);
          continue;
        }
        await supabase.from("property_discounts").upsert(
          { property_id: propertyId, discount_type: row.type, percentage: pct, enabled: true, updated_at: new Date().toISOString() },
          { onConflict: "property_id,discount_type" },
        );
      }
      toast({ title: "Saved", description: "Your discounts have been updated." });
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">
        Only the single best-matching discount is applied to any one booking, never stacked.
      </p>
      {rows.map((row) => {
        const meta = DISCOUNT_LABELS[row.type];
        return (
          <div key={row.type} className="rounded-xl border border-white/15 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{meta.label}</p>
                <p className="text-xs text-white/60">{meta.sub}</p>
              </div>
              <Switch
                checked={row.enabled}
                onCheckedChange={(v) =>
                  setRow(row.type, {
                    enabled: v,
                    percentage: v && !row.percentage ? String(SUGGESTED_DISCOUNT_PERCENTAGE[row.type]) : row.percentage,
                  })
                }
              />
            </div>
            {row.enabled && (
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="number"
                  className="w-24 border-white/20 bg-black/30 text-white placeholder:text-white/40"
                  placeholder={String(SUGGESTED_DISCOUNT_PERCENTAGE[row.type])}
                  value={row.percentage}
                  onChange={(e) => setRow(row.type, { percentage: e.target.value.replace(/[^0-9.]/g, "") })}
                />
                <span className="text-sm text-white/60">% off</span>
              </div>
            )}
          </div>
        );
      })}
      <Button onClick={handleSave} disabled={saving} className="w-full bg-ember text-white hover:bg-ember/90">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save discounts
      </Button>
    </div>
  );
}

// ── Cancellation policy ──────────────────────────────────────────────────────

function CancellationSection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [shortTerm, setShortTerm] = useState<ShortTermPolicyId>(DEFAULT_SHORT_TERM_POLICY);
  const [longTerm, setLongTerm] = useState<LongTermPolicyId>(DEFAULT_LONG_TERM_POLICY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("properties").select("cancel_policy, cancel_policy_long_term").eq("id", propertyId).single();
      if (!cancelled) {
        setShortTerm((data?.cancel_policy as ShortTermPolicyId) ?? DEFAULT_SHORT_TERM_POLICY);
        setLongTerm((data?.cancel_policy_long_term as LongTermPolicyId) ?? DEFAULT_LONG_TERM_POLICY);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({ cancel_policy: shortTerm, cancel_policy_long_term: longTerm })
        .eq("id", propertyId);
      if (error) throw error;
      toast({ title: "Saved", description: "Cancellation policy updated." });
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-white">Under 28 nights</p>
        <p className="mb-3 mt-0.5 text-xs text-white/50">
          Every listing starts on our default. Pick a different one whenever you like — guests see this before they book.
        </p>
        <div className="space-y-3">
          {SHORT_TERM_POLICIES.map((policy) => (
            <button
              key={policy.id}
              type="button"
              onClick={() => setShortTerm(policy.id)}
              className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                shortTerm === policy.id ? "border-ember bg-ember/10" : "border-white/15 hover:border-white/30"
              }`}
            >
              <div>
                <p className={`flex flex-wrap items-center gap-2 text-sm font-medium ${shortTerm === policy.id ? "text-ember" : "text-white"}`}>
                  {policy.label}
                  {policy.id === DEFAULT_SHORT_TERM_POLICY && (
                    <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                      Our default
                    </span>
                  )}
                </p>
                {policy.rules.map((rule) => (
                  <p key={rule} className="mt-1 text-xs text-white/60">{rule}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">28+ nights</p>
        <p className="mb-3 mt-0.5 text-xs text-white/50">
          Applies to stays of {LONG_TERM_NIGHTS_THRESHOLD} nights or more, which cancel differently to a short break.
        </p>
        <div className="space-y-3">
          {LONG_TERM_POLICIES.map((policy) => (
            <button
              key={policy.id}
              type="button"
              onClick={() => setLongTerm(policy.id)}
              className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                longTerm === policy.id ? "border-ember bg-ember/10" : "border-white/15 hover:border-white/30"
              }`}
            >
              <div>
                <p className={`flex flex-wrap items-center gap-2 text-sm font-medium ${longTerm === policy.id ? "text-ember" : "text-white"}`}>
                  {policy.label}
                  {policy.id === DEFAULT_LONG_TERM_POLICY && (
                    <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                      Our default
                    </span>
                  )}
                </p>
                {policy.rules.map((rule) => (
                  <p key={rule} className="mt-1 text-xs text-white/60">{rule}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-ember text-white hover:bg-ember/90">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save cancellation policy
      </Button>
    </div>
  );
}
