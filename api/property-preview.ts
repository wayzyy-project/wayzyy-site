import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Public, unauthenticated preview for a single property - the share page
// needs to show draft / pending_review / final_stage listings too (not
// just "active"), and anon RLS only exposes active rows. This uses the
// service role server-side to look up any non-rejected property by id and
// hands back only what a pre-launch preview needs: no price, no host
// contact info, nothing beyond what the share page renders.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("property-preview: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const id = typeof req.query.id === "string" ? req.query.id : undefined;
  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin
    .from("properties")
    .select("id, title, description, city, state, images, max_guests, bedrooms, beds, bathrooms, amenities, status")
    .eq("id", id)
    .maybeSingle();

  if (error || !data || data.status === "rejected") {
    return res.status(404).json({ error: "Not found" });
  }

  const { status: _status, ...preview } = data;
  return res.status(200).json({ property: preview });
}
