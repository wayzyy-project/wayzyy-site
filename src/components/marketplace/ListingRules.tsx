import type { ComponentType } from "react";
import {
  AlertTriangle, BriefcaseMedical, Camera, CigaretteOff, CircleHelp, Clock, FireExtinguisher,
  Flame, KeyRound, PartyPopper, PawPrint, Phone, Users, Video,
} from "lucide-react";
import { hasSafetyItem, SAFETY_ITEMS, type ListingRules } from "@/lib/houseRules";

// The website's version of the app's HouseRulesAccordion and SafetyAccordion:
// same fields, same wording, so a guest reads the same rules on both.

type Icon = ComponentType<{ className?: string }>;

const RULE_ICON: Record<string, Icon> = {
  pets: PawPrint,
  smoking: CigaretteOff,
  photography: Camera,
  events: PartyPopper,
};

function RuleLine({ icon, label, value }: { icon: Icon; label: string; value: boolean | null }) {
  const Glyph = value === null ? CircleHelp : icon;
  return (
    <li className="flex items-center gap-3 text-sm">
      <Glyph className={`h-4 w-4 shrink-0 ${value ? "text-emerald-600" : "text-muted-foreground"}`} />
      <span className={value === false ? "text-muted-foreground" : "text-foreground"}>
        {label} {value === null ? "- not reported" : value ? "allowed" : "not allowed"}
      </span>
    </li>
  );
}

type SafetyStatus = "available" | "not_available" | "not_reported";
const STATUS_TEXT: Record<SafetyStatus, string> = {
  available: "Available",
  not_available: "Not available",
  not_reported: "Not reported",
};
const STATUS_CLASS: Record<SafetyStatus, string> = {
  available: "text-emerald-600",
  not_available: "text-muted-foreground",
  not_reported: "text-amber-600",
};
const SAFETY_ICON: Record<string, Icon> = {
  "Smoke Alarm": Flame,
  "CO Alarm": AlertTriangle,
  "Fire Extinguisher": FireExtinguisher,
  "First Aid": BriefcaseMedical,
};

export function ListingRulesSections({ rules }: { rules: ListingRules }) {
  const safety: { key: string; label: string; icon: Icon; status: SafetyStatus }[] = [
    ...SAFETY_ITEMS.map((item) => ({
      key: item.id,
      label: item.label,
      icon: SAFETY_ICON[item.id],
      status: (hasSafetyItem(rules.safetyAmenities, item.match) ? "available" : "not_available") as SafetyStatus,
    })),
    {
      key: "cameras",
      label: "Exterior security cameras",
      icon: Video,
      status: rules.securityCameras === null ? "not_reported" : rules.securityCameras ? "available" : "not_available",
    },
    {
      key: "contact",
      label: "Emergency contact",
      icon: Phone,
      status: rules.hasEmergencyContact ? "available" : "not_reported",
    },
  ];

  return (
    <>
      <div className="pt-6 space-y-4">
        <h3 className="text-lg font-bold font-display text-[#FF6B00]">House rules</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">Checking in and out</p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" /> Check-in after {rules.checkIn}
            </p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" /> Check-out before {rules.checkOut}
            </p>
            {rules.selfCheckIn && (
              <p className="flex items-center gap-3 text-sm text-foreground">
                <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" /> Self check-in
              </p>
            )}
          </div>
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-foreground">During your stay</p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" /> {rules.maxGuests} guest{rules.maxGuests === 1 ? "" : "s"} maximum
            </p>
            <ul className="space-y-2.5">
              <RuleLine icon={RULE_ICON.pets} label="Pets" value={rules.pets} />
              <RuleLine icon={RULE_ICON.smoking} label="Smoking" value={rules.smoking} />
              <RuleLine icon={RULE_ICON.events} label="Events" value={rules.parties} />
              <RuleLine icon={RULE_ICON.photography} label="Commercial photography" value={rules.commercialPhotography} />
            </ul>
          </div>
        </div>
        {rules.additional.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Additional rules</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {rules.additional.map((rule, i) => <li key={i}>{rule}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-4">
        <h3 className="text-lg font-bold font-display text-[#FF6B00]">Safety and property</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {safety.map(({ key, label, icon: Glyph, status }) => (
            <li key={key} className="flex items-center gap-3 text-sm">
              <Glyph className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-foreground">{label}</span>
              <span className={`text-xs font-semibold ${STATUS_CLASS[status]}`}>{STATUS_TEXT[status]}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
