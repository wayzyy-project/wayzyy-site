/**
 * Display-only tidy-up for a listing's description. Descriptions come from
 * Airbnb imports and hosts' own typing, so they arrive with section titles
 * glued onto the previous sentence ("...memories."The space"), single line
 * breaks standing in for paragraphs, "*" bullets run together on one line and
 * missing spaces after full stops. This turns the raw text into blocks the page
 * can lay out with proper spacing. The stored text is never changed.
 */

export type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string; label?: string }
  | { type: "list"; items: string[] };

// Section titles Airbnb adds to a listing's text.
const HEADINGS = ["The space", "Guest access", "Other things to note", "Getting around", "Location", "Why Stay Here?", "Why stay here?"];
const HEADING_SET = new Set(HEADINGS.map((h) => h.toLowerCase().replace(/[:.]$/, "")));

const isHeading = (line: string) => HEADING_SET.has(line.trim().toLowerCase().replace(/[:.]$/, ""));

const normalise = (raw: string): string => {
  let t = raw.replace(/\r\n?/g, "\n").replace(/[^\S\n]+/g, " ").replace(/ *\n */g, "\n");

  // A section title stuck to the end of the previous sentence, or to the text after it.
  t = t.replace(
    /([.!?”"’)])\s*(The space|Guest access|Other things to note|Getting around)(?=\n|$|[A-Za-z\-:])/g,
    "$1\n$2\n",
  );
  t = t.replace(/([.!?”"’)])\s*Location(?=\n)/g, "$1\nLocation");
  t = t.replace(/([.!?”"’)])\s*(Facilities|Amenities)\s*([-–:])\s*/g, "$1\n$2 $3 ");

  // Question-and-answer notes run together: "...- Q: What time? -A: 3pm"
  t = t.replace(/\s*-?\s*\b(Q|A):\s*/g, "\n$1: ");

  // "Vagator.This" -> "Vagator. This" (lower-case letter, full stop, capital letter and a lower-case one after).
  t = t.replace(/([a-z])\.([A-Z][a-z])/g, "$1. $2");

  return t.replace(/\n{3,}/g, "\n\n").trim();
};

const BULLET_START = /^(?:[*•·]|-\s)\s*/;

export function formatDescription(raw: string | null | undefined): DescriptionBlock[] {
  if (!raw || !raw.trim()) return [];
  const blocks: DescriptionBlock[] = [];
  const pushItem = (item: string) => {
    const last = blocks[blocks.length - 1];
    if (last && last.type === "list") last.items.push(item);
    else blocks.push({ type: "list", items: [item] });
  };

  for (const rawLine of normalise(raw).split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isHeading(line)) {
      blocks.push({ type: "heading", text: line.replace(/[:.]$/, "") });
      continue;
    }

    // "...including:* Pool* Garden* Kitchen" - bullets run together on one line.
    if ((line.match(/\*/g) ?? []).length >= 2) {
      const [lead, ...items] = line.split(/\s*\*\s*/);
      if (lead.trim()) blocks.push({ type: "paragraph", text: lead.trim() });
      items.map((i) => i.trim()).filter(Boolean).forEach(pushItem);
      continue;
    }

    if (BULLET_START.test(line)) {
      pushItem(line.replace(BULLET_START, "").trim());
      continue;
    }

    const qa = line.match(/^([QA]):\s+(.+)$/);
    if (qa) {
      blocks.push({ type: "paragraph", label: qa[1], text: qa[2] });
      continue;
    }

    // "Spacious Comfort: Seven bedrooms..." - bold the short label before the colon.
    const labelled = line.match(/^([A-Z][^:.!?]{1,40}):\s+(.{20,})$/);
    if (labelled && labelled[1].split(" ").length <= 5 ) {
      blocks.push({ type: "paragraph", label: labelled[1], text: labelled[2] });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }
  return blocks;
}
