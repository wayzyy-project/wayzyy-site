// Festival and long-weekend windows hosts commonly price up, so the host
// calendar can offer them as one tap. Dates are the NIGHTS to price, inclusive.
// Lunar-calendar festivals shift year to year; these were checked for
// 2026-27 and the list should be refreshed each year. The suggested uplift is
// only a starting point - the host can change it before saving.
export interface FestivalPack {
  id: string;
  name: string;
  /** First night, YYYY-MM-DD */
  start: string;
  /** Last night, YYYY-MM-DD */
  end: string;
  suggestedPct: number;
}

export const INDIA_FESTIVAL_PACKS: FestivalPack[] = [
  { id: 'durga-dussehra-2026', name: 'Durga Puja & Dussehra', start: '2026-10-16', end: '2026-10-21', suggestedPct: 20 },
  { id: 'diwali-2026',         name: 'Diwali week',           start: '2026-11-05', end: '2026-11-11', suggestedPct: 25 },
  { id: 'xmas-ny-2026',        name: 'Christmas & New Year',  start: '2026-12-23', end: '2027-01-02', suggestedPct: 30 },
  { id: 'republic-day-2027',   name: 'Republic Day weekend',  start: '2027-01-23', end: '2027-01-26', suggestedPct: 15 },
  { id: 'holi-2027',           name: 'Holi weekend',          start: '2027-03-19', end: '2027-03-22', suggestedPct: 20 },
  { id: 'independence-2027',   name: 'Independence Day & Raksha Bandhan', start: '2027-08-13', end: '2027-08-17', suggestedPct: 15 },
  { id: 'ganesh-2027',         name: 'Ganesh Chaturthi',      start: '2027-09-03', end: '2027-09-05', suggestedPct: 15 },
];
