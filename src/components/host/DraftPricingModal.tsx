import { useEffect, useState } from "react";
import { BedDouble, CheckCircle2, Droplet, IndianRupee, Loader2, MapPin, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface DraftProperty {
  id: string;
  title: string;
  city: string;
  state: string;
  images: string[];
}

interface FullDetails {
  description: string | null;
  amenities: string[] | null;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

interface Props {
  property: DraftProperty;
  onClose: () => void;
  onApproved: () => void;
}

// Shown when a host opens one of their admin-imported "draft" properties.
// Admin imports the listing but deliberately never sets a price - that's
// the host's own call. This is where they set it (nightly + weekend) and
// give the final go-ahead that sends it into review.
export function DraftPricingModal({ property, onClose, onApproved }: Props) {
  const { toast } = useToast();
  const [price, setPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [details, setDetails] = useState<FullDetails | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("properties")
      .select("description, amenities, max_guests, bedrooms, bathrooms")
      .eq("id", property.id)
      .maybeSingle()
      .then(({ data }) => setDetails(data as FullDetails));
  }, [property.id]);

  const handleApprove = async () => {
    const numPrice = Number(price);
    if (!Number.isFinite(numPrice) || numPrice < 100) {
      toast({ title: "Pricing required", description: "Enter a valid nightly rate (₹100 or more) to continue.", variant: "destructive" });
      return;
    }
    const numWeekendPrice = weekendPrice ? Number(weekendPrice) : numPrice;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({
          price_per_night: numPrice,
          weekend_price: numWeekendPrice,
          status: "pending_review",
        })
        .eq("id", property.id);

      if (error) throw error;

      toast({ title: "Sent for review! 🚀", description: `"${property.title}" now has your pricing and is in our review queue.` });
      onApproved();
    } catch (err: any) {
      toast({ title: "Couldn't save pricing", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const photos = property.images ?? [];
  const location = [property.city, property.state].filter(Boolean).join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Set pricing & approve</h3>
            <p className="text-xs text-muted-foreground">Imported by our team — this is the last step before it goes to review.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* A real listing card, at real size - not a shrunken mockup.
              This is what a guest actually sees, so it needs to look like
              it, not like a wireframe: a proper photo, room to read the
              title, and the same stats/amenities a live listing shows. */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <div className="relative aspect-[16/10] w-full bg-muted">
              {photos.length > 0 ? (
                <img src={photos[photoIndex]} alt={property.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No photos imported</div>
              )}
              {photos.length > 1 && (
                <>
                  <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                    {photoIndex + 1} / {photos.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h4 className="font-display text-base font-semibold leading-snug text-foreground">{property.title || "Untitled listing"}</h4>
                {location && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {location}
                  </p>
                )}
              </div>

              {details && (details.max_guests || details.bedrooms || details.bathrooms) && (
                <div className="flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                  {details.max_guests ? (
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {details.max_guests} guests</span>
                  ) : null}
                  {details.bedrooms ? (
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {details.bedrooms} bed{details.bedrooms !== 1 ? "s" : ""}</span>
                  ) : null}
                  {details.bathrooms ? (
                    <span className="flex items-center gap-1.5"><Droplet className="h-4 w-4" /> {details.bathrooms} bath</span>
                  ) : null}
                </div>
              )}

              {details?.description && (
                <p className="whitespace-pre-line text-sm text-muted-foreground line-clamp-3 border-t border-border pt-3">
                  {details.description}
                </p>
              )}

              {details?.amenities && details.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                  {details.amenities.slice(0, 8).map((a) => (
                    <span key={a} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{a}</span>
                  ))}
                  {details.amenities.length > 8 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">+{details.amenities.length - 8} more</span>
                  )}
                </div>
              )}

              <div className="border-t border-border pt-3">
                <span className="text-lg font-bold text-foreground">
                  {price ? `₹${Number(price).toLocaleString("en-IN")}` : "₹— "}
                </span>
                <span className="text-sm text-muted-foreground"> / night</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Your pricing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Nightly Base Rate (₹) *</Label>
                <Input type="number" placeholder="e.g. 3500" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 text-xs" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Weekend Rate (₹) (Optional)</Label>
                <Input type="number" placeholder="e.g. 4200" value={weekendPrice} onChange={(e) => setWeekendPrice(e.target.value)} className="mt-1 text-xs" />
              </div>
            </div>
          </div>

          <Button onClick={handleApprove} disabled={submitting || !price} className="w-full gap-2 py-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider">
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending for review...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Approve & Send for Review</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
