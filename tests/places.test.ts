import assert from "node:assert/strict";
import test from "node:test";
import { buildPlacePage, distanceKm, nearbyPlaces, regionSearch, type PlaceListing } from "../api/_lib/places";

let n = 0;
const stay = (city: string, lat: number | null, lng: number | null, state = "Goa"): PlaceListing => ({
  id: `p${++n}`, title: `Stay ${n}`, city, state, price_per_night: 5000, images: [], max_guests: 4, bedrooms: 2,
  amenities: [], space_type: null, pets_allowed: null, latitude: lat, longitude: lng,
});

// Map points close to real ones (from live listings).
const all = [
  stay("Assagao", 15.5986, 73.7842), stay("Assagao", 15.5990, 73.7840),
  stay("Siolim", 15.6102, 73.7602), stay("Siolim", 15.6150, 73.7650),
  stay("Anjuna", 15.5908, 73.7482),
  stay("Candolim", 15.5195, 73.7770),
  stay("Colva", 15.2826, 73.9215), stay("Colva", 15.2826, 73.9215),
  stay("Girim", 15.3098, 73.9168),
  stay("Goa", 15.59, 73.77),                       // no real area: never a link
  stay("Gurgaon", 28.46, 77.03, "Haryana"),        // outside Goa: never a link
];

test("distanceKm matches a known Goa distance", () => {
  // Assagao to Colva is about 39 km in a straight line.
  const km = distanceKm(15.5986, 73.7842, 15.2826, 73.9215);
  assert.ok(km > 36 && km < 42, `got ${km}`);
});

test("nearby areas are sorted nearest first, from the stay's own map point", () => {
  const r = nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 });
  // Siolim's centre is ~2.8 km from this point, Anjuna ~3.9 km, Candolim ~9 km, South Goa ~35-40 km.
  assert.deepEqual(r.nearby.map((p) => p.label), ["Siolim", "Anjuna", "Candolim", "Girim", "Colva"]);
  assert.equal(r.nearby[0].href, "/siolim/stays");
  assert.deepEqual(r.nearby.map((p) => p.km), [3, 4, 9, 35, 38]);
  assert.ok(r.nearby.every((p, i, a) => i === 0 || (a[i - 1].km ?? 0) <= (p.km ?? 0)));
});

test("the stay's own area is offered separately, never as 'nearby'", () => {
  const r = nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 });
  assert.deepEqual(r.here, { href: "/assagao/stays", label: "Assagao", count: 2 });
  assert.ok(!r.nearby.some((p) => p.href === "/assagao/stays"));
});

test("an area with only this stay gets no 'here' link", () => {
  const r = nearbyPlaces(all, { city: "Anjuna", lat: 15.5908, lng: 73.7482 });
  assert.equal(r.here, null);
});

test("'Goa' and places outside Goa are never linked", () => {
  const r = nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 }, 20);
  const hrefs = r.nearby.map((p) => p.href);
  assert.ok(!hrefs.includes("/goa/stays"));
  assert.ok(!hrefs.includes("/gurgaon/stays"));
});

test("region link counts the region's stays; Girim counts as South Goa", () => {
  assert.deepEqual(nearbyPlaces(all, { city: "Colva", lat: 15.2826, lng: 73.9215 }).region, {
    href: "/south-goa/stays", label: "South Goa", count: 3,
  });
  assert.equal(nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 }).region?.count, 6);
  const colva = nearbyPlaces(all, { city: "Colva", lat: 15.2826, lng: 73.9215 });
  assert.equal(colva.nearby[0].label, "Girim");
});

test("without its own map point, a stay falls back to its area's centre", () => {
  const r = nearbyPlaces(all, { city: "Colva", lat: null, lng: null });
  assert.equal(r.nearby[0].label, "Girim");
  assert.ok(r.nearby.every((p) => p.km !== null));
});

test("limit caps the number of nearby areas", () => {
  assert.equal(nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 }, 2).nearby.length, 2);
});

test("every nearby link opens a real area page listing only that area", () => {
  for (const p of nearbyPlaces(all, { city: "Assagao", lat: 15.5988, lng: 73.7841 }).nearby) {
    const slug = p.href.split("/")[1];
    const page = buildPlacePage(all, slug);
    assert.ok(page, `no page for ${p.href}`);
    assert.equal(page.listings.length, p.count);
    assert.ok(page.listings.every((l) => l.city === p.label));
  }
});

test("searching a region matches the villages in it, wherever the village is written", () => {
  const north = regionSearch("North Goa");
  assert.ok(north);
  for (const text of ["Goa Assagao", "Siolim, Goa", "Plot 4, Siolim Road", "Goa Marna"]) assert.equal(north(text), true, text);
  for (const text of ["Goa Palolem", "Goa", "Colva", "Panaji, Goa"]) assert.equal(north(text), false, text);
  assert.equal(regionSearch("South goa")?.("Goa Agonda"), true);
});

test("a region search also works from its first letters, but only for regions", () => {
  assert.ok(regionSearch("north"));
  assert.ok(regionSearch("  South G "));
  assert.equal(regionSearch("no"), undefined); // too short
  assert.equal(regionSearch("Goa"), undefined); // the whole state, not a region
  assert.equal(regionSearch("Assagao"), undefined); // a village: handled by the plain text match
});

test("Old Goa is the third region, also found as 'central'; every real village sits in one region only", () => {
  const old = regionSearch("Old Goa");
  assert.ok(old);
  for (const text of ["Panaji, Goa", "Goa Panjim", "Dona Paula", "Ribandar"]) assert.equal(old(text), true, text);
  assert.equal(old("Assagao, Goa"), false);
  assert.equal(regionSearch("central")?.("Panaji, Goa"), true);
  // Villages from the live listings: each one matches exactly one region.
  const live = ["Candolim", "Siolim", "Bogmalo", "Assagao", "Anjuna", "Baga", "Arpora", "Colva", "Panaji", "Marna", "Mapusa", "Girim",
    "Vagator", "Morjim", "Calangute", "Varca", "Chapora", "Vasco Da Gama"];
  const regions = ["North Goa", "Old Goa", "South Goa"].map((r) => regionSearch(r)!);
  for (const v of live) assert.equal(regions.filter((m) => m(`Goa ${v}`)).length, 1, v);
});
