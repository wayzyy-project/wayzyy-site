import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// host_onboarding_submissions has RLS enabled — the only select policy
// scopes a signed-in user to their own row by email (see
// supabase/migrations/20260818_host_onboarding_status_rls.sql). Reading
// or updating every submission for the admin queue needs the service
// role, same pattern as api/admin-gig-challenge.ts: verify the caller is
// actually hello@wayzyy.com via their own session token, then use the
// service role key server-side for the privileged read/write.
const ADMIN_EMAIL = "hello@wayzyy.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("admin-host-onboarding: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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
    const { data, error } = await admin
      .from("host_onboarding_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ submissions: data ?? [] });
  }

  if (req.method === "PATCH") {
    const { id, status, notes } = (req.body ?? {}) as { id?: string; status?: string; notes?: string };
    if (!id || !status) {
      return res.status(400).json({ error: "id and status are required" });
    }
    if (!["received", "verifying", "published", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const update: Record<string, unknown> = { status };
    if (notes !== undefined) update.notes = notes;

    const { error } = await admin
      .from("host_onboarding_submissions")
      .update(update)
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
