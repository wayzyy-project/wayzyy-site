-- Migration: add submission_type to grand_prix_applications, relax pitch_deck_link
-- Created: 2026-08-19
--
-- Submissions now accept a pitch deck, a video, or both (previously the
-- deck was mandatory), and participants pick which track they're
-- pitching on: a product/feature idea or a marketing idea.

alter table public.grand_prix_applications
  add column if not exists submission_type text; -- 'product' | 'marketing'

alter table public.grand_prix_applications
  alter column pitch_deck_link drop not null;
