import { supabase } from "./supabase";

// Same block-user function and user_blocks table as the app.
export interface BlockResult { ok: boolean; reason?: string }

export const isBlocked = async (blockerId: string, blockedId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("user_blocks").select("blocked_id")
    .eq("blocker_id", blockerId).eq("blocked_id", blockedId).maybeSingle();
  return !!data;
};

const call = async (blockedId: string, action: "block" | "unblock"): Promise<BlockResult> => {
  const { data, error } = await supabase.functions.invoke("block-user", { body: { blockedId, action } });
  if (!error && (data as any)?.ok) return { ok: true };
  let reason: string | undefined;
  try { reason = (await (error as any)?.context?.json?.())?.error; } catch { /* no body */ }
  return { ok: false, reason: reason ?? "Something went wrong. Please try again." };
};

export const blockUser = (blockerId: string, blockedId: string): Promise<BlockResult> =>
  blockerId === blockedId ? Promise.resolve({ ok: false, reason: "You can't block yourself." }) : call(blockedId, "block");
export const unblockUser = (blockedId: string) => call(blockedId, "unblock");
