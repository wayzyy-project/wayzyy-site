import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// When a host sets their pricing on an admin-imported draft and approves
// it, two things have to happen together: the property moves to
// pending_review, and our team gets told so someone actually does the
// final approve. Doing the update client-side (as this used to) meant the
// second half never happened - a property could sit in the review queue
// indefinitely with nobody aware it had arrived.
const ADMIN_EMAIL = "hello@wayzyy.com";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendViaZepto(payload: { from: string; to: string; subject: string; html: string }) {
  const match = payload.from.match(/^(.*?)\s*<(.*?)>$/);
  const fromAddress = match ? match[2].trim() : payload.from;
  const fromName = match ? match[1].trim() : undefined;
  const zeptomailUrl = process.env.ZEPTOMAIL_API_URL || "https://api.zeptomail.in/v1.1/email";

  const res = await fetch(zeptomailUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${process.env.ZEPTOMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      from: { address: fromAddress, name: fromName },
      to: [{ email_address: { address: payload.to } }],
      subject: payload.subject,
      htmlbody: payload.html,
    }),
  });

  if (!res.ok) {
    throw new Error(`ZeptoMail API error: ${res.status} - ${await res.text()}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("host-approve-pricing: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization" });
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return res.status(401).json({ error: "Not authenticated" });

  const { propertyId, price, weekendPrice } = (req.body ?? {}) as {
    propertyId?: string;
    price?: number;
    weekendPrice?: number;
  };

  if (!propertyId) return res.status(400).json({ error: "propertyId is required" });

  const numPrice = Number(price);
  if (!Number.isFinite(numPrice) || numPrice < 100 || numPrice > 1000000) {
    return res.status(400).json({ error: "Price must be between ₹100 and ₹10,00,000 per night" });
  }
  const numWeekend = Number(weekendPrice);
  const finalWeekend = Number.isFinite(numWeekend) && numWeekend > 0 ? numWeekend : numPrice;

  // The caller must own this property, and it must still be a draft -
  // this endpoint only ever performs the draft -> pending_review
  // transition, so it can't be used to re-price or re-submit a listing
  // that's already live or already under review.
  const { data: property, error: fetchErr } = await admin
    .from("properties")
    .select("id, title, city, state, host_id, host_email, status, source_url, imported_by_admin")
    .eq("id", propertyId)
    .maybeSingle();

  if (fetchErr) return res.status(500).json({ error: fetchErr.message });
  if (!property) return res.status(404).json({ error: "Property not found" });
  if (property.host_id !== user.id) {
    return res.status(403).json({ error: "You can only approve your own listings" });
  }
  if (property.status !== "draft") {
    return res.status(400).json({ error: "This listing is no longer awaiting your pricing" });
  }

  const { error: updateErr } = await admin
    .from("properties")
    .update({
      price_per_night: numPrice,
      weekend_price: finalWeekend,
      status: "pending_review",
    })
    .eq("id", propertyId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  // Host's own name for the email - profiles.name, falling back to their
  // auth metadata / email.
  const { data: profile } = await admin.from("profiles").select("name").eq("id", user.id).maybeSingle();
  const hostName = profile?.name || user.user_metadata?.full_name || user.email || "A host";

  if (process.env.ZEPTOMAIL_API_KEY) {
    const safeHost = escapeHtml(hostName);
    const safeTitle = escapeHtml(property.title || "Untitled listing");
    const safeLocation = escapeHtml([property.city, property.state].filter(Boolean).join(", "));
    const reviewLink = `https://wayzyy.com/adminn/review/${propertyId}`;

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#ff6b00;">Ready for final approval</p>
          <h2 style="margin:0 0 16px;color:#111;">${safeHost} approved their pricing</h2>
          <table width="100%" style="font-size:14px;color:#444;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#888;">Listing</td><td style="padding:6px 0;font-weight:600;">${safeTitle}</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Location</td><td style="padding:6px 0;">${safeLocation || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Nightly</td><td style="padding:6px 0;font-weight:600;">₹${numPrice.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Weekend</td><td style="padding:6px 0;">₹${finalWeekend.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Source</td><td style="padding:6px 0;">${property.imported_by_admin ? "Imported by our team" : "Added by host"}</td></tr>
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="${reviewLink}" style="display:inline-block;background:#ff6b00;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;">
              Review &amp; approve →
            </a>
          </div>
          ${property.source_url ? `<p style="margin:16px 0 0;text-align:center;font-size:12px;color:#aaa;">Original listing: <a href="${escapeHtml(property.source_url)}" style="color:#888;">${escapeHtml(property.source_url)}</a></p>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await sendViaZepto({
        from: "Wayzyy Listings <noreply@wayzyy.com>",
        to: ADMIN_EMAIL,
        subject: `[Ready to approve] ${hostName} priced "${property.title || "a listing"}"`,
        html,
      });
    } catch (err: any) {
      // The pricing update already succeeded - a failed notification
      // shouldn't fail the host's action, but it does need to be visible
      // in logs since it means nobody was told.
      console.error("host-approve-pricing: admin email failed", err?.message);
    }
  } else {
    console.error("host-approve-pricing: ZEPTOMAIL_API_KEY not set, admin was not notified");
  }

  return res.status(200).json({ ok: true });
}
