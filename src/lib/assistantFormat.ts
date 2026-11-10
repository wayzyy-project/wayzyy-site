// How the assistant's words are shown in the chat box. The server already sends plain text
// (supabase/functions/_shared/replyFormat.ts in wayzyy-app); this repeats the same cleaning so chats
// saved in the browser before that change, or any stray markdown, never show asterisks.
// Keep this in step with the server copy.

export function cleanAssistantText(input: string): string {
  let t = String(input ?? "").replace(/\r\n?/g, "\n");
  t = t.replace(/```[a-z]*\n?([\s\S]*?)```/gi, "$1").replace(/`([^`\n]+)`/g, "$1");
  t = t.replace(/\[([^\]\n]+)\]\((?:https?:\/\/|\/)[^)\s]*\)/g, "$1");
  t = t.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  t = t.replace(/\*\*([^*\n]+?)\*\*/g, "$1").replace(/__([^_\n]+?)__/g, "$1").replace(/\*\*+/g, "");
  t = t.replace(/(^|[\s(])\*([^\s*][^*\n]*?)\*(?=[\s).,!?:;]|$)/g, "$1$2");
  t = t.replace(/^[ \t]*[*•–]\s+/gm, "- ");
  t = t.replace(/^\s*\|?[\s:|-]{3,}\|?\s*$/gm, "").replace(/^\s*>\s?/gm, "");
  t = t.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

export type Block = { type: "p"; text: string } | { type: "ul"; items: string[] } | { type: "ol"; items: string[] };

/** Splits cleaned text into paragraphs and bullet / numbered lists, so lists render as real lists. */
export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join("\n") });
    para = [];
  };
  for (const line of cleanAssistantText(text).split("\n")) {
    const bullet = line.match(/^\s*-\s+(.*)$/);
    const number = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || number) {
      flush();
      const type = bullet ? "ul" : "ol";
      const item = (bullet ?? number)![1];
      const last = blocks[blocks.length - 1];
      if (last && last.type === type) last.items.push(item);
      else blocks.push({ type, items: [item] });
    } else if (line.trim() === "") {
      flush();
    } else {
      para.push(line);
    }
  }
  flush();
  return blocks;
}
