# Omero — teaser site

> Stays without the small print. Honest pricing for travelers. Fair, evidence-respecting policies for hosts.

A subscription-for-hosts (free-for-travelers) stay platform. This repo is the
**teaser / waitlist** site. It's a Vite + React + TypeScript app, Tailwind +
shadcn/ui for the primitives, Framer Motion for choreography, and Lenis for
buttery smooth scrolling.

## Stack

- Vite 5 + React 18 + TypeScript 5
- Tailwind CSS + tailwindcss-animate
- shadcn/ui component primitives (already vendored under `src/components/ui`)
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
  App.tsx                  ← routes + providers + smooth scroll
  pages/
    Index.tsx              ← the teaser
    NotFound.tsx
  components/
    SmoothScroll.tsx       ← Lenis wrapper
    Reveal.tsx             ← scroll-triggered fade-up
    Backpacker.tsx         ← walking backpacker SVG
    SiteNav.tsx            ← blur-on-scroll top nav
    HeroDualPOV.tsx        ← sticky two-panel hero, backpacker walks across
    Marquee.tsx            ← infinite scrolling principles strip
    WhySection.tsx         ← "why we exist" — the Superhost story
    TwoSides.tsx           ← traveler ↔ host segmented view
    Principles.tsx         ← horizontally drifting manifesto
    WaitlistSection.tsx
    Waitlist.tsx           ← dual-audience email capture
    SiteFooter.tsx
    theme-toggle.tsx
    ui/                    ← shadcn primitives
  index.css                ← design tokens (HSL), Lenis CSS, keyframes
```

## Design system

All colors are HSL custom properties in `src/index.css` (and surfaced as
Tailwind tokens in `tailwind.config.ts`). The palette is warm "paper" +
ink, with a single **ember / coral** accent. Brand display font is
Instrument Serif (italics carry a lot of weight); body is Inter.

To shift the accent later, change `--ember` in `:root` and `.dark`.

## What's next

- Wire `Waitlist.tsx` to a real backend (Resend / Loops / Supabase / your own).
- Drop in real hero photography behind the dual-POV panels if/when ready.
- Add `/host` and `/travel` deeper landing pages once the product surface stabilizes.
- Point `git remote set-url origin <your-new-repo>` once the repo's created.

## Notes on origin

Bootstrapped from a clean Vite + shadcn project I'd built before (GRT) —
kept the build tooling and shadcn primitives, replaced everything else.
