import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays, format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

/**
 * Check-in / checkout range picker for a listing. The first click sets
 * check-in, the second sets checkout; a checkout that's too close is pushed
 * out to the host's minimum stay instead of being refused.
 */
export function StayDatesCalendar({
  checkIn,
  checkOut,
  minNights = 1,
  months = 1,
  unavailable,
  onChange,
}: {
  checkIn: Date;
  checkOut: Date;
  minNights?: number;
  months?: number;
  /** "yyyy-MM-dd" nights that are booked or blocked */
  unavailable?: Set<string>;
  onChange: (checkIn: Date, checkOut: Date) => void;
}) {
  // While picking, hold a half-finished range locally so the first click
  // doesn't immediately become a 1-night stay.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const selected: DateRange = draft ?? { from: checkIn, to: checkOut };
  const today = startOfDay(new Date());
  const [notice, setNotice] = useState<string | null>(null);
  const isTaken = (d: Date) => !!unavailable?.has(format(d, "yyyy-MM-dd"));
  // True if any night from check-in up to (not including) checkout is taken.
  const crossesTaken = (from: Date, to: Date) => {
    for (let d = from; d < to; d = addDays(d, 1)) if (isTaken(d)) return true;
    return false;
  };

  const handleSelect = (range: DateRange | undefined, day: Date) => {
    // Starting a new pick (nothing in progress): this click is check-in.
    if (!draft) {
      if (isTaken(day)) return;
      setNotice(null);
      setDraft({ from: day, to: undefined });
      return;
    }
    const from = draft.from!;
    if (day <= from) {
      setDraft({ from: day, to: undefined });
      return;
    }
    const nights = differenceInDays(day, from);
    const to = nights < minNights ? addDays(from, minNights) : day;
    if (crossesTaken(from, to)) {
      // Can't stay through a booked night: start over from the clicked day.
      setDraft({ from: day, to: undefined });
      setNotice("Some nights in that range are already booked. Pick dates that don't cross the greyed-out days.");
      return;
    }
    setNotice(null);
    setDraft(undefined);
    onChange(from, to);
    void range;
  };

  return (
    <div className="space-y-2">
      <Calendar
        mode="range"
        numberOfMonths={months}
        selected={selected}
        onSelect={handleSelect}
        defaultMonth={checkIn}
        // Booked nights can't be a check-in, but can be a checkout (the guest
        // leaves that morning), so only block them while picking check-in.
        disabled={draft ? [{ before: today }] : [{ before: today }, isTaken]}
        modifiers={{ taken: isTaken }}
        modifiersClassNames={{ taken: "line-through text-muted-foreground/40" }}
        className="rounded-2xl"
        // Airbnb-style range: full dark circles on check-in/checkout and a
        // light band for the nights between that runs into the middle of each
        // circle, instead of a solid block the circles spill over.
        classNames={{
          cell: [
            "h-10 w-10 p-0 text-center text-sm relative focus-within:z-20",
            "[&:has(.day-range-middle)]:bg-[#FF6B00]/15",
            "[&:has(.day-range-start)]:bg-[linear-gradient(90deg,transparent_50%,rgba(255,107,0,0.15)_50%)]",
            "[&:has(.day-range-end)]:bg-[linear-gradient(270deg,transparent_50%,rgba(255,107,0,0.15)_50%)]",
            "[&:has(.day-range-start.day-range-end)]:!bg-none",
          ].join(" "),
          day: "h-10 w-10 rounded-full p-0 font-medium transition-colors hover:bg-muted aria-selected:opacity-100",
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected: "!bg-foreground !text-background hover:!bg-foreground",
          day_range_middle: "day-range-middle !bg-transparent !text-foreground hover:!bg-[#FF6B00]/25",
          day_today: "font-bold underline underline-offset-4",
          day_disabled: "text-muted-foreground/40 line-through hover:bg-transparent",
          head_cell: "w-10 text-[0.75rem] font-medium text-muted-foreground",
        }}
      />
      {notice && <p className="px-3 text-xs font-semibold text-[#FF6B00]">{notice}</p>}
      <p className="px-3 text-xs text-muted-foreground">
        {draft ? "Now pick your checkout date." : "Pick a check-in date, then a checkout date."}
        {minNights > 1 ? ` Minimum stay: ${minNights} nights.` : ""}
      </p>
    </div>
  );
}
