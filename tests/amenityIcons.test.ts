import assert from "node:assert/strict";
import test from "node:test";
import { AirVent, Bath, Car, Check, Eye, Plane, Waves, WashingMachine, Wind, UtensilsCrossed } from "lucide-react";
import { amenityIcon } from "../src/lib/amenityIcons";
import {
  CeilingFanGlyph, DeskGlyph, DiningTableGlyph, HangerGlyph, IronGlyph, KettleGlyph, PumpBottleGlyph, SoapGlyph, WardrobeGlyph,
} from "../src/components/icons/AmenityGlyphs";
import { AMENITIES } from "../src/lib/amenities";

test("matches catalogue and raw Airbnb labels", () => {
  assert.equal(amenityIcon("Pool"), Waves);
  assert.equal(amenityIcon("Air conditioning"), AirVent);
  assert.equal(amenityIcon("Free parking on premises"), Car);
  assert.equal(amenityIcon("Hot tub"), Bath);
  assert.equal(amenityIcon("Dedicated workspace"), DeskGlyph);
  assert.equal(amenityIcon("Iron"), IronGlyph);
  assert.equal(amenityIcon("Shampoo"), PumpBottleGlyph);
  assert.equal(amenityIcon("Body soap"), SoapGlyph);
  assert.equal(amenityIcon("Clothes storage: wardrobe"), WardrobeGlyph);
  assert.equal(amenityIcon("Hangers"), HangerGlyph);
  assert.equal(amenityIcon("Ceiling fan"), CeilingFanGlyph);
  assert.equal(amenityIcon("Kettle"), KettleGlyph);
  assert.equal(amenityIcon("Dining table"), DiningTableGlyph);
  assert.equal(amenityIcon("Outdoor dining"), amenityIcon("Dishes & silverware"));
  assert.equal(amenityIcon("Environment-friendly"), Check);
});

test("specific rules win over generic ones", () => {
  assert.equal(amenityIcon("Pool view"), Eye);
  assert.equal(amenityIcon("Airport shuttle"), Plane);
  assert.equal(amenityIcon("Hair dryer"), Wind);
  assert.equal(amenityIcon("Hairdryer"), Wind);
  assert.equal(amenityIcon("Dryer"), WashingMachine);
  assert.equal(amenityIcon("Dishwasher"), UtensilsCrossed);
  assert.notEqual(amenityIcon("Steam room"), amenityIcon("Tea"));
  assert.equal(amenityIcon("Carpeted floors"), Check);
});

test("every catalogue amenity gets a real icon, unknown text falls back", () => {
  assert.deepEqual(AMENITIES.filter((a) => amenityIcon(a) === Check), []);
  assert.equal(amenityIcon("Something new"), Check);
});

test("labels seen on live listings get an icon", () => {
  for (const label of ["Ethernet connection", "Cot – available upon request", "Crockery and cutlery", "Cooker", "Wine glasses", "Private entrance", "Building staff"]) {
    assert.notEqual(amenityIcon(label), Check, label);
  }
});
