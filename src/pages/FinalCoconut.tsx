import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Terminal, Copy, Check, Clock, Trophy, Coins, Zap, ShieldAlert } from "lucide-react";
import { SEO } from "@/components/SEO";
import { round2Cases, round2Meta, round2MaxScore, type TestCase } from "@/data/round2TestCases";

/**
 * Round 2 password gate. Soft gate only - keeps the page from being casually
 * crawled/found, not a real auth boundary. Passwords are known ahead of time
 * by the 4 finalists, so this doesn't need to be cryptographically secure,
 * only enough friction that it isn't indexed or stumbled into.
 */
const VALID_CODES: Record<string, string> = {
  wayzyyloves1: "loves",
  wayzyycoconut2: "coconut",
  wayzyybeach3: "beach",
  wayzyyvilla4: "villa",
};

const STORAGE_KEY = "wayzyy_final_coconut_session";
const CHALLENGE_HOURS = 48;

type Session = { codeName: string; loginAt: number };

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.codeName || !parsed?.loginAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function useCountdown(loginAt: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!loginAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [loginAt]);

  if (!loginAt) return null;
  const deadline = loginAt + CHALLENGE_HOURS * 60 * 60 * 1000;
  const remainingMs = Math.max(0, deadline - now);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, expired: remainingMs <= 0 };
}

function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--ember)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ember)) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}

function PasswordGate({ onUnlock }: { onUnlock: (session: Session) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().toLowerCase();
    const codeName = VALID_CODES[trimmed];
    if (!codeName) {
      setError(true);
      setShake((s) => s + 1);
      return;
    }
    const session: Session = { codeName, loginAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    onUnlock(session);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      <GridBackdrop />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[120px]"
      />
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        key={shake}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-ember/30 bg-ember/10">
            <Lock className="h-5 w-5 text-ember" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Restricted</div>
            <div className="font-display text-lg font-bold text-white">Round 2 access</div>
          </div>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-white/60">
          This page is curated for the four finalists of the Wayzyy Gig Challenge. Enter your access
          code to begin.
        </p>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="access code"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
        />
        {error && (
          <p className="mt-2 text-xs font-medium text-red-400">That code doesn't match. Check the message we sent you.</p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-ember py-3 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Unlock
        </button>
      </motion.form>
    </div>
  );
}

function CountdownBadge({ loginAt }: { loginAt: number }) {
  const cd = useCountdown(loginAt);
  if (!cd) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className={
        "flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-bold " +
        (cd.expired
          ? "border-red-500/40 bg-red-500/10 text-red-400"
          : "border-ember/40 bg-ember/10 text-ember")
      }
    >
      <Clock className="h-4 w-4" />
      {cd.expired ? "TIME'S UP" : `${pad(cd.hours)}:${pad(cd.minutes)}:${pad(cd.seconds)}`}
    </div>
  );
}

function TurnBubble({ turn }: { turn: TestCase["turns"][number] }) {
  const isHost = turn.speaker === "host";
  return (
    <div className={"flex " + (isHost ? "justify-end" : "justify-start")}>
      <div
        className={
          "max-w-[85%] rounded-lg border px-3 py-2 font-mono text-[13px] leading-relaxed " +
          (isHost
            ? "border-sky-500/25 bg-sky-500/10 text-sky-100"
            : "border-white/15 bg-white/5 text-white/90")
        }
      >
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/40">
          {turn.speaker}
        </span>
        {turn.text}
      </div>
    </div>
  );
}

function CaseCard({ testCase }: { testCase: TestCase }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-ember">{testCase.id}</span>
        {testCase.turns.length > 1 && (
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
            {testCase.turns.length} turns
          </span>
        )}
      </div>
      <div className="space-y-2">
        {testCase.turns.map((t, i) => (
          <TurnBubble key={i} turn={t} />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  index,
  label,
  description,
  points,
  cases,
}: {
  index: number;
  label: string;
  description: string;
  points: number;
  cases: TestCase[];
}) {
  const [open, setOpen] = useState(true);
  const subtotal = cases.length * points;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ember/30 bg-ember/10 font-mono text-sm font-bold text-ember">
            {String(index).padStart(2, "0")}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold text-white">{label}</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/60">
                {cases.length} cases
              </span>
              <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[11px] font-bold text-ember">
                {points} pts each
              </span>
            </div>
            <p className="mt-0.5 text-xs text-white/50">{description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-xs text-white/40">{subtotal} pts max</span>
          <span className="font-mono text-xs text-white/40">{open ? "hide" : "show"}</span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {cases.map((c) => (
                <CaseCard key={c.id} testCase={c} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Challenge({ session }: { session: Session }) {
  const [copied, setCopied] = useState(false);

  const byCategory = useMemo(() => {
    const map = new Map<string, TestCase[]>();
    for (const c of round2Cases) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return map;
  }, []);

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(round2Cases, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative min-h-screen bg-ink px-6 py-16">
      <GridBackdrop />
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              <Terminal className="h-3.5 w-3.5 text-ember" />
              wayzyy / final-coconut / {session.codeName}
            </div>
            <h1 className="text-balance font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Round 2. Try to <span className="text-ember">break it.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              These test cases are curated for you, not published anywhere else. Run your Round 1
              solution against them, log every miss, and send us your honest results.
            </p>
          </div>
          <CountdownBadge loginAt={session.loginAt} />
        </div>

        {/* Reward strip */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Coins className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
            <div>
              <div className="text-sm font-bold text-white">Guaranteed for all four finalists</div>
              <div className="text-xs text-white/60">1,000 Wayzyy credits each, the moment we go live.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/10 p-4">
            <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
            <div>
              <div className="text-sm font-bold text-white">The actual gig</div>
              <div className="text-xs text-white/70">
                2 days of paid work with us, equivalent to $1,000, goes to whoever's engine holds
                up best against real conditions.
              </div>
            </div>
          </div>
        </div>

        {/* Rules strip */}
        <div className="mb-10 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-ember" />
            48 hours from your first login
          </div>
          <div className="h-3 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-ember" />
            Honest failure reports beat a clean-looking score
          </div>
          <div className="h-3 w-px bg-white/15" />
          <div>Everyone's running the same set. Good luck.</div>
        </div>

        {/* Scoring strip */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-5 py-4">
          <div>
            <div className="text-sm font-bold text-white">Scoring, easiest to hardest</div>
            <p className="text-xs text-white/50">Points per correct case rise with difficulty — 10 · 15 · 20 · 25 · 30</p>
          </div>
          <div className="rounded-full border border-ember/40 bg-ember/10 px-4 py-1.5 font-mono text-sm font-bold text-ember">
            {round2MaxScore} pts possible
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {round2Meta.categories.map((cat, i) => (
            <CategorySection
              key={cat.key}
              index={i + 1}
              label={cat.label}
              description={cat.description}
              points={cat.points}
              cases={byCategory.get(cat.key) ?? []}
            />
          ))}
        </div>

        {/* Export */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/60">
            Prefer to feed this straight into your own harness? Grab the whole set as JSON.
          </p>
          <button
            onClick={copyJson}
            className="flex items-center gap-2 rounded-lg border border-ember/40 bg-ember/10 px-4 py-2 text-sm font-bold text-ember transition-colors hover:bg-ember/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          Wayzyy — stays without the small print.
        </p>
      </div>
    </div>
  );
}

export default function FinalCoconut() {
  const [session, setSession] = useState<Session | null>(() => loadSession());

  return (
    <SEO title="Round 2 — Wayzyy Gig Challenge" description="Private testing round for Wayzyy Gig Challenge finalists." path="/final-coconut" noindex>
      {session ? <Challenge session={session} /> : <PasswordGate onUnlock={setSession} />}
    </SEO>
  );
}
