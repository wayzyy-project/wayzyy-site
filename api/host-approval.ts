import type { VercelRequest, VercelResponse } from "@vercel/node";

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
  const apiKey = process.env.ZEPTOMAIL_API_KEY;

  if (!apiKey) {
    console.warn("ZEPTOMAIL_API_KEY is not set. Email notification logged instead:", payload.subject, "to:", payload.to);
    return;
  }

  const authHeader = apiKey.startsWith("Zoho-enczapikey")
    ? apiKey.trim()
    : `Zoho-enczapikey ${apiKey.trim()}`;

  const res = await fetch(zeptomailUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      from: { address: fromAddress, name: fromName || "Wayzyy Host Support" },
      to: [{ email_address: { address: payload.to } }],
      subject: payload.subject,
      htmlbody: payload.html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("ZeptoMail API error response:", errText);
    throw new Error(`ZeptoMail API error ${res.status}: ${errText}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, email, name } = req.body as {
    action: "import_requested" | "import_approved" | "import_rejected" | "request_received" | "account_approved";
    email: string;
    name?: string;
  };

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  const hostName = escapeHtml(name || "Host");
  const hostEmail = escapeHtml(email);
  const adminEmail = "hello@wayzyy.com";
  const fromAddress = "hello@wayzyy.com";

  try {
    // 1. Host requests 1-Click Import Feature Access
    if (action === "import_requested") {
      // Email A: Notify Admin at hello@wayzyy.com
      await sendViaZepto({
        from: `Wayzyy Host Platform <${fromAddress}>`,
        to: adminEmail,
        subject: `🚨 New Import Listing Feature Request from ${hostName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0;">
            <h2 style="font-size: 18px; font-weight: 800; color: #ff6b00; margin: 0 0 12px 0;">New Import Access Request</h2>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">
              Host <strong>${hostName}</strong> (<a href="mailto:${hostEmail}" style="color: #ff6b00;">${hostEmail}</a>) has requested access to the <strong>1-Click Airbnb & Booking Listing Import</strong> feature.
            </p>
            <div style="background-color: #fff7ed; padding: 16px; border-radius: 12px; border-left: 4px solid #ff6b00; margin: 16px 0;">
              <p style="font-size: 13px; font-weight: 600; color: #9a3412; margin: 0;">Host Email: ${hostEmail}</p>
              <p style="font-size: 13px; color: #431407; margin-top: 4px; margin-bottom: 0;">Requested: ${new Date().toLocaleString("en-IN")}</p>
            </div>
            <p style="font-size: 13px; color: #64748b;">Log into <a href="https://wayzyy.com/host" style="color: #ff6b00; font-weight: 700;">hello@wayzyy.com Host Portal</a> to approve this import request.</p>
          </div>
        `,
      }).catch((e) => console.warn("Admin notification email warning:", e));

      // Email B: Confirmation to Host
      await sendViaZepto({
        from: `Wayzyy Host Team <${fromAddress}>`,
        to: hostEmail,
        subject: "Airbnb Listing Import Access Request Received 🌴",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #ff6b00; margin: 0;">Wayzyy Host Portal</h1>
              <p style="font-size: 13px; color: #64748b; margin-top: 4px;">1-Click Airbnb & Booking Import Feature</p>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Hello ${hostName},</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              We have received your request for <strong>1-Click Airbnb Listing Import Access</strong>!
            </p>
            
            <div style="background-color: #fff7ed; border-left: 4px solid #ff6b00; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 13px; font-weight: 600; color: #9a3412; margin: 0;">
                ⏳ What happens next?
              </p>
              <p style="font-size: 13px; color: #431407; margin-top: 6px; margin-bottom: 0; line-height: 1.5;">
                Our team reviews every import access request. You will receive an automated email notification at <strong>${hostEmail}</strong> once import access is unlocked for your account.
              </p>
            </div>
            
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
              You can still list your properties manually anytime from your Host Portal dashboard. If you have questions, contact us at <a href="mailto:hello@wayzyy.com" style="color: #ff6b00;">hello@wayzyy.com</a>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Wayzyy Inc. All rights reserved. • Goa, India
            </p>
          </div>
        `,
      });

      return res.status(200).json({ success: true, message: "Import request emails sent" });
    }

    // 2. Admin approves Import Listing Access
    if (action === "import_approved" || action === "account_approved") {
      await sendViaZepto({
        from: `Wayzyy Host Team <${fromAddress}>`,
        to: hostEmail,
        subject: "Airbnb Listing Import Access Granted! 🎉",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #ff6b00; margin: 0;">Wayzyy Host Portal</h1>
              <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Direct Vacation Rentals & Host Platform</p>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Congratulations ${hostName}! 🎉</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              Great news! Your <strong>1-Click Airbnb & Booking Listing Import</strong> feature has been officially activated by our team.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 8px 0;">✨ Features Unlocked:</h3>
              <ul style="font-size: 13px; color: #15803d; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>1-Click Import:</strong> Auto-fetch photos, layouts & details from Airbnb</li>
                <li><strong>Direct Rates:</strong> Set 100% of your nightly pricing with 0% commission</li>
                <li><strong>Instant Approval Flow:</strong> Move imported listings to review in 10 seconds</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://wayzyy.com/host" style="display: inline-block; background-color: #ff6b00; color: #ffffff; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 99px; text-decoration: none; box-shadow: 0 4px 12px rgba(255,107,0,0.3);">
                Import Your Listing Now →
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Wayzyy Inc. All rights reserved. • Goa, India
            </p>
          </div>
        `,
      });
      return res.status(200).json({ success: true, message: "Import approval email sent" });
    }

    return res.status(400).json({ error: "Invalid action type" });
  } catch (err: any) {
    console.error("Host approval email handler error:", err);
    return res.status(500).json({ error: err?.message || "Failed to send host approval email" });
  }
}
