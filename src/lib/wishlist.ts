// Wishlists, the same model as the mobile app (WishlistContext.tsx):
// named collections stored in `wishlists` + `wishlist_properties`, so a stay
// saved on the website shows up in the app and vice versa.
//
// Signed out, collections live in this browser only; on sign-in they're
// uploaded to the account once, exactly like the app's guest migration.
// The old flat list (`wayzyy_wishlist`) becomes a "My Wishlist" collection.
import { supabase } from "@/lib/supabase";

export interface WishlistCollection {
  id: string;
  name: string;
  propertyIds: string[];
  createdAt: number;
}

const GUEST_KEY = "wayzyy_wishlists_guest";
const LEGACY_KEY = "wayzyy_wishlist";
const RECENT_KEY = "wayzyy_recently_viewed";
const UPDATE_EVENT = "wayzyy_wishlist_updated";
const PICKER_EVENT = "wayzyy_wishlist_open";

let collections: WishlistCollection[] = [];
let userId: string | null = null;
let started = false;

// Demo listings have slug ids, not database ids - they can only be saved locally.
const isDbId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const emit = () => window.dispatchEvent(new Event(UPDATE_EVENT));

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}

function guestCollections(): WishlistCollection[] {
  const cols = readLocal<WishlistCollection[]>(GUEST_KEY, []);
  const legacy = readLocal<string[]>(LEGACY_KEY, []);
  if (legacy.length > 0 && cols.length === 0) {
    const migrated = [{ id: `local-${Date.now()}`, name: "My Wishlist", propertyIds: legacy, createdAt: Date.now() }];
    writeLocal(GUEST_KEY, migrated);
    try { localStorage.removeItem(LEGACY_KEY); } catch { /* ignore */ }
    return migrated;
  }
  return cols;
}

async function loadRemote(uid: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id, name, created_at, wishlist_properties(property_id)")
    .order("created_at", { ascending: true });
  if (error) { console.warn("wishlists load failed", error); return; }
  let remote: WishlistCollection[] = (data ?? []).map((w: any) => ({
    id: w.id,
    name: w.name,
    propertyIds: (w.wishlist_properties ?? []).map((wp: any) => wp.property_id),
    createdAt: new Date(w.created_at).getTime(),
  }));

  // Upload anything saved while signed out, then forget the local copy.
  const local = guestCollections().filter((c) => c.propertyIds.length > 0);
  for (const col of local) {
    const { data: row } = await supabase.from("wishlists").insert({ user_id: uid, name: col.name }).select().single();
    if (!row) continue;
    const ids = col.propertyIds.filter(isDbId);
    if (ids.length) {
      await supabase.from("wishlist_properties").insert(ids.map((pid) => ({ wishlist_id: row.id, property_id: pid })));
    }
    remote = [...remote, { id: row.id, name: col.name, propertyIds: ids, createdAt: new Date(row.created_at).getTime() }];
  }
  if (local.length) { try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ } }

  collections = remote;
  emit();
}

export function startWishlistSync() {
  if (started) return;
  started = true;
  collections = guestCollections();
  supabase.auth.getSession().then(({ data: { session } }) => {
    userId = session?.user?.id ?? null;
    if (userId) loadRemote(userId);
    else emit();
  });
  supabase.auth.onAuthStateChange((_e, session) => {
    const next = session?.user?.id ?? null;
    if (next === userId) return;
    userId = next;
    if (userId) loadRemote(userId);
    else { collections = guestCollections(); emit(); }
  });
}

const persistGuest = () => { if (!userId) writeLocal(GUEST_KEY, collections); };

export const getCollections = () => collections;
export const isPropertyWishlisted = (propertyId: string) => collections.some((c) => c.propertyIds.includes(propertyId));
export const collectionIdsFor = (propertyId: string) => collections.filter((c) => c.propertyIds.includes(propertyId)).map((c) => c.id);
export const allSavedIds = () => Array.from(new Set(collections.flatMap((c) => c.propertyIds)));

export async function createCollection(name: string, firstPropertyId?: string): Promise<WishlistCollection> {
  const clean = name.trim() || "My Wishlist";
  let col: WishlistCollection = { id: `local-${Date.now()}`, name: clean, propertyIds: firstPropertyId ? [firstPropertyId] : [], createdAt: Date.now() };
  if (userId) {
    const { data: row, error } = await supabase.from("wishlists").insert({ user_id: userId, name: clean }).select().single();
    if (error || !row) throw new Error(error?.message ?? "Couldn't create the wishlist");
    col = { ...col, id: row.id, createdAt: new Date(row.created_at).getTime() };
    if (firstPropertyId && isDbId(firstPropertyId)) await supabase.from("wishlist_properties").insert({ wishlist_id: row.id, property_id: firstPropertyId });
  }
  collections = [...collections, col];
  persistGuest();
  emit();
  return col;
}

export async function setInCollection(propertyId: string, collectionId: string, saved: boolean) {
  const before = collections;
  collections = collections.map((c) =>
    c.id !== collectionId ? c
      : { ...c, propertyIds: saved ? Array.from(new Set([...c.propertyIds, propertyId])) : c.propertyIds.filter((p) => p !== propertyId) },
  );
  persistGuest();
  emit();
  if (!userId || !isDbId(propertyId)) return;
  const { error } = saved
    ? await supabase.from("wishlist_properties").insert({ wishlist_id: collectionId, property_id: propertyId })
    : await supabase.from("wishlist_properties").delete().eq("wishlist_id", collectionId).eq("property_id", propertyId);
  if (error && !/duplicate/i.test(error.message)) { collections = before; emit(); throw new Error(error.message); }
}

export async function renameCollection(collectionId: string, name: string) {
  const clean = name.trim();
  if (!clean) return;
  collections = collections.map((c) => (c.id === collectionId ? { ...c, name: clean } : c));
  persistGuest();
  emit();
  if (userId) await supabase.from("wishlists").update({ name: clean }).eq("id", collectionId);
}

export async function deleteCollection(collectionId: string) {
  collections = collections.filter((c) => c.id !== collectionId);
  persistGuest();
  emit();
  if (userId) await supabase.from("wishlists").delete().eq("id", collectionId);
}

// Heart buttons call this; <WishlistPicker /> (mounted once in App) listens.
export function openWishlistPicker(propertyId: string) {
  window.dispatchEvent(new CustomEvent(PICKER_EVENT, { detail: propertyId }));
}
export const WISHLIST_PICKER_EVENT = PICKER_EVENT;
export const WISHLIST_UPDATE_EVENT = UPDATE_EVENT;

// Kept for older callers: the heart now opens the picker instead of
// silently toggling one flat list.
export function toggleWishlist(propertyId: string) {
  openWishlistPicker(propertyId);
}

// Recently viewed, like the app's Wishlists tab. Newest first, max 12.
export function recordRecentlyViewed(propertyId: string) {
  const list = readLocal<string[]>(RECENT_KEY, []).filter((id) => id !== propertyId);
  writeLocal(RECENT_KEY, [propertyId, ...list].slice(0, 12));
}
export const getRecentlyViewed = () => readLocal<string[]>(RECENT_KEY, []);
