import { createClient } from "@supabase/supabase-js";

// Same Supabase project as the mobile app - same auth.users, same
// properties table, same storage buckets. A host who signs up here can
// log into the mobile app with the same credentials, and vice versa.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge Function calls with a stale session.
//
// A tab left open (or a laptop asleep) can wake with an access token that has
// already expired; the background refresh timer was paused, so the next
// functions.invoke() goes out with that expired token and the function answers
// 401 - "Couldn't update the booking / non-2xx status code". Wrap invoke so it
// (1) refreshes first when the token is expired or about to be, and (2) on a
// 401, refreshes once and retries. Every functions.invoke() on the site gets
// this without touching the call sites.
const rawInvoke = supabase.functions.invoke.bind(supabase.functions);

async function freshSession(force = false) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const expiresSoon = (session.expires_at ?? 0) * 1000 < Date.now() + 60_000;
  if (!force && !expiresSoon) return session;
  const { data, error } = await supabase.auth.refreshSession();
  return error ? null : data.session;
}

(supabase.functions as any).invoke = async (name: string, options: any = {}) => {
  await freshSession();
  let result = await rawInvoke(name, options);
  const status = (result.error as any)?.context?.status;
  if (status === 401) {
    const session = await freshSession(true);
    if (session) {
      result = await rawInvoke(name, {
        ...options,
        headers: { ...(options.headers ?? {}), Authorization: `Bearer ${session.access_token}` },
      });
    } else if (result.error) {
      (result.error as any).message = "Your sign-in has expired. Please sign in again.";
    }
  }
  return result;
};

// Background tabs pause the refresh timer; restart it when the tab is visible.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
