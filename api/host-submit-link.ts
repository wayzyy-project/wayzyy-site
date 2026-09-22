import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Lets a host send us a listing link to import on their behalf, separate
// from self-serve "Import Listing" (that pulls it in immediately; this
// just tells our team about it - for a host past their self-serve limit,
// or one who'd rather not deal with the import flow themselves).
//
// Appends to the same host_onboarding_submissions.property_urls array the
// one-time onboarding form writes to, rather than a new table - AdminHosts'
// pendingLinks logic already reads that array and diffs it against
// imported properties, so a link submitted here shows up in the "links to
// import" queue automatically, no admin-side changes needed.
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
    console.error("host-submit-link: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing authorization" });
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return res.status(401).json({ error: "Not authenticated" });

  const { url } = (req.body ?? {}) as { url?: string };
  const trimmed = (url ?? "").trim();
  if (!trimmed) return res.status(400).json({ error: "A listing URL is required" });
  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return res.status(400).json({ error: "That doesn't look like a valid URL - paste the full listing link, starting with https://" });
  }

  const { data: existing, error: fetchErr } = await admin
    .from("host_onboarding_submissions")
    .select("id, property_urls")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (fetchErr) return res.status(500).json({ error: fetchErr.message });

  const { data: profile } = await admin.from("profiles").select("name, phone").eq("id", user.id).maybeSingle();

  if (existing) {
    const urls = existing.property_urls ?? [];
    if (!urls.includes(trimmed)) {
      const { error: updateErr } = await admin
        .from("host_onboarding_submissions")
        .update({ property_urls: [...urls, trimmed] })
        .eq("id", existing.id);
      if (updateErr) return res.status(500).json({ error: updateErr.message });
    }
  } else {
    const { error: insertErr } = await admin.from("host_onboarding_submissions").insert({
      full_name: profile?.name || user.user_metadata?.full_name || "Host",
      email: user.email || "",
      phone: profile?.phone || "",
      property_urls: [trimmed],
      status: "received",
      user_id: user.id,
    });
    if (insertErr) return res.status(500).json({ error: insertErr.message });
  }

  if (process.env.ZEPTOMAIL_API_KEY) {
    const hostName = profile?.name || user.user_metadata?.full_name || user.email || "A host";
    const safeHost = escapeHtml(hostName);
    const safeUrl = escapeHtml(trimmed);
    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#ff6b00;">Link to import</p>
          <h2 style="margin:0 0 16px;color:#111;">${safeHost} sent a listing link</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#444;word-break:break-all;">${safeUrl}</p>
          <div style="text-align:center;margin-top:8px;">
            <a href="https://wayzyy.com/adminn/hosts" style="display:inline-block;background:#ff6b00;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;">
              Open admin hosts →
            </a>
          </div>
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
        subject: `[Link to import] ${hostName} sent a listing`,
        html,
      });
    } catch (err: any) {
      console.error("host-submit-link: admin email failed", err?.message);
    }
  } else {
    console.error("host-submit-link: ZEPTOMAIL_API_KEY not set, admin was not notified");
  }

  return res.status(200).json({ ok: true });
}
