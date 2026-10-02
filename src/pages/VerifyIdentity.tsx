import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

/**
 * Active identity-verification page - doesn't exist on mobile either yet
 * (mobile's own gate is entirely passive: create-booking just withholds the
 * confirmation email until aadhaar_verified is true, with no on-screen
 * prompt anywhere). This is the first place either platform actively walks
 * someone through it, wired to the live Digio-based digilocker-initiate/
 * digilocker-complete functions (see supabase/functions in wayzyy-app).
 *
 * Digio's flow is workflow+webhook driven, not a redirect-and-exchange like
 * Setu's - so after opening the consent link, this page polls
 * digilocker-complete (which itself checks Digio's status) rather than
 * waiting for a callback URL.
 */
export default function VerifyIdentity() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  // Internal paths only - never let ?returnTo= send someone off-site.
  const rawReturnTo = searchParams.get("returnTo") ?? "";
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/trips";

  const [checking, setChecking] = useState(true);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [starting, setStarting] = useState(false);
  const [consentUrl, setConsentUrl] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check whether this account is already verified before offering to start.
  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("aadhaar_verified, digilocker_request_id")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data?.aadhaar_verified === true) {
        setAlreadyVerified(true);
        setChecking(false);
        return;
      }
      // A request started earlier (this tab timed out, or the guest finished
      // from Digio's email link instead) - one status check picks that up,
      // since nothing else marks the profile verified without polling.
      if (data?.digilocker_request_id) {
        requestIdRef.current = data.digilocker_request_id;
        const { data: status } = await supabase.functions.invoke("digilocker-complete", {
          body: { requestId: data.digilocker_request_id },
        });
        if (cancelled) return;
        if (status?.verified) setAlreadyVerified(true);
      }
      setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("digilocker-initiate", {
        body: {
          redirectUrl: `${window.location.origin}/verify-identity?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });
      if (fnError || !data) {
        throw new Error(fnError?.message ?? "Could not start DigiLocker verification");
      }
      // requestId/consentUrl come straight from the live digilocker-initiate
      // response - see supabase/functions/digilocker-initiate in wayzyy-app.
      const requestId = data.requestId ?? data.digioResponse?.id ?? null;
      const url = data.consentUrl ?? null;
      if (!requestId) throw new Error("Digio didn't return a request id");
      requestIdRef.current = requestId;
      if (url) {
        setConsentUrl(url);
        window.open(url, "_blank", "noopener,noreferrer");
      }
      beginPolling();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong starting verification");
    } finally {
      setStarting(false);
    }
  }

  function beginPolling() {
    if (pollTimer.current) clearInterval(pollTimer.current);
    setPolling(true);
    // Digio's flow completes asynchronously (the user finishes DigiLocker
    // consent in the tab that just opened, then Digio's webhook - or, as a
    // fallback, this same status check - marks it done). Poll every 5s for
    // up to 5 minutes rather than require a page reload.
    let attempts = 0;
    pollTimer.current = setInterval(async () => {
      attempts += 1;
      const requestId = requestIdRef.current;
      if (!requestId) return;
      const { data } = await supabase.functions.invoke("digilocker-complete", {
        body: { requestId },
      });
      if (data?.verified) {
        setVerified(true);
        setPolling(false);
        if (pollTimer.current) clearInterval(pollTimer.current);
        return;
      }
      if (attempts >= 60) {
        setPolling(false);
        if (pollTimer.current) clearInterval(pollTimer.current);
      }
    }, 5000);
  }

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <h1 className="font-display text-xl font-bold text-slate-900">Sign in first</h1>
        <p className="max-w-sm text-sm text-slate-500">You need to be signed in to verify your identity.</p>
        <Link to="/" className="mt-2 text-sm font-semibold text-ember">Go to wayzyy.com</Link>
      </div>
    );
  }

  return (
    <SEO title="Verify your identity" description="Verify your identity via DigiLocker to complete your Wayzyy booking.">
      <div className="min-h-screen bg-white">
        <header className="flex items-center gap-2.5 px-5 py-4 sm:px-8">
          <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-base font-bold tracking-tight text-slate-900">wayzyy</span>
        </header>

        <main className="mx-auto flex max-w-md flex-col items-center px-5 pb-20 pt-10 text-center sm:px-8">
          {alreadyVerified || verified ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">You're verified</h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Your identity's been confirmed via DigiLocker. Your booking's full confirmation is on its way.
              </p>
              <Link
                to={returnTo}
                className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white"
              >
                Continue
              </Link>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Verify your identity</h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Wayzyy verifies every guest via DigiLocker (Aadhaar) for everyone's safety. This takes under a minute.
              </p>

              {error && (
                <div className="mt-4 w-full rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>
              )}

              {!consentUrl ? (
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify with DigiLocker"}
                </button>
              ) : (
                <div className="mt-6 w-full space-y-3">
                  <a
                    href={consentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white"
                  >
                    Open DigiLocker verification <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {polling ? (
                    <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Waiting for you to finish in the other tab…
                    </p>
                  ) : (
                    <button
                      onClick={beginPolling}
                      className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
                    >
                      I've finished - check again
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </SEO>
  );
}
