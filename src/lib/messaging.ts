import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Mirrors mobile/src/services/messaging.ts function-for-function against the
// exact same `threads`/`messages` tables and `mark_thread_read` RPC in the
// same Supabase project - a thread started here shows up in the app (and
// vice versa) because it IS the same conversation, not a separate inbox
// that happens to look similar. Keep the two files in sync.

export const WAYZYY_SYSTEM_ACCOUNT_ID = "f85239f2-6e02-40ae-a09f-09d2941bc7eb";

// ─── Types ────────────────────────────────────────────────────────────────

export interface Thread {
  id: string;
  property_id: string;
  property_title: string;
  guest_id: string;
  host_id: string;
  guest_name: string;
  host_name: string;
  guest_avatar: string | null;
  host_avatar: string | null;
  last_message: string | null;
  last_message_at: string;
  guest_unread: number;
  host_unread: number;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  reply_to_id: string | null;
  reply_to_text: string | null;
}

// ─── Thread helpers ─────────────────────────────────────────────────────────

/** Find an existing thread or create a new one. Returns the thread id. */
export const getOrCreateThread = async (params: {
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  hostId: string;
  guestName: string;
  hostName: string;
}): Promise<string | null> => {
  const { data: existing } = await supabase
    .from("threads")
    .select("id")
    .eq("property_id", params.propertyId)
    .eq("guest_id", params.guestId)
    .eq("host_id", params.hostId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("threads")
    .insert({
      property_id: params.propertyId,
      property_title: params.propertyTitle,
      guest_id: params.guestId,
      host_id: params.hostId,
      guest_name: params.guestName,
      host_name: params.hostName,
    })
    .select("id")
    .single();

  if (error) {
    console.error("getOrCreateThread error:", JSON.stringify(error));
    throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  }
  return created.id;
};

/** Fetch all threads for a user (as guest or host), newest first. */
export const fetchThreads = async (userId: string): Promise<Thread[]> => {
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  if (error) { console.warn("fetchThreads:", error); return []; }
  const threads = data ?? [];
  if (threads.length === 0) return [];

  const userIds = Array.from(new Set(threads.flatMap((t: any) => [t.guest_id, t.host_id])));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, avatar_url")
    .in("id", userIds);
  const avatarById = new Map((profiles ?? []).map((p: any) => [p.id, p.avatar_url as string | null]));

  const isUnread = (t: any, forHostSide: boolean): number => {
    const recipientId = forHostSide ? t.host_id : t.guest_id;
    if (!t.last_message_sender_id || t.last_message_sender_id === recipientId) return 0;
    const lastReadAt = forHostSide ? t.host_last_read_at : t.guest_last_read_at;
    if (!lastReadAt) return 1;
    return new Date(t.last_message_at) > new Date(lastReadAt) ? 1 : 0;
  };

  return threads.map((t: any) => ({
    ...t,
    guest_avatar: avatarById.get(t.guest_id) ?? null,
    host_avatar: avatarById.get(t.host_id) ?? null,
    guest_unread: isUnread(t, false),
    host_unread: isUnread(t, true),
  }));
};

// ─── Message helpers ────────────────────────────────────────────────────────

/** Fetch all messages in a thread, oldest first. */
export const fetchMessages = async (threadId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) { console.warn("fetchMessages:", error); return []; }
  return data ?? [];
};

/** Send a message. Thread preview fields are updated by a DB trigger on
 *  insert, same as mobile - never set them from here. */
export const sendMessage = async (
  threadId: string,
  senderId: string,
  senderName: string,
  content: string,
  replyToId?: string,
  replyToText?: string,
): Promise<Message | null> => {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: senderId,
      content,
      ...(replyToId ? { reply_to_id: replyToId } : {}),
      ...(replyToText ? { reply_to_text: replyToText } : {}),
    })
    .select()
    .single();

  if (error) { console.warn("sendMessage:", error); return null; }

  supabase.functions
    .invoke("send-message-notification", { body: { threadId, senderId, senderName, content } })
    .catch((e) => console.warn("push notification failed:", e));

  return data;
};

/** Mark all messages in a thread as read for the current user role - stamps
 *  the database's own now(), not this browser's clock (see mobile's note on
 *  clock drift causing unread dots to stick). */
export const markThreadRead = async (threadId: string, isHost: boolean) => {
  await supabase.rpc("mark_thread_read", { p_thread_id: threadId, p_is_host: isHost });
};

// ─── Realtime ───────────────────────────────────────────────────────────────

export const subscribeToMessages = (
  threadId: string,
  onMessage: (msg: Message) => void,
): RealtimeChannel => {
  return supabase
    .channel(`messages:${threadId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
      (payload) => onMessage(payload.new as Message),
    )
    .subscribe();
};

export const subscribeToThreads = (userId: string, onChange: () => void): RealtimeChannel => {
  return supabase
    .channel(`threads:${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "threads" }, onChange)
    .subscribe();
};
