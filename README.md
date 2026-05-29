# Wayzyy — teaser site

> Stays without the small print. Honest pricing for travelers. Fair, subscription-based policies for hosts.

A subscription-for-hosts (free-for-travelers) stay platform built to fix what's broken with existing BnB platforms — fake listings, opaque fees, unreliable support, and algorithms that punish hosts. This repo is the **teaser / waitlist** site.

Built with Vite + React + TypeScript, Tailwind + shadcn/ui for primitives, Framer Motion for choreography, and Lenis for smooth scrolling.

## Stack

- Vite 5 + React 18 + TypeScript 5
- Tailwind CSS + tailwindcss-animate
- shadcn/ui component primitives (vendored under `src/components/ui`)
- Framer Motion 11 (scroll-driven hero, reveals, micro-interactions)
- Lenis (smooth wheel scrolling, respects reduced-motion)
- next-themes (light/dark, system aware)
- react-router-dom 6, sonner for toasts

## Run

```bash
npm install
npm run dev      # local dev on http://localhost:8080
npm run build    # production build
npm run lint     # eslint
npm run preview  # preview the built site
```

## Layout

```
src/
  App.tsx                     ← routes + providers + smooth scroll
  pages/
    Index.tsx                 ← the teaser page
    NotFound.tsx
  components/
    SmoothScroll.tsx          ← Lenis wrapper
    Reveal.tsx                ← scroll-triggered fade-up
    Backpacker.tsx            ← walking backpacker SVG illustration
    PartyFigurines.tsx        ← party crowd SVG for House Parties section
    SiteNav.tsx               ← blur-on-scroll top nav
    HeroDualPOV.tsx           ← sticky two-panel hero (hosts first → travelers on scroll)
    Marquee.tsx               ← infinite scrolling ticker strip
    WhySection.tsx            ← "why we exist" — the Superhost story
    TestimonialsSection.tsx   ← real community complaints + Wayzyy mission statement
    TwoSides.tsx              ← host ↔ traveler segmented feature view
    Principles.tsx            ← horizontally drifting manifesto
    HousePartiesSection.tsx   ← coming-soon: party booking feature
    WaitlistSection.tsx
    Waitlist.tsx              ← dual-audience email capture (host/traveler)
    SiteFooter.tsx
    theme-toggle.tsx
    ui/                       ← shadcn primitives
  index.css                   ← design tokens (HSL), Lenis CSS, keyframes
```

## Key features on the landing page

- **Host-first hero** — opens on the hosting value prop, transitions to traveler on scroll
- **Testimonials** — real community sentiment cards (Reddit) with a mission statement
- **Two Sides** — toggleable host/traveler breakdown with Aadhaar verification, tiered subscriptions, AI photo detection, staff reviews
- **Principles** — scrolling manifesto: flat-fee subscription, 24/7 real support, no algorithm penalty, bad guests blacklisted
- **House Parties** — coming-soon section with party figurine illustration
- **Waitlist** — dual-audience signup with early-joiner referral mention

## Design system

All colors are HSL custom properties in `src/index.css` (surfaced as Tailwind tokens in `tailwind.config.ts`). The palette is warm "paper" + ink with a single **ember / coral** accent. Brand display font is Instrument Serif (italics carry weight); body is Inter.

To shift the accent, change `--ember` in `:root` and `.dark`.

## What's next

- Wire `Waitlist.tsx` to a real backend (Resend / Loops / Supabase).
- Build out `/host` and `/travel` deeper landing pages.
- Add real photography behind the dual-POV hero panels.
- Implement Aadhaar verification flow.
- Launch tiered subscription pricing page.
