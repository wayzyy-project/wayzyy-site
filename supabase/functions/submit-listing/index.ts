// Supabase Edge Function: submit-listing
// Handles manual host listing creation & 1-click imported listings from Airbnb/OTA.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmitListingPayload {
  listingData: {
    title: string;
    description?: string;
    price: number;
    weekendPrice?: number;
    placeType?: string;
    spaceType?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    registrationNumber?: string;
    latitude?: number | null;
    longitude?: number | null;
    maxGuests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    sleepingArrangements?: any[];
    cancelPolicy?: string;
    cancelPolicyLongTerm?: string;
    amenities?: string[];
    photos?: string[];
    instantBook?: boolean;
    selfCheckIn?: boolean;
    checkInTime?: string;
    checkOutTime?: string;
  };
  hostEmail: string;
  hostName: string;
  hostId: string;
  isImport?: boolean;
}

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const zeptomailKey = Deno.env.get("ZEPTOMAIL_API_KEY") ?? "";
    const zeptomailUrl = Deno.env.get("ZEPTOMAIL_API_URL") || "https://api.zeptomail.in/v1.1/email";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: SubmitListingPayload = await req.json();
    const { listingData, hostEmail, hostName, hostId, isImport } = body;

    if (!listingData || !listingData.title || !listingData.price) {
      return new Response(
        JSON.stringify({ success: false, error: "Title and price are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Validate Goa Tourism Registration Number (skipped if isImport is true)
    const isGoa =
      listingData.city?.toLowerCase().includes("goa") ||
      listingData.state?.toLowerCase().includes("goa");

    if (isGoa && !isImport && !listingData.registrationNumber?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Goa Tourism Registration Number is mandatory for live listings in Goa.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Insert listing into properties table
    const insertPayload = {
      host_id: hostId,
      title: listingData.title,
      description: listingData.description || "",
      price: listingData.price,
      weekend_price: listingData.weekendPrice || listingData.price,
      place_type: listingData.placeType || "Entire place",
      space_type: listingData.spaceType || "Villa",
      street: listingData.street || "",
      city: listingData.city || "Goa",
      state: listingData.state || "Goa",
      pincode: listingData.pincode || "",
      registration_number: listingData.registrationNumber || null,
      latitude: listingData.latitude || null,
      longitude: listingData.longitude || null,
      max_guests: listingData.maxGuests || 2,
      bedrooms: listingData.bedrooms || 1,
      beds: listingData.beds || 1,
      bathrooms: listingData.bathrooms || 1,
      sleeping_arrangements: listingData.sleepingArrangements || [],
      cancellation_policy: listingData.cancelPolicy || "Flexible",
      cancellation_policy_long_term: listingData.cancelPolicyLongTerm || "Firm",
      amenities: listingData.amenities || [],
      photos: listingData.photos || [],
      cover_image: listingData.photos?.[0] || null,
      instant_book: listingData.instantBook || false,
      self_check_in: listingData.selfCheckIn || false,
      check_in_time: listingData.checkInTime || "3:00 PM",
      check_out_time: listingData.checkOutTime || "11:00 AM",
      status: "pending_review",
      is_import: Boolean(isImport),
      created_at: new Date().toISOString(),
    };

    const { data: propData, error: propError } = await supabase
      .from("properties")
      .insert(insertPayload)
      .select()
      .single();

    if (propError) {
      console.error("Failed to insert property:", propError);
      // Fallback response with meaningful detail
      return new Response(
        JSON.stringify({ success: false, error: propError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Send email alert to admin via ZeptoMail
    if (zeptomailKey) {
      try {
        const emailHtml = `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 12px;">
            <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 8px;">
              ${isImport ? "📥 New 1-Click Imported Listing" : "🏠 New Host Listing Submitted"}
            </h2>
            <p style="color: #666; font-size: 14px;">"${listingData.title}" is now awaiting admin review.</p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #888; width: 140px;">Host:</td><td><strong>${hostName}</strong> (${hostEmail})</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Price / Night:</td><td><strong>₹${listingData.price.toLocaleString("en-IN")}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #888;">City:</td><td>${listingData.city || "Goa"}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Registration No:</td><td>${listingData.registrationNumber || (isImport ? "Imported (Pending)" : "None")}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Photos Count:</td><td>${listingData.photos?.length || 0} photos</td></tr>
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://wayzyy.com/adminn/listings" style="background: #e05c2e; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
                Review in Admin Dashboard →
              </a>
            </div>
          </div>
        `;

        await fetch(zeptomailUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Zoho-enczapikey ${zeptomailKey}`,
          },
          body: JSON.stringify({
            from: { address: "hello@wayzyy.com", name: "Wayzyy Listings" },
            to: [{ email_address: { address: "akshaykumar.sharma@wayzyy.com" } }],
            subject: `${isImport ? "[Imported]" : "[New Listing]"} ${listingData.title} by ${hostName}`,
            htmlbody: emailHtml,
          }),
        });
      } catch (mailErr) {
        console.warn("Listing notification email failed (non-fatal):", mailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, property: propData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("submit-listing error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
