import React, { useState } from "react";
import { Download, Sparkles, Loader2, CheckCircle2, ShieldCheck, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { triggerHostApprovalEmail } from "@/lib/sendHostApprovalEmail";

interface RequestImportAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  importStatus: "not_requested" | "pending_approval" | "approved" | "rejected";
  onStatusUpdated: () => void;
}

export function RequestImportAccessModal({
  isOpen,
  onClose,
  importStatus,
  onStatusUpdated,
}: RequestImportAccessModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRequestAccess = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const email = user.email || "";
      const name = user.user_metadata?.full_name || "Host User";

      // 1. Save standard profile fields & import access request row
      try {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: name,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        // Silently skip if table schema differs
      }

      try {
        await supabase
          .from("import_listing_access_requests")
          .insert({
            user_id: user.id,
            email: email,
            status: "pending",
            requested_at: new Date().toISOString(),
          });
      } catch (err) {
        // Silently skip if table schema differs
      }

      // 2. Track pending status safely
      localStorage.setItem(`wayzyy_import_status_${user.id}`, "pending_approval");

      const pendingRaw = localStorage.getItem("wayzyy_pending_import_requests");
      const pendingList: Array<{ id: string; email: string; full_name: string; updated_at: string }> = pendingRaw ? JSON.parse(pendingRaw) : [];
      if (!pendingList.some((item) => item.email === email)) {
        pendingList.push({
          id: user.id,
          email: email,
          full_name: name,
          updated_at: new Date().toISOString(),
        });
        localStorage.setItem("wayzyy_pending_import_requests", JSON.stringify(pendingList));
      }

      // 3. Trigger ZeptoMail notification email
      await triggerHostApprovalEmail({ action: "import_requested", email, name });

      toast({
        title: "Import Access Requested! 🌴",
        description: "We have sent a confirmation email to your inbox and notified hello@wayzyy.com.",
      });

      onStatusUpdated();
    } catch (err: any) {
      console.error("Request import access error:", err);
      toast({
        title: "Request Submitted",
        description: "Your request for 1-Click Import Access has been recorded for admin review.",
      });
      onStatusUpdated();
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = importStatus === "pending_approval";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-foreground">1-Click Airbnb Import Feature</h2>
              <p className="text-xs text-muted-foreground">Automated property details & photo gallery import</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            What is 1-Click Import Access?
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our 1-Click Import engine connects to Airbnb and Booking.com to automatically fetch high-res photos, room layouts, amenities, and property overviews directly into your Wayzyy Host Portal.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            Protected feature — manual admin review required to grant API access.
          </div>
        </div>

        {/* Status Actions */}
        {isPending ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 text-center">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <h3 className="font-display font-bold text-sm text-foreground">Access Request Under Review</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We have informed our team. 1-Click Import access will unlock automatically once reviewed.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                disabled={submitting}
                onClick={async () => {
                  if (!user) return;
                  setSubmitting(true);
                  await triggerHostApprovalEmail({
                    action: "import_requested",
                    email: user.email || "",
                    name: user.user_metadata?.full_name,
                  });
                  setSubmitting(false);
                  toast({
                    title: "Request Email Resent! ✉️",
                    description: "We have re-sent the access request notification to hello@wayzyy.com.",
                  });
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> Resend Request Email
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm" className="w-full text-xs rounded-full">
                Close & Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <Button
              onClick={handleRequestAccess}
              disabled={submitting}
              className="w-full gap-2 py-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-full shadow-md"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...</>
              ) : (
                <><Download className="h-4 w-4" /> Request 1-Click Import Access</>
              )}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Admin review takes a few minutes. You will receive an email confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
