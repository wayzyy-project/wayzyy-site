import assert from "node:assert/strict";
import test from "node:test";
import {
  computeNightlyPrices,
  computeStayCharges,
  guestNightlyPrice,
  stayGstRateFor,
} from "../src/lib/pricing";

test("guest display price includes the 7% Wayzyy fee", () => {
  assert.equal(guestNightlyPrice(10_000), 10_700);
});

test("stay GST follows the nightly tariff thresholds", () => {
  assert.equal(stayGstRateFor(1_000), 0);
  assert.equal(stayGstRateFor(1_001), 0.05);
  assert.equal(stayGstRateFor(7_500), 0.05);
  assert.equal(stayGstRateFor(7_501), 0.18);
});

test("date overrides replace only the matching host nights", () => {
  assert.deepEqual(
    computeNightlyPrices(8_000, "2026-11-01", "2026-11-04", { "2026-11-02": 10_000 }),
    [8_000, 10_000, 8_000],
  );
});

test("stay charges keep accommodation, GST and Wayzyy fee separate", () => {
  assert.deepEqual(computeStayCharges([10_000], null, 0), {
    accommodation: 10_000,
    stayGst: 1_800,
    serviceFee: 700,
    serviceFeeGst: 126,
    total: 12_626,
  });
});
