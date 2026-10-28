import { useEffect, useState } from "react";
import { Loader2, Minus, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BED_TYPES, sleepingFromRow, type SleepingRoom } from "@/lib/houseRules";

// Property type ("Entire place in Siolim") and the room-by-room beds behind
// "Where you'll sleep". Same columns as the app's listing editor.

const SPACE_TYPES = [
  { id: "entire", label: "Entire place", sub: "Guests have the whole place to themselves" },
  { id: "private", label: "Private room", sub: "Their own room, shared common areas" },
  { id: "shared", label: "Shared room", sub: "A room or space shared with others" },
] as const;

const card = "rounded-2xl border border-white/15 bg-white/5 p-4";
const selectClass =
  "h-9 rounded-md border border-white/20 bg-white/10 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30";

export function SpaceSleepingSection({ propertyId }: { propertyId: string }) {
  const { toast } = useToast();
  const [spaceType, setSpaceType] = useState<string>("");
  const [rooms, setRooms] = useState<SleepingRoom[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("space_type, sleeping_arrangements")
      .eq("id", propertyId)
      .single()
      .then(({ data }) => {
        const st = String(data?.space_type ?? "").trim();
        const r = sleepingFromRow(data?.sleeping_arrangements);
        setSpaceType(st);
        setRooms(r);
        setSaved(JSON.stringify({ st, r }));
      });
  }, [propertyId]);

  if (saved === null) return null;
  const dirty = JSON.stringify({ st: spaceType, r: rooms }) !== saved;

  const updateRoom = (i: number, next: SleepingRoom) => setRooms((rs) => rs.map((r, j) => (j === i ? next : r)));
  const isCode = SPACE_TYPES.some((t) => t.id === spaceType.toLowerCase());

  const handleSave = async () => {
    const clean = rooms
      .map((r) => ({ name: r.name.trim(), beds: r.beds.filter((b) => b.count > 0) }))
      .filter((r) => r.name && r.beds.length > 0);
    setSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({ space_type: spaceType || null, sleeping_arrangements: clean.length ? clean : null })
        .eq("id", propertyId);
      if (error) throw error;
      setRooms(clean);
      setSaved(JSON.stringify({ st: spaceType, r: clean }));
      toast({ title: "Saved", description: "Property type and sleeping arrangements updated." });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className={card}>
        <p className="text-sm font-semibold text-white">Property type</p>
        <p className="mb-3 text-xs text-white/50">Shown under your title, e.g. "Entire place in Siolim".</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {SPACE_TYPES.map((t) => {
            const on = spaceType.toLowerCase() === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSpaceType(t.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${on ? "border-[#FF6B00] bg-[#FF6B00]/15" : "border-white/15 hover:border-white/30"}`}
              >
                <span className="block text-sm font-medium text-white">{t.label}</span>
                <span className="block text-xs text-white/50">{t.sub}</span>
              </button>
            );
          })}
        </div>
        {spaceType && !isCode && (
          <p className="mt-2 text-xs text-white/50">Currently shown as "{spaceType}". Pick one above to change it.</p>
        )}
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">Where guests sleep</p>
        <p className="mb-3 text-xs text-white/50">Add each room and its beds. Guests see this as "Where you'll sleep".</p>
        <div className="space-y-3">
          {rooms.map((room, i) => (
            <div key={i} className="rounded-xl border border-white/15 p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={room.name}
                  maxLength={40}
                  placeholder={`Bedroom ${i + 1}`}
                  onChange={(e) => updateRoom(i, { ...room, name: e.target.value })}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                />
                <button
                  type="button"
                  aria-label="Remove room"
                  onClick={() => setRooms((rs) => rs.filter((_, j) => j !== i))}
                  className="shrink-0 p-2 text-white/50 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {room.beds.map((bed, b) => (
                  <div key={b} className="flex items-center gap-2">
                    <select
                      className={`${selectClass} flex-1`}
                      value={bed.type}
                      onChange={(e) => updateRoom(i, { ...room, beds: room.beds.map((x, k) => (k === b ? { ...x, type: e.target.value } : x)) })}
                    >
                      {(BED_TYPES.includes(bed.type as never) ? BED_TYPES : [bed.type, ...BED_TYPES]).map((t) => (
                        <option key={t} value={t} className="text-black">{t}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label="Fewer"
                      onClick={() => updateRoom(i, {
                        ...room,
                        beds: bed.count <= 1 ? room.beds.filter((_, k) => k !== b) : room.beds.map((x, k) => (k === b ? { ...x, count: x.count - 1 } : x)),
                      })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-white">{bed.count}</span>
                    <button
                      type="button"
                      aria-label="More"
                      onClick={() => updateRoom(i, { ...room, beds: room.beds.map((x, k) => (k === b ? { ...x, count: Math.min(10, x.count + 1) } : x)) })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateRoom(i, { ...room, beds: [...room.beds, { type: "Double bed", count: 1 }] })}
                  className="text-xs font-semibold text-[#FF6B00] hover:underline"
                >
                  + Add a bed
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-3 gap-1"
          onClick={() => setRooms((rs) => [...rs, { name: `Bedroom ${rs.length + 1}`, beds: [{ type: "Double bed", count: 1 }] }])}
        >
          <Plus className="h-4 w-4" /> Add a room
        </Button>
      </div>

      <Button onClick={handleSave} disabled={!dirty || saving} className="w-full gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {dirty ? "Save property type and beds" : "All changes saved"}
      </Button>
    </div>
  );
}
