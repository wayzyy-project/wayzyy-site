import { Navigate, useLocation } from "react-router-dom";

/**
 * /host-onboarding and /host-onboarding/status used to be a second, parallel
 * onboarding system with its own anonymous intake form and its own
 * public-by-email status lookup. Both are now folded into the authenticated
 * /host dashboard, so those two routes exist only to catch links already
 * shared with hosts (emails, WhatsApp, calls) and land them in the right
 * place instead of on a 404.
 *
 * Query params are carried through so campaign/attribution tags on any
 * previously-shared link survive the hop, and `intent=concierge` tells the
 * dashboard to open the "we'll do it for you" path once they're signed in.
 */
export function HostOnboardingRedirect() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  if (!params.has("intent")) params.set("intent", "concierge");

  return <Navigate to={`/host?${params.toString()}`} replace />;
}

export default HostOnboardingRedirect;
