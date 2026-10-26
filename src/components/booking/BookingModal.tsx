import { StayDatesCalendar } from "@/components/booking/StayDatesCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Smartphone,
  Loader2,
  Lock,
  ArrowRight,
  Download,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { PropertyListing } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import confetti from "canvas-confetti";
import { bookingsOpenFor, BOOKINGS_CLOSED_MESSAGE} from "@/lib/bookingGate";
import { trackAddPaymentInfo, trackBeginCheckout, trackPurchase, type TrackedStay } from "@/lib/analytics";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyListing;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  /** What actually gets charged via Razorpay: stay + GST + Wayzyy fee + its GST. The server re-checks it. */
  totalAmount: number;
  /** Stay price after discounts, before GST/fees - what coupons are checked against (same as the app). */
  accommodation?: number;
  /** GST inside totalAmount (stay GST + GST on the Wayzyy fee), so analytics can report a pre-tax value. */
  tax?: number;
  /** Lets the guest change dates here instead of closing the modal; the parent re-quotes. */
  onDatesChange?: (checkIn: Date, checkOut: Date) => void;
  minNights?: number;
  unavailable?: Set<string>;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;
function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  checkInDate,
  checkOutDate,
  guestCount,
  totalAmount,
  accommodation,
  tax = 0,
  onDatesChange,
  minNights = 1,
  unavailable,
}) => {
  const navigate = useNavigate();
  const [editDatesOpen, setEditDatesOpen] = useState(false);
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [signUpName, setSignUpName] = useState("");
  const [signUpSent, setSignUpSent] = useState(false);

  const [step, setStep] = useState<"details" | "payment" | "confirmed">("details");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay_upi" | "razorpay_card">("razorpay_upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isRequest, setIsRequest] = useState(true);
  // Coupon + wallet credit, same rules as the app's BookingScreen; the server
  // re-checks both in create-booking-order / create-booking.
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWalletCredit, setUseWalletCredit] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("wallet_balance").eq("id", user.id).maybeSingle()
      .then(({ data }) => setWalletBalance(Number(data?.wallet_balance) || 0));
  }, [user]);
  const couponDiscount = appliedCoupon ? Math.min(appliedCoupon.discountAmount, totalAmount) : 0;
  const creditApplied = useWalletCredit ? Math.min(walletBalance, totalAmount - couponDiscount) : 0;
  const payable = totalAmount - couponDiscount - creditApplied;
  const trackedStay = (): TrackedStay => ({
    propertyId: property.id,
    title: property.title,
    category: property.category,
    city: property.city,
    nights: Math.max(1, differenceInDays(checkOutDate, checkInDate)),
    value: Math.max(0, payable - tax),
  });
  useEffect(() => {
    if (isOpen) trackBeginCheckout(trackedStay());
    // Once per opening, not on every price/date change inside the modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code || applyingCoupon) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const { data, error } = await supabase.functions.invoke("validate-coupon", { body: { code, bookingAmount: accommodation ?? totalAmount } });
      if (error || !data?.valid) throw new Error(data?.error ?? "This code isn't valid for this stay.");
      setAppliedCoupon({ code, discountAmount: Number(data.discountAmount) || 0 });
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err instanceof Error ? err.message : "This code isn't valid for this stay.");
    } finally {
      setApplyingCoupon(false);
    }
  };
  const [needsVerification, setNeedsVerification] = useState(false);

  // Sign-in, only asked for if there's no session yet - booking requires a
  // real account (create-booking takes guestId from the JWT, never the body).
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  if (!isOpen) return null;

  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    const { error } = await signIn(signInEmail, signInPassword);
    setSigningIn(false);
    if (error) {
      toast({ title: "Couldn't sign in", description: error.message, variant: "destructive" });
      return;
    }
    setEmail((prev) => prev || signInEmail);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      toast({
        title: "Please fill required details",
        description: "Your full name, phone number, and email are required for booking verification.",
        variant: "destructive"
      });
      return;
    }
    setStep("payment");
  };

  const handleExecutePayment = async () => {
    // Launch switch: stop before any order is created or money is touched.
    if (!bookingsOpenFor(property.id)) {
      toast({ title: "Bookings open soon", description: BOOKINGS_CLOSED_MESSAGE });
      return;
    }
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in above before paying.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    let paymentId: string;
    let paymentOrderId: string;
    let paymentSignature: string;

    try {
      const { data: orderData, error: orderError } = await supabase.functions.invoke("create-booking-order", {
        // Stay details let the server check price + availability before
        // checkout opens, so unavailable dates can never be paid for.
        body: {
          amount: payable,
          couponCode: appliedCoupon?.code ?? null,
          useWalletCredit,
          propertyId: property.id,
          checkIn: format(checkInDate, "yyyy-MM-dd"),
          checkOut: format(checkOutDate, "yyyy-MM-dd"),
          guests: guestCount,
        },
      });
      if (orderError || !orderData?.orderId) {
        // invoke() hides the server's message behind "non-2xx status code";
        // read the body so the guest sees why (dates booked, price changed...).
        const body = await (orderError as any)?.context?.json?.().catch(() => null);
        throw new Error(body?.error ?? orderData?.error ?? "Could not start payment. Please try again.");
      }

      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error("Razorpay checkout failed to load");
      trackAddPaymentInfo(trackedStay(), paymentMethod === "razorpay_upi" ? "UPI" : "Card", appliedCoupon?.code);

      const result = await new Promise<RazorpaySuccess>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: orderData.keyId,
          order_id: orderData.orderId,
          amount: orderData.amount,
          currency: "INR",
          name: "Wayzyy",
          description: `${property.title} · ${nights} night${nights !== 1 ? "s" : ""}`,
          image: property.images[0] ?? "",
          prefill: { name: fullName, email, contact: phone },
          notes: {
            property_id: property.id,
            guest_id: user.id,
            check_in: format(checkInDate, "yyyy-MM-dd"),
            check_out: format(checkOutDate, "yyyy-MM-dd"),
            guests: String(guestCount),
          },
          theme: { color: "#FF6B00" },
          handler: (response: RazorpaySuccess) => resolve(response),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });

      paymentId = result.razorpay_payment_id;
      paymentOrderId = result.razorpay_order_id;
      paymentSignature = result.razorpay_signature;
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Payment not completed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Payment has genuinely succeeded past this point - a failure creating
    // the booking record must never be reported as "payment not completed".
    try {
      const { data: bookingData, error: bookingError } = await supabase.functions.invoke("create-booking", {
        body: {
          propertyId: property.id,
          guestName: fullName,
          guestEmail: email,
          checkIn: format(checkInDate, "yyyy-MM-dd"),
          checkOut: format(checkOutDate, "yyyy-MM-dd"),
          guests: guestCount,
          totalPrice: payable,
          couponCode: appliedCoupon?.code ?? null,
          useWalletCredit,
          paymentId,
          paymentOrderId,
          paymentSignature,
        },
      });

      if (bookingError || !bookingData?.bookingId) {
        // create-booking refunds automatically when it rejects a paid
        // booking (dates taken in the meantime, price changed) - say so.
        let serverError: { error?: string; refunded?: boolean } | null = bookingData ?? null;
        const ctx = (bookingError as { context?: Response } | null)?.context;
        if (!serverError && ctx && typeof ctx.json === "function") {
          serverError = await ctx.json().catch(() => null);
        }
        if (serverError?.refunded) {
          toast({
            title: "Booking couldn't be completed",
            description: serverError.error ?? "Your payment has been refunded in full.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(serverError?.error ?? bookingError?.message ?? "Unknown error");
      }
      setIsRequest(bookingData.status !== "confirmed");
      // Only after create-booking has verified the payment and saved the booking.
      trackPurchase(trackedStay(), {
        transactionId: bookingData.bookingId,
        tax,
        coupon: appliedCoupon?.code,
        status: bookingData.status === "confirmed" ? "confirmed" : "requested",
      });

      // create-booking withholds the confirmation email until the guest is
      // Aadhaar-verified but never tells the client that in its response -
      // the client checks the same profile field separately to know whether
      // to show the verification prompt below.
      const { data: profile } = await supabase
        .from("profiles")
        .select("aadhaar_verified")
        .eq("id", user.id)
        .maybeSingle();
      setNeedsVerification(profile?.aadhaar_verified !== true);

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setBookingId(bookingData.reference ?? bookingData.bookingId);
      setStep("confirmed");
    } catch (error) {
      toast({
        title: "Payment received, booking pending",
        description: `Your payment went through (ref: ${paymentId}) but we couldn't finalize the booking automatically. Please contact hello@wayzyy.com with this reference and we'll sort it out.\n\n${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg text-foreground">
              {step === "details" && (user ? "2. Your details" : "1. Log in or sign up")}
              {step === "payment" && "3. Review and pay"}
              {step === "confirmed" && (isRequest ? "Request Sent" : "Reservation Confirmed")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Guest Information */}
          {step === "details" && (
            <div className="space-y-5">
              {/* Mini Stay Summary Card */}
              <div className="flex items-center gap-4 p-4 rounded-3xl border border-border bg-muted/20">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="h-16 w-20 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{property.title}</h4>
                  <p className="text-xs text-muted-foreground">{property.area}, {property.city}</p>
                  <p className="text-xs font-semibold text-foreground mt-1">
                    {format(checkInDate, "MMM d")} – {format(checkOutDate, "MMM d, yyyy")} ({nights} {nights === 1 ? "night" : "nights"} · {guestCount} {guestCount === 1 ? "guest" : "guests"})
                    {onDatesChange && (
                      <Popover open={editDatesOpen} onOpenChange={setEditDatesOpen}>
                        <PopoverTrigger asChild>
                          <button type="button" className="ml-2 font-bold text-[#FF6B00] underline underline-offset-2">Edit</button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto rounded-2xl p-2">
                          <StayDatesCalendar
                            checkIn={checkInDate}
                            checkOut={checkOutDate}
                            minNights={minNights}
                            unavailable={unavailable}
                            onChange={(a, b) => { onDatesChange(a, b); setEditDatesOpen(false); }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </p>
                </div>
              </div>

              {!user ? (
                <div className="space-y-4 rounded-3xl border border-border p-5">
                  <div>
                    <p className="text-base font-bold text-foreground">Log in or sign up to book</p>
                    <p className="mt-1 text-xs text-muted-foreground">Same account as the Wayzyy app. Nothing is charged until the payment step.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => supabase.auth.signInWithOAuth({
                      provider: "google",
                      // Come back to this listing, not the host portal.
                      options: { redirectTo: `https://wayzyy.com${window.location.pathname}` },
                    })}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-semibold hover:border-foreground/50"
                  >
                    <svg aria-hidden viewBox="0 0 48 48" className="h-4 w-4"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
                  <div className="grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
                    {(["login", "signup"] as const).map((m) => (
                      <button key={m} type="button" onClick={() => setAuthMode(m)} className={`rounded-full py-1.5 font-semibold transition-colors ${authMode === m ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                        {m === "login" ? "Log in" : "Sign up"}
                      </button>
                    ))}
                  </div>
                  {signUpSent ? (
                    <p className="rounded-2xl bg-muted p-4 text-sm">Check {signInEmail} for a link to confirm your account, then come back here and log in.</p>
                  ) : (
                  <form
                    onSubmit={async (e) => {
                      if (authMode === "login") return handleSignIn(e);
                      e.preventDefault();
                      setSigningIn(true);
                      const { data, error } = await signUp(signInEmail, signInPassword, signUpName.trim());
                      setSigningIn(false);
                      if (error) { toast({ title: "Couldn't create your account", description: error.message, variant: "destructive" }); return; }
                      setFullName((v) => v || signUpName.trim());
                      setEmail((v) => v || signInEmail);
                      if (!data.session) setSignUpSent(true);
                    }}
                    className="space-y-3"
                  >
                    {authMode === "signup" && (
                      <input required placeholder="Full name (as on your ID)" value={signUpName} onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF6B00]" />
                    )}
                    <input type="email" required placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF6B00]" />
                    <input type="password" required minLength={authMode === "signup" ? 8 : undefined} placeholder={authMode === "signup" ? "Create a password (8+ characters)" : "Password"} value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF6B00]" />
                    <button type="submit" disabled={signingIn} className="btn-brand btn-brand-lg w-full">
                      {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : authMode === "login" ? "Log in and continue" : "Create account and continue"}
                    </button>
                  </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-foreground">Full Name (as per Aadhaar / ID)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Akshay Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Special Requests / Estimated Arrival (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Requesting early luggage drop-off at 12 PM"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs font-medium outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>

                  {/* Aadhaar Trust Notice */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span>Protected by Wayzyy Verified Trust Layer. No hidden fees - every charge is itemized.</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-brand btn-brand-lg w-full"
                  >
                    Proceed to Payment · ₹{payable.toLocaleString("en-IN")}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Razorpay Payment Gateway Selection */}
          {step === "payment" && (
            <div className="space-y-6">
              {/* Payment Summary */}
              {/* Coupon + wallet credit */}
              <div className="rounded-3xl border border-border p-4 space-y-3 text-sm">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Code <span className="font-mono">{appliedCoupon.code}</span> applied</span>
                    <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(""); }} className="text-xs font-semibold underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); applyCoupon(); }} className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                      placeholder="Have a coupon code?"
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm uppercase outline-none focus:border-foreground"
                    />
                    <button type="submit" disabled={!couponInput.trim() || applyingCoupon} className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold disabled:opacity-40">
                      {applyingCoupon ? "Checking…" : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                {walletBalance > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useWalletCredit} onChange={(e) => setUseWalletCredit(e.target.checked)} className="h-4 w-4 accent-[#FF6B00]" />
                    <span>Use my ₹{walletBalance.toLocaleString("en-IN")} Wayzyy credit</span>
                  </label>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                {(couponDiscount > 0 || creditApplied > 0) && (
                  <>
                    <div className="flex justify-between text-muted-foreground"><span>Stay total</span><span>₹{totalAmount.toLocaleString("en-IN")}</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-emerald-700 dark:text-emerald-400"><span>Coupon {appliedCoupon?.code}</span><span>−₹{couponDiscount.toLocaleString("en-IN")}</span></div>}
                    {creditApplied > 0 && <div className="flex justify-between text-emerald-700 dark:text-emerald-400"><span>Wayzyy credit</span><span>−₹{creditApplied.toLocaleString("en-IN")}</span></div>}
                  </>
                )}
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total Payable Amount</span>
                  <span className="text-base text-[#FF6B00] font-black">₹{payable.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-muted-foreground">Includes all taxes - the nightly price already includes Wayzyy's fee, and the GST is shown on the listing page.</p>
              </div>

              {/* Razorpay Gateway Options */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Payment Method (Razorpay India)</p>

                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay_upi")}
                  className={`w-full flex items-center justify-between p-4 rounded-3xl border text-left transition-all ${
                    paymentMethod === "razorpay_upi"
                      ? "border-[#FF6B00] bg-[#FF6B00]/5 shadow-xs"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">UPI / Instant Pay</p>
                      <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === "razorpay_upi" ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-border"}`}>
                    {paymentMethod === "razorpay_upi" && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay_card")}
                  className={`w-full flex items-center justify-between p-4 rounded-3xl border text-left transition-all ${
                    paymentMethod === "razorpay_card"
                      ? "border-[#FF6B00] bg-[#FF6B00]/5 shadow-xs"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">Visa, MasterCard, RuPay, Diners</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === "razorpay_card" ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-border"}`}>
                    {paymentMethod === "razorpay_card" && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>256-bit encrypted Razorpay SSL checkout</span>
              </div>

              {!bookingsOpenFor(property.id) && (
                <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  {BOOKINGS_CLOSED_MESSAGE}
                </p>
              )}

              {/* Pay Button */}
              <button
                type="button"
                disabled={isSubmitting || !bookingsOpenFor(property.id)}
                onClick={handleExecutePayment}
                className="btn-brand btn-brand-lg w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {bookingsOpenFor(property.id)
                        ? `Pay ₹${payable.toLocaleString("en-IN")} & Confirm Booking`
                        : "Bookings open soon"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Confirmation Screen */}
          {step === "confirmed" && (
            <div className="text-center space-y-6 py-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black font-display text-foreground">
                  {isRequest ? "Request sent to your host" : `You're going to ${property.city}!`}
                </h3>
                {isRequest && (
                  <p className="text-xs text-muted-foreground mt-1">
                    They have 6 hours to accept. If they decline or don't respond, you're refunded in full automatically.
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Booking reference: <strong className="text-[#FF6B00]">{bookingId}</strong>
                </p>
              </div>

              {needsVerification && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">One more step: verify your identity</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Your payment is confirmed, but your host's contact details and full booking confirmation are held until you verify via DigiLocker (Aadhaar).
                    </p>
                    <Link
                      to={`/verify-identity?returnTo=/trips`}
                      onClick={onClose}
                      className="mt-2 inline-block text-xs font-bold text-amber-800 dark:text-amber-300 underline"
                    >
                      Verify now →
                    </Link>
                  </div>
                </div>
              )}

              {/* Receipt Summary */}
              <div className="rounded-3xl border border-border bg-muted/20 p-5 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border font-bold">
                  <span>{property.title}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{isRequest ? "Paid - awaiting host" : "Paid in Full"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dates:</span>
                  <span className="font-semibold text-foreground">
                    {format(checkInDate, "MMM d")} – {format(checkOutDate, "MMM d, yyyy")} ({nights} nights)
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Primary Guest:</span>
                  <span className="font-semibold text-foreground">{fullName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Host:</span>
                  <span className="font-semibold text-foreground">{property.host.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Amount Paid:</span>
                  <span className="font-black text-foreground">₹{payable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to="/trips"
                  onClick={onClose}
                  className="btn-brand btn-brand-lg w-full text-center"
                >
                  View in My Trips & Directions
                </Link>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full py-3 rounded-2xl border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download / Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
