import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// profiles has RLS enabled and is normally scoped to "your own row" -
// listing every registered host for the admin directory needs the service
// role, same pattern as api/admin-host-onboarding.ts: verify the caller is
// actually hello@wayzyy.com via their own session token, then use the
// service role key server-side for the privileged read.
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
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("admin-hosts: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization" });
  }
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user || user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (req.method === "GET") {
    // profiles has no email column at all (schema: id, name, phone,
    // avatar_url, is_host, created_at, updated_at) - email only exists on
    // auth.users, so it has to be pulled separately via the admin API and
    // merged in by id. listUsers() is paginated (50/page by default), so
    // page through it rather than assuming everyone fits on page 1.
    const authUsersById: Record<string, { email: string | null; created_at: string }> = {};
    let page = 1;
    const perPage = 200;
    while (true) {
      const { data: pageData, error: listErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (listErr) return res.status(500).json({ error: listErr.message });
      for (const u of pageData.users) {
        authUsersById[u.id] = { email: u.email ?? null, created_at: u.created_at };
      }
      if (pageData.users.length < perPage) break;
      page += 1;
    }

    const [
      { data: profiles, error: profilesErr },
      { data: properties, error: propsErr },
      { data: submissions, error: subsErr },
    ] = await Promise.all([
      // profiles' name column is "name", not "full_name" - aliased here so
      // the rest of this file and the frontend can keep using full_name.
      admin.from("profiles").select("id, full_name:name, phone, created_at"),
      admin.from("properties").select("id, host_id, title, status, price_per_night, imported_by_admin, source_url").order("created_at", { ascending: false }),
      // The concierge "we do it for you" form. A host who came in this way
      // already handed us their listing links - the admin directory should
      // surface those links inline so they can be imported without
      // digging through a separate queue.
      admin.from("host_onboarding_submissions")
        .select("id, user_id, email, status, property_urls, airbnb_profile_url, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (profilesErr) return res.status(500).json({ error: profilesErr.message });
    if (propsErr) return res.status(500).json({ error: propsErr.message });
    if (subsErr) return res.status(500).json({ error: subsErr.message });

    // Submissions link by user_id when the host was signed in, but older
    // rows predate that column - fall back to matching on email.
    const submissionByUserId: Record<string, any> = {};
    const submissionByEmail: Record<string, any> = {};
    for (const s of submissions ?? []) {
      if ((s as any).user_id && !submissionByUserId[(s as any).user_id]) submissionByUserId[(s as any).user_id] = s;
      const em = ((s as any).email || "").toLowerCase();
      if (em && !submissionByEmail[em]) submissionByEmail[em] = s;
    }

    const counts: Record<string, { draft: number; pending_review: number; active: number; rejected: number; total: number }> = {};
    const propertiesByHost: Record<string, any[]> = {};
    for (const p of properties ?? []) {
      const hostId = (p as any).host_id;
      if (!hostId) continue;
      counts[hostId] ??= { draft: 0, pending_review: 0, active: 0, rejected: 0, total: 0 };
      const status = (p as any).status as string;
      if (status === "draft" || status === "pending_review" || status === "active" || status === "rejected") {
        counts[hostId][status] += 1;
      }
      counts[hostId].total += 1;
      propertiesByHost[hostId] ??= [];
      propertiesByHost[hostId].push(p);
    }

    // profiles is the base list (every account gets a row via the signup
    // trigger) - auth.users fills in the email that profiles doesn't have.
    // Each host also carries its own property list (not just counts) so
    // the admin directory can show, per host, exactly which properties
    // are waiting on the host's pricing vs. waiting on the admin's final
    // approve, rather than just an opaque count.
    const hosts = (profiles ?? []).map((p: any) => {
      const email = authUsersById[p.id]?.email ?? null;
      const submission = submissionByUserId[p.id] ?? (email ? submissionByEmail[email.toLowerCase()] : null) ?? null;
      return {
        ...p,
        email,
        created_at: p.created_at ?? authUsersById[p.id]?.created_at ?? null,
        propertyCounts: counts[p.id] ?? { draft: 0, pending_review: 0, active: 0, rejected: 0, total: 0 },
        properties: propertiesByHost[p.id] ?? [],
        // How this host reached us: the concierge form (they sent links,
        // we import) vs. signing up and doing it themselves.
        submission: submission
          ? {
              id: submission.id,
              status: submission.status,
              propertyUrls: submission.property_urls ?? [],
              airbnbProfileUrl: submission.airbnb_profile_url ?? null,
              createdAt: submission.created_at,
            }
          : null,
      };
    }).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

    // Waitlist leads - people who filled the pre-launch "join the waitlist"
    // form on the marketing site. This never creates an account (no
    // auth.users row, no password), so these people are invisible to the
    // hosts list above even though they've already expressed interest and
    // may have sent property links over WhatsApp before ever signing up.
    // select("*") rather than a fixed column list since this table's shape
    // has grown past its original migration (e.g. a "name" column added
    // directly in the dashboard, not tracked in supabase/migrations).
    const { data: waitlistLeads, error: waitlistErr } = await admin
      .from("waitlist_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (waitlistErr) return res.status(500).json({ error: waitlistErr.message });

    return res.status(200).json({ hosts, waitlistLeads: waitlistLeads ?? [] });
  }

  if (req.method === "POST") {
    // Batched "your properties are ready" email - sent once after an admin
    // has finished importing one or more properties for a host, rather
    // than one email per property.
    const { hostId, hostEmail, hostName } = (req.body ?? {}) as { hostId?: string; hostEmail?: string; hostName?: string };
    if (!hostId || !hostEmail) {
      return res.status(400).json({ error: "hostId and hostEmail are required" });
    }

    const { data: drafts, error: draftsErr } = await admin
      .from("properties")
      .select("title")
      .eq("host_id", hostId)
      .eq("status", "draft");

    if (draftsErr) return res.status(500).json({ error: draftsErr.message });
    if (!drafts || drafts.length === 0) {
      return res.status(400).json({ error: "This host has no draft properties to notify about" });
    }

    const zeptoKey = process.env.ZEPTOMAIL_API_KEY;
    if (!zeptoKey) {
      return res.status(500).json({ error: "Email is not configured" });
    }

    const safeName = escapeHtml(hostName || "there");
    const count = drafts.length;
    const plural = count === 1 ? "property" : "properties";

    // Email HTML is table-based and inline-styled on purpose: Gmail and
    // Outlook strip <style> blocks and don't support flex/grid. SVG is
    // stripped too, so the logo is the PNG mark.
    const listRows = drafts
      .map(
        (d: any) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #EFEDE9;font-size:14px;color:#14161A;">
                  ${escapeHtml(d.title || "Untitled listing")}
                </td>
              </tr>`
      )
      .join("");

    // Where the host is in the process, drawn at the bottom so the
    // instructions come first. Step 2 is the live one - theirs to do.
    const step = (n: string, title: string, body: string, state: "done" | "now" | "next") => {
      const bg = state === "done" ? "#14704A" : state === "now" ? "#FF6B00" : "#FFFFFF";
      const fg = state === "next" ? "#9AA0A8" : "#FFFFFF";
      const border = state === "next" ? "1px solid #D8D3CB" : "none";
      const titleColor = state === "next" ? "#9AA0A8" : "#14161A";
      return `
              <tr>
                <td width="34" valign="top" style="padding:0 12px 18px 0;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td align="center" valign="middle" width="26" height="26" style="width:26px;height:26px;background:${bg};border:${border};border-radius:13px;color:${fg};font-size:12px;font-weight:700;line-height:26px;">${n}</td>
                  </tr></table>
                </td>
                <td valign="top" style="padding:0 0 18px;">
                  <div style="font-size:13px;font-weight:700;color:${titleColor};line-height:1.4;">${title}</div>
                  <div style="font-size:12px;color:#6B7280;line-height:1.5;margin-top:2px;">${body}</div>
                </td>
              </tr>`;
    };

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F5F3EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3EF;padding:32px 12px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E7E3DC;">

        <tr><td style="padding:28px 32px 0;">
          <img src="https://wayzyy.com/icon-192.png" width="36" height="36" alt="Wayzyy" style="display:block;border:0;border-radius:9px;" />
        </td></tr>

        <tr><td style="padding:20px 32px 0;">
          <h1 style="margin:0;font-size:21px;line-height:1.3;color:#14161A;font-weight:700;">
            Hi ${safeName}, your ${plural} ${count === 1 ? "is" : "are"} ready for pricing
          </h1>
          <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#5A6068;">
            Our team has imported ${count} ${plural} into your Wayzyy account and set ${count === 1 ? "it" : "them"} up for you.
            The only thing left is your pricing.
          </p>
        </td></tr>

        <tr><td style="padding:22px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">${listRows}</table>
        </td></tr>

        <tr><td style="padding:22px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FBF9F6;border:1px solid #EFEDE9;border-radius:10px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:13px;font-weight:700;color:#14161A;">What you need to do</div>
              <div style="font-size:13px;line-height:1.65;color:#5A6068;margin-top:6px;">
                Open each listing and set your <strong style="color:#14161A;">base nightly rate</strong> and, if you want one,
                a separate <strong style="color:#14161A;">weekend rate</strong>. You can also block dates or set a different
                price for specific nights from the calendar on each property, any time.
              </div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td align="center" style="padding:24px 32px 0;">
          <a href="https://wayzyy.com/host?tab=draft" style="display:inline-block;background:#FF6B00;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:13px 30px;border-radius:8px;">
            Add your pricing
          </a>
        </td></tr>

        <tr><td style="padding:28px 32px 0;">
          <div style="border-top:1px solid #EFEDE9;padding-top:20px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9AA0A8;padding-bottom:16px;">
              How it works
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${step("1", "We import your listing", "Done — photos, details and layout are already in.", "done")}
              ${step("2", "You add your pricing", "Set your base and weekend rates, then approve.", "now")}
              ${step("3", "We review and publish", "Our team gives the final approval and your listing goes live.", "next")}
            </table>
          </div>
        </td></tr>

        <tr><td style="padding:8px 32px 28px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#9AA0A8;">
            Questions? Reply to this email or reach us at
            <a href="mailto:hello@wayzyy.com" style="color:#FF6B00;text-decoration:none;">hello@wayzyy.com</a>.
          </p>
        </td></tr>

      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#A9AEB5;">Wayzyy — stays without the small print.</p>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await sendViaZepto({
        from: "Wayzyy Listings <noreply@wayzyy.com>",
        to: hostEmail,
        subject: `Your ${count} ${plural} ${count === 1 ? "is" : "are"} ready — add your pricing`,
        html,
      });
    } catch (err: any) {
      console.error("admin-hosts: notify email failed", err);
      return res.status(500).json({ error: "Could not send email" });
    }

    // In-app notification to back up the email - a host might not check
    // their inbox, but the dashboard bell is right there next time they
    // log in.
    const { error: notifErr } = await admin.from("host_notifications").insert({
      user_id: hostId,
      title: `${drafts.length} propert${drafts.length === 1 ? "y" : "ies"} imported for you`,
      body: `Set your pricing and approve to send ${drafts.length === 1 ? "it" : "them"} for review.`,
      link: "/host?tab=draft",
    });
    if (notifErr) console.error("admin-hosts: notification insert failed", notifErr.message);

    return res.status(200).json({ ok: true, notified: drafts.length });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
