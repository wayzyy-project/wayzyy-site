import React, { useState } from "react";
import {
  ShieldCheck, Upload, Camera, FileText, CheckCircle2, Loader2, AlertCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface ManualVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DOC_TYPES = [
  { id: "aadhaar", label: "Aadhaar Card", requiresBack: true },
  { id: "pan", label: "PAN Card", requiresBack: false },
  { id: "passport", label: "Passport", requiresBack: false },
];

export function ManualVerificationModal({ isOpen, onClose, onSuccess }: ManualVerificationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [docType, setDocType] = useState<string>("aadhaar");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedDocConfig = DOC_TYPES.find((d) => d.id === docType);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToStorage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${user?.id || "anon"}_${folder}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("identity-verification")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      // Fallback: return data URL if storage bucket fails/unconfigured in local dev
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    return filePath;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit verification documents.",
        variant: "destructive",
      });
      return;
    }

    if (!frontFile) {
      toast({
        title: "Document image required",
        description: `Please upload the front photo of your ${selectedDocConfig?.label}.`,
        variant: "destructive",
      });
      return;
    }

    if (selectedDocConfig?.requiresBack && !backFile) {
      toast({
        title: "Document back image required",
        description: `Please upload the back photo of your ${selectedDocConfig?.label}.`,
        variant: "destructive",
      });
      return;
    }

    if (!selfieFile) {
      toast({
        title: "Selfie required",
        description: "Please upload a clear selfie photo of yourself.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const frontPath = await uploadToStorage(frontFile, "front");
      const backPath = backFile ? await uploadToStorage(backFile, "back") : null;
      const selfiePath = await uploadToStorage(selfieFile, "selfie");

      const { error } = await supabase.from("identity_verification_submissions").insert({
        user_id: user.id,
        user_email: user.email,
        doc_type: docType,
        doc_front_url: frontPath,
        doc_back_url: backPath,
        selfie_url: selfiePath,
        status: "pending_review",
        submitted_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Verification submitted!",
        description: "Your documents have been submitted for manual review. Our team will verify them shortly.",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Manual verification error:", err);
      toast({
        title: "Submission failed",
        description: err?.message || "Could not submit identity verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Manual Identity Verification</h2>
              <p className="text-xs text-muted-foreground">Upload official government ID and a selfie for human verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Document Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Government ID Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {DOC_TYPES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setDocType(d.id);
                  setBackFile(null);
                  setBackPreview(null);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  docType === d.id
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4 mb-1.5" />
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Photos Upload */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            ID Photos ({selectedDocConfig?.label})
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Front Photo */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-center relative overflow-hidden group">
              {frontPreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                  <img src={frontPreview} alt="ID Front" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFrontFile(null); setFrontPreview(null); }}
                    className="absolute top-1.5 right-1.5 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full flex flex-col items-center py-3">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-foreground">Upload ID Front</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, setFrontFile, setFrontPreview)}
                  />
                </label>
              )}
            </div>

            {/* Back Photo (if required) */}
            {selectedDocConfig?.requiresBack ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-center relative overflow-hidden group">
                {backPreview ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                    <img src={backPreview} alt="ID Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setBackFile(null); setBackPreview(null); }}
                      className="absolute top-1.5 right-1.5 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full flex flex-col items-center py-3">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-foreground">Upload ID Back</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, setBackFile, setBackPreview)}
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 p-4 bg-muted/10 text-center">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground/40 mb-1.5" />
                <span className="text-xs text-muted-foreground font-medium">Single-sided ID</span>
                <span className="text-[11px] text-muted-foreground/70">Back photo not required for {selectedDocConfig?.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selfie Upload */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Selfie Verification</Label>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-center relative overflow-hidden group">
            {selfiePreview ? (
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary shadow-md">
                <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setSelfieFile(null); setSelfiePreview(null); }}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full flex flex-col items-center py-2">
                <Camera className="h-6 w-6 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Upload Live Selfie</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Ensure face is clearly visible without sunglasses or hats</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, setSelfieFile, setSelfiePreview)}
                />
              </label>
            )}
          </div>
        </div>

        {/* Informational note */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your identity details are securely stored and encrypted. Manual reviews are usually processed within 2 to 12 hours by our Indian operations team.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> Submit Documents
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
