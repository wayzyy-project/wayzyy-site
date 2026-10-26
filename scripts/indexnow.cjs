// Pings IndexNow (Bing, Yandex, etc.) with every sitemap URL after a production build.
// shortcut: resubmits all URLs each deploy instead of only changed ones; fine at ~100 pages, diff against the previous sitemap when it grows.
const fs = require("fs");

const KEY = "6d48314c48814daceca40d3d9fa8a5dc";
const HOST = "wayzyy.com";

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("IndexNow: skipped (not a production build)");
    return;
  }
  const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  console.log(`IndexNow: submitted ${urlList.length} URLs, status ${res.status}`);
}

// A failed ping must never fail the deploy.
main().catch((e) => console.warn("IndexNow failed:", e.message));
