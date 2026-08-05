import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download, Search, Loader2, CheckCircle2, ShieldCheck, Info, IndianRupee, X, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { normalizeAmenities } from "@/lib/amenities";

interface ImportListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface LookupResult {
  listingId: string;
  name: string | null;
  description: string | null;
  photoUrls: string[];
  coverPhotoUrl: string | null;
  hostName: string | null;
  location: { locality?: string; region?: string; country?: string } | null;
  details: { guests?: number; bedrooms?: number; beds?: number; baths?: number } | null;
}

export function ImportListingModal({ isOpen, onClose, onSuccess }: ImportListingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [urlOrId, setUrlOrId] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [listingData, setListingData] = useState<LookupResult | null>(null);

  // Host input rates
  const [price, setPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(true);

  if (!isOpen) return null;

  const handleLookup = async () => {
    if (!urlOrId.trim()) return;
    setLookingUp(true);
    setListingData(null);

    try {
      const inputStr = urlOrId.trim();
      let extractedId = "";

      const roomMatch = inputStr.match(/rooms\/(\d+)/i);
      if (roomMatch && roomMatch[1]) {
        extractedId = roomMatch[1];
      } else {
        const numMatch = inputStr.match(/\b(\d{8,20})\b/);
        if (numMatch && numMatch[1]) {
          extractedId = numMatch[1];
        }
      }

      if (!extractedId) {
        throw new Error("Invalid Airbnb listing URL or ID. Please paste a valid Airbnb property link.");
      }

      const { data, error } = await supabase.functions.invoke("airroi-listing-lookup", {
        body: { listingId: extractedId },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Could not retrieve listing details.");
      }

      setListingData(data as LookupResult);
      toast({
        title: "Listing Details Loaded",
        description: "Review details below, add your direct host pricing, and move for approval.",
      });
    } catch (err: any) {
      console.error("Lookup failed:", err);
      toast({
        title: "Listing lookup failed",
        description: err?.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLookingUp(false);
    }
  };

  const handleMoveForApproval = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to import your listing.",
        variant: "destructive",
      });
      return;
    }

    if (!listingData) return;

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast({
        title: "Pricing required",
        description: "Please enter a valid nightly rate for this property.",
        variant: "destructive",
      });
      return;
    }

    const numWeekendPrice = weekendPrice ? Number(weekendPrice) : numPrice;

    setSubmitting(true);
    try {
      const photos = listingData.photoUrls || [];
      const coverPhoto = listingData.coverPhotoUrl || photos[0] || "";
      const locStr = listingData.location?.locality || listingData.location?.region || "Goa";

      const { data, error } = await supabase.from("properties").insert({
        title: listingData.name || "Imported Airbnb Property",
        description: listingData.description || "",
        price: numPrice,
        weekend_price: numWeekendPrice,
        host_id: user.id,
        host_name: user.user_metadata?.full_name || listingData.hostName || "Host",
        cover_image: coverPhoto,
        images: photos,
        city: locStr,
        location: locStr,
        state: "Goa",
        max_guests: listingData.details?.guests || 2,
        bedrooms: listingData.details?.bedrooms || 1,
        beds: listingData.details?.beds || 1,
        bathrooms: listingData.details?.baths || 1,
        status: "pending_review",
        source: "airbnb_import",
        source_airbnb_id: listingData.listingId,
        created_at: new Date().toISOString(),
      }).select().single();

      if (error) throw error;

      toast({
        title: "Submitted for Approval!",
        description: `"${listingData.name || "Property"}" is now pending review by our team.`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Import submit error:", err);
      toast({
        title: "Submission failed",
        description: err?.message || "Could not submit listing for approval.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Import Airbnb Listing</h2>
              <p className="text-xs text-muted-foreground">Import property details & images — set your direct rates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Lookup Input */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Airbnb Listing Link or Room ID
            </Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="https://www.airbnb.com/rooms/1041747980845934345"
                value={urlOrId}
                onChange={(e) => setUrlOrId(e.target.value)}
                className="text-xs font-mono"
              />
              <Button onClick={handleLookup} disabled={lookingUp || !urlOrId.trim()} className="gap-1.5 shrink-0">
                {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Fetch Details
              </Button>
            </div>
          </div>

          {/* Listing Details Preview & Pricing Input */}
          {listingData && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {listingData.coverPhotoUrl ? (
                    <img
                      src={listingData.coverPhotoUrl}
                      alt={listingData.name || "Cover"}
                      className="h-14 w-14 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs font-semibold">
                      No Photo
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1">
                      {listingData.name || "Untitled Listing"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {listingData.location?.locality || "Goa"} • {listingData.details?.bedrooms || 1} Bed • {listingData.details?.baths || 1} Bath • {listingData.photoUrls.length} Photos
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedPreview(!expandedPreview)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {expandedPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {expandedPreview && (
                <div className="space-y-4 pt-2 border-t border-border/60 text-xs">
                  {/* Photo Gallery Grid Preview */}
                  {listingData.photoUrls.length > 0 && (
                    <div>
                      <p className="font-medium text-muted-foreground mb-1.5">Imported Photo Gallery ({listingData.photoUrls.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {listingData.photoUrls.slice(0, 4).map((p, idx) => (
                          <img key={idx} src={p} alt={`Photo ${idx + 1}`} className="h-16 w-full object-cover rounded-md border border-border" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description preview */}
                  {listingData.description && (
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 bg-background p-2.5 rounded-lg border border-border">
                        {listingData.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Explicit Pricing Input Step */}
              <div className="rounded-xl border border-primary/20 bg-background p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
                    Set Your Direct Host Pricing (₹)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We do <strong className="text-foreground">not</strong> import third-party pricing or platform markups. Enter your direct nightly host rates below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label className="text-xs">Nightly Base Rate (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 3500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Weekend Rate (₹) (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 4200"
                      value={weekendPrice}
                      onChange={(e) => setWeekendPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleMoveForApproval}
                    disabled={submitting || !price}
                    className="w-full gap-2 py-5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting for Approval...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Move for Approval
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Import Transparency Policy Disclosures */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Wayzyy Property Import & Verification Policy
              </span>
              <Link
                to="/policies/property-import-policy"
                target="_blank"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Read Full Policy →
              </Link>
            </div>
            <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-foreground">No Scraping of Reviews:</strong> We do not import third-party guest ratings or reviews. All reviews on Wayzyy represent verified stays on our platform.
              </li>
              <li>
                <strong className="text-foreground">Direct Pricing Control:</strong> Hosts specify their direct night rates without mandatory platform markups or hidden fees.
              </li>
              <li>
                <strong className="text-foreground">Manual Verification:</strong> Every imported listing is reviewed by our team before going live.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
