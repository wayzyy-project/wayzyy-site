import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import {
  WISHLIST_PICKER_EVENT,
  WISHLIST_UPDATE_EVENT,
  collectionIdsFor,
  createCollection,
  getCollections,
  setInCollection,
  startWishlistSync,
} from "@/lib/wishlist";
import { useToast } from "@/hooks/use-toast";

// "Save to wishlist" sheet, same flow as the app's WishlistModal: tick any
// number of collections, or create a new one with this stay already in it.
export function WishlistPicker() {
  const { toast } = useToast();
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [, force] = useState(0);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    startWishlistSync();
    const onOpen = (e: Event) => { setPropertyId((e as CustomEvent<string>).detail); setCreating(false); setName(""); };
    const onUpdate = () => force((n) => n + 1);
    window.addEventListener(WISHLIST_PICKER_EVENT, onOpen);
    window.addEventListener(WISHLIST_UPDATE_EVENT, onUpdate);
    return () => {
      window.removeEventListener(WISHLIST_PICKER_EVENT, onOpen);
      window.removeEventListener(WISHLIST_UPDATE_EVENT, onUpdate);
    };
  }, []);

  useEffect(() => {
    if (!propertyId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPropertyId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [propertyId]);

  if (!propertyId) return null;
  const cols = getCollections();
  const inIds = new Set(collectionIdsFor(propertyId));

  const toggle = async (id: string) => {
    try { await setInCollection(propertyId, id, !inIds.has(id)); }
    catch (e) { toast({ title: "Couldn't update the wishlist", description: e instanceof Error ? e.message : "Try again.", variant: "destructive" }); }
  };

  const create = async () => {
    try {
      const col = await createCollection(name, propertyId);
      toast({ title: `Saved to ${col.name}` });
      setCreating(false);
      setName("");
    } catch (e) {
      toast({ title: "Couldn't create the wishlist", description: e instanceof Error ? e.message : "Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 sm:p-6" onClick={() => setPropertyId(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl"
      >
        <div className="relative flex items-center justify-center border-b border-border px-6 py-4">
          <button onClick={() => setPropertyId(null)} aria-label="Close" className="absolute left-4 rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
          <h2 id="wishlist-picker-title" className="text-base font-bold text-foreground">Save to wishlist</h2>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          {cols.length === 0 && !creating && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No wishlists yet. Create one to save this stay.</p>
          )}
          {cols.map((c) => {
            const on = inIds.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-muted/60 transition-colors"
              >
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">{c.propertyIds.length} saved</span>
                </span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${on ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-border"}`}>
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border p-4">
          {creating ? (
            <form onSubmit={(e) => { e.preventDefault(); create(); }} className="flex gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Wishlist name, e.g. Goa with friends"
                maxLength={50}
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <button type="submit" className="btn-brand">Save</button>
            </form>
          ) : (
            <button onClick={() => setCreating(true)} className="flex w-full items-center justify-center gap-2 rounded-full border border-foreground py-3 text-sm font-semibold text-foreground hover:bg-muted/50">
              <Plus className="h-4 w-4" /> Create new wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
