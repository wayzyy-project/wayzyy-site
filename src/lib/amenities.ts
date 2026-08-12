/**
 * Wayzyy Amenity Normalizer & Mapping Utility
 * Translates raw Airbnb / AirROI amenity names into standardized Wayzyy amenity labels
 * used across the website, mobile app, and backend database.
 */

// Canonical amenity checklist shown in the manual listing wizard (HostPortal.tsx)
// and the Airbnb import review flow (ImportListingModal.tsx) - kept as a single
// shared list so both paths stay in sync.
export const AMENITIES = [
  "WiFi", "Kitchen", "Washer", "AC", "Heating", "Hot Water", "TV", "Pool",
  "Parking", "Breakfast", "Garden", "Beach Access", "Pet-friendly", "BBQ",
  "Workspace", "Gym", "EV Charger",
];

export const AMENITY_ALIASES: Record<string, string[]> = {
  // WiFi
  wifi: ['WiFi', 'Wifi'],
  'wi-fi': ['WiFi', 'Wifi'],
  'wireless internet': ['WiFi', 'Wifi'],

  // Air Conditioning / Climate
  'air conditioning': ['AC', 'Air conditioning'],
  ac: ['AC', 'Air conditioning'],
  'central air conditioning': ['AC', 'Air conditioning'],
  'split type ductless air conditioning': ['AC', 'Air conditioning'],
  'ceiling fan': ['Ceiling fan'],
  fan: ['Ceiling fan'],
  heating: ['Heating'],

  // Swimming Pool & Outdoor
  pool: ['Pool'],
  'private pool': ['Pool'],
  'shared pool': ['Pool'],
  'outdoor pool': ['Pool'],
  backyard: ['Garden', 'Backyard'],
  garden: ['Garden', 'Backyard'],
  'outdoor furniture': ['Outdoor furniture'],
  'outdoor dining area': ['Outdoor dining', 'Outdoor dining area'],
  'outdoor dining': ['Outdoor dining', 'Outdoor dining area'],
  'bbq grill': ['BBQ', 'BBQ Grill', 'BBQ grill'],
  barbecue: ['BBQ', 'BBQ Grill'],
  balcony: ['Balcony'],
  'patio or balcony': ['Balcony'],

  // Parking
  'free parking on premises': ['Parking', 'Free parking'],
  'free street parking': ['Parking', 'Free parking'],
  'paid parking on premises': ['Parking'],
  parking: ['Parking', 'Free parking'],

  // Check-in & Access
  'self check-in': ['Self check-in'],
  keypad: ['Self check-in'],
  'smart lock': ['Self check-in'],
  lockbox: ['Self check-in'],

  // Laundry & Grooming
  iron: ['Iron'],
  'ironing board': ['Iron'],
  washer: ['Washer', 'Free washer'],
  'free washer': ['Free washer', 'Washer'],
  'washing machine': ['Washer', 'Free washer'],
  'hair dryer': ['Hair dryer'],
  hairdryer: ['Hair dryer'],
  shampoo: ['Shampoo'],
  'body soap': ['Body soap'],
  'shower gel': ['Shower gel'],
  'cleaning products': ['Cleaning products'],
  essentials: ['Essentials'],

  // Kitchen & Appliances
  kitchen: ['Kitchen'],
  refrigerator: ['Refrigerator'],
  fridge: ['Refrigerator'],
  microwave: ['Microwave'],
  'cooking basics': ['Cooking basics'],
  'dishes and silverware': ['Dishes and silverware'],
  dishwasher: ['Dishwasher'],
  'hot water kettle': ['Hot Water', 'Hot water kettle'],
  kettle: ['Hot water kettle'],
  'wine glasses': ['Wine glasses'],
  toaster: ['Toaster'],
  'rice maker': ['Rice maker'],
  'dining table': ['Dining table'],

  // Entertainment & Workspace
  tv: ['TV'],
  hdtv: ['TV'],
  'smart tv': ['TV'],
  'board games': ['Board games'],
  'dedicated workspace': ['Workspace', 'Dedicated workspace'],
  workspace: ['Workspace', 'Dedicated workspace'],
  desk: ['Workspace', 'Dedicated workspace'],

  // Views & Location
  'sea view': ['Sea View'],
  'ocean view': ['Sea View'],
  'river view': ['River View'],
  'mountain view': ['Mountain View'],
  'garden view': ['Garden View'],
  'beach access': ['Beach Access'],

  // Safety Features
  'first aid kit': ['First aid kit'],
  'smoke alarm': ['Smoke alarm'],
  'fire extinguisher': ['Fire extinguisher'],
  'carbon monoxide alarm': ['Carbon monoxide alarm'],

  // Policies & Rules
  'pets allowed': ['Pet-friendly', 'Pets Allowed', 'Pets allowed'],
  'pet friendly': ['Pet-friendly', 'Pets Allowed'],
  'long term stays allowed': ['Long term stays allowed'],
  'building staff': ['Building staff'],
  'cleaning before checkout': ['Cleaning before checkout'],
  breakfast: ['Breakfast'],
};

export function normalizeAmenities(rawAmenities: string[]): string[] {
  const result = new Set<string>();

  for (const raw of rawAmenities) {
    if (!raw || typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();
    result.add(trimmed);

    for (const [key, targets] of Object.entries(AMENITY_ALIASES)) {
      if (lower === key || lower.includes(key)) {
        for (const target of targets) {
          result.add(target);
        }
      }
    }
  }

  return Array.from(result);
}

/** normalizeAmenities() returns a broad label set (some outside the AMENITIES
 * checklist, e.g. "Sea View", "Iron"); this narrows it down to only the
 * canonical checkbox labels, for pre-checking the AMENITIES toggle UI. */
export function matchKnownAmenities(rawAmenities: string[]): string[] {
  const normalized = new Set(normalizeAmenities(rawAmenities));
  return AMENITIES.filter((known) => normalized.has(known));
}
