import type { VercelRequest, VercelResponse } from "@vercel/node";

// Escapes user-supplied text before it's interpolated into the HTML email
// body — mirrors the same helper used in api/waitlist.ts.
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

type GigChallengePayload = {
  bookingRef?: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  status?: string;
  writtenPitch: string;
  techniques?: string[];
  safetyApproach?: string;
  metrics?: string;
  costEstimate?: string;
  pastWorkRepo?: string;
  videoLink: string;
  availability?: string;
  earliestStartDate?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as GigChallengePayload;

  if (!body.fullName || !body.email || !body.email.includes("@") || !body.writtenPitch || !body.videoLink) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("gig-challenge: Supabase env vars are not configured");
    return res.status(500).json({ error: "Storage not configured" });
  }

  // The application itself is the thing that must not get lost, so the
  // Supabase insert is the required step — unlike the waitlist's best-effort
  // insert, a failure here fails the whole request instead of failing silently.
  try {
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/gig_challenge_applications`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        booking_ref: body.bookingRef,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        linkedin: body.linkedin,
        github: body.github,
        status: body.status,
        written_pitch: body.writtenPitch,
        techniques: body.techniques,
        safety_approach: body.safetyApproach,
        metrics: body.metrics,
        cost_estimate: body.costEstimate,
        past_work_repo: body.pastWorkRepo,
        video_link: body.videoLink,
        availability: body.availability,
        earliest_start_date: body.earliestStartDate,
      }),
    });

    if (!insertRes.ok) {
      throw new Error(`Supabase insert error: ${insertRes.status} - ${await insertRes.text()}`);
    }
  } catch (err) {
    console.error("gig-challenge: failed to save application:", err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "Failed to save application" });
  }

  // The applicant's thank-you email is best-effort — the application is
  // already saved above, so a flaky email send shouldn't surface as a
  // failure to someone who just successfully submitted.
  if (process.env.ZEPTOMAIL_API_KEY) {
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 12px;">
        <h2 style="font-size: 24px; color: #1a1a1a; margin-bottom: 8px;">Thank you for your submission</h2>
        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          Hi ${escapeHtml(body.fullName)}, we've received your pitch and video walkthrough for the
          Wayzyy solo developer challenge. Our engineering team reviews submissions on a rolling
          basis and you'll hear back within 48–72 hours.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px; width: 140px;">Booking Reference</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold;">${escapeHtml(body.bookingRef)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Submitted</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa; margin: 0;">Wayzyy — stays without the small print.</p>
      </div>
    `;

    try {
      await sendViaZepto({
        from: "Wayzyy <noreply@wayzyy.com>",
        to: body.email,
        subject: "Thank you for your submission — Wayzyy Gig Challenge",
        html: emailHtml,
      });
    } catch (err) {
      console.error("gig-challenge: confirmation email failed (non-fatal):", err instanceof Error ? err.message : err);
    }
  } else {
    console.error("gig-challenge: ZEPTOMAIL_API_KEY is not configured, skipping confirmation email");
  }

  return res.status(200).json({ ok: true });
}
