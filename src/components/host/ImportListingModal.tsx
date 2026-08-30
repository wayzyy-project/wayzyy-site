import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Download, Search, Loader2, CheckCircle2, ShieldCheck, IndianRupee, X, ChevronDown, ChevronUp, AlertCircle, Sparkles, Mail, UserCheck, Eye, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { triggerHostApprovalEmail } from "@/lib/sendHostApprovalEmail";
import { AMENITIES, matchKnownAmenities } from "@/lib/amenities";

/**
 * When set, the imported listing is filed under this host instead of the
 * signed-in user. Used by the admin onboarding queue to import properties
 * on behalf of a host who chose the "we do it for you" path - they sent us
 * their listing links and expect the finished listings to appear in their
 * own dashboard, not ours.
 */
export type ImportTargetHost = {
  id: string;
  email: string;
  name: string;
};

interface ImportListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accessToken?: string | null;
  targetHost?: ImportTargetHost | null;
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
  amenities?: string[];
  selfCheckIn?: boolean;
  petsAllowed?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  state?: string | null;
}

// AirROI's amenity strings are free-text and won't exactly match our
// canonical AMENITIES list - reuse the app's existing, more thorough
// alias-based normalizer (already relied on by AdminAirroiImport.tsx)
// rather than a second, weaker matcher, then narrow to the checkbox list.
// Anything that doesn't match a known amenity is dropped - hosts can still
// add it manually via the toggle chips.
function mapAirroiAmenities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const strings = raw.filter((entry): entry is string => typeof entry === "string");
  return matchKnownAmenities(strings);
}

// AirROI descriptions arrive as an unbroken wall of text with "◆" section
// markers and no line breaks between merged sentences (e.g.
// "One king-sized bedEnsuite bathroomAC"). This is a readability pass, not
// perfect formatting - insert a newline before each "◆" marker, and before a
// capital letter that directly follows a lowercase letter with no
// intervening space/punctuation.
function cleanupImportedDescription(text: string | null | undefined): string {
  if (!text) return "";
  return text
    // AirROI/scraped descriptions sometimes arrive as raw HTML fragments
    // (house rules in particular come through with literal "<br />" tags) -
    // convert those to real line breaks and strip anything else that looks
    // like a tag before it ever reaches the editable textarea, otherwise
    // "<br />" shows up verbatim as text in the admin preview and in the
    // property that actually gets saved.
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/\s*◆\s*/g, "\n◆ ")
    .replace(/([a-z])([A-Z])/g, "$1\n$2")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function ImportListingModal({ isOpen, onClose, onSuccess, accessToken: propAccessToken, targetHost }: ImportListingModalProps) {
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
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(true);
  // Goa listings legally need this to operate, but it's never available at
  // import time from Airbnb/AirROI, so it's offered here rather than
  // required - fill it in if you have it, or come back to it later from
  // the listing's Details tab once it's imported.
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [dontHaveRegistration, setDontHaveRegistration] = useState(false);

  // Every host account (existing & new) has 1-Click Import access enabled by default (up to 5 properties)
  const isAdmin = user?.email === "hello@wayzyy.com";
  const isApproved = true;

  useEffect(() => {
    if (isOpen && user) {
      setAccessState("approved");
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
        // rather than returning them at the top level - read from there.
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
            amenities: listing.amenities,
            selfCheckIn: listing.selfCheckIn,
            petsAllowed: listing.petsAllowed,
            latitude: listing.latitude,
            longitude: listing.longitude,
            city: listing.city,
            state: listing.state,
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
          "Automated AirROI details lookup was unavailable. Property pre-filled with your Airbnb Room ID below - please review title & set your direct rates."
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
      setDescription(cleanupImportedDescription(fetchedResult.description));
      setAmenities(mapAirroiAmenities(fetchedResult.amenities));

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

    // Admin importing on a host's behalf skips pricing entirely - it's a
    // draft until the host prices and approves it themselves.
    if (!targetHost) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        toast({ title: "Pricing required", description: "Please enter a valid nightly rate for this property.", variant: "destructive" });
        return;
      }
    }

    const numPrice = targetHost ? 0 : Number(price);
    const numWeekendPrice = targetHost ? 0 : (weekendPrice ? Number(weekendPrice) : numPrice);

    setSubmitting(true);
    try {
      const photos = listingData.photoUrls || [];
      const coverPhoto = listingData.coverPhotoUrl || photos[0] || "";
      const city = listingData.city || listingData.location?.locality || "Goa";
      // No "Goa" fallback here - this platform now imports from outside
      // Goa too (this exact listing is in Rishikesh), and silently
      // mislabeling an unknown state as Goa is worse than leaving it blank
      // for the host/admin to notice and fill in.
      const state = listingData.state || listingData.location?.region || "";
      const bedrooms = listingData.details?.bedrooms || 1;
      const finalTitle = title || listingData.name || "Imported Airbnb Property";
      const finalDescription = description || listingData.description || "";

      // submit-listing is the canonical submission pipeline (same one the
      // manual wizard uses in HostPortal.tsx) - it validates and writes the
      // property row server-side. AirROI doesn't provide the wizard-only
      // fields below (placeType, street, registration, etc.), so we fill in
      // sensible defaults consistent with emptyForm in HostPortal.tsx.
      // Pricing and reviews are deliberately never imported from AirROI - 
      // price/weekendPrice stay host-entered, and no review data exists on
      // the AirROI preview to import in the first place.
      const { data: result, error: fnError } = await supabase.functions.invoke("submit-listing", {
        body: {
          listingData: {
            title: finalTitle,
            description: finalDescription,
            price: String(numPrice),
            weekendPrice: String(numWeekendPrice),
            placeType: "villa",
            spaceType: "entire",
            street: listingData.location?.locality || "",
            city,
            state,
            pincode: "",
            registrationNumber: registrationNumber.trim(),
            // The original Airbnb room ID this was looked up from, so the
            // saved property can link back to the source listing - not
            // set for a manual draft (listingData.isManualDraft).
            sourceAirbnbId: listingData.isManualDraft ? null : listingData.listingId,
            latitude: listingData.latitude ?? null,
            longitude: listingData.longitude ?? null,
            maxGuests: listingData.details?.guests || 2,
            bedrooms,
            beds: listingData.details?.beds || 1,
            bathrooms: listingData.details?.baths || 1,
            sleepingArrangements: Array.from({ length: bedrooms }, (_, i) => ({
              name: `Bedroom ${i + 1}`,
              beds: [{ type: "Double bed", count: 1 }],
            })),
            cancelPolicy: "Flexible",
            cancelPolicyLongTerm: "Firm",
            amenities,
            photos,
            instantBook: false,
            selfCheckIn: listingData.selfCheckIn ?? false,
            checkInTime: "3:00 PM",
            checkOutTime: "11:00 AM",
          },
          // Files the listing under the target host when an admin is
          // importing on someone's behalf, otherwise under the signed-in
          // user as normal.
          hostEmail: targetHost?.email ?? user.email ?? "",
          hostName: targetHost?.name || user.user_metadata?.full_name || listingData.hostName || "Host",
          hostId: targetHost?.id ?? user.id,
          // Tells submit-listing to skip the Goa Tourism Registration
          // Number requirement. That number is never actually available at
          // import time (registrationNumber is always "" above - it isn't
          // something Airbnb/AirROI exposes), so the check was hard-failing
          // every single Goa import. The listing still lands as
          // pending_review either way; registration can be collected before
          // it's actually published rather than blocking the import itself.
          isImport: true,
          // Only takes effect when the caller is actually the admin - the
          // function re-derives that from the JWT, this is just the signal
          // that this particular import should skip pricing.
          isDraftImport: Boolean(targetHost),
        },
      });

      if (fnError) {
        let message = fnError.message ?? "Submission failed";
        try {
          const body = await (fnError as any).context?.json?.();
          if (body?.error) message = body.error;
        } catch {
          // ignore - fall back to generic message
        }
        throw new Error(message);
      }
      if (!result?.success) throw new Error(result?.error ?? "Submission failed");

      // Also save locally so it immediately shows up on dashboard - this is
      // only an optimistic supplement now; the edge function call above is
      // the source of truth and its errors are surfaced to the user.
      // Skipped entirely when importing on someone else's behalf: the
      // listing belongs in their dashboard, and writing it to the admin's
      // local cache would show it as the admin's own property.
      if (!targetHost) {
        const localKey = `wayzyy_user_listings_${user.id}`;
        const existingRaw = localStorage.getItem(localKey);
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        existingList.unshift({
          id: `prop_${Date.now()}`,
          title: finalTitle,
          description: finalDescription,
          price: numPrice,
          weekend_price: numWeekendPrice,
          status: "pending_review",
          city,
          cover_image: coverPhoto,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(localKey, JSON.stringify(existingList));
      }

      toast({
        title: targetHost ? "Imported for host" : "Submitted for Approval! 🚀",
        description: targetHost
          ? `"${finalTitle}" now sits in ${targetHost.name || targetHost.email}'s dashboard.`
          : `"${finalTitle}" is now pending review by our team. Check your email for confirmation, or visit your listings page shortly.`,
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
        data-lenis-prevent
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
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {targetHost ? "Import for host" : "Import Airbnb Listing"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {targetHost
                      ? "This listing will be filed under their account, not yours"
                      : "Import property details & images - set your direct rates"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Whose account this lands in. Deliberately loud - importing
                into the wrong host's dashboard is quiet and annoying to undo. */}
            {targetHost && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-ember/40 bg-ember/10 p-3.5">
                <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Importing into {targetHost.name || targetHost.email}'s account
                  </p>
                  <p className="mt-0.5 text-muted-foreground">{targetHost.email}</p>
                </div>
              </div>
            )}

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
                {lookingUp && (
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/40 p-5 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-sm font-medium text-foreground">Fetching your listing…</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This can take a few minutes. You can check out our{" "}
                      <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>{" "}
                      or our{" "}
                      <Link to="/host-terms" target="_blank" className="text-primary underline">Host Policy</Link>{" "}
                      while you wait, or just leave this open — it'll keep going in the background.
                    </p>
                  </div>
                )}
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

                {/* How it'll actually look - not the raw editable fields
                    below, but a real preview: photos in order, title,
                    location, and the description as guests would actually
                    read it (post-cleanup, no stray HTML). This is what was
                    missing before an admin clicked import - the raw field
                    editor doesn't tell you if a description still has
                    "<br />" sitting in it or if the wrong photo got picked
                    as the cover. */}
                <div className="mx-auto max-w-[240px] rounded-[2rem] border-4 border-foreground/10 bg-background p-1.5 shadow-lg">
                  <div className="flex items-center justify-center gap-1 pb-1">
                    <Eye className="h-3 w-3 text-primary" />
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-primary">How it'll look</span>
                  </div>
                  <div data-lenis-prevent className="max-h-[420px] overflow-y-auto rounded-[1.5rem] border border-border">
                    {(listingData.photoUrls?.length ?? 0) > 0 ? (
                      <img src={listingData.photoUrls[0]} alt="" className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-[10px] text-muted-foreground">
                        <Home className="h-5 w-5" />
                      </div>
                    )}
                    <div className="space-y-2 p-2.5">
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">{title || listingData.name || "Untitled listing"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {[listingData.city || listingData.location?.locality, listingData.state || listingData.location?.region].filter(Boolean).join(", ") || "Location not set"}
                        </p>
                      </div>
                      {description && (
                        <p className="text-[10px] text-muted-foreground whitespace-pre-line line-clamp-6 border-t border-border pt-2">
                          {description}
                        </p>
                      )}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 border-t border-border pt-2">
                          {amenities.slice(0, 6).map((a) => (
                            <span key={a} className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{a}</span>
                          ))}
                          {amenities.length > 6 && <span className="text-[9px] text-muted-foreground">+{amenities.length - 6} more</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  {(listingData.photoUrls?.length ?? 0) > 1 && (
                    <p className="pt-1 text-center text-[9px] text-muted-foreground">+{listingData.photoUrls.length - 1} more photos imported</p>
                  )}
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
                        <div data-lenis-prevent className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1">
                          {listingData.photoUrls.map((p, idx) => (
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

                    {/* Amenities - pre-checked from AirROI's best-effort match, but
                        always host-editable since this is a review step, not a locked import. */}
                    <div>
                      <p className="font-medium text-muted-foreground mb-1.5">Amenities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {AMENITIES.map((a) => {
                          const active = amenities.includes(a);
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() =>
                                setAmenities((prev) =>
                                  prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                                )
                              }
                              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                                active
                                  ? "border-ember bg-ember/10 text-ember"
                                  : "border-border text-muted-foreground hover:border-foreground/30"
                              }`}
                            >
                              {a}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Host Pricing Step - skipped entirely for an admin
                    import-for-host. Pricing is the host's own call, not
                    admin's to guess at on their behalf - the property lands
                    as a draft, and the host sets nightly + weekend rate
                    themselves from their dashboard before it moves to
                    review. */}
                {!targetHost && (
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

                  {/* Only Goa currently requires this, and only to actually
                      operate - never to import, review, or publish. Offered
                      here so a host who has it can add it in one pass, with
                      an explicit out for the (common) case of not having it
                      yet - our team follows up, and it stays editable from
                      the listing's Details tab afterward either way.
                      Was defaulting to "Goa" whenever AirROI didn't return a
                      state at all, which showed this field on non-Goa
                      imports (e.g. Rishikesh) - only show it when the
                      listing is actually confirmed Goa. */}
                  {(listingData?.state ?? "").trim().toLowerCase() === "goa" && (
                    <div className="space-y-2 border-t border-border pt-3">
                      <Label className="text-xs font-semibold">Goa Tourism Registration Number</Label>
                      <Input
                        placeholder="e.g. GT/SDE/123/2026"
                        value={registrationNumber}
                        disabled={dontHaveRegistration}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="text-xs disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={dontHaveRegistration}
                          onChange={(e) => {
                            setDontHaveRegistration(e.target.checked);
                            if (e.target.checked) setRegistrationNumber("");
                          }}
                          className="h-3.5 w-3.5 rounded border-border"
                        />
                        I don't have this yet — our team will help me sort it out
                      </label>
                    </div>
                  )}

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
                )}

                {/* Admin import-for-host: no pricing step here at all - the
                    listing lands as a draft in the host's dashboard, and
                    they set nightly + weekend pricing and approve it
                    themselves before it goes to review. */}
                {targetHost && (
                  <div className="rounded-2xl border border-primary/30 bg-background p-4 space-y-3 shadow-xs">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This imports as a draft in <strong className="text-foreground">{targetHost.name || targetHost.email}</strong>'s dashboard.
                      They'll set their own pricing and approve it before it goes to review — nothing to fill in here.
                    </p>
                    <div className="pt-1">
                      <Button
                        onClick={handleMoveForApproval}
                        disabled={submitting}
                        className="w-full gap-2 py-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider"
                      >
                        {submitting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4" /> Import as Draft for Host</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
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
