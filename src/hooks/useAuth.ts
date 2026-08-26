import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Clean up Supabase hash error parameters if email link expired or had origin mismatch
    if (window.location.hash && window.location.hash.includes("error_description")) {
      console.warn("Supabase Auth URL Hash Notice:", window.location.hash);
      // Clean hash from URL bar without forcing page reload
      window.history.replaceState(null, "", window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  const getAuthRedirectUrl = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return "https://wayzyy.com/host";
      }
      return `${origin}/host`;
    }
    return "https://wayzyy.com/host";
  };

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = getAuthRedirectUrl();
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl,
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    const redirectTo = getAuthRedirectUrl();
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { session, user: session?.user ?? null, loading, signUp, signIn, signInWithGoogle, signOut };
};
