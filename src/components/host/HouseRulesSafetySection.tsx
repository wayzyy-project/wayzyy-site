import { useEffect, useState } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CHECK_IN_TIMES, CHECK_OUT_TIMES, SAFETY_ITEMS, displayTime, hasSafetyItem } from "@/lib/houseRules";

// Every house rule and safety detail a guest sees on the listing page, editable
// in one place. Same columns the app's listing editor writes, so a change made
// here shows in the app and vice versa.

interface Form {
  checkIn: string;
  checkOut: string;
  selfCheckIn: boolean;
  pets: boolean;
  petFee: string;
  smoking: boolean;
  parties: boolean;
  photography: boolean;
  additional: string[];
  safety: string[];
  cameras: boolean | null;
  emergencyPhone: string;
}

const card = "rounded-2xl border border-white/15 bg-white/5 p-4";
const selectClass =
  "h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30";

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/50">{sub}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function HouseRulesSafetySection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [newRule, setNewRule] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("check_in_time, check_out_time, self_check_in, pets_allowed, pet_fee, smoking_allowed, parties_allowed, commercial_photography_allowed, house_rules_additional, safety_amenities, has_security_cameras, emergency_contact_phone")
      .eq("id", propertyId)
      .single()
      .then(({ data }) => {
        const amenities: string[] = Array.isArray(data?.safety_amenities) ? data.safety_amenities.map(String) : [];
        const next: Form = {
          checkIn: displayTime(data?.check_in_time, "2:00 PM"),
          checkOut: displayTime(data?.check_out_time, "11:00 AM"),
          selfCheckIn: data?.self_check_in === true,
          pets: data?.pets_allowed === true,
          petFee: data?.pet_fee != null ? String(data.pet_fee) : "",
          smoking: data?.smoking_allowed === true,
          parties: data?.parties_allowed === true,
          photography: data?.commercial_photography_allowed === true,
          additional: Array.isArray(data?.house_rules_additional) ? data.house_rules_additional.map(String).filter(Boolean) : [],
          // Older listings spell these differently; tick by meaning, save the standard ids.
          safety: SAFETY_ITEMS.filter((item) => hasSafetyItem(amenities, item.match)).map((item) => item.id),
          cameras: data?.has_security_cameras ?? null,
          emergencyPhone: data?.emergency_contact_phone ?? "",
        };
        setForm(next);
        setSaved(JSON.stringify(next));
      });
  }, [propertyId]);

  if (!form) return <p className="text-sm text-white/50">Loading...</p>;

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));
  const dirty = JSON.stringify(form) !== saved;

  const addRule = () => {
    const rule = newRule.trim();
    if (!rule) return;
    if (!form.additional.some((r) => r.toLowerCase() === rule.toLowerCase())) set("additional", [...form.additional, rule]);
    setNewRule("");
  };

  const handleSave = async () => {
    const fee = parseFloat(form.petFee);
    setSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({
          check_in_time: form.checkIn,
          check_out_time: form.checkOut,
          self_check_in: form.selfCheckIn,
          pets_allowed: form.pets,
          pet_fee: form.pets && fee > 0 ? fee : null,
          smoking_allowed: form.smoking,
          parties_allowed: form.parties,
          commercial_photography_allowed: form.photography,
          house_rules_additional: form.additional,
          safety_amenities: form.safety,
          has_security_cameras: form.cameras,
          emergency_contact_phone: form.emergencyPhone.trim() || null,
        })
        .eq("id", propertyId);
      if (error) throw error;
      setSaved(JSON.stringify(form));
      toast({ title: "Saved", description: "Guests now see these rules and safety details on your listing." });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Keep a saved time selectable even if it isn't one of the standard options.
  const checkInOptions = CHECK_IN_TIMES.includes(form.checkIn as never) ? [...CHECK_IN_TIMES] : [form.checkIn, ...CHECK_IN_TIMES];
  const checkOutOptions = CHECK_OUT_TIMES.includes(form.checkOut as never) ? [...CHECK_OUT_TIMES] : [form.checkOut, ...CHECK_OUT_TIMES];

  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="mb-3 text-sm font-semibold text-white">Checking in and out</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold text-white/80">Check-in after</Label>
            <select className={`mt-1.5 ${selectClass}`} value={form.checkIn} onChange={(e) => set("checkIn", e.target.value)}>
              {checkInOptions.map((t) => <option key={t} value={t} className="text-black">{t}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-white/80">Check-out before</Label>
            <select className={`mt-1.5 ${selectClass}`} value={form.checkOut} onChange={(e) => set("checkOut", e.target.value)}>
              {checkOutOptions.map((t) => <option key={t} value={t} className="text-black">{t}</option>)}
            </select>
          </div>
        </div>
        <ToggleRow label="Self check-in" sub="Guests can get in without meeting you (keypad, lockbox or building staff)." checked={form.selfCheckIn} onChange={(v) => set("selfCheckIn", v)} />
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">During the stay</p>
        <p className="text-xs text-white/50">The maximum number of guests is set on the Listing tab.</p>
        <div className="divide-y divide-white/10">
          <ToggleRow label="Pets allowed" sub="Guests can bring their pets." checked={form.pets} onChange={(v) => set("pets", v)} />
          {form.pets && (
            <div className="py-3">
              <Label className="text-xs font-semibold text-white/80">Pet fee per stay (optional, ₹)</Label>
              <Input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="e.g. 500"
                value={form.petFee}
                onChange={(e) => set("petFee", e.target.value)}
                className="mt-1.5 border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
          )}
          <ToggleRow label="Smoking allowed" sub="Smoking is allowed on the property." checked={form.smoking} onChange={(v) => set("smoking", v)} />
          <ToggleRow label="Events allowed" sub="Parties, gatherings or events are allowed." checked={form.parties} onChange={(v) => set("parties", v)} />
          <ToggleRow label="Commercial photography allowed" sub="Photo or video shoots for brands, ads or paid content." checked={form.photography} onChange={(v) => set("photography", v)} />
        </div>
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">Additional rules</p>
        <p className="mb-3 text-xs text-white/50">Anything else guests should follow, one rule per line, e.g. "Quiet hours after 10 PM".</p>
        {form.additional.length > 0 && (
          <ul className="mb-3 space-y-2">
            {form.additional.map((rule, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-white">
                <span className="whitespace-pre-line">{rule}</span>
                <button
                  type="button"
                  aria-label="Remove rule"
                  onClick={() => set("additional", form.additional.filter((_, j) => j !== i))}
                  className="mt-0.5 text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Input
            value={newRule}
            maxLength={300}
            placeholder="Add a rule"
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRule(); } }}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
          />
          <Button type="button" variant="secondary" onClick={addRule} disabled={!newRule.trim()} className="shrink-0 gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">Safety devices</p>
        <p className="mb-3 text-xs text-white/50">Tick what the property has. Guests see anything unticked as "Not available".</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SAFETY_ITEMS.map((item) => {
            const on = form.safety.includes(item.id);
            return (
              <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 p-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => set("safety", on ? form.safety.filter((s) => s !== item.id) : [...form.safety, item.id])}
                  className="h-4 w-4 accent-[#FF6B00]"
                />
                {item.label}
              </label>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-semibold text-white">Exterior security cameras</p>
        <p className="mb-3 text-xs text-white/50">
          Cameras watching any indoor space are not allowed on Wayzyy, even when switched off. Outdoor cameras must be disclosed.
        </p>
        <div className="flex gap-2">
          {([[true, "Yes, there are"], [false, "No cameras"]] as const).map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => set("cameras", value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                form.cameras === value ? "border-[#FF6B00] bg-ember/20 text-white" : "border-white/20 text-white/70 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Label className="mt-5 block text-xs font-semibold text-white/80">Emergency contact number</Label>
        <p className="text-xs text-white/50">Who guests can call in an emergency during the stay. The listing only shows that one is available, never the number.</p>
        <Input
          type="tel"
          inputMode="tel"
          placeholder="+91 98765 43210"
          value={form.emergencyPhone}
          onChange={(e) => set("emergencyPhone", e.target.value)}
          className="mt-1.5 border-white/20 bg-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <Button onClick={handleSave} disabled={!dirty || saving} className="w-full gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {dirty ? "Save house rules and safety" : "All changes saved"}
      </Button>
    </div>
  );
}
