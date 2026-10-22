import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays, startOfDay } from "date-fns";
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
  onChange,
}: {
  checkIn: Date;
  checkOut: Date;
  minNights?: number;
  months?: number;
  onChange: (checkIn: Date, checkOut: Date) => void;
}) {
  // While picking, hold a half-finished range locally so the first click
  // doesn't immediately become a 1-night stay.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const selected: DateRange = draft ?? { from: checkIn, to: checkOut };
  const today = startOfDay(new Date());

  const handleSelect = (range: DateRange | undefined, day: Date) => {
    // Starting a new pick (nothing in progress): this click is check-in.
    if (!draft) {
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
        disabled={{ before: today }}
        className="rounded-2xl"
      />
      <p className="px-3 text-xs text-muted-foreground">
        {draft ? "Now pick your checkout date." : "Pick a check-in date, then a checkout date."}
        {minNights > 1 ? ` Minimum stay: ${minNights} nights.` : ""}
      </p>
    </div>
  );
}
