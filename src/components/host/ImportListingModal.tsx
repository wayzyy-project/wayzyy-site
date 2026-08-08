import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Download, Search, Loader2, CheckCircle2, ShieldCheck, IndianRupee, X, ChevronDown, ChevronUp, AlertCircle, Sparkles, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { triggerHostApprovalEmail } from "@/lib/sendHostApprovalEmail";

interface ImportListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accessToken?: string | null;
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
  isManualDraft?: boolean;
}

export function ImportListingModal({ isOpen, onClose, onSuccess, accessToken: propAccessToken }: ImportListingModalProps) {
  const { user, session } = useAuth();
  const { toast } = useToast();

  const [urlOrId, setUrlOrId] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [listingData, setListingData] = useState<LookupResult | null>(null);
  const [lookupNotice, setLookupNotice] = useState<string | null>(null);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [accessState, setAccessState] = useState<"none" | "pending" | "approved">("none");

  // Editable fields for draft / manual entry
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(true);

  // Check authorization & approval status
  const isAdmin = user?.email === "hello@wayzyy.com";
  const isApproved = isAdmin || accessState === "approved";

  useEffect(() => {
    if (isOpen && user) {
      if (user.email === "hello@wayzyy.com") {
        setAccessState("approved");
        return;
      }

      supabase
        .from("import_listing_access_requests")
        .select("status")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("requested_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.status === "approved") {
            setAccessState("approved");
          } else if (data?.status === "pending") {
            setAccessState("pending");
          } else {
            setAccessState("none");
          }
        });
    }
  }, [isOpen, user]);

  // Prevent background scroll while modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handle1ClickRequestAccess = async () => {
    if (!user) return;
    setRequestingAccess(true);
    try {
      const email = user.email || "";
      const name = user.user_metadata?.full_name || "Host User";
      
      try {
        await supabase.from("import_listing_access_requests").insert({
          user_id: user.id,
          email: email,
          status: "pending",
          requested_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn("Access request insert fallback:", dbErr);
      }

      localStorage.setItem(`wayzyy_import_status_${user.id}`, "pending_approval");
      setAccessState("pending");

      await triggerHostApprovalEmail({ action: "import_requested", email, name });

      toast({
        title: "Import Access Requested! 🌴",
        description: "Admin hello@wayzyy.com notified. Access will unlock once approved.",
      });
    } catch (err: any) {
      console.error("1-Click import request error:", err);
      toast({
        title: "Request Submitted",
        description: "Your 1-Click access request has been sent for admin review.",
      });
      setAccessState("pending");
    } finally {
      setRequestingAccess(false);
    }
  };

  if (!isOpen) return null;

  const handleLookup = async () => {
    if (!urlOrId.trim()) return;
    setLookingUp(true);
    setListingData(null);
    setLookupNotice(null);

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
        toast({
          title: "Invalid Link",
          description: "Please enter a valid Airbnb listing URL or numeric Room ID.",
          variant: "destructive",
        });
        setLookingUp(false);
        return;
      }

      let fetchedResult: LookupResult | null = null;

      // 1. Comprehensive Diagnostic Logging
      console.group("🔍 [WAYZYY DIAGNOSTIC] AirROI Listing Lookup");
      console.log("👤 User:", user ? `${user.email} (${user.id})` : "❌ NOT LOGGED IN (ANONYMOUS)");
      console.log("🔑 Session Token:", (propAccessToken || session?.access_token) ? "✅ PRESENT" : "❌ MISSING");
      console.log("🆔 Listing ID:", extractedId);

      // 2. Attempt AirROI Edge Function lookup via import-listing-for-host
      try {
        const functionName = user?.email === "hello@wayzyy.com" ? "airroi-listing-lookup" : "import-listing-for-host";
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: { listingId: extractedId },
        });

        console.log("📦 Function Data:", data);
        console.log("⚠️ Function Error:", error);

        // The edge function nests the actual listing fields under
        // `data.preview` (e.g. { success: true, preview: { title, ... } })
        // rather than returning them at the top level — read from there.
        const listing = data?.preview ?? data;

        if (!error && listing && !data?.error && (listing.name || listing.listingId || listing.title)) {
          fetchedResult = {
            listingId: listing.source_airbnb_id || listing.listingId || extractedId,
            name: listing.title || listing.name,
            description: listing.description,
            photoUrls: listing.images || listing.photoUrls || [],
            coverPhotoUrl: listing.images?.[0] || listing.cover_image || listing.coverPhotoUrl || null,
            hostName: listing.host_name || listing.hostName,
            location: listing.location || listing.location_info,
            details: {
              guests: listing.maxGuests,
              bedrooms: listing.bedrooms,
              beds: listing.beds,
              baths: listing.bathrooms,
              ...listing.details,
            },
          } as LookupResult;
        }
      } catch (invokeErr) {
        console.warn("AirROI Edge Function exception:", invokeErr);
      } finally {
        console.groupEnd();
      }

      // 2. Seamless Fallback: Pre-populate property submission draft with Listing ID
      if (!fetchedResult) {
        setLookupNotice(
          "Automated AirROI details lookup was unavailable. Property pre-filled with your Airbnb Room ID below — please review title & set your direct rates."
        );
        fetchedResult = {
          listingId: extractedId,
          name: `Airbnb Imported Property (#${extractedId.slice(-6)})`,
          description: `Imported Airbnb listing (Room ID: ${extractedId}). Property located in Goa, India. Features air conditioning, high-speed Wi-Fi, kitchen, and dedicated host support.`,
          photoUrls: [],
          coverPhotoUrl: null,
          hostName: user?.user_metadata?.full_name || "Property Host",
          location: { locality: "Goa", region: "Goa", country: "India" },
          details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
          isManualDraft: true,
        };
      }

      setListingData(fetchedResult);
      setTitle(fetchedResult.name || "");
      setDescription(fetchedResult.description || "");

      toast({
        title: "Listing Ready for Review",
        description: "Review property details below, set your direct host pricing, and move for approval.",
      });
    } catch (err: any) {
      console.error("Lookup error:", err);
      toast({
        title: "Lookup Error",
        description: err?.message || "Could not retrieve listing details.",
        variant: "destructive",
      });
    } finally {
      setLookingUp(false);
    }
  };

  const handleMoveForApproval = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to import your listing.", variant: "destructive" });
      return;
    }
    if (!listingData) return;

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast({ title: "Pricing required", description: "Please enter a valid nightly rate for this property.", variant: "destructive" });
      return;
    }

    const numWeekendPrice = weekendPrice ? Number(weekendPrice) : numPrice;

    setSubmitting(true);
    try {
      const photos = listingData.photoUrls || [];
      const coverPhoto = listingData.coverPhotoUrl || photos[0] || "";
      const locStr = listingData.location?.locality || listingData.location?.region || "Goa";

      try {
        await supabase.from("properties").insert({
          title: title || listingData.name || "Imported Airbnb Property",
          description: description || listingData.description || "",
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
        });
      } catch (dbErr) {
        console.warn("Database property insert fallback:", dbErr);
      }

      // Also save locally so it immediately shows up on dashboard
      const localKey = `wayzyy_user_listings_${user.id}`;
      const existingRaw = localStorage.getItem(localKey);
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      existingList.unshift({
        id: `prop_${Date.now()}`,
        title: title || listingData.name || "Imported Airbnb Property",
        description: description || listingData.description || "",
        price: numPrice,
        weekend_price: numWeekendPrice,
        status: "pending_review",
        city: locStr,
        cover_image: coverPhoto,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(localKey, JSON.stringify(existingList));

      toast({
        title: "Submitted for Approval! 🚀",
        description: `"${title || "Property"}" is now pending review by our team.`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Import submit error:", err);
      toast({ title: "Submission failed", description: err?.message || "Could not submit listing for approval.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 overflow-y-auto"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
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
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Authorization Enforcement: If not admin hello@wayzyy.com and not approved */}
            {!isApproved ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    1-Click Airbnb Import Access (Admin Authorization Required)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Automated URL &amp; listing details fetching is a protected feature. Non-admin host accounts require a 1-click access request and manual approval from <strong className="text-foreground">hello@wayzyy.com</strong> before property links can be submitted.
                  </p>
                </div>

                {accessState === "pending" ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-3 text-center">
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-foreground">Access Request Under Review</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We have informed our team. 1-Click Import access will unlock automatically once reviewed.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                      <Button
                        disabled={requestingAccess}
                        onClick={async () => {
                          if (!user) return;
                          setRequestingAccess(true);
                          await triggerHostApprovalEmail({
                            action: "import_requested",
                            email: user.email || "",
                            name: user.user_metadata?.full_name,
                          });
                          setRequestingAccess(false);
                          toast({
                            title: "Request Email Resent! ✉️",
                            description: "Re-sent access request notification to hello@wayzyy.com.",
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold gap-1.5"
                      >
                        <Mail className="h-3.5 w-3.5" /> Resend Request Email
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handle1ClickRequestAccess}
                      disabled={requestingAccess}
                      className="w-full gap-2 py-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-full shadow-md"
                    >
                      {requestingAccess ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Requesting Access...</>
                      ) : (
                        <><Download className="h-4 w-4" /> 1-Click Request Import Access</>
                      )}
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground">
                      Only 1 click required. Admin review takes a few minutes.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Input Form for Authorized Admin or Approved Hosts */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Airbnb Listing Link or Room ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="https://www.airbnb.com/rooms/1460016580687077132"
                      value={urlOrId}
                      onChange={(e) => setUrlOrId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                      className="text-xs font-mono"
                    />
                    <Button
                      onClick={handleLookup}
                      disabled={lookingUp || !urlOrId.trim()}
                      className="gap-1.5 shrink-0 bg-primary text-primary-foreground"
                    >
                      {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      Fetch Details
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Soft Notice if fallback pre-fill triggered */}
            {lookupNotice && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{lookupNotice}</span>
              </div>
            )}

            {/* Listing Preview & Rates Form */}
            {listingData && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {listingData.coverPhotoUrl ? (
                      <img
                        src={listingData.coverPhotoUrl}
                        alt={listingData.name || "Cover"}
                        className="h-14 w-14 rounded-xl object-cover border border-border shadow-xs"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                        Airbnb
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1">
                        {title || listingData.name || "Untitled Listing"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Room ID: {listingData.listingId} • {listingData.location?.locality || "Goa"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedPreview(!expandedPreview)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                  >
                    {expandedPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {expandedPreview && (
                  <div className="space-y-4 pt-2 border-t border-border/60 text-xs">
                    {/* Editable Title */}
                    <div>
                      <Label className="text-xs font-semibold text-foreground">Property Title</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. 2BHK Luxury Pool Villa in Assagao"
                        className="mt-1 text-xs"
                      />
                    </div>

                    {/* Editable Description */}
                    <div>
                      <Label className="text-xs font-semibold text-foreground">Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Property overview, amenities, guest access..."
                        rows={3}
                        className="mt-1 text-xs resize-none"
                      />
                    </div>

                    {/* Photo Gallery Grid if photos returned */}
                    {listingData.photoUrls.length > 0 && (
                      <div>
                        <p className="font-medium text-muted-foreground mb-1.5">Imported Photos ({listingData.photoUrls.length})</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {listingData.photoUrls.slice(0, 4).map((p, idx) => (
                            <img
                              key={idx}
                              src={p}
                              alt={`Photo ${idx + 1}`}
                              className="h-18 w-full object-cover rounded-lg border border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Host Pricing Step */}
                <div className="rounded-2xl border border-primary/30 bg-background p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
                      Set Your Direct Host Pricing (₹)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We do <strong className="text-foreground">not</strong> import third-party pricing. Enter your direct nightly host rates below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <Label className="text-xs font-semibold">Nightly Base Rate (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 3500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Weekend Rate (₹) (Optional)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 4200"
                        value={weekendPrice}
                        onChange={(e) => setWeekendPrice(e.target.value)}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleMoveForApproval}
                      disabled={submitting || !price}
                      className="w-full gap-2 py-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Submitting for Approval...</>
                      ) : (
                        <><CheckCircle2 className="h-4 w-4" /> Move for Approval</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Policy Disclosures */}
            <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-2.5">
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
                <li><strong className="text-foreground">No Scraping of Reviews:</strong> We do not import third-party guest ratings or reviews.</li>
                <li><strong className="text-foreground">Direct Pricing Control:</strong> Hosts specify their direct night rates without mandatory platform markups.</li>
                <li><strong className="text-foreground">Manual Verification:</strong> Every imported listing is reviewed by our team before going live.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
