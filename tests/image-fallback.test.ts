import assert from "node:assert/strict";
import test from "node:test";
import { fallbackImageToOriginal, originalImageUrl } from "../src/lib/img";

const source = "https://example.supabase.co/storage/v1/object/public/property-images/photo.jpg";
const optimized = `https://wayzyy.com/_vercel/image?url=${encodeURIComponent(source)}&w=900&q=75`;

test("recovers a public image URL from a Vercel optimizer request", () => {
  assert.equal(originalImageUrl(optimized), source);
  assert.equal(originalImageUrl(source), source);
});

test("falls back to the original image once without looping", () => {
  const removed: string[] = [];
  const element = {
    dataset: {} as Record<string, string>,
    currentSrc: optimized,
    src: optimized,
    removeAttribute: (name: string) => removed.push(name),
  } as unknown as HTMLImageElement;

  assert.equal(fallbackImageToOriginal(element, source), true);
  assert.equal(element.src, source);
  assert.deepEqual(removed, ["srcset", "sizes"]);
  assert.equal(fallbackImageToOriginal(element, source), false);
});
