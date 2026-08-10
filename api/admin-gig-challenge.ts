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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Only the two server-only vars are required — the anon key isn't
  // needed at all: the service-role client's own auth.getUser(jwt) can
  // validate a caller's access token directly, without a separate
  // anon-key client. (Previously this also required VITE_SUPABASE_ANON_KEY,
  // which is meant for the client build and isn't guaranteed to be present
  // in the serverless function runtime the same way — that was causing a
  // 500 here even though gig-challenge.ts's insert, which only needs these
  // same two vars, works fine in production.)
  if (!supabaseUrl || !serviceKey) {
    console.error("admin-gig-challenge: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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
