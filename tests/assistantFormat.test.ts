import assert from "node:assert/strict";
import test from "node:test";
import { cleanAssistantText, toBlocks } from "../src/lib/assistantFormat";

test("removes markdown symbols but keeps the words", () => {
  assert.equal(cleanAssistantText("The **Anjuna Villa** is free for *12-14 Dec*."), "The Anjuna Villa is free for 12-14 Dec.");
  assert.equal(cleanAssistantText("## Options\nSee [the villa](https://wayzyy.com/property/x)."), "Options\nSee the villa.");
});

test("turns asterisk bullets into a real list", () => {
  assert.deepEqual(toBlocks("Here you go:\n* Villa A, Siolim\n* Villa B, Baga\n\nWant more?"), [
    { type: "p", text: "Here you go:" },
    { type: "ul", items: ["Villa A, Siolim", "Villa B, Baga"] },
    { type: "p", text: "Want more?" },
  ]);
});

test("numbered lists stay numbered", () => {
  assert.deepEqual(toBlocks("1. First\n2. Second"), [{ type: "ol", items: ["First", "Second"] }]);
});

test("plain text is one paragraph and sums with an asterisk are left alone", () => {
  assert.deepEqual(toBlocks("3 nights * 8000 = 24000"), [{ type: "p", text: "3 nights * 8000 = 24000" }]);
});
