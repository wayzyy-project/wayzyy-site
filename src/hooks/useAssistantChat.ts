import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GREETING, Msg, chatSessionId, loadChat, saveChat } from "@/lib/assistant";

// The assistant's conversation, kept in the browser for the visit so it follows the
// guest from page to page. The words go to the server; stay cards come back with the reply.
export function useAssistantChat() {
  const [messages, setMessages] = useState<Msg[]>(loadChat);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveChat(messages);
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || sending) return;
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setError(null);
      setSending(true);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("trip-assistant", {
          body: { sessionId: chatSessionId(), messages: next.map(({ role, content: c }) => ({ role, content: c })) },
        });
        if (fnError || !data?.reply) throw new Error(fnError?.message || data?.error || "No reply");
        setMessages([...next, { role: "assistant", content: String(data.reply), stays: Array.isArray(data.stays) ? data.stays : [] }]);
      } catch {
        setError("Sorry, I couldn't reach the assistant. Please try again, or message the Wayzyy team.");
      } finally {
        setSending(false);
      }
    },
    [messages, sending],
  );

  const reset = useCallback(() => {
    chatSessionId(true);
    setMessages([GREETING]);
    setError(null);
  }, []);

  return { messages, sending, error, send, reset };
}
