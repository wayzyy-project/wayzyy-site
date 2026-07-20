import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// Same value sets as mobile/src/screens/host/BecomeHostScreen.tsx — keeps
// listings consistent regardless of which platform a host submits from.
const PLACE_TYPES = [
  { id: "villa", label: "Villa" },
  { id: "apt", label: "Apartment" },
  { id: "cottage", label: "Cottage" },
  { id: "farm", label: "Farm Stay" },
  { id: "heritage", label: "Heritage Home" },
  { id: "other", label: "Other" },
];

const SPACE_TYPES = [
  { id: "entire", label: "Entire place" },
  { id: "private", label: "Private room" },
  { id: "shared", label: "Shared room" },
];

const AMENITIES = [
  "WiFi", "Kitchen", "Washer", "AC", "Heating", "Hot Water", "TV", "Pool",
  "Parking", "Breakfast", "Garden", "Beach Access", "Pet-friendly", "BBQ",
  "Workspace", "Gym", "EV Charger",
];

const MIN_PHOTOS = 5;

interface ListingForm {
  title: string;
  description: string;
  price: string;
  placeType: string;
  spaceType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  registrationNumber: string;
  maxGuests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  amenities: string[];
}

const emptyForm: ListingForm = {
  title: "", description: "", price: "",
  placeType: "villa", spaceType: "entire",
  street: "", city: "Goa", state: "Goa", pincode: "",
  registrationNumber: "",
  maxGuests: "2", bedrooms: "1", beds: "1", bathrooms: "1",
  amenities: [],
};

function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } =
        mode === "signup" ? await signUp(email, password, name) : await signIn(email, password);
      if (error) throw error;
      if (mode === "signup") {
        toast({ title: "Check your email", description: "Confirm your address, then log in to list your property." });
        setMode("login");
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex rounded-full border border-border p-1 text-sm">
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === "signup" ? "bg-ember text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === "login" ? "bg-ember text-white" : "text-muted-foreground"}`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full bg-ember hover:bg-ember/90 text-white">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Log in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        This is the same account system as the Wayzyy app — log in here with the same email and
        password you'd use on mobile, or create a new one either place.
      </p>
    </div>
  );
}

function ListingFormPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<ListingForm>(emptyForm);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (id: string) =>
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
    }));

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const next = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const isGoa = data.state.trim().toLowerCase() === "goa";

  const validate = (): string | null => {
    if (data.title.trim().length < 5) return "Listing title must be at least 5 characters.";
    if (!data.description.trim()) return "Please add a description.";
    const price = parseFloat(data.price);
    if (!Number.isFinite(price) || price < 100 || price > 1000000) return "Price must be between ₹100 and ₹10,00,000 per night.";
    if (!data.street.trim() || !data.city.trim() || !data.state.trim() || !data.pincode.trim()) return "Please complete the address.";
    if (isGoa && !data.registrationNumber.trim()) return "Goa Tourism Registration Number is required for Goa listings.";
    if (photos.length < MIN_PHOTOS) return `Please add at least ${MIN_PHOTOS} photos.`;
    return null;
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const { file } of photos) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${user!.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast({ title: "Missing information", description: validationError, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const photoUrls = await uploadPhotos();

      const { data: result, error } = await supabase.functions.invoke("submit-listing", {
        body: {
          listingData: {
            title: data.title,
            description: data.description,
            price: data.price,
            placeType: data.placeType,
            spaceType: data.spaceType,
            street: data.street,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            registrationNumber: data.registrationNumber,
            maxGuests: Number(data.maxGuests),
            bedrooms: Number(data.bedrooms),
            beds: Number(data.beds),
            bathrooms: Number(data.bathrooms),
            amenities: data.amenities,
            photos: photoUrls,
            instantBook: false,
            selfCheckIn: false,
            cancelPolicy: "Flexible",
            checkInTime: "3:00 PM",
            checkOutTime: "11:00 AM",
          },
          hostEmail: user?.email ?? "",
          hostName: (user?.user_metadata?.name as string) ?? user?.email ?? "Host",
          hostId: user?.id ?? null,
        },
      });

      if (error) {
        let message = error.message ?? "Submission failed";
        try {
          const body = await (error as any).context?.json?.();
          if (body?.error) message = body.error;
        } catch {
          // ignore — fall back to generic message
        }
        throw new Error(message);
      }
      if (!result?.success) throw new Error(result?.error ?? "Submission failed");

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Couldn't submit listing",
        description: err instanceof Error ? err.message : "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md text-center py-16">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-ember" />
        <h2 className="font-display text-2xl mb-2">Submitted for review</h2>
        <p className="text-sm text-muted-foreground">
          You'll get a confirmation email shortly, and another once our team approves your listing —
          usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-4">
        <h2 className="font-display text-xl">The basics</h2>
        <div>
          <Label htmlFor="title">Listing title</Label>
          <Input id="title" value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Anjuna Bohemian Stone Villa" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={data.description} onChange={(e) => set("description", e.target.value)} rows={4} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Place type</Label>
            <Select value={data.placeType} onValueChange={(v) => set("placeType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLACE_TYPES.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Space type</Label>
            <Select value={data.spaceType} onValueChange={(v) => set("spaceType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPACE_TYPES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Location</h2>
        <div>
          <Label htmlFor="street">Street address</Label>
          <Input id="street" value={data.street} onChange={(e) => set("street", e.target.value)} required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={data.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={data.state} onChange={(e) => set("state", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" value={data.pincode} onChange={(e) => set("pincode", e.target.value)} required />
          </div>
        </div>
        {isGoa && (
          <div>
            <Label htmlFor="reg">Goa Tourism Registration Number</Label>
            <Input id="reg" value={data.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="e.g. GTR/2026/00000" required />
            <p className="mt-1 text-xs text-muted-foreground">
              Required to publish a Goa listing.{" "}
              <Link to="/goa-host-compliance-checklist" className="text-ember hover:underline">
                Don't have one yet? See the compliance checklist.
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Capacity & price</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="guests">Max guests</Label>
            <Input id="guests" type="number" min={1} max={50} value={data.maxGuests} onChange={(e) => set("maxGuests", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" type="number" min={0} max={50} value={data.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="beds">Beds</Label>
            <Input id="beds" type="number" min={0} max={50} value={data.beds} onChange={(e) => set("beds", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" min={0} max={50} value={data.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} required />
          </div>
        </div>
        <div>
          <Label htmlFor="price">Price per night (₹)</Label>
          <Input id="price" type="number" min={100} max={1000000} value={data.price} onChange={(e) => set("price", e.target.value)} required />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <Checkbox checked={data.amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Photos</h2>
        <p className="text-sm text-muted-foreground">At least {MIN_PHOTOS} photos required.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((p, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-border">
              <img src={p.preview} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground hover:border-ember hover:text-ember transition-colors">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Add photos</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </label>
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-ember hover:bg-ember/90 text-white" size="lg">
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit for review
      </Button>
    </form>
  );
}

export default function HostPortal() {
  const { user, loading } = useAuth();

  return (
    <SEO
      title="List your property — Wayzyy"
      description="List your property on Wayzyy directly from the web — the same platform hosts use on the app, with the same review and approval process."
      path="/host"
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Wayzyy
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">List your property</h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Same platform, same review process, same database as the Wayzyy app — list from
              wherever's easiest for you.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 sm:py-16">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <ListingFormPanel />
          ) : (
            <AuthPanel />
          )}
        </div>
      </div>
    </SEO>
  );
}
