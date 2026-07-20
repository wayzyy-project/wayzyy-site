// Free geocoding via OpenStreetMap's Nominatim — no API key needed. Mirrors
// the mobile app's Location.geocodeAsync/reverseGeocodeAsync behavior:
// pincode -> coordinates -> pan the map -> reverse geocode -> fill address
// fields, and the reverse direction when a pin is placed/dragged directly.

export interface ReverseGeocodeResult {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const HEADERS = { "Accept-Language": "en" };

export async function geocodePincode(pincode: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(pincode)}&country=India&format=json&limit=1`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const results = await res.json();
  if (!results?.length) return null;
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const data = await res.json();
  const addr = data?.address;
  if (!addr) return null;
  return {
    street: [addr.house_number, addr.road].filter(Boolean).join(" ") || undefined,
    city: addr.city ?? addr.town ?? addr.village ?? addr.county ?? undefined,
    state: addr.state ?? undefined,
    pincode: addr.postcode ?? undefined,
  };
}
