// Goa areas we have stays in, each linked to its long-form guide on the blog.
// Used by the stays homepage ("Explore Goa by area") and by listing pages,
// which match a property's location/title to an area to show its guide.
export interface AreaGuide {
  area: string;
  vibe: string;
  blurb: string;
  guide: string;
}

export const AREA_GUIDES: AreaGuide[] = [
  { area: "Vagator", vibe: "Cliffs & nightlife", blurb: "Clifftop sunsets, Chapora Fort and North Goa's best-known party strip.", guide: "/blog/vagator-goa-beach-guide" },
  { area: "Anjuna", vibe: "Markets & cafés", blurb: "The Wednesday flea market, beach shacks and a laid-back café scene.", guide: "/blog/anjuna-goa-beach-guide" },
  { area: "Assagao", vibe: "Villas & quiet lanes", blurb: "Portuguese homes, leafy lanes and some of Goa's best restaurants.", guide: "/blog/assagao-goa-villas-guide" },
  { area: "Siolim", vibe: "Riverside & spacious", blurb: "Big villas by the Chapora river, close to Morjim and Vagator.", guide: "/blog/siolim-goa-villas-guide" },
  { area: "Morjim", vibe: "Calm beach", blurb: "A long, quiet beach with turtle nesting season and soft sand.", guide: "/blog/morjim-goa-beach-guide" },
  { area: "Candolim", vibe: "Easy beach days", blurb: "Gentle beach, Fort Aguada nearby, and everything within reach.", guide: "/blog/candolim-goa-beach-guide" },
  { area: "Calangute", vibe: "Busy & central", blurb: "Goa's liveliest beach, with water sports and food on every corner.", guide: "/blog/calangute-goa-beach-guide" },
  { area: "Baga", vibe: "Clubs & shacks", blurb: "Tito's Lane, beach clubs and nights that run late.", guide: "/blog/baga-goa-beach-guide" },
  { area: "Mandrem", vibe: "Slow & scenic", blurb: "Yoga retreats, a river crossing and an unhurried stretch of sand.", guide: "/blog/mandrem-goa-beach-guide" },
  { area: "Palolem", vibe: "South Goa bay", blurb: "A palm-lined crescent bay with calm water and kayaking.", guide: "/blog/palolem-beach-south-goa-guide" },
  { area: "Agonda", vibe: "Quiet South Goa", blurb: "A long, peaceful beach with beach huts and turtle season.", guide: "/blog/agonda-beach-south-goa-guide" },
  { area: "Cola", vibe: "Hidden lagoon", blurb: "A freshwater lagoon meeting the sea, reached down a dirt track.", guide: "/blog/cola-beach-goa-guide" },
  { area: "Galgibaga", vibe: "Untouched beach", blurb: "One of Goa's emptiest beaches, a protected turtle-nesting site.", guide: "/blog/galgibaga-beach-goa-guide" },
];

export const TRIP_GUIDES = [
  { title: "Goa beaches, ranked", to: "/blog/goa-beaches-guide" },
  { title: "Nightlife guide", to: "/blog/goa-nightlife-guide" },
  { title: "Where to eat", to: "/blog/goa-food-guide" },
  { title: "Itineraries", to: "/blog/goa-itinerary-guide" },
  { title: "North vs South Goa", to: "/blog/north-goa-vs-south-goa-guide" },
  { title: "Trip budget", to: "/blog/goa-trip-budget-guide" },
];

export function areaForListing(...fields: (string | null | undefined)[]): AreaGuide | null {
  const hay = fields.filter(Boolean).join(" ").toLowerCase();
  return AREA_GUIDES.find((g) => hay.includes(g.area.toLowerCase())) ?? null;
}
