import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Deliberately public, no auth: a host types the email they submitted
// with and sees their own status directly, no magic link, no Supabase
// session, no dependency on Auth redirect-URL configuration. The
// tradeoff is that anyone who knows/guesses a host's email can see
// this too, so only low-sensitivity fields are returned - no phone
// number, no raw property URLs, just enough to show progress.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = (req.query.email as string | undefined)?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("host-onboarding-status: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data, error } = await admin
    .from("host_onboarding_submissions")
    .select("id, created_at, full_name, status, property_urls, airbnb_profile_url")
    .ilike("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("host-onboarding-status: lookup failed:", error.message);
    return res.status(500).json({ error: "Failed to look up status" });
  }

  const submissions = (data ?? []).map((s) => ({
    id: s.id,
    created_at: s.created_at,
    full_name: s.full_name,
    status: s.status,
    property_count: (s.property_urls?.length ?? 0) + (s.airbnb_profile_url ? 1 : 0),
  }));

  return res.status(200).json({ submissions });
}
