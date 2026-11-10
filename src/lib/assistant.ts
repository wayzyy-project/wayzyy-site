// Shared bits for the Wayzyy trip assistant: the chat's types, where it keeps its
// conversation in the browser, and a way for any button on the site to open it.

export interface StayCard {
  id: string;
  title: string;
  location: string;
  bedrooms: number | null;
  maxGuests: number | null;
  pool: "private" | "pool" | "none";
  jacuzzi: boolean;
  nights: number;
  total: number;
  perNight: number;
  url: string;
  calendarSynced: boolean;
}

export interface Msg {
  role: "user" | "assistant";
  content: string;
  stays?: StayCard[];
}

export const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I can help you find a stay in Goa. Tell me your dates, how many of you are travelling, and roughly what you're looking for (area, pool, budget), and I'll check what's actually free.",
};

// Tap-to-send starters, shown until the guest says something.
export const SUGGESTIONS = [
  "Villa with a pool for 6 people",
  "Weekend stay in North Goa",
  "2BHK under ₹8,000 a night",
  "I'm flexible on dates",
];

const STORAGE_KEY = "wayzyy_assistant_chat_v1";
const SESSION_KEY = "wayzyy_assistant_session_v1";

// One id per chat, so the team sees a conversation as one record rather than many messages.
export function chatSessionId(fresh = false): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && !fresh) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function loadChat(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Storage can be blocked (private windows) - start fresh.
  }
  return [GREETING];
}

export function saveChat(messages: Msg[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  } catch {
    // The chat just won't survive a refresh.
  }
}

// The server gives absolute links; keep navigation inside the app.
export const localHref = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
};

export const OPEN_ASSISTANT_EVENT = "wayzyy:open-assistant";

/** Open the floating assistant from anywhere (e.g. the "chat instead" line under the search bar). */
export function openAssistant() {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT));
}
