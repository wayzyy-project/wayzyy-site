import type { VercelRequest, VercelResponse } from "@vercel/node";

// Escapes user-supplied text before it's interpolated into the HTML email
// body — mirrors the same helper used in api/gig-challenge.ts.
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

type HostOnboardingPayload = {
  fullName: string;
  email: string;
  phone: string;
  airbnbProfileUrl?: string;
  propertyUrls?: string;
  agreedToTerms: boolean;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as HostOnboardingPayload;

  if (!body.fullName || !body.email || !body.email.includes("@") || !body.phone || !body.agreedToTerms) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const hasAirbnb = !!body.airbnbProfileUrl?.trim();
  const hasUrls = !!body.propertyUrls?.trim();
  if (!hasAirbnb && !hasUrls) {
    return res.status(400).json({ error: "Provide either an Airbnb profile link or at least one property URL" });
  }

  const propertyUrls = body.propertyUrls
    ? body.propertyUrls.split(",").map((u) => u.trim()).filter(Boolean)
    : [];

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("host-onboarding: Supabase env vars are not configured, logging submission in dev mode:", body.email);
    return res.status(200).json({ ok: true, devMode: true });
  }

  try {
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/host_onboarding_submissions`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        airbnb_profile_url: body.airbnbProfileUrl || null,
        property_urls: propertyUrls,
      }),
    });

    if (!insertRes.ok) {
      console.error(`host-onboarding: Supabase insert warning (${insertRes.status}):`, await insertRes.text());
    }
  } catch (err) {
    console.error("host-onboarding: DB insert error (non-fatal):", err instanceof Error ? err.message : err);
  }

  if (process.env.ZEPTOMAIL_API_KEY) {
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 12px;">
        <h2 style="font-size: 24px; color: #1a1a1a; margin-bottom: 8px;">Thanks for submitting your properties</h2>
        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          Hi ${escapeHtml(body.fullName)}, it's great to have you with us. We've received your
          submission and our team will verify your properties before they go live on Wayzyy.
          You'll hear from us by email and phone with updates.
        </p>
        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          As a small token of thanks for being with us this early, we'll be sending you a welcome
          kit soon.
        </p>
        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          Want to check where things stand? Head to
          <a href="https://wayzyy.com/host-onboarding/status" style="color: #1a1a1a; font-weight: bold;">wayzyy.com/host-onboarding/status</a>
          and enter this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa; margin: 0;">Wayzyy — stays without the small print.</p>
      </div>
    `;

    try {
      await sendViaZepto({
        from: "Wayzyy <hello@wayzyy.com>",
        to: body.email,
        subject: "Thanks for submitting your properties — Wayzyy",
        html: emailHtml,
      });
    } catch (err) {
      console.error("host-onboarding: confirmation email failed (non-fatal):", err instanceof Error ? err.message : err);
    }
  } else {
    console.error("host-onboarding: ZEPTOMAIL_API_KEY is not configured, skipping confirmation email");
  }

  return res.status(200).json({ ok: true });
}
