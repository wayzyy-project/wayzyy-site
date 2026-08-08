import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Copy, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DISCOUNT_TYPES, DISCOUNT_LABELS, SUGGESTED_DISCOUNT_PERCENTAGE, DiscountType } from "@/lib/discounts";
import { SHORT_TERM_POLICIES, LONG_TERM_POLICIES, ShortTermPolicyId, LongTermPolicyId } from "@/lib/cancellationPolicies";

const SUPABASE_URL = "https://eitpwcnsoshweoqzusdk.supabase.co";

interface Props {
  propertyId: string;
  propertyTitle: string;
  onBack: () => void;
}

// The website's equivalent of the app's ConnectCalendarScreen + HostDiscountsScreen +
// cancellation-policy cards — same tables and edge functions as mobile, so a
// change made here shows up in the app instantly and vice versa.
export function ListingManagePanel({ propertyId, propertyTitle, onBack }: Props) {
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
      <p className="mb-6 text-sm text-white/60">Manage calendar sync, discounts, and cancellation policy.</p>

      <Tabs defaultValue="calendar">
        <TabsList className="mb-6 bg-white/10 text-white/60">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Calendar</TabsTrigger>
          <TabsTrigger value="discounts" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Discounts</TabsTrigger>
          <TabsTrigger value="cancellation" className="data-[state=active]:bg-white/15 data-[state=active]:text-white">Cancellation</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <CalendarSection propertyId={propertyId} propertyTitle={propertyTitle} />
        </TabsContent>
        <TabsContent value="discounts">
          <DiscountsSection propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="cancellation">
          <CancellationSection propertyId={propertyId} />
        </TabsContent>
      </Tabs>
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
        <p className="mb-2 text-sm font-semibold text-white">Step 1 — add this link to the other website</p>
        <div className="liquid-glass flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 p-4">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-white/60">Wayzyy calendar link</p>
            <p className="truncate text-sm text-white">{exportUrl ?? "—"}</p>
          </div>
          <Button size="sm" onClick={handleCopy} disabled={!exportUrl} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-white">Step 2 — paste the other website's .ics link</p>
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
  const [shortTerm, setShortTerm] = useState<ShortTermPolicyId>("Flexible");
  const [longTerm, setLongTerm] = useState<LongTermPolicyId>("Firm");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("properties").select("cancel_policy, cancel_policy_long_term").eq("id", propertyId).single();
      if (!cancelled) {
        setShortTerm((data?.cancel_policy as ShortTermPolicyId) ?? "Flexible");
        setLongTerm((data?.cancel_policy_long_term as LongTermPolicyId) ?? "Firm");
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
        <p className="mb-3 text-sm font-semibold text-white">Under 28 nights</p>
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
                <p className={`text-sm font-medium ${shortTerm === policy.id ? "text-ember" : "text-white"}`}>{policy.label}</p>
                {policy.rules.map((rule) => (
                  <p key={rule} className="mt-1 text-xs text-white/60">{rule}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-white">28+ nights</p>
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
                <p className={`text-sm font-medium ${longTerm === policy.id ? "text-ember" : "text-white"}`}>{policy.label}</p>
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
