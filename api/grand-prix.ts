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

type GrandPrixPayload = {
  bookingRef?: string;
  teamName?: string;
  fullName: string;
  email: string;
  hackathonTrack: string;
  pitchDeckLink: string;
  videoLink?: string;
  pitch: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as GrandPrixPayload;

  if (!body.fullName || !body.email || !body.email.includes("@") || !body.pitchDeckLink || !body.pitch || !body.hackathonTrack) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("grand-prix: Supabase env vars are not configured, logging submission in dev mode:", body.email);
    return res.status(200).json({ ok: true, devMode: true });
  }

  try {
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/grand_prix_applications`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        booking_ref: body.bookingRef,
        team_name: body.teamName,
        full_name: body.fullName,
        email: body.email,
        hackathon_track: body.hackathonTrack,
        pitch_deck_link: body.pitchDeckLink,
        video_link: body.videoLink,
        pitch: body.pitch,
      }),
    });

    if (!insertRes.ok) {
      console.error(`grand-prix: Supabase insert warning (${insertRes.status}):`, await insertRes.text());
    }
  } catch (err) {
    console.error("grand-prix: DB insert error (non-fatal):", err instanceof Error ? err.message : err);
  }

  if (process.env.ZEPTOMAIL_API_KEY) {
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; border-radius: 12px; border: 1px solid #ff6b00;">
        <h2 style="font-size: 24px; color: #ffffff; margin-bottom: 8px;">You're on the grid.</h2>
        <p style="font-size: 15px; color: #ccc; line-height: 1.6;">
          Hi ${escapeHtml(body.fullName)}, we've received your Grand Prix Hackathon submission
          ${body.teamName ? `for team <strong style="color:#ff6b00;">${escapeHtml(body.teamName)}</strong>` : ""}.
          We review every entry and you'll hear back on credits, prizes, or the $1,000/month
          opportunity within 48–72 hours.
        </p>
        <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px; width: 140px;">Booking Reference</td>
            <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${escapeHtml(body.bookingRef)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Submitted</td>
            <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; margin: 0;">Wayzyy — stays without the small print.</p>
      </div>
    `;

    try {
      await sendViaZepto({
        from: "Wayzyy <hello@wayzyy.com>",
        to: body.email,
        subject: "You're on the grid — Wayzyy Grand Prix Hackathon",
        html: emailHtml,
      });
    } catch (err) {
      console.error("grand-prix: confirmation email failed (non-fatal):", err instanceof Error ? err.message : err);
    }
  } else {
    console.error("grand-prix: ZEPTOMAIL_API_KEY is not configured, skipping confirmation email");
  }

  return res.status(200).json({ ok: true });
}
