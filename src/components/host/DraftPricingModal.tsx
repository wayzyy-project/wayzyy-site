import { useState } from "react";
import { CheckCircle2, Eye, IndianRupee, Loader2, X } from "lucide-react";
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

        <div className="p-4 space-y-4">
          {/* Compact preview - same rounded-phone visual language as the
              listing wizard's PhonePreview, but built off the saved
              property row rather than in-progress form state. */}
          <div className="mx-auto max-w-[220px] rounded-[2rem] border-4 border-foreground/10 bg-background p-1.5 shadow-lg">
            <div className="flex items-center justify-center gap-1 pb-1">
              <Eye className="h-3 w-3 text-ember" />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-ember">How it'll look</span>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-border">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt="" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-[10px] text-muted-foreground">No photos</div>
              )}
              <div className="space-y-1 p-2">
                <p className="truncate text-xs font-semibold text-foreground">{property.title || "Untitled listing"}</p>
                <p className="text-[10px] text-muted-foreground">{[property.city, property.state].filter(Boolean).join(", ")}</p>
                <p className="text-xs font-bold text-foreground">
                  {price ? `₹${Number(price).toLocaleString("en-IN")}` : "₹—"} <span className="text-[10px] font-normal text-muted-foreground">/ night</span>
                </p>
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
