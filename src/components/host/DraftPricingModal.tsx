import { useState } from "react";
import { CheckCircle2, ExternalLink, IndianRupee, Loader2, MapPin, Users, X } from "lucide-react";
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
  source_url?: string | null;
  max_guests?: number | null;
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
      <div className="w-full max-w-lg my-auto rounded-3xl border border-border bg-background shadow-2xl">
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
          {/* Kept deliberately minimal - photo, guest count, price. This
              is a quick "is this the right listing?" glance before
              pricing, not a full listing preview. */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <div className="relative aspect-[16/10] w-full bg-muted">
              {photos.length > 0 ? (
                <img src={photos[0]} alt={property.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No photos imported</div>
              )}
            </div>

            <div className="space-y-2.5 p-4">
              <div>
                <h4 className="font-display text-base font-semibold leading-snug text-foreground">{property.title || "Untitled listing"}</h4>
                {location && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {location}
                  </p>
                )}
              </div>

              {property.max_guests ? (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {property.max_guests} guests
                </p>
              ) : null}

              <div className="border-t border-border pt-2.5">
                <span className="text-lg font-bold text-foreground">
                  {price ? `₹${Number(price).toLocaleString("en-IN")}` : "₹— "}
                </span>
                <span className="text-sm text-muted-foreground"> / night</span>
              </div>

              {/* The original Airbnb listing this was pulled from, so the
                  host can check it actually matches what's now theirs to
                  price and approve - not shown for a manual/no-source
                  draft. */}
              {property.source_url && (
                <a
                  href={property.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View original Airbnb listing
                </a>
              )}
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
