import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// A simple "rule set": set things up once on this listing, then copy them to
// the host's other listings in one go. It only copies settings that already
// exist per listing, so the booking rules themselves are unchanged.

interface Listing { id: string; title: string | null; city: string | null; status: string }

type GroupId = "minStay" | "cancellation" | "discounts" | "houseRules";

const GROUPS: { id: GroupId; label: string; sub: string }[] = [
  { id: "minStay", label: "Stay rules", sub: "Minimum and maximum nights, and allowed check-in and check-out days." },
  { id: "cancellation", label: "Cancellation policy", sub: "Both the short-stay and long-stay policy." },
  { id: "discounts", label: "Discounts", sub: "Weekly, monthly, last-minute, early-bird and new-listing. Replaces the discounts already on the other listings." },
  {
    id: "houseRules",
    label: "House rules and check-in",
    sub: "Pets (and pet fee), smoking, parties, extra rules, check-in and check-out times, self check-in.",
  },
];

const HOUSE_FIELDS = [
  "pets_allowed", "pet_fee", "smoking_allowed", "parties_allowed",
  "house_rules_additional", "check_in_time", "check_out_time", "self_check_in",
] as const;

export function ApplyRulesSection({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<Set<GroupId>>(new Set(["minStay", "cancellation", "discounts", "houseRules"]));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) { if (!cancelled) setListings([]); return; }
      const { data } = await supabase
        .from("properties")
        .select("id, title, city, status")
        .eq("host_id", uid)
        .neq("id", propertyId)
        .order("created_at", { ascending: false });
      if (!cancelled) setListings((data ?? []) as Listing[]);
    })();
    return () => { cancelled = true; };
  }, [propertyId]);

  const toggle = <T,>(set: Set<T>, v: T): Set<T> => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    return next;
  };

  const apply = async () => {
    const targets = [...picked];
    if (targets.length === 0 || groups.size === 0) return;
    const names = GROUPS.filter((g) => groups.has(g.id)).map((g) => g.label.toLowerCase()).join(", ");
    if (!window.confirm(`Copy ${names} from "${propertyTitle}" to ${targets.length} other listing${targets.length === 1 ? "" : "s"}? This overwrites those settings there.`)) return;

    setBusy(true);
    try {
      const { data: src, error: srcErr } = await supabase
        .from("properties")
        .select(["min_nights", "max_nights", "checkin_days", "checkout_days", "cancel_policy", "cancel_policy_long_term", ...HOUSE_FIELDS].join(", "))
        .eq("id", propertyId)
        .single();
      if (srcErr || !src) throw new Error(srcErr?.message ?? "Couldn't read this listing's settings.");
      const s = src as unknown as Record<string, unknown>;

      const patch: Record<string, unknown> = {};
      if (groups.has("minStay")) {
        patch.min_nights = s.min_nights;
        patch.max_nights = s.max_nights;
        patch.checkin_days = s.checkin_days;
        patch.checkout_days = s.checkout_days;
      }
      if (groups.has("cancellation")) {
        patch.cancel_policy = s.cancel_policy;
        patch.cancel_policy_long_term = s.cancel_policy_long_term;
      }
      if (groups.has("houseRules")) for (const f of HOUSE_FIELDS) patch[f] = s[f];

      if (Object.keys(patch).length > 0) {
        const { error } = await supabase.from("properties").update(patch).in("id", targets);
        if (error) throw new Error(error.message);
      }

      if (groups.has("discounts")) {
        const { data: rows, error: dErr } = await supabase
          .from("property_discounts")
          .select("discount_type, percentage, enabled")
          .eq("property_id", propertyId);
        if (dErr) throw new Error(dErr.message);
        const { error: delErr } = await supabase.from("property_discounts").delete().in("property_id", targets);
        if (delErr) throw new Error(delErr.message);
        const copies = targets.flatMap((tid) =>
          (rows ?? []).map((r: any) => ({ property_id: tid, discount_type: r.discount_type, percentage: r.percentage, enabled: r.enabled })),
        );
        if (copies.length > 0) {
          const { error: insErr } = await supabase.from("property_discounts").insert(copies);
          if (insErr) throw new Error(insErr.message);
        }
      }

      toast({ title: "Rules copied", description: `Applied to ${targets.length} listing${targets.length === 1 ? "" : "s"}.` });
      setPicked(new Set());
    } catch (e) {
      toast({ title: "Couldn't copy rules", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (listings === null) {
    return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }
  if (listings.length === 0) {
    return <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">You have no other listings to copy these settings to yet.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Set your rules once on <span className="font-medium text-foreground">{propertyTitle}</span>, then copy them to your other listings. Saved settings only: nothing else on those listings changes.
      </p>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-foreground">What to copy</h3>
        <div className="space-y-2">
          {GROUPS.map((g) => (
            <label key={g.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
              <input type="checkbox" className="mt-1 accent-[#FF6B00]" checked={groups.has(g.id)} onChange={() => setGroups((p) => toggle(p, g.id))} />
              <span>
                <span className="block text-sm font-medium text-foreground">{g.label}</span>
                <span className="block text-xs text-muted-foreground">{g.sub}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Copy to</h3>
          <button
            type="button"
            className="text-xs font-medium text-[#FF6B00] hover:underline"
            onClick={() => setPicked(picked.size === listings.length ? new Set() : new Set(listings.map((l) => l.id)))}
          >
            {picked.size === listings.length ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="space-y-2">
          {listings.map((l) => (
            <label key={l.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
              <input type="checkbox" className="accent-[#FF6B00]" checked={picked.has(l.id)} onChange={() => setPicked((p) => toggle(p, l.id))} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{l.title || "Untitled listing"}</span>
                <span className="block text-xs text-muted-foreground">{[l.city, l.status.replace("_", " ")].filter(Boolean).join(" · ")}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <Button onClick={apply} disabled={busy || picked.size === 0 || groups.size === 0} className="w-full gap-2 bg-[#FF6B00] text-white hover:bg-[#E05300]">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Copy to ${picked.size} listing${picked.size === 1 ? "" : "s"}`}
      </Button>
    </div>
  );
}
