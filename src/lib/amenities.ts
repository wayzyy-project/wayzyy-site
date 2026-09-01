/**
 * Wayzyy Amenity Normalizer & Mapping Utility
 * Translates raw Airbnb / AirROI amenity names into standardized Wayzyy amenity labels
 * used across the website, mobile app, and backend database.
 */

/**
 * The amenity catalogue, grouped the way a host thinks about their place.
 *
 * This was 17 items, which caused two problems: a host had almost nothing
 * to choose from, and matchKnownAmenities() filters imported amenities down
 * to this list - so anything Airbnb sent that wasn't one of the 17 was
 * silently dropped on import, including things the alias table already knew
 * how to resolve (Sea View, Balcony, Self check-in, Smoke alarm...).
 *
 * Weighted towards what actually matters for Goa and India - backup power,
 * mosquito nets, water purifiers, caretakers - rather than a generic list.
 */
export const AMENITY_GROUPS: { group: string; items: string[] }[] = [
  {
    group: "Essentials",
    items: [
      "WiFi", "Fast WiFi", "AC", "Heating", "Ceiling fan", "Hot Water", "Geyser",
      "TV", "Washer", "Dryer", "Iron", "Hair dryer", "Towels & linens", "Hangers",
      "Wardrobe", "Backup power / Inverter", "Generator",
    ],
  },
  {
    group: "Kitchen & dining",
    items: [
      "Kitchen", "Refrigerator", "Microwave", "Stove", "Oven", "Dishwasher",
      "Cooking basics", "Dishes & silverware", "Coffee maker", "Kettle",
      "Toaster", "Water purifier", "Dining table", "BBQ",
    ],
  },
  {
    group: "Bathroom",
    items: ["Shampoo", "Conditioner", "Body soap", "Bathtub", "Bidet", "Toiletries"],
  },
  {
    group: "Bedroom",
    items: [
      "Extra pillows & blankets", "Room-darkening blinds", "Mosquito net",
      "Safe", "Crib", "Extra mattress",
    ],
  },
  {
    group: "Outdoor",
    items: [
      "Pool", "Private pool", "Shared pool", "Jacuzzi", "Garden", "Balcony",
      "Terrace", "Rooftop", "Outdoor furniture", "Outdoor dining", "Fire pit",
      "Hammock", "Beach Access", "Beach essentials", "Courtyard",
    ],
  },
  {
    group: "Views",
    items: ["Sea View", "Ocean view", "Garden View", "Mountain View", "Pool view", "River view", "City view"],
  },
  {
    group: "Parking & facilities",
    items: ["Parking", "Free parking", "Paid parking", "EV Charger", "Gym", "Elevator", "Single-level home", "Scooter rental"],
  },
  {
    group: "Family",
    items: ["High chair", "Baby bath", "Children's books & toys", "Board games", "Baby safety gates"],
  },
  {
    group: "Safety",
    items: [
      "Smoke alarm", "Carbon monoxide alarm", "Fire extinguisher", "First aid kit",
      "Exterior security cameras", "Gated property", "Caretaker on site", "Security guard",
    ],
  },
  {
    group: "Services & policies",
    items: [
      "Breakfast", "Self check-in", "Housekeeping", "Laundry service", "Chef available",
      "Airport shuttle", "Luggage drop-off", "Workspace", "Long term stays allowed",
      "Pet-friendly", "Smoking allowed", "Events allowed",
    ],
  },
];

// Flat list - kept as the same shape and name so the wizard, the import
// review flow and matchKnownAmenities() all keep working unchanged.
export const AMENITIES = AMENITY_GROUPS.flatMap((g) => g.items);

/** Which group an amenity belongs to, for grouping search results. */
export function amenityGroupOf(amenity: string): string | null {
  return AMENITY_GROUPS.find((g) => g.items.includes(amenity))?.group ?? null;
}

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
