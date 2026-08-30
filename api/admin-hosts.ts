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
    const listItems = drafts.map((d: any) => `<li style="margin:0 0 6px;">${escapeHtml(d.title || "Untitled listing")}</li>`).join("");

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 12px;color:#111;">Hi ${safeName}, your properties are ready 🎉</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#555;line-height:1.6;">
            Our team has imported and reviewed ${drafts.length} propert${drafts.length === 1 ? "y" : "ies"} for you:
          </p>
          <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#333;">${listItems}</ul>
          <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
            Log in to your host portal to see how each one looks, set your nightly and weekend pricing, and approve it to send it to us for final review.
          </p>
          <div style="text-align:center;">
            <a href="https://wayzyy.com/host" style="display:inline-block;background:#ff6b00;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;">
              Go to Host Portal →
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
        to: hostEmail,
        subject: `Your ${drafts.length} propert${drafts.length === 1 ? "y is" : "ies are"} ready — set your pricing`,
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
