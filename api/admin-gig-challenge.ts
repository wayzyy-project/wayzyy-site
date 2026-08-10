import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// gig_challenge_applications has RLS enabled with zero policies (see
// supabase/migrations/20260731_gig_challenge_applications.sql) — no anon
// or authenticated client key can ever read it directly, on purpose, since
// it holds applicant PII. This endpoint is the only way to read/update it
// from the browser: it verifies the caller is actually hello@wayzyy.com via
// their own Supabase session token, then uses the service role key
// server-side to do the privileged read/write.
const ADMIN_EMAIL = "hello@wayzyy.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization" });
  }
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const authedClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: userErr } = await authedClient.auth.getUser();
  if (userErr || !user || user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  if (req.method === "GET") {
    const { data, error } = await admin
      .from("gig_challenge_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ submissions: data ?? [] });
  }

  if (req.method === "PATCH") {
    const { id, status } = (req.body ?? {}) as { id?: string; status?: string };
    if (!id || !status) {
      return res.status(400).json({ error: "id and status are required" });
    }

    const { error } = await admin
      .from("gig_challenge_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
