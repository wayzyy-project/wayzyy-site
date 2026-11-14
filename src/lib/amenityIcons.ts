import {
  AirVent, Armchair, Baby, Bath, Bed, Bike, BookOpen, BriefcaseMedical, Building2, CalendarDays, Car, Cctv,
  Check, ChefHat, Cigarette, Coffee, CookingPot, Dice5, DoorOpen, Droplets, Dumbbell, Eye, Fan, Fence, Flame,
  FireExtinguisher, Heater, Key, Lock, Luggage, Microwave, Mountain, PartyPopper, PawPrint, Plane, PlugZap,
  Refrigerator, ShieldCheck, ShowerHead, Siren, Sparkles, Sun, Trees, Tv, Umbrella, Utensils,
  UtensilsCrossed, WashingMachine, Waves, Wifi, Wind, Zap, ArrowUpDown, Blinds, Croissant, Wine,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  CeilingFanGlyph, DeskGlyph, DiningTableGlyph, HangerGlyph, IronGlyph, KettleGlyph, PumpBottleGlyph, SoapGlyph, WardrobeGlyph,
} from "@/components/icons/AmenityGlyphs";

type AmenityIcon = ComponentType<LucideProps>;

// Amenity labels are free text (catalogue names plus raw Airbnb ones like
// "Free parking on premises"), so match by keyword. First match wins: keep
// specific patterns above generic ones ("pool view" before "pool").
const RULES: [RegExp, AmenityIcon][] = [
  [/view/, Eye],
  [/hot tub|jacuzzi/, Bath],
  [/pool/, Waves],
  [/wi-?fi|internet|ethernet/, Wifi],
  [/airport|shuttle/, Plane],
  [/\bac\b|air condition/, AirVent],
  [/ev charg/, PlugZap],
  [/parking|garage|carport/, Car],
  [/dishwasher/, UtensilsCrossed],
  [/hair ?dryer/, Wind],
  [/washer|washing|dryer|laundry/, WashingMachine],
  [/\btv\b|television|netflix|cable/, Tv],
  [/workspace|desk/, DeskGlyph],
  [/fire extinguisher/, FireExtinguisher],
  [/smoke alarm|carbon monoxide|alarm/, Siren],
  [/smoking/, Cigarette],
  [/fire ?pit|fireplace|bbq|grill/, Flame],
  [/first aid/, BriefcaseMedical],
  [/camera|cctv/, Cctv],
  [/security|gated|guard|caretaker|staff/, ShieldCheck],
  [/safe\b|lockbox/, Lock],
  [/self check-?in|keypad|smart lock/, Key],
  [/chef/, ChefHat],
  [/breakfast/, Croissant],
  [/kettle/, KettleGlyph],
  [/coffee|\btea\b/, Coffee],
  [/refrigerator|fridge|freezer/, Refrigerator],
  [/microwave/, Microwave],
  [/stove|oven|cook|toaster/, CookingPot],
  [/kitchen/, Utensils],
  [/dining table/, DiningTableGlyph],
  [/dishes|silverware|crockery|cutlery|dining|high chair/, Utensils],
  [/wine|glasses/, Wine],
  [/purifier|drinking water|ro water/, Droplets],
  [/soap|body wash|shower gel/, SoapGlyph],
  [/shampoo|conditioner|toiletries/, PumpBottleGlyph],
  [/hot water|geyser|shower/, ShowerHead],
  [/bath|bidet/, Bath],
  [/heating|heater/, Heater],
  [/ceiling fan/, CeilingFanGlyph],
  [/\bfan\b/, Fan],
  [/backup|inverter|generator|power/, Zap],
  [/\biron/, IronGlyph],
  [/wardrobe|closet|clothes storage|dresser/, WardrobeGlyph],
  [/hanger/, HangerGlyph],
  [/towel|linen|pillow|blanket|mattress|bed|crib|\bcot\b/, Bed],
  [/blind|curtain|darkening/, Blinds],
  [/mosquito/, Fence],
  [/baby|children|kids|gate/, Baby],
  [/board game|games/, Dice5],
  [/book/, BookOpen],
  [/beach/, Umbrella],
  [/garden|courtyard|tree/, Trees],
  [/balcony|terrace|rooftop|patio|sun ?deck/, Sun],
  [/outdoor|hammock|furniture/, Armchair],
  [/mountain|hill/, Mountain],
  [/gym|fitness/, Dumbbell],
  [/elevator|lift/, ArrowUpDown],
  [/single-level|step-free|entrance/, DoorOpen],
  [/scooter|bike|bicycle/, Bike],
  [/housekeeping|cleaning/, Sparkles],
  [/luggage/, Luggage],
  [/long term|monthly/, CalendarDays],
  [/\bpets?\b|pet-friendly/, PawPrint],
  [/event|part(y|ies)/, PartyPopper],
  [/city|building/, Building2],
];

/** Icon for an amenity label; a plain check when nothing matches. */
export function amenityIcon(label: string): AmenityIcon {
  const l = label.toLowerCase();
  return RULES.find(([re]) => re.test(l))?.[1] ?? Check;
}
