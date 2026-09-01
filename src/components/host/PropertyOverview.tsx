import { useEffect, useState } from "react";
import { Images, Loader2, MapPin, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AMENITIES } from "@/lib/amenities";

interface PropertyRow {
  title: string | null;
  description: string | null;
  price_per_night: number | null;
  weekend_price: number | null;
  amenities: string[] | null;
  images: string[] | null;
  max_guests: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  city: string | null;
  state: string | null;
  status: string | null;
  source_url: string | null;
}

const PREVIEW_COUNT = 5;

export function PropertyOverview({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [row, setRow] = useState<PropertyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Editable copies. Kept separate from `row` so "Save changes" only
  // enables once something actually differs.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [maxGuests, setMaxGuests] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  useEffect(() => {
    supabase
      .from("properties")
      .select("title, description, price_per_night, weekend_price, amenities, images, max_guests, bedrooms, beds, bathrooms, city, state, status, source_url")
      .eq("id", propertyId)
      .maybeSingle()
      .then(({ data }) => {
        const p = (data ?? null) as PropertyRow | null;
        setRow(p);
        setTitle(p?.title ?? "");
        setDescription(p?.description ?? "");
        setPrice(p?.price_per_night != null ? String(p.price_per_night) : "");
        setWeekendPrice(p?.weekend_price != null ? String(p.weekend_price) : "");
        setAmenities(p?.amenities ?? []);
        setMaxGuests(p?.max_guests != null ? String(p.max_guests) : "");
        setBedrooms(p?.bedrooms != null ? String(p.bedrooms) : "");
        setBeds(p?.beds != null ? String(p.beds) : "");
        setBathrooms(p?.bathrooms != null ? String(p.bathrooms) : "");
      });
  }, [propertyId]);

  if (!row) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  const photos = row.images ?? [];
  const numOr = (v: string) => (v.trim() === "" ? null : Number(v));

  const dirty =
    title !== (row.title ?? "") ||
    description !== (row.description ?? "") ||
    numOr(price) !== (row.price_per_night ?? null) ||
    numOr(weekendPrice) !== (row.weekend_price ?? null) ||
    numOr(maxGuests) !== (row.max_guests ?? null) ||
    numOr(bedrooms) !== (row.bedrooms ?? null) ||
    numOr(beds) !== (row.beds ?? null) ||
    numOr(bathrooms) !== (row.bathrooms ?? null) ||
    JSON.stringify([...amenities].sort()) !== JSON.stringify([...(row.amenities ?? [])].sort());

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Add a title", description: "Guests see this first.", variant: "destructive" });
      return;
    }
    const nightly = numOr(price);
    // A live listing without a price would be bookable at zero. A draft is
    // allowed to have none - that's the whole point of the pricing step.
    if (row.status !== "draft" && (nightly == null || nightly < 100)) {
      toast({ title: "Nightly rate is required", description: "Enter ₹100 or more.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // status is deliberately not in this update - publishing stays with
      // the review flow, not the edit form.
      const { error } = await supabase
        .from("properties")
        .update({
          title: title.trim(),
          description: description.trim(),
          price_per_night: nightly,
          weekend_price: numOr(weekendPrice),
          amenities,
          max_guests: numOr(maxGuests),
          bedrooms: numOr(bedrooms),
          beds: numOr(beds),
          bathrooms: numOr(bathrooms),
        })
        .eq("id", propertyId);
      if (error) throw error;

      setRow({
        ...row,
        title: title.trim(),
        description: description.trim(),
        price_per_night: nightly,
        weekend_price: numOr(weekendPrice),
        amenities,
        max_guests: numOr(maxGuests),
        bedrooms: numOr(bedrooms),
        beds: numOr(beds),
        bathrooms: numOr(bathrooms),
      });
      toast({ title: "Saved", description: "Your listing has been updated." });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photos ------------------------------------------------------- */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Photos</p>
          {photos.length > 0 && <span className="text-xs text-white/50">{photos.length} imported</span>}
        </div>

        {photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 py-10 text-center text-xs text-white/50">
            No photos on this listing yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.slice(0, PREVIEW_COUNT).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Photo ${i + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg border border-white/10 object-cover"
                />
              ))}
              {photos.length > PREVIEW_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAllPhotos(true)}
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/5 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Images className="h-4 w-4" />
                  +{photos.length - PREVIEW_COUNT} more
                </button>
              )}
            </div>
            {photos.length > PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllPhotos(true)}
                className="mt-2 text-xs font-medium text-ember hover:underline"
              >
                See all {photos.length} photos
              </button>
            )}
          </>
        )}
      </section>

      {/* Title + description ------------------------------------------ */}
      <section className="space-y-4">
        <div>
          <Label className="text-xs font-semibold text-white/80">Listing title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Serene 3BHK villa near Assagao"
            className="mt-1.5"
          />
          {(row.city || row.state) && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-white/50">
              <MapPin className="h-3 w-3" /> {[row.city, row.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold text-white/80">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={14}
            placeholder="What makes this place worth staying in?"
            className="mt-1.5 max-h-[60vh] leading-relaxed"
          />
          <p className="mt-1 text-[11px] text-white/40">{description.length} characters</p>
        </div>
      </section>

      {/* Pricing ------------------------------------------------------- */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">Pricing</p>
        <p className="mt-0.5 text-xs text-white/50">
          Your standard rates. Individual nights can be priced separately from the Calendar tab.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold text-white/80">Nightly rate (₹)</Label>
            <Input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-white/80">Weekend rate (₹)</Label>
            <Input type="number" inputMode="numeric" value={weekendPrice} onChange={(e) => setWeekendPrice(e.target.value)} placeholder="Same as nightly" className="mt-1.5" />
          </div>
        </div>
      </section>

      {/* Capacity ------------------------------------------------------ */}
      <section>
        <p className="mb-3 text-sm font-semibold text-white">The space</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["Guests", maxGuests, setMaxGuests],
            ["Bedrooms", bedrooms, setBedrooms],
            ["Beds", beds, setBeds],
            ["Bathrooms", bathrooms, setBathrooms],
          ] as const).map(([label, value, set]) => (
            <div key={label}>
              <Label className="text-xs font-semibold text-white/80">{label}</Label>
              <Input type="number" inputMode="numeric" value={value} onChange={(e) => set(e.target.value)} className="mt-1.5" />
            </div>
          ))}
        </div>
      </section>

      {/* Amenities ----------------------------------------------------- */}
      <section>
        <p className="text-sm font-semibold text-white">Amenities</p>
        <p className="mt-0.5 mb-3 text-xs text-white/50">{amenities.length} selected — tap to add or remove.</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const on = amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAmenities((prev) => (on ? prev.filter((x) => x !== a) : [...prev, a]))}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  on ? "border-ember bg-ember/15 text-ember" : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </section>

      {row.source_url && (
        <a
          href={row.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-white/50 underline-offset-2 hover:text-white hover:underline"
        >
          View the original Airbnb listing this was imported from
        </a>
      )}

      {/* Save ---------------------------------------------------------- */}
      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/70 p-3 backdrop-blur-xl">
        <Button onClick={handleSave} disabled={saving || !dirty} className="gap-2 bg-ember text-white hover:bg-ember/90">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
        <span className="text-xs text-white/50">{dirty ? "You have unsaved changes." : "Everything is saved."}</span>
      </div>

      {/* All-photos overlay -------------------------------------------- */}
      {showAllPhotos && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-8"
          onClick={() => setShowAllPhotos(false)}
        >
          <div className="mx-auto max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-black/60 py-2 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">All {photos.length} photos</p>
              <button
                type="button"
                onClick={() => setShowAllPhotos(false)}
                className="rounded-full border border-white/20 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {photos.map((src, i) => (
                <img key={i} src={src} alt={`Photo ${i + 1}`} loading="lazy" className="w-full rounded-xl border border-white/10 object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
