import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, audience } = req.body as { email: string; audience: string };

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Wayzyy Waitlist <akshaykumar.sharma@wayzyy.com>",
        to: "akshaykumar.sharma@wayzyy.com",
        reply_to: email,
        subject: `New ${audience === "host" ? "Host" : "Traveler"} joined the waitlist`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 12px;">
            <h2 style="font-size: 24px; color: #1a1a1a; margin-bottom: 8px;">
              New ${audience === "host" ? "🏠 Host" : "✈️ Traveler"} on the waitlist
            </h2>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px; width: 120px;">Email</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold;">${email}</td>
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
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
