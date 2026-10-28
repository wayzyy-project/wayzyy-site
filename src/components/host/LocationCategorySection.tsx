import { useEffect, useState } from "react";
import { Loader2, MapPin, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationMap } from "@/components/host/LocationMap";
import { reverseGeocode } from "@/lib/geocode";

// Where the listing is (area line, city, state, map pin) and how Explore files
// it (place type and vibe). Same columns, and the same options, as onboarding.

const PLACE_TYPES = [
  { id: "villa", label: "Villa" },
  { id: "apt", label: "Apartment" },
  { id: "cottage", label: "Cottage" },
  { id: "farm", label: "Farm Stay" },
  { id: "heritage", label: "Heritage Home" },
  { id: "other", label: "Other" },
] as const;

const VIBES = [
  { id: "beach", label: "Beach", sub: "On the beach or a short walk from it" },
  { id: "heritage", label: "Heritage", sub: "Portuguese, colonial or old-world character" },
  { id: "farm", label: "Farm Stay", sub: "On a farm, plantation or among fields" },
  { id: "clifftop", label: "Cliff Top", sub: "On a cliff or headland with big views" },
] as const;

interface Form {
  area: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  category: string;
  vibe: string | null;
}

const card = "rounded-2xl border border-white/15 bg-white/5 p-4";
const inputClass = "mt-1.5 border-white/20 bg-white/10 text-white placeholder:text-white/40";
const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-[#FF6B00] bg-[#FF6B00]/20 text-white" : "border-white/20 text-white/70 hover:text-white"}`;

export function LocationCategorySection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("location, city, state, latitude, longitude, category, vibe")
      .eq("id", propertyId)
      .single()
      .then(({ data }) => {
        const next: Form = {
          area: data?.location ?? "",
          city: data?.city ?? "",
          state: data?.state ?? "",
          lat: data?.latitude ?? null,
          lng: data?.longitude ?? null,
          category: data?.category ?? "other",
          vibe: data?.vibe ?? null,
        };
        setForm(next);
        setSaved(JSON.stringify(next));
      });
  }, [propertyId]);

  if (!form) return null;

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));
  const dirty = JSON.stringify(form) !== saved;
  const isPreset = PLACE_TYPES.some((t) => t.id === form.category);

  const handlePin = async (lat: number, lng: number) => {
    setForm((f) => (f ? { ...f, lat, lng } : f));
    // Fill city and state from the pin, but never overwrite what the host typed with nothing.
    try {
      const place = await reverseGeocode(lat, lng);
      if (place) setForm((f) => (f ? { ...f, city: place.city ?? f.city, state: place.state ?? f.state } : f));
    } catch {
      // The pin still counts; the host can type the city.
    }
  };

  const handleSave = async () => {
    if (!form.city.trim()) {
      toast({ title: "Add a city", description: "Guests search by it.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({
          location: form.area.trim() || [form.city.trim(), form.state.trim()].filter(Boolean).join(", "),
          city: form.city.trim(),
          state: form.state.trim(),
          latitude: form.lat,
          longitude: form.lng,
          category: form.category,
          vibe: form.vibe,
        })
        .eq("id", propertyId);
      if (error) throw error;
      setSaved(JSON.stringify(form));
      toast({ title: "Saved", description: "Location and category updated." });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className={card}>
        <p className="text-sm font-semibold text-white">Location</p>
        <p className="mb-3 text-xs text-white/50">Guests see the area line and the map. Keep your exact street address out of the area line.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Label className="text-xs font-semibold text-white/80">Area shown to guests</Label>
            <Input value={form.area} maxLength={120} placeholder="e.g. Siolim, Goa" onChange={(e) => set("area", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-semibold text-white/80">City or village</Label>
            <Input value={form.city} maxLength={60} placeholder="e.g. Siolim" onChange={(e) => set("city", e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label className="text-xs font-semibold text-white/80">State</Label>
            <Input value={form.state} maxLength={60} placeholder="e.g. Goa" onChange={(e) => set("state", e.target.value)} className={inputClass} />
          </div>
        </div>
        <p className="mt-4 text-xs text-white/50">Tap the map or drag the pin to the property's exact spot.</p>
        <LocationMap lat={form.lat} lng={form.lng} onChange={handlePin} className="mt-2 h-64 w-full overflow-hidden rounded-xl border border-white/15" />
        {form.lat != null && form.lng != null && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3.5 w-3.5" /> Pin set · {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">Type of place</p>
        <p className="mb-3 text-xs text-white/50">Used for filters on Explore.</p>
        <div className="flex flex-wrap gap-2">
          {PLACE_TYPES.map((t) => (
            <button key={t.id} type="button" onClick={() => set("category", t.id)} className={chip(form.category === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {!isPreset && <p className="mt-2 text-xs text-white/50">Currently filed as "{form.category}". Pick one above to change it.</p>}

        <p className="mt-5 text-sm font-semibold text-white">Explore category (optional)</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {VIBES.map((v) => {
            const on = form.vibe === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => set("vibe", on ? null : v.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${on ? "border-[#FF6B00] bg-[#FF6B00]/15" : "border-white/15 hover:border-white/30"}`}
              >
                <span className="block text-sm font-medium text-white">{v.label}</span>
                <span className="block text-xs text-white/50">{v.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Button onClick={handleSave} disabled={!dirty || saving} className="w-full gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {dirty ? "Save location and category" : "All changes saved"}
      </Button>
    </div>
  );
}
