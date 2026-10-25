import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Landmark } from "lucide-react";
import { useLightSurface } from "@/hooks/useLightSurface";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Same host_payout_accounts record and save-host-payout-account function as
// the app. The full account number goes only to the payment partner; we keep
// the last 4 digits. The host's PAN (needed for TDS) is stored with the account
// and only that host can read it back; it is shown masked.

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const maskPan = (pan: string) => `••••••${pan.slice(-4)}`;

export default function HostPayoutAccount() {
  useLightSurface();
  const { session, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const userId = session?.user?.id;
  const [saved, setSaved] = useState<{ name: string; last4: string; ifsc: string; pan: string | null } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("host_payout_accounts")
      .select("account_holder_name, bank_account_last4, ifsc, pan")
      .eq("host_id", userId)
      .maybeSingle();
    setSaved(data ? { name: data.account_holder_name, last4: data.bank_account_last4, ifsc: data.ifsc, pan: data.pan ?? null } : null);
    setLoaded(true);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // `body` is the bank details plus PAN, or just { pan } to add a PAN to an
  // account that is already linked.
  const submit = async (body: Record<string, string>, successTitle: string) => {
    if (body.pan && !PAN_RE.test(body.pan)) {
      toast({ title: "Check your PAN", description: "It should look like ABCDE1234F.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("save-host-payout-account", { body });
    setSaving(false);
    if (error || (data as any)?.error) {
      toast({ title: "Couldn't save", description: (data as any)?.error || error?.message, variant: "destructive" });
      return;
    }
    setAccount("");
    setPan("");
    setEditing(false);
    toast({ title: successTitle });
    load();
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ accountHolderName: name, accountNumber: account, ifsc, pan }, "Payout account saved");
  };

  const savePanOnly = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ pan }, "PAN saved");
  };

  return (
    <div className="host-light min-h-screen bg-background">
      <SEO title="Payout account | Wayzyy Host" description="Where your earnings are paid." path="/host/payout" />
      <main className="mx-auto max-w-md px-4 py-8">
        <Link to="/host" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to host dashboard
        </Link>
        <h1 className="font-display text-3xl mb-2 flex items-center gap-2"><Landmark className="h-7 w-7" /> Payout account</h1>
        <p className="mb-6 text-sm text-muted-foreground">Your earnings are paid to this bank account after guests check in.</p>
        {authLoading || (session && !loaded) ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        ) : !session ? (
          <p className="text-sm text-muted-foreground">Please <Link className="underline" to="/host">sign in to your host account</Link> first.</p>
        ) : saved && !editing ? (
          <div className="space-y-3 rounded-xl border p-4 text-sm">
            <p className="font-semibold">{saved.name}</p>
            <p>Account ending {saved.last4} · {saved.ifsc}</p>
            {saved.pan ? (
              <p>PAN {maskPan(saved.pan)}</p>
            ) : (
              <form onSubmit={savePanOnly} className="space-y-2 border-t pt-3">
                <Label htmlFor="po-pan-add">Add your PAN</Label>
                <p className="text-xs text-muted-foreground">Needed for tax (TDS) on your payouts.</p>
                <div className="flex gap-2">
                  <Input id="po-pan-add" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} maxLength={10}
                    placeholder="ABCDE1234F" autoCapitalize="characters" required />
                  <Button type="submit" size="sm" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
                </div>
              </form>
            )}
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Change account</Button>
          </div>
        ) : (
          <form onSubmit={save} className="space-y-3">
            <div><Label htmlFor="po-name">Account holder name</Label>
              <Input id="po-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label htmlFor="po-acc">Account number</Label>
              <Input id="po-acc" inputMode="numeric" value={account} onChange={(e) => setAccount(e.target.value)} required /></div>
            <div><Label htmlFor="po-ifsc">IFSC code</Label>
              <Input id="po-ifsc" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} maxLength={11} required /></div>
            <div><Label htmlFor="po-pan">PAN</Label>
              <Input id="po-pan" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} maxLength={10}
                placeholder="ABCDE1234F" autoCapitalize="characters" required />
              <p className="mt-1 text-xs text-muted-foreground">Needed for tax (TDS) on your payouts.</p></div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save payout account"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
