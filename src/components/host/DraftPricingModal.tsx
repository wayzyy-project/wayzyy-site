import { useEffect, useState } from "react";
import { BatteryFull, BedDouble, CheckCircle2, Droplet, Eye, IndianRupee, Loader2, MapPin, Signal, Users, Wifi, X } from "lucide-react";
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

// A real phone mockup - bezel, notch, status bar - with its own fixed
// pixel height so it scrolls on its own regardless of whatever height the
// surrounding modal ends up with. Relying on the modal's height to cascade
// down through a flex row was the bug: max-height + flex-stretch doesn't
// reliably resolve to a concrete number in every layout context, and when
// it doesn't, the "scrollable" panel silently has nothing to scroll
// within. A fixed height sidesteps that entirely.
function PhonePreview({ photos, title, location, details }: { photos: string[]; title: string; location: string; details: FullDetails | null }) {
  return (
    <div className="mx-auto" style={{ width: 300 }}>
      <div
        className="relative overflow-hidden rounded-[2.75rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl"
        style={{ height: 620 }}
      >
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
        <div className="h-full w-full overflow-y-auto overscroll-contain rounded-[2rem] bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 pb-1 pt-2.5 text-[11px] font-semibold text-neutral-900 backdrop-blur-sm">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryFull className="h-3.5 w-3.5" />
            </div>
          </div>

          {photos.length > 0 ? (
            photos.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Photo ${idx + 1}`} className="w-full object-cover" style={{ aspectRatio: "4 / 3" }} />
                {idx === 0 && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                    1 / {photos.length}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-neutral-400">No photos imported</div>
          )}

          <div className="space-y-3 rounded-t-2xl bg-white px-4 pb-8 pt-4">
            <div>
              <h4 className="text-base font-semibold leading-snug text-neutral-900">{title || "Untitled listing"}</h4>
              {location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin className="h-3 w-3" /> {location}
                </p>
              )}
              {details && (details.max_guests || details.bedrooms || details.bathrooms) && (
                <p className="mt-1 text-xs text-neutral-500">
                  {[
                    details.max_guests ? `${details.max_guests} guests` : null,
                    details.bedrooms ? `${details.bedrooms} bedroom${details.bedrooms !== 1 ? "s" : ""}` : null,
                    details.bathrooms ? `${details.bathrooms} bath` : null,
                  ].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            {details?.description && (
              <div className="border-t border-neutral-100 pt-3">
                <p className="whitespace-pre-line text-xs leading-relaxed text-neutral-700">{details.description}</p>
              </div>
            )}

            {details?.amenities && details.amenities.length > 0 && (
              <div className="border-t border-neutral-100 pt-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">What this place offers</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.amenities.map((a) => (
                    <span key={a} className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  const [showFullPreview, setShowFullPreview] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className={`w-full ${showFullPreview ? "max-w-3xl" : "max-w-lg"} my-auto flex flex-col md:flex-row rounded-3xl border border-border bg-background shadow-2xl`}>
        {/* Left: pricing side - always here, never hidden behind the preview. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Set pricing & approve</h3>
              <p className="text-xs text-muted-foreground">Imported by our team — this is the last step before it goes to review.</p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-muted">
                {photos.length > 0 ? (
                  <img src={photos[0]} alt={property.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No photos imported</div>
                )}
                <button
                  type="button"
                  onClick={() => setShowFullPreview((v) => !v)}
                  className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors ${
                    showFullPreview ? "bg-primary text-primary-foreground" : "bg-black/60 text-white hover:bg-black/75"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> {showFullPreview ? "Hide preview" : `See full preview${photos.length > 1 ? ` (${photos.length} photos)` : ""}`}
                </button>
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

        {/* Right: the actual phone mockup, only mounted once requested. */}
        {showFullPreview && (
          <div className="w-full md:w-[340px] shrink-0 border-t md:border-t-0 md:border-l border-border bg-muted/20 p-4 flex flex-col items-center justify-center gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Eye className="h-3.5 w-3.5" /> How it'll look
            </p>
            <PhonePreview photos={photos} title={property.title} location={location} details={details} />
          </div>
        )}
      </div>
    </div>
  );
}
