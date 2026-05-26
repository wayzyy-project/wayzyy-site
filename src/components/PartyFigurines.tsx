import { useReducedMotion } from "framer-motion";

export function PartyFigurines({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 440 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* floating confetti dots */}
      {!reduce && (
        <>
          <circle cx="80" cy="12" r="3" fill="hsl(var(--ember))" opacity="0.7">
            <animate attributeName="cy" values="12;4;12" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="8" r="2.5" fill="currentColor" opacity="0.35">
            <animate attributeName="cy" values="8;1;8" dur="1.7s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.7s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="10" r="2" fill="hsl(var(--ember))" opacity="0.6">
            <animate attributeName="cy" values="10;3;10" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="6" r="2" fill="currentColor" opacity="0.25">
            <animate attributeName="cy" values="6;0;6" dur="1.9s" begin="0.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="14" r="2.5" fill="hsl(var(--ember))" opacity="0.5">
            <animate attributeName="cy" values="14;6;14" dur="1.5s" begin="0.9s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* ── Figure 1: arms-raised dancer with party hat (x=35) ── */}
      <g transform="translate(35, 8)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="35,8; 35,3; 35,8"
            dur="0.85s"
            repeatCount="indefinite"
          />
        )}
        {/* party hat */}
        <polygon points="-5,12 5,12 0,0" fill="hsl(var(--ember))" opacity="0.95" />
        <rect x="-5" y="11" width="10" height="2" rx="1" fill="hsl(var(--ember))" />
        {/* head */}
        <circle cx="0" cy="22" r="9" fill="currentColor" />
        {/* torso */}
        <rect x="-7" y="31" width="14" height="26" rx="4" fill="currentColor" />
        {/* left arm — angled up-left */}
        <rect x="-14" y="25" width="5" height="19" rx="2.5" fill="currentColor"
          transform="rotate(-48, -12, 33)" />
        {/* right arm — angled up-right */}
        <rect x="9" y="25" width="5" height="19" rx="2.5" fill="currentColor"
          transform="rotate(48, 11, 33)" />
        {/* left leg */}
        <rect x="-7" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-14, -4, 57)" />
        {/* right leg */}
        <rect x="1" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(14, 4, 57)" />
        {/* shoes */}
        <rect x="-10" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="3" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>

      {/* ── Figure 2: cup-raiser (x=103) ── */}
      <g transform="translate(103, 8)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="103,8; 103,4; 103,8"
            dur="1.0s"
            begin="0.15s"
            repeatCount="indefinite"
          />
        )}
        {/* head */}
        <circle cx="0" cy="22" r="9" fill="currentColor" />
        {/* torso (slight lean right) */}
        <rect x="-7" y="31" width="14" height="26" rx="4" fill="currentColor"
          transform="rotate(5, 0, 44)" />
        {/* right arm raised up with cup */}
        <rect x="6" y="22" width="5" height="19" rx="2.5" fill="currentColor"
          transform="rotate(-55, 8, 33)" />
        {/* cup */}
        <rect x="20" y="6" width="7" height="9" rx="1.5" fill="hsl(var(--ember))" />
        <rect x="19" y="14" width="9" height="2" rx="1" fill="hsl(var(--ember))" opacity="0.6" />
        {/* left arm — slightly out */}
        <rect x="-14" y="28" width="5" height="17" rx="2.5" fill="currentColor"
          transform="rotate(22, -12, 33)" />
        {/* left leg */}
        <rect x="-7" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-8, -4, 57)" />
        {/* right leg */}
        <rect x="1" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(18, 4, 57)" />
        {/* shoes */}
        <rect x="-9" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="4" y="77" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>

      {/* ── Figure 3: wide-jump celebrator (x=178) ── */}
      <g transform="translate(178, 6)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="178,6; 178,0; 178,6"
            dur="0.75s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        )}
        {/* head */}
        <circle cx="0" cy="20" r="10" fill="currentColor" />
        {/* big grin arc */}
        <path d="M-5,24 Q0,28 5,24" stroke="hsl(var(--ember))" strokeWidth="1.5" fill="none"
          strokeLinecap="round" />
        {/* torso */}
        <rect x="-8" y="30" width="16" height="28" rx="5" fill="currentColor" />
        {/* left arm — wide out-left */}
        <rect x="-24" y="30" width="5" height="20" rx="2.5" fill="currentColor"
          transform="rotate(80, -22, 34)" />
        {/* right arm — wide out-right */}
        <rect x="19" y="30" width="5" height="20" rx="2.5" fill="currentColor"
          transform="rotate(-80, 21, 34)" />
        {/* left leg — spread */}
        <rect x="-8" y="58" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-22, -5, 58)" />
        {/* right leg — spread */}
        <rect x="2" y="58" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(22, 5, 58)" />
        {/* shoes */}
        <rect x="-13" y="76" width="10" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="5" y="76" width="10" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>

      {/* ── Figure 4: bottle-tilter (x=253) ── */}
      <g transform="translate(253, 8)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="253,8; 253,4; 253,8"
            dur="0.95s"
            begin="0.45s"
            repeatCount="indefinite"
          />
        )}
        {/* head */}
        <circle cx="0" cy="22" r="9" fill="currentColor" />
        {/* torso — lean left */}
        <rect x="-7" y="31" width="14" height="26" rx="4" fill="currentColor"
          transform="rotate(-6, 0, 44)" />
        {/* left arm — extended forward holding bottle */}
        <rect x="-22" y="26" width="5" height="19" rx="2.5" fill="currentColor"
          transform="rotate(75, -20, 33)" />
        {/* bottle */}
        <rect x="-32" y="14" width="6" height="13" rx="2" fill="hsl(var(--ember))" />
        <rect x="-31" y="11" width="4" height="5" rx="1.5" fill="hsl(var(--ember))" opacity="0.7" />
        {/* right arm — behind back */}
        <rect x="7" y="28" width="5" height="16" rx="2.5" fill="currentColor"
          transform="rotate(-15, 9, 33)" />
        {/* legs */}
        <rect x="-7" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-10, -4, 57)" />
        <rect x="1" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(10, 4, 57)" />
        {/* shoes */}
        <rect x="-9" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="3" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>

      {/* ── Figure 5: shimmy dancer (x=323) ── */}
      <g transform="translate(323, 8)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="323,8; 323,3; 323,8"
            dur="0.8s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        )}
        {/* party hat */}
        <polygon points="-4,12 4,12 0,1" fill="hsl(var(--ember))" opacity="0.9" />
        {/* head */}
        <circle cx="0" cy="22" r="9" fill="currentColor" />
        {/* torso */}
        <rect x="-7" y="31" width="14" height="26" rx="4" fill="currentColor" />
        {/* left arm — up diagonal */}
        <rect x="-13" y="24" width="5" height="19" rx="2.5" fill="currentColor"
          transform="rotate(-35, -11, 33)" />
        {/* right arm — down at hip */}
        <rect x="8" y="31" width="5" height="17" rx="2.5" fill="currentColor"
          transform="rotate(25, 10, 35)" />
        {/* mid-step legs */}
        <rect x="-7" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-20, -4, 57)" />
        <rect x="1" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(8, 4, 57)" />
        {/* shoes */}
        <rect x="-12" y="75" width="10" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="3" y="77" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>

      {/* ── Figure 6: V-arms groove (x=393) ── */}
      <g transform="translate(393, 8)">
        {!reduce && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="393,8; 393,2; 393,8"
            dur="0.9s"
            begin="0.75s"
            repeatCount="indefinite"
          />
        )}
        {/* head */}
        <circle cx="0" cy="22" r="9" fill="currentColor" />
        {/* torso */}
        <rect x="-7" y="31" width="14" height="26" rx="4" fill="currentColor" />
        {/* both arms up in wide V */}
        <rect x="-16" y="22" width="5" height="20" rx="2.5" fill="currentColor"
          transform="rotate(-38, -14, 33)" />
        <rect x="11" y="22" width="5" height="20" rx="2.5" fill="currentColor"
          transform="rotate(38, 13, 33)" />
        {/* small star accent near right hand */}
        <circle cx="24" cy="10" r="3" fill="hsl(var(--ember))" opacity="0.85" />
        {/* legs — together, slight bounce stance */}
        <rect x="-7" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(-7, -4, 57)" />
        <rect x="1" y="57" width="6" height="22" rx="3" fill="currentColor"
          transform="rotate(7, 4, 57)" />
        {/* shoes */}
        <rect x="-9" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
        <rect x="3" y="76" width="9" height="4" rx="2" fill="hsl(var(--ember))" />
      </g>
    </svg>
  );
}
