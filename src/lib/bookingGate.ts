// Launch switch for website bookings. Closed by default: the payment step
// shows a "not live yet" message and never creates an order or charges anyone.
//
// To open bookings at launch: set VITE_BOOKINGS_OPEN=true in the Vercel
// project's environment variables and redeploy. No code change needed.
export const BOOKINGS_OPEN = import.meta.env.VITE_BOOKINGS_OPEN === "true";

export const BOOKINGS_CLOSED_MESSAGE =
  "Wayzyy isn't live for bookings just yet. We open very soon, so no payment has been taken. Please check back in a few days.";
