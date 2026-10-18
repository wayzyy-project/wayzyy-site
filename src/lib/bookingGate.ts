// Launch switch for website bookings. Closed by default: the payment step
// shows a "not live yet" message and never creates an order or charges anyone.
//
// To open bookings at launch: set VITE_BOOKINGS_OPEN=true in the Vercel
// project's environment variables and redeploy. No code change needed.
export const BOOKINGS_OPEN = import.meta.env.VITE_BOOKINGS_OPEN === "true";

export const BOOKINGS_CLOSED_MESSAGE =
  "Wayzyy isn't live for bookings just yet. We open very soon, so no payment has been taken. Please check back in a few days.";

// Listings that take real bookings even while BOOKINGS_OPEN is off - used to
// run a live payment test on one hidden seed listing ("Hey12", Rs 100/night,
// not shown on Explore) without opening every listing.
// Empty again after the 19 Oct live payment test on "Hey12".
const BOOKABLE_BEFORE_LAUNCH = new Set<string>([]);

export const bookingsOpenFor = (propertyId?: string | null): boolean =>
  BOOKINGS_OPEN || (!!propertyId && BOOKABLE_BEFORE_LAUNCH.has(propertyId));
