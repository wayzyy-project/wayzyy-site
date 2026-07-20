import { createClient } from "@supabase/supabase-js";

// Same Supabase project as the mobile app — same auth.users, same
// properties table, same storage buckets. A host who signs up here can
// log into the mobile app with the same credentials, and vice versa.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
