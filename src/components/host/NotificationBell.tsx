import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface HostNotification {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

// A minimal notification inbox - right now it only ever fires one thing
// (admin imported properties for you, go set pricing), but it's a real
// table/read-state, not a toast that vanishes if you miss it.
export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<HostNotification[]>([]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("host_notifications")
      .select("id, title, body, link, read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications((data as HostNotification[]) ?? []);
  };

  useEffect(() => {
    fetchNotifications();
    // Light polling rather than realtime - this fires rarely (once per
    // admin "Notify host" click), doesn't need a socket for that.
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = async (n: HostNotification) => {
    if (!n.read) {
      await supabase.from("host_notifications").update({ read: true }).eq("id", n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.link) navigate(n.link);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">Nothing yet.</div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => handleClick(n)}
              className="flex flex-col items-start gap-0.5 whitespace-normal py-2.5"
            >
              <div className="flex w-full items-start gap-2">
                {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                {n.read && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs ${n.read ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                  {n.body && <p className="text-[11px] text-muted-foreground mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {new Date(n.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
