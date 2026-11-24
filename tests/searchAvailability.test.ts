import assert from "node:assert/strict";
import test from "node:test";
import { BOOKED, addDays, nearestFree, stayProblem, type ListingCalendar } from "../src/lib/searchAvailability";

// Far enough ahead that today's date never trips a rule.
const IN = "2027-12-29";
const OUT = "2028-01-04"; // 6 nights
const cal = (booked: string[] = [], rules: ListingCalendar["rules"] = {}, totalUnits = 1): ListingCalendar =>
  ({ unavailable: new Set(booked), rules, totalUnits });
const range = (from: string, n: number) => Array.from({ length: n }, (_, i) => addDays(from, i));

test("a stay is free when no searched night is taken; the check-out morning doesn't count", () => {
  assert.equal(stayProblem(cal(), IN, OUT), null);
  assert.equal(stayProblem(cal([OUT, "2027-12-28"]), IN, OUT), null);
  assert.equal(stayProblem(cal(["2028-01-03"]), IN, OUT), BOOKED);
});

test("multi-unit listings are never 'booked', but still follow the host's rules", () => {
  assert.equal(stayProblem(cal(range(IN, 6), {}, 3), IN, OUT), null);
  assert.match(stayProblem(cal([], { minNights: 7 }, 3), IN, OUT)!, /at least 7 nights/);
});

test("host rules apply, including the date_rules minimum for that check-in", () => {
  assert.match(stayProblem(cal([], { maxNights: 3 }), IN, OUT)!, /maximum stay of 3/);
  assert.match(stayProblem(cal([], { dateMinNights: { [IN]: 7 } }), IN, OUT)!, /at least 7 nights/);
  assert.equal(stayProblem(cal([], { dateMinNights: { "2027-12-30": 7 } }), IN, OUT), null);
});

test("nearest free stay: same length, later wins a tie, earlier when it is closer", () => {
  // Every night of the search is booked: one day later still clashes until the 4th.
  const booked = range(IN, 6);
  // Later: start 2028-01-04 (6 days on). Earlier: end on 12-29, start 12-23 (6 days back). Tie -> later.
  assert.deepEqual(nearestFree(cal(booked), IN, OUT, 42, "2027-01-01"), { checkIn: "2028-01-04", checkOut: "2028-01-10" });
  // Block the later side for a week more: the earlier stay is now nearest.
  assert.deepEqual(nearestFree(cal([...booked, ...range(OUT, 10)]), IN, OUT, 42, "2027-01-01"), { checkIn: "2027-12-23", checkOut: "2027-12-29" });
});

test("nearest free stay never starts before today, stretches to the minimum, and gives up after the window", () => {
  const booked = range(IN, 6);
  assert.deepEqual(nearestFree(cal(booked), IN, OUT, 42, "2027-12-29"), { checkIn: "2028-01-04", checkOut: "2028-01-10" });
  const min = nearestFree(cal([], { dateMinNights: { [IN]: 7, "2027-12-30": 8 } }), IN, OUT, 42, "2027-01-01");
  assert.deepEqual(min, { checkIn: "2027-12-30", checkOut: "2028-01-07" });
  assert.equal(nearestFree(cal(range("2027-11-01", 120)), IN, OUT, 42, "2027-01-01"), null);
});
