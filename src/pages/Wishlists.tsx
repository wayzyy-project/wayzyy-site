import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Heart, Pencil, Plus, Trash2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { PropertyCard } from "@/components/marketplace/PropertyCard";
import { MOCK_PROPERTIES, PropertyListing } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  WISHLIST_UPDATE_EVENT,
  allSavedIds,
  createCollection,
  deleteCollection,
  getCollections,
  getRecentlyViewed,
  renameCollection,
  startWishlistSync,
} from "@/lib/wishlist";

function toListing(p: any): PropertyListing {
  const images = Array.isArray(p.images) && p.images.length ? p.images : [];
  const price = Number(p.price_per_night) || 0;
  return {
    id: p.id,
    slug: p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : p.id,
    title: p.title || "Stay",
    description: p.description || "",
    category: (p.category?.toLowerCase() || "apartments") as any,
    showcase: p.status !== "active" && !!p.showcase,
    propertyType: p.space_type ? `${p.space_type} in ${p.city || "Goa"}` : `Entire place in ${p.city || "Goa"}`,
    city: p.city || "Goa",
    area: p.location || p.city || "Goa",
    state: p.state || "Goa",
    country: "India",
    lat: Number(p.latitude) || 0,
    lng: Number(p.longitude) || 0,
    images,
    pricePerNight: price,
    originalPrice: price * 2,
    currency: "₹",
    rating: 0,
    reviewCount: 0,
    isGuestFavourite: false,
    isTopTenPercent: false,
    maxGuests: Number(p.max_guests) || 2,
    bedrooms: Number(p.bedrooms) || 1,
    beds: Number(p.beds) || 1,
    bathrooms: Number(p.bathrooms) || 1,
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
  } as PropertyListing;
}

export default function Wishlists() {
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const openId = params.get("c");
  const [, force] = useState(0);
  const [byId, setById] = useState<Record<string, PropertyListing>>({});
  const [loaded, setLoaded] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);

  useEffect(() => {
    startWishlistSync();
    const onUpdate = () => force((n) => n + 1);
    window.addEventListener(WISHLIST_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(WISHLIST_UPDATE_EVENT, onUpdate);
  }, []);

  const collections = getCollections();
  const recent = getRecentlyViewed();
  const wanted = useMemo(() => Array.from(new Set([...allSavedIds(), ...recent])).sort(), [collections, recent.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch only the stays we need. RLS already hides anything not public.
  useEffect(() => {
    const missing = wanted.filter((id) => !byId[id]);
    // Demo listings (slug ids) come from the bundled sample data.
    const demo = Object.fromEntries(MOCK_PROPERTIES.filter((m) => missing.includes(m.id)).map((m) => [m.id, m]));
    const dbIds = missing.filter((id) => /^[0-9a-f-]{36}$/i.test(id));
    if (dbIds.length === 0) { setById((prev) => ({ ...prev, ...demo })); setLoaded(true); return; }
    supabase.from("properties").select("*").in("id", dbIds).then(({ data }) => {
      setById((prev) => ({ ...prev, ...demo, ...Object.fromEntries((data ?? []).map((p: any) => [p.id, toListing(p)])) }));
      setLoaded(true);
    });
  }, [wanted.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = collections.find((c) => c.id === openId) ?? null;
  const recentListings = recent.map((id) => byId[id]).filter(Boolean);

  const submitNew = async () => {
    try { await createCollection(newName); setCreating(false); setNewName(""); }
    catch (e) { toast({ title: "Couldn't create the wishlist", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  };

  return (
    <SEO title="Wishlists - Wayzyy" description="Stays you've saved on Wayzyy, in your own collections.">
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />

        <main className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 xl:px-14 py-10 space-y-10">
          {open ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => setParams({})} aria-label="All wishlists" className="rounded-full p-2 hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
                  {renaming === open.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); renameCollection(open.id, newName); setRenaming(null); }} className="flex gap-2">
                      <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={50} className="rounded-full border border-border bg-background px-4 py-2 text-lg font-bold outline-none focus:border-foreground" />
                      <button className="btn-brand">Save</button>
                    </form>
                  ) : (
                    <h1 className="truncate text-3xl font-bold font-display">{open.name}</h1>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setRenaming(open.id); setNewName(open.name); }} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-foreground/40"><Pencil className="h-4 w-4" /> Rename</button>
                  <button
                    onClick={async () => { if (window.confirm(`Delete "${open.name}"? The stays in it aren't affected.`)) { await deleteCollection(open.id); setParams({}); } }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-red-600 hover:border-red-600/50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
              {open.propertyIds.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border py-16 text-center space-y-2">
                  <p className="text-base font-bold">Nothing saved here yet</p>
                  <p className="text-sm text-muted-foreground">Explore stays and tap ♡ to save them here.</p>
                  <Link to="/" className="btn-brand inline-flex mt-3">Explore stays</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                  {open.propertyIds.map((id) => byId[id] && <PropertyCard key={id} property={byId[id]} nights={2} />)}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display">Wishlists</h1>
                <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-foreground/40"><Plus className="h-4 w-4" /> New wishlist</button>
              </div>

              {creating && (
                <form onSubmit={(e) => { e.preventDefault(); submitNew(); }} className="flex max-w-md gap-2">
                  <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Wishlist name" maxLength={50} className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground" />
                  <button className="btn-brand">Create</button>
                  <button type="button" onClick={() => setCreating(false)} className="px-3 text-sm underline">Cancel</button>
                </form>
              )}

              {recentListings.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-bold">Recently viewed</h2>
                  <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
                    {recentListings.map((p) => (
                      <div key={p.id} className="w-60 shrink-0"><PropertyCard property={p} nights={2} /></div>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <h2 className="text-lg font-bold">Collections</h2>
                {collections.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border py-16 text-center space-y-2">
                    <Heart className="mx-auto h-8 w-8 text-[#FF6B00]" />
                    <p className="text-base font-bold">No wishlists yet</p>
                    <p className="text-sm text-muted-foreground">Tap ♡ on any stay to save it to a wishlist. Sign in to keep them in sync with the Wayzyy app.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {collections.map((c) => {
                      const covers = c.propertyIds.map((id) => byId[id]?.images[0]).filter(Boolean).slice(0, 4) as string[];
                      return (
                        <button key={c.id} onClick={() => setParams({ c: c.id })} className="group text-left">
                          <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl bg-muted">
                            {covers.length === 0 && <div className="col-span-2 row-span-2 flex items-center justify-center"><Heart className="h-8 w-8 text-muted-foreground" /></div>}
                            {covers.length > 0 && covers.length < 4 && <img src={covers[0]} alt="" loading="lazy" className="col-span-2 row-span-2 h-full w-full object-cover" />}
                            {covers.length === 4 && covers.map((src, i) => <img key={i} src={src} alt="" loading="lazy" className="h-full w-full object-cover" />)}
                          </div>
                          <p className="mt-2 truncate text-sm font-semibold group-hover:text-[#FF6B00]">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.propertyIds.length} saved</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
              {!loaded && <p className="text-sm text-muted-foreground">Loading…</p>}
            </>
          )}
        </main>
      </div>
    </SEO>
  );
}
