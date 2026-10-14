import React, { useEffect, useState } from "react";
import { X, CheckCircle2, Loader2, Info } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Shown instead of the booking window while bookings are closed (see
// lib/bookingGate.ts). Takes no payment and needs no sign-in: the visitor
// leaves their contact details, the property-enquiry function stores it and
// emails hello@wayzyy.com, and the team follows up with the host and the guest.

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: { id: string; title: string; city?: string; area?: string; images?: string[] };
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
}

export const EnquiryModal: React.FC<Props> = ({ isOpen, onClose, property, checkInDate, checkOutDate, guestCount }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: people never see or fill this
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Pre-fill from the signed-in account, without overwriting anything typed.
  useEffect(() => {
    if (user?.email) setEmail((prev) => prev || user.email!);
    const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
    const known = meta.full_name || meta.name;
    if (known) setName((prev) => prev || known);
  }, [user]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { data, error } = await supabase.functions.invoke("property-enquiry", {
      body: {
        propertyId: property.id,
        name,
        phone,
        email,
        message,
        website,
        guests: guestCount,
        checkIn: format(checkInDate, "yyyy-MM-dd"),
        checkOut: format(checkOutDate, "yyyy-MM-dd"),
      },
    });
    setSending(false);

    if (error || (data as any)?.error) {
      let description = (data as any)?.error || "Please check your details and try again.";
      try {
        const body = await (error as any)?.context?.json?.();
        if (body?.error) description = body.error;
      } catch { /* no body */ }
      toast({ title: "Couldn't send your enquiry", description, variant: "destructive" });
      return;
    }
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="font-display text-lg font-black text-foreground">
            {sent ? "Enquiry received" : "Enquire about this stay"}
          </span>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {sent ? (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-foreground">Thank you, {name.split(" ")[0] || "there"}.</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We've noted your interest in <strong className="text-foreground">{property.title}</strong>. Wayzyy is going live very
                soon. Our team will get in touch with the host and update you on this stay, using the contact details you
                shared.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                You can also come back and book it directly as soon as we launch.
              </p>
              <button onClick={onClose} className="rounded-full bg-[#FF6B00] px-6 py-2.5 text-sm font-bold text-white">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-3 text-xs leading-relaxed text-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" />
                <span>
                  We're going live soon, so bookings and payments aren't open yet. Leave your details to show interest in this
                  stay. Our team will contact the host and get back to you, or you can return and book when we launch.
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-3">
                {property.images?.[0] && <img src={property.images[0]} alt="" className="h-14 w-16 rounded-xl object-cover" />}
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-bold text-foreground">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(checkInDate, "MMM d")} – {format(checkOutDate, "MMM d, yyyy")} · {guestCount} guest{guestCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="enq-name" className="text-[11px] font-bold uppercase text-muted-foreground">Your name</label>
                <input id="enq-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                  className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-[#FF6B00]" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-phone" className="text-[11px] font-bold uppercase text-muted-foreground">Phone</label>
                  <input id="enq-phone" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-[#FF6B00]" />
                </div>
                <div>
                  <label htmlFor="enq-email" className="text-[11px] font-bold uppercase text-muted-foreground">Email</label>
                  <input id="enq-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-[#FF6B00]" />
                </div>
              </div>
              <div>
                <label htmlFor="enq-msg" className="text-[11px] font-bold uppercase text-muted-foreground">Anything we should know (optional)</label>
                <textarea id="enq-msg" rows={3} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-[#FF6B00]" />
              </div>

              {/* Honeypot - hidden from people, tempting for form-filling bots. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>

              <button type="submit" disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#FF781A] to-[#E05300] py-3.5 text-sm font-black text-white shadow-lg disabled:opacity-60">
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send my enquiry"}
              </button>
              <p className="text-center text-[11px] text-muted-foreground">No payment is taken. We'll only use your details to reply about this stay.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
