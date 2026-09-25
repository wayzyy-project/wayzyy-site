import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Public, unauthenticated preview of everything one host has listed - same
// reasoning as property-preview: a host we've imported for may not have
// logged in yet, and anon RLS only exposes active rows. Uses the service
// role server-side to list every non-rejected property for a host id and
// hands back only what a portfolio preview needs (no price, no exact
// address, no other host's data).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("host-preview: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  const hostId = typeof req.query.hostId === "string" ? req.query.hostId : undefined;
  if (!hostId) {
    return res.status(400).json({ error: "Missing hostId" });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const [{ data: properties, error: propsErr }, { data: profile }] = await Promise.all([
    admin
      .from("properties")
      .select("id, title, city, state, images, status, bedrooms, max_guests")
      .eq("host_id", hostId)
      .neq("status", "rejected")
      .order("created_at", { ascending: false }),
    admin.from("profiles").select("name").eq("id", hostId).maybeSingle(),
  ]);

  if (propsErr) {
    return res.status(500).json({ error: propsErr.message });
  }
  if (!properties || properties.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(200).json({
    hostName: profile?.name ?? null,
    properties: properties.map((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      state: p.state,
      coverImage: p.images?.[0] ?? null,
      bedrooms: p.bedrooms,
      maxGuests: p.max_guests,
      // Guests only ever see "live" - a host previewing their own
      // portfolio gets to see exactly where each listing stands.
      status: p.status,
    })),
  });
}
