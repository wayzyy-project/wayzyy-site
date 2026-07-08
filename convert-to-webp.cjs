#!/usr/bin/env node
// convert-to-webp.cjs — converts all blog images to WebP and renames references

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "public/blog");
const QUALITY = 82; // good balance: visually lossless, ~60-75% smaller than PNG

async function convertAll() {
  const files = fs.readdirSync(BLOG_DIR);
  const images = files.filter((f) =>
    /\.(png|jpg|jpeg)$/i.test(f)
  );

  console.log(`\nFound ${images.length} images to convert:\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of images) {
    const srcPath = path.join(BLOG_DIR, file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const destFile = `${base}.webp`;
    const destPath = path.join(BLOG_DIR, destFile);

    // Skip if already a webp source
    if (ext.toLowerCase() === ".webp") continue;

    const statBefore = fs.statSync(srcPath);
    totalBefore += statBefore.size;

    try {
      await sharp(srcPath).webp({ quality: QUALITY }).toFile(destPath);

      const statAfter = fs.statSync(destPath);
      totalAfter += statAfter.size;

      const savings = (
        ((statBefore.size - statAfter.size) / statBefore.size) *
        100
      ).toFixed(1);
      const beforeKb = (statBefore.size / 1024).toFixed(0);
      const afterKb = (statAfter.size / 1024).toFixed(0);

      console.log(
        `  ✓ ${file.padEnd(50)} ${beforeKb}K → ${afterKb}K  (-${savings}%)`
      );
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log("\n──────────────────────────────────────────────────────────────");
  const totalSavings = (
    ((totalBefore - totalAfter) / totalBefore) *
    100
  ).toFixed(1);
  console.log(
    `  Total before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `  Total after:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`  Saved:        ${totalSavings}% 🚀\n`);
}

convertAll().catch(console.error);
