import type { VercelRequest, VercelResponse } from "@vercel/node";

// Escapes user-supplied text before it's interpolated into the HTML email
// body — the email is client input and otherwise dropped into a template
// literal unescaped, which lets malformed/malicious input break the email
// layout (or worse) for whoever reads it. Mirrors the same helper used in
// the wayzyy-app Supabase functions.
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

  // ZeptoMail region matters — accounts on Zoho's India org send via
  // api.zeptomail.in (confirmed live in wayzyy-app); accounts on the
  // global/US org use api.zeptomail.com.
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

  const { email, audience } = req.body as { email: string; audience: string };

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    // Persist the signup so the app can auto-grant a wallet credit the moment
    // this email registers an account. Best-effort — never blocks the waitlist
    // confirmation the visitor sees, even if this insert fails.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseServiceKey) {
      fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
        method: "POST",
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates",
        },
        body: JSON.stringify({ email, audience }),
      }).catch((e) => console.error("waitlist_signups insert failed (non-fatal):", e));
    }

    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 12px;">
        <h2 style="font-size: 24px; color: #1a1a1a; margin-bottom: 8px;">
          New ${audience === "host" ? "🏠 Host" : "✈️ Traveler"} on the waitlist
        </h2>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px; width: 120px;">Email</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Signed up as</td>
            <td style="padding: 8px 0; color: #e05c2e; font-size: 14px; font-weight: bold;">${audience === "host" ? "Host" : "Traveler"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Time</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa; margin: 0;">Wayzyy — stays without the small print.</p>
      </div>
    `;

    // "noreply@wayzyy.com" is the domain-verified sender used consistently
    // across every wayzyy-app email function.
    const from = "Wayzyy Waitlist <noreply@wayzyy.com>";
    const to = "akshaykumar.sharma@wayzyy.com";
    const subject = `New ${audience === "host" ? "Host" : "Traveler"} joined the waitlist`;

    if (!process.env.ZEPTOMAIL_API_KEY) {
      console.error("waitlist: ZEPTOMAIL_API_KEY is not configured");
      return res.status(500).json({ error: "Email not configured" });
    }

    try {
      await sendViaZepto({ from, to, subject, html: emailHtml });
    } catch (err) {
      console.error("ZeptoMail failed:", err instanceof Error ? err.message : err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
