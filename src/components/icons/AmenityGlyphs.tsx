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

export const CoffeeMakerGlyph = glyph("CoffeeMakerGlyph", <>
  <path d="M5 21h14M6 3h12M6 3v18M18 3v5M6 8h12" />
  <path d="M10 21v-4h4v4M9 12h6" />
</>);

export const StoveGlyph = glyph("StoveGlyph", <>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <circle cx="8.5" cy="8.5" r="2" />
  <circle cx="15.5" cy="8.5" r="2" />
  <circle cx="8.5" cy="15.5" r="2" />
  <circle cx="15.5" cy="15.5" r="2" />
</>);

export const PoolTableGlyph = glyph("PoolTableGlyph", <>
  <rect x="2" y="5" width="20" height="14" rx="2" />
  <circle cx="5.5" cy="8.5" r="0.75" fill="currentColor" />
  <circle cx="18.5" cy="8.5" r="0.75" fill="currentColor" />
  <circle cx="5.5" cy="15.5" r="0.75" fill="currentColor" />
  <circle cx="18.5" cy="15.5" r="0.75" fill="currentColor" />
  <circle cx="12" cy="12" r="1.5" />
</>);

export const CrockeryGlyph = glyph("CrockeryGlyph", <>
  <path d="M4 3v6a2 2 0 0 0 4 0V3M6 3v18" />
  <circle cx="16" cy="12" r="5" />
  <circle cx="16" cy="12" r="2" />
</>);

export const CleaningBucketGlyph = glyph("CleaningBucketGlyph", <>
  <path d="M5 11h14l-1.5 10h-11z" />
  <path d="M8 11V8a4 4 0 0 1 8 0v3M9 3.5 12 2M7 15h10" />
</>);

export const OutdoorShowerGlyph = glyph("OutdoorShowerGlyph", <>
  <path d="M4 21V4a2 2 0 0 1 2-2h8M14 2v3M9 5h10v4H9z" />
  <path d="M11 12v1M14 12v1M17 12v1M11 16v1M14 16v1M17 16v1M12.5 20v1M15.5 20v1" />
</>);

export const FrontCarGlyph = glyph("FrontCarGlyph", <>
  <path d="M5 11 7 5h10l2 6M3 11h18v7H3z" />
  <path d="M5 18v2M19 18v2" />
  <circle cx="7" cy="14.5" r="0.75" fill="currentColor" />
  <circle cx="17" cy="14.5" r="0.75" fill="currentColor" />
</>);

export const LoungerGlyph = glyph("LoungerGlyph", <>
  <path d="M3 18 15 8l5 4M3 18h18M5 21v-3M19 21v-3" />
  <path d="M15 8l-2 6h8" />
  <circle cx="18" cy="4" r="1.5" />
</>);

export const DishwasherGlyph = glyph("DishwasherGlyph", <>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <path d="M3 8h18M7 5.5h.01M11 5.5h.01" />
  <circle cx="12" cy="15" r="3.5" />
  <path d="M9.5 15h5" />
</>);

export const SprayBottleGlyph = glyph("SprayBottleGlyph", <>
  <path d="M8 11h8v10H8zM10 11V8h4v3M14 8h-6V5h6" />
  <path d="M8 5H5M5 8H3M5 2H3M12 15h.01" />
</>);

export const BedLinenGlyph = glyph("BedLinenGlyph", <>
  <path d="M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
  <path d="M3 14h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zM6 21h12" />
</>);

export const GrillGlyph = glyph("GrillGlyph", <>
  <path d="M4 10h16a8 8 0 0 1-16 0zM8 17l-2 4M16 17l2 4" />
  <path d="M9 3c1 1 1 2 0 3M13 3c1 1 1 2 0 3" />
</>);

export const BuildingStaffGlyph = glyph("BuildingStaffGlyph", <>
  <path d="M14 21V4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v17M17.5 7v.01M17.5 11v.01" />
  <circle cx="7" cy="8" r="3" />
  <path d="M2 21v-3a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v3zM1 21h22" />
</>);

export const ToasterGlyph = glyph("ToasterGlyph", <>
  <path d="M5 10h14a2 2 0 0 1 2 2v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a2 2 0 0 1 2-2zM8 10V8M16 10V8" />
  <path d="M8 14h8" />
</>);

export const EssentialsGlyph = glyph("EssentialsGlyph", <>
  <rect x="3" y="3" width="5" height="18" rx="1" />
  <rect x="10" y="3" width="4" height="18" rx="1" />
  <path d="M16 4h5v16h-5M18.5 8v.01M18.5 12v.01M18.5 16v.01" />
</>);
