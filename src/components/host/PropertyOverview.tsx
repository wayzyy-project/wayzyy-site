import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Loader2, MapPin, Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AmenityPicker } from "@/components/host/AmenityPicker";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 10;

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
  const { user } = useAuth();
  const [row, setRow] = useState<PropertyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Photos - mix of already-saved URLs and pending local File uploads not
  // yet in Storage. `photos` always reflects final desired order/contents.
  const [photos, setPhotos] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

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
        setPhotos(p?.images ?? []);
      });
  }, [propertyId]);

  if (!row) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

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
    JSON.stringify([...amenities].sort()) !== JSON.stringify([...(row.amenities ?? [])].sort()) ||
    JSON.stringify(photos) !== JSON.stringify(row.images ?? []);

  const handleAddPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast({ title: "Photo limit reached", description: `A listing can have up to ${MAX_PHOTOS} photos.`, variant: "destructive" });
      return;
    }
    const picked = Array.from(files).slice(0, remaining);
    const newEntries: Record<string, File> = {};
    const newUrls: string[] = [];
    for (const file of picked) {
      const blobUrl = URL.createObjectURL(file);
      newEntries[blobUrl] = file;
      newUrls.push(blobUrl);
    }
    setPendingFiles((prev) => ({ ...prev, ...newEntries }));
    setPhotos((prev) => [...prev, ...newUrls].slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (idx: number) => {
    if (photos.length <= MIN_PHOTOS) {
      toast({ title: "Minimum photos required", description: `A listing needs at least ${MIN_PHOTOS} photos.`, variant: "destructive" });
      return;
    }
    const target = photos[idx];
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    if (target.startsWith("http")) {
      setPhotosToDelete((prev) => [...prev, target]);
    } else {
      setPendingFiles((prev) => {
        const next = { ...prev };
        delete next[target];
        return next;
      });
    }
  };

  const handleMovePhoto = (idx: number, direction: -1 | 1) => {
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= photos.length) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

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
    if (photos.length < MIN_PHOTOS) {
      toast({ title: "More photos needed", description: `Please have at least ${MIN_PHOTOS} photos before saving.`, variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Upload any newly-added local files first, splicing the resulting
      // public URLs back into their original position.
      let finalPhotos = photos;
      const localIndices = photos.map((p, i) => (p.startsWith("http") ? -1 : i)).filter((i) => i !== -1);
      if (localIndices.length > 0 && user) {
        const uploadedUrls: string[] = [];
        for (const idx of localIndices) {
          const blobUrl = photos[idx];
          const file = pendingFiles[blobUrl];
          if (!file) continue;
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from("property-images").upload(path, file, {
            contentType: file.type || "image/jpeg",
            upsert: false,
          });
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
          uploadedUrls.push(urlData.publicUrl);
        }
        finalPhotos = [...photos];
        localIndices.forEach((idx, k) => { finalPhotos[idx] = uploadedUrls[k]; });
        setPhotos(finalPhotos);
        setPendingFiles({});
      }

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
          images: finalPhotos,
        })
        .eq("id", propertyId);
      if (error) throw error;

      // Only remove the now-unused originals from Storage after the DB
      // update succeeded - if it failed, the photo is still "in use".
      if (photosToDelete.length > 0) {
        const { data: prefixData } = supabase.storage.from("property-images").getPublicUrl("");
        const prefix = prefixData.publicUrl;
        const paths = photosToDelete.filter((url) => url.startsWith(prefix)).map((url) => url.slice(prefix.length));
        if (paths.length > 0) {
          await supabase.storage.from("property-images").remove(paths).catch(() => {});
        }
        setPhotosToDelete([]);
      }

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
        images: finalPhotos,
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
          <span className="text-xs text-white/50">{photos.length} / {MAX_PHOTOS}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((src, i) => (
            <div key={src + i} className="group relative aspect-[4/3] w-full">
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full rounded-lg border border-white/10 object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemovePhoto(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                <button
                  type="button"
                  onClick={() => handleMovePhoto(i, -1)}
                  disabled={i === 0}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-black disabled:opacity-40"
                  aria-label="Move earlier"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMovePhoto(i, 1)}
                  disabled={i === photos.length - 1}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-black disabled:opacity-40"
                  aria-label="Move later"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 bg-white/5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add photos
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleAddPhotos(e.target.files)}
        />
        <p className="mt-2 text-[11px] text-white/40">
          The first photo is your cover. Use the arrows to reorder - at least {MIN_PHOTOS} photos required.
        </p>
        {photos.length > PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAllPhotos(true)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-ember hover:underline"
          >
            <Images className="h-3.5 w-3.5" /> View all {photos.length} photos
          </button>
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
        <p className="mb-3 mt-0.5 text-xs text-white/50">
          What guests get. Remove anything that doesn't apply, and search to add what's missing.
        </p>
        <AmenityPicker value={amenities} onChange={setAmenities} />
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
