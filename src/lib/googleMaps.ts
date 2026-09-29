// A separate key from the mobile app's - that one is restricted to the
// Android/iOS bundle and rejects any browser request outright. This one is
// restricted to wayzyy.com/* under Application restrictions in Cloud
// Console, which only Maps JavaScript API (this) supports - the Geocoding
// API doesn't support HTTP-referrer restriction at all, which is why
// geocoding is a separate server-side key, never shipped to the browser.
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
