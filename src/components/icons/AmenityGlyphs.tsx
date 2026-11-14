import type { LucideProps } from "lucide-react";
import * as React from "react";

// Outline glyphs for amenities lucide doesn't draw, on lucide's 24px grid so
// they sit alongside lucide icons and take the same className/strokeWidth.
function glyph(name: string, children: React.ReactNode) {
  const Glyph = ({ size = 24, strokeWidth = 2, absoluteStrokeWidth: _a, ...rest }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
  Glyph.displayName = name;
  return Glyph;
}

export const IronGlyph = glyph("IronGlyph", <>
  <path d="M2 16h19v-3a5 5 0 0 0-5-5H8.5z" />
  <path d="M10 8V5h8a1 1 0 0 1 1 1v3" />
  <circle cx="7" cy="19.5" r="0.5" fill="currentColor" />
  <circle cx="11" cy="19.5" r="0.5" fill="currentColor" />
  <circle cx="15" cy="19.5" r="0.5" fill="currentColor" />
</>);

export const DeskGlyph = glyph("DeskGlyph", <>
  <path d="M2 13h20M4 13v8M20 13v8M14 13v5h6" />
  <path d="M7 13V8M5 13h4M5 8h4L8 5H6z" />
</>);

export const PumpBottleGlyph = glyph("PumpBottleGlyph", <>
  <rect x="7" y="10" width="10" height="11" rx="2" />
  <path d="M10 10V7h4v3M12 7V4M9 4h5M7 14h10" />
</>);

export const SoapGlyph = glyph("SoapGlyph", <>
  <rect x="4" y="10" width="10" height="11" rx="2" />
  <path d="M7 10V7h4v3M9 7V4M6 4h5" />
  <circle cx="18.5" cy="8" r="2" />
  <circle cx="19" cy="14" r="1.25" />
</>);

export const WardrobeGlyph = glyph("WardrobeGlyph", <>
  <rect x="4" y="3" width="16" height="17" rx="1" />
  <path d="M12 3v17M10 10v2M14 10v2M6 20v1.5M18 20v1.5" />
</>);

export const HangerGlyph = glyph("HangerGlyph", <>
  <path d="M10 6a2 2 0 1 1 2 2v2" />
  <path d="M12 10 2.8 16.6A1 1 0 0 0 3.4 18.4h17.2a1 1 0 0 0 .6-1.8z" />
</>);

export const CeilingFanGlyph = glyph("CeilingFanGlyph", <>
  <path d="M9 3h6M12 3v6" />
  <path d="M10 9h4v3h-4z" />
  <path d="M10 10.5H3.5a1.5 1.5 0 0 0 0 3H10M14 10.5h6.5a1.5 1.5 0 0 1 0 3H14" />
  <path d="M11 12v2a1 1 0 0 0 2 0v-2" />
</>);

export const KettleGlyph = glyph("KettleGlyph", <>
  <path d="M6 20h11l-1-10H7z" />
  <path d="M7 10l1.5-3h6L16 10M10 7V5h3v2" />
  <path d="M16.5 12h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-1.6" />
  <path d="M6.5 13 3 10.5" />
</>);

export const DiningTableGlyph = glyph("DiningTableGlyph", <>
  <path d="M7 11h10M9 11v9M15 11v9" />
  <path d="M3 6v14M3 15h3v5M21 6v14M21 15h-3v5" />
</>);
