import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Loader2, Trash2, Minus, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PropertyCalendar } from "@/components/host/PropertyCalendar";
import { MarketRateCard, useMarketRates } from "@/components/host/MarketRateNote";
import { PropertyOverview } from "@/components/host/PropertyOverview";
import { ApplyRulesSection } from "@/components/host/ApplyRulesSection";
import { HouseRulesSafetySection } from "@/components/host/HouseRulesSafetySection";
import { SpaceSleepingSection } from "@/components/host/SpaceSleepingSection";
import { LocationCategorySection } from "@/components/host/LocationCategorySection";
import { DAY_ORDER, DAY_SHORT } from "@/lib/stayRules";
import { DISCOUNT_TYPES, DISCOUNT_LABELS, SUGGESTED_DISCOUNT_PERCENTAGE, DiscountType } from "@/lib/discounts";
import { SHORT_TERM_POLICIES, LONG_TERM_POLICIES, ShortTermPolicyId, LongTermPolicyId, DEFAULT_SHORT_TERM_POLICY, DEFAULT_LONG_TERM_POLICY, LONG_TERM_NIGHTS_THRESHOLD } from "@/lib/cancellationPolicies";


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
  houseRules:
    "Check-in and check-out times, pets, smoking, events, photography, your own extra rules, and the safety devices at the property. Guests see all of this on your listing before they book.",
  cancellation:
    "How much a guest gets back if they cancel, and how late they can do it. Pick one policy for short stays and one for long ones — guests see this before they book.",
  rules:
    "Set your rules once on this listing (minimum stay, cancellation, discounts, house rules and check-in), then copy them to your other listings in one go.",
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
          <TabsTrigger value="houseRules" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">House rules & safety</TabsTrigger>
          <TabsTrigger value="cancellation" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Cancellation</TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Copy rules</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="listing">
          <PropertyOverview propertyId={propertyId} />
          <SpaceSleepingSection propertyId={propertyId} />
          <LocationCategorySection propertyId={propertyId} />
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
        <TabsContent value="houseRules">
          <HouseRulesSafetySection propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="cancellation">
          <CancellationSection propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="rules">
          <ApplyRulesSection propertyId={propertyId} propertyTitle={propertyTitle} />
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
  const marketRate = useMarketRates([propertyId])[propertyId];

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
      <MarketRateCard rate={marketRate} price={rates.price_per_night} />
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
  // Optional stay rules (null / empty = no rule).
  const [maxNights, setMaxNights] = useState<number | null>(null);
  const [checkinDays, setCheckinDays] = useState<number[]>([]);
  const [checkoutDays, setCheckoutDays] = useState<number[]>([]);

  useEffect(() => {
    supabase
      .from("properties")
      .select("state, registration_number, min_nights, max_nights, checkin_days, checkout_days")
      .eq("id", propertyId)
      .single()
      .then(({ data }) => {
        setState(data?.state ?? null);
        setRegistrationNumber(data?.registration_number ?? "");
        setMinNights(data?.min_nights ?? 1);
        setMaxNights(data?.max_nights ?? null);
        setCheckinDays((data?.checkin_days as number[] | null) ?? []);
        setCheckoutDays((data?.checkout_days as number[] | null) ?? []);
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
      // A maximum below the minimum would make the listing unbookable.
      const raiseMax = maxNights != null && clamped > maxNights;
      const { error } = await supabase
        .from("properties")
        .update(raiseMax ? { min_nights: clamped, max_nights: clamped } : { min_nights: clamped })
        .eq("id", propertyId);
      if (error) throw error;
      if (raiseMax) setMaxNights(clamped);
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

      <StayRulesCard
        propertyId={propertyId}
        minNights={minNights}
        maxNights={maxNights}
        setMaxNights={setMaxNights}
        checkinDays={checkinDays}
        setCheckinDays={setCheckinDays}
        checkoutDays={checkoutDays}
        setCheckoutDays={setCheckoutDays}
      />

      <AvailabilityRulesCard propertyId={propertyId} />

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


// ── Optional stay rules: maximum stay and allowed check-in / check-out days ──

function StayRulesCard(props: {
  propertyId: string;
  minNights: number;
  maxNights: number | null;
  setMaxNights: (v: number | null) => void;
  checkinDays: number[];
  setCheckinDays: (v: number[]) => void;
  checkoutDays: number[];
  setCheckoutDays: (v: number[]) => void;
}) {
  const { toast } = useToast();
  const { propertyId, minNights, maxNights, checkinDays, checkoutDays } = props;
  const [busy, setBusy] = useState(false);

  const save = async (patch: Record<string, unknown>, apply: () => void) => {
    setBusy(true);
    const { error } = await supabase.from("properties").update(patch).eq("id", propertyId);
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    apply();
  };

  const setMax = (v: number | null) => {
    const value = v == null ? null : Math.min(90, Math.max(minNights, v));
    save({ max_nights: value }, () => props.setMaxNights(value));
  };

  const toggleDay = (list: number[], day: number): number[] =>
    list.includes(day) ? list.filter((d) => d !== day) : [...list, day].sort((a, b) => a - b);

  const setDays = (field: "checkin_days" | "checkout_days", next: number[]) =>
    save({ [field]: next.length ? next : null }, () =>
      field === "checkin_days" ? props.setCheckinDays(next) : props.setCheckoutDays(next),
    );

  const DayChips = ({ label, hint, days, field }: { label: string; hint: string; days: number[]; field: "checkin_days" | "checkout_days" }) => (
    <div>
      <Label className="text-xs font-semibold text-white/80">{label}</Label>
      <p className="mt-0.5 text-xs text-white/50">{days.length === 0 ? `${hint} Any day right now.` : hint}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DAY_ORDER.map((d) => (
          <button
            key={d}
            type="button"
            disabled={busy}
            onClick={() => setDays(field, toggleDay(days, d))}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
              days.includes(d) ? "border-ember bg-ember text-white" : "border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            {DAY_SHORT[d]}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 rounded-2xl border border-white/15 bg-white/5 p-4">
      <div>
        <Label className="text-xs font-semibold text-white/80">Stay rules (optional)</Label>
        <p className="mt-0.5 text-xs text-white/50">
          All off by default. Guests see these before they pick dates, and bookings that break them are blocked at checkout.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-xs font-semibold text-white/80">Maximum nights</Label>
          <p className="mt-0.5 text-xs text-white/50">{maxNights == null ? "No limit right now." : "Longest stay a guest can book."}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Switch checked={maxNights != null} disabled={busy} onCheckedChange={(on) => setMax(on ? Math.max(minNights, 30) : null)} />
          {maxNights != null && (
            <>
              <button type="button" disabled={busy || maxNights <= minNights} onClick={() => setMax(maxNights - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-bold text-white">{maxNights}</span>
              <button type="button" disabled={busy || maxNights >= 90} onClick={() => setMax(maxNights + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <DayChips label="Check-in days" hint="Pick the weekdays guests can arrive on." days={checkinDays} field="checkin_days" />
      <DayChips label="Check-out days" hint="Pick the weekdays guests can leave on." days={checkoutDays} field="checkout_days" />
    </div>
  );
}

// ── Availability: advance notice, same-day cut-off, preparation time, window ──
// Mirrors Airbnb's calendar availability settings; enforced in
// _shared/bookingQuote.ts (wayzyy-app). null = no rule.

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: h,
  label: h === 0 ? "12 am (midnight)" : h < 12 ? `${h} am` : h === 12 ? "12 pm (noon)" : `${h - 12} pm`,
}));

function AvailabilityRulesCard({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [rules, setRules] = useState<{ advance_notice_days: number | null; same_day_cutoff_hour: number | null; preparation_days: number | null; availability_window_days: number | null } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("properties").select("advance_notice_days, same_day_cutoff_hour, preparation_days, availability_window_days").eq("id", propertyId).maybeSingle()
      .then(({ data }) => setRules({
        advance_notice_days: data?.advance_notice_days ?? null,
        same_day_cutoff_hour: data?.same_day_cutoff_hour ?? null,
        preparation_days: data?.preparation_days ?? null,
        availability_window_days: data?.availability_window_days ?? null,
      }));
  }, [propertyId]);

  if (!rules) return null;

  const save = async (patch: Partial<typeof rules>) => {
    const before = rules;
    setRules({ ...rules, ...patch });
    setBusy(true);
    const { error } = await supabase.from("properties").update(patch).eq("id", propertyId);
    setBusy(false);
    if (error) { setRules(before); toast({ title: "Couldn't save", description: error.message, variant: "destructive" }); }
  };

  const selectCls = "mt-1.5 w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-white disabled:opacity-50";
  const notice = rules.advance_notice_days;

  return (
    <div className="space-y-5 rounded-2xl border border-white/15 bg-white/5 p-4">
      <div>
        <Label className="text-xs font-semibold text-white/80">Availability</Label>
        <p className="mt-0.5 text-xs text-white/50">When guests can book. Bookings that don't fit are blocked at checkout.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-white/80">Advance notice</span>
          <select disabled={busy} className={selectCls}
            value={notice == null ? "" : String(notice)}
            onChange={(e) => save({ advance_notice_days: e.target.value === "" ? null : Number(e.target.value), ...(e.target.value !== "0" ? { same_day_cutoff_hour: null } : {}) })}>
            <option value="">No rule (same day, any time)</option>
            <option value="0">Same day, with a cut-off time</option>
            {[1, 2, 3, 7].map((d) => <option key={d} value={d}>At least {d} day{d > 1 ? "s" : ""} before</option>)}
          </select>
        </label>

        {notice === 0 && (
          <label className="block">
            <span className="text-xs font-semibold text-white/80">Same-day bookings close at</span>
            <select disabled={busy} className={selectCls}
              value={rules.same_day_cutoff_hour == null ? "" : String(rules.same_day_cutoff_hour)}
              onChange={(e) => save({ same_day_cutoff_hour: e.target.value === "" ? null : Number(e.target.value) })}>
              <option value="">Any time</option>
              {HOUR_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-xs font-semibold text-white/80">Preparation time</span>
          <select disabled={busy} className={selectCls}
            value={rules.preparation_days == null ? "" : String(rules.preparation_days)}
            onChange={(e) => save({ preparation_days: e.target.value === "" ? null : Number(e.target.value) })}>
            <option value="">None</option>
            <option value="1">Block 1 night before and after each stay</option>
            <option value="2">Block 2 nights before and after each stay</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-white/80">Availability window</span>
          <select disabled={busy} className={selectCls}
            value={rules.availability_window_days == null ? "" : String(rules.availability_window_days)}
            onChange={(e) => save({ availability_window_days: e.target.value === "" ? null : Number(e.target.value) })}>
            <option value="">Any time in the future</option>
            <option value="90">3 months ahead</option>
            <option value="180">6 months ahead</option>
            <option value="270">9 months ahead</option>
            <option value="365">12 months ahead</option>
          </select>
        </label>
      </div>
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
    // Served from wayzyy.com (vercel.json proxies it to the export function);
    // the old supabase.co links pasted into other sites keep working too.
    ? `https://wayzyy.com/calendar/${propertyId}/${exportToken}.ics`
    : null;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!exportUrl) return;
    // navigator.clipboard is refused in some contexts (inside dialogs without
    // focus, older Safari, non-secure frames), and the rejection used to be
    // swallowed - the button just did nothing. Fall back to a hidden textarea.
    let ok = false;
    try {
      await navigator.clipboard.writeText(exportUrl);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = exportUrl;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      document.body.removeChild(ta);
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied", description: "Calendar link copied to clipboard." });
    } else {
      toast({ title: "Couldn't copy", description: "Select the link and copy it manually.", variant: "destructive" });
    }
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
      <p className="rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-white/70">
        Some systems (for example eZee) can give you a calendar link but cannot import one. If the other website has
        nowhere to paste the Wayzyy link in Step 1, only Step 2 works: their bookings block your Wayzyy dates, and you
        will need to block Wayzyy bookings on their side yourself.
      </p>

      <div>
        <p className="mb-2 text-sm font-semibold text-white">Step 1 - add this link to the other website</p>
        <div className="liquid-glass flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 p-4">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-white/60">Wayzyy calendar link</p>
            <input
              readOnly
              value={exportUrl ?? " - "}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Wayzyy calendar link"
              className="w-full truncate bg-transparent text-sm text-white outline-none"
            />
          </div>
          <Button size="sm" onClick={handleCopy} disabled={!exportUrl} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
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
