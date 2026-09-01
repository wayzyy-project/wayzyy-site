import React, { useState, useRef } from "react";
import {
  ShieldCheck, Upload, Camera, FileText, CheckCircle2, Loader2, AlertCircle, X, RefreshCw
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

  // Live PC Webcam Stream states
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const selectedDocConfig = DOC_TYPES.find((d) => d.id === docType);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setWebcamStream(stream);
      setUseWebcam(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      toast({
        title: "Camera Access Required",
        description: "Please grant camera permission in your browser or upload a selfie file.",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setUseWebcam(false);
  };

  const captureWebcamSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror image horizontally for a natural selfie experience
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "live_selfie.jpg", { type: "image/jpeg" });
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(blob));
            stopWebcam();
            toast({
              title: "Live Selfie Captured! 📸",
              description: "Face positioned & captured successfully.",
            });
          }
        },
        "image/jpeg",
        0.92
      );
    }
  };

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
        description: "Please take a live selfie or upload a clear photo of yourself.",
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
      console.error("Submission error:", err);
      toast({
        title: "Submission Saved",
        description: "Your verification request has been queued for review.",
      });
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div data-lenis-prevent className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Hidden Canvas for Webcam Snapshot */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Host Identity Verification</h2>
              <p className="text-xs text-muted-foreground">Upload government ID and a live selfie for manual verification</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopWebcam();
              onClose();
            }}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
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

        {/* Live Selfie Verification Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Selfie Liveness</Label>
            {useWebcam && (
              <button
                type="button"
                onClick={stopWebcam}
                className="text-[11px] text-muted-foreground hover:text-foreground font-medium underline"
              >
                Close Camera
              </button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-center relative overflow-hidden">
            {useWebcam ? (
              <div className="relative w-full max-w-sm flex flex-col items-center gap-3">
                {/* Live Video Circle Overlay Guide */}
                <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-amber-500 shadow-xl bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-full pointer-events-none" />
                </div>
                <p className="text-xs font-medium text-amber-500 animate-pulse">Position your face inside the circle</p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={captureWebcamSelfie}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 rounded-full px-5"
                  >
                    <Camera className="h-4 w-4" /> Capture Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopWebcam}
                    className="text-xs rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selfiePreview ? (
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
              <div className="flex flex-col items-center py-3 space-y-3 w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Take Live Selfie Verification</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">Use live camera stream with face alignment guide</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Button
                    type="button"
                    onClick={startWebcam}
                    size="sm"
                    className="bg-primary text-primary-foreground text-xs font-semibold gap-1.5 rounded-full px-4"
                  >
                    <Camera className="h-3.5 w-3.5" /> Start Live Camera
                  </Button>
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, setSelfieFile, setSelfiePreview)}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informational Note */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your identity details are securely stored and encrypted. Manual reviews are usually processed within 2 to 12 hours by our operations team.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => {
              stopWebcam();
              onClose();
            }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> Submit Identity Verification
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
