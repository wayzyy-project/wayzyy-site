const fs = require('fs');
const path = require('path');

// Read and parse blogPosts.ts
let blogPostsCode = fs.readFileSync(path.join(__dirname, '../src/lib/blogPosts.ts'), 'utf8');
blogPostsCode = blogPostsCode.replace(/export interface BlogPostMeta[\s\S]*?\n\}/g, '');
blogPostsCode = blogPostsCode.replace(': BlogPostMeta[]', '');
blogPostsCode = blogPostsCode.replace('export const blogPosts', 'const blogPosts');
blogPostsCode += '\nmodule.exports = { blogPosts };';

const evalModule = { exports: {} };
const runCode = new Function('module', 'exports', 'require', blogPostsCode);
runCode(evalModule, evalModule.exports, require);
const blogPosts = evalModule.exports.blogPosts;

// Live Goa listings for the sitemap. Same filter as the public /goa-stays page
// (active, Goa, not a seed/test host). Fail-soft: with no credentials or no
// network the sitemap is still built, just without listing URLs.
async function fetchLiveListingUrls() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('VITE_SUPABASE_URL/ANON_KEY not set - sitemap built without listing pages.');
    return [];
  }
  try {
    const pageSrc = fs.readFileSync(path.join(__dirname, '../src/pages/GoaStaysPublic.tsx'), 'utf8');
    const seedBlock = pageSrc.match(/SEED_HOST_EMAILS\s*=\s*\[([\s\S]*?)\]/);
    const seeds = seedBlock ? [...seedBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
    const q = `${url}/rest/v1/properties?select=id,host_email,created_at&status=eq.active&state=ilike.goa&order=created_at.desc`;
    const res = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    return rows.filter((r) => !seeds.includes(r.host_email)).map((r) => r.id);
  } catch (err) {
    console.warn('Could not fetch listings for sitemap:', err.message);
    return [];
  }
}

(async () => {
const siteUrl = 'https://wayzyy.com';
const today = new Date().toISOString().slice(0, 10);

// 1. Generate sitemap.xml
const listingIds = await fetchLiveListingUrls();
const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/airbnb-alternative', priority: '0.9', changefreq: 'monthly' },
  { url: '/earnings-calculator', priority: '0.8', changefreq: 'monthly' },
  { url: '/goa-host-compliance-checklist', priority: '0.8', changefreq: 'monthly' },
  { url: '/host', priority: '0.8', changefreq: 'monthly' },
  { url: '/host-onboarding', priority: '0.7', changefreq: 'monthly' },
  { url: '/gig-challenge', priority: '0.7', changefreq: 'weekly' },
  { url: '/grand-prix', priority: '0.7', changefreq: 'weekly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/explore', priority: '0.8', changefreq: 'monthly' },
  { url: '/goa-stays', priority: '0.9', changefreq: 'daily' },
  { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { url: '/payment-refund', priority: '0.5', changefreq: 'yearly' },
  { url: '/host-terms', priority: '0.5', changefreq: 'yearly' },
  { url: '/guest-terms', priority: '0.5', changefreq: 'yearly' },
  { url: '/policies', priority: '0.5', changefreq: 'yearly' },
];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

staticRoutes.forEach((r) => {
  sitemapXml += `  <url>\n    <loc>${siteUrl}${r.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
});

listingIds.forEach((id) => {
  sitemapXml += `  <url>\n    <loc>${siteUrl}/property/${id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
});

blogPosts.forEach((post) => {
  sitemapXml += `  <url>\n    <loc>${siteUrl}/blog/${post.slug}</loc>\n    <lastmod>${post.publishedDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});

sitemapXml += `</urlset>\n`;
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapXml, 'utf8');
console.log(`Generated sitemap.xml with ${staticRoutes.length + listingIds.length + blogPosts.length} URLs (${listingIds.length} listings).`);

// 2. Generate llms.txt
let llmsTxt = `# Wayzyy

> Wayzyy is a host-first short-term rental platform for Goa villas and vacation rentals with 0% host commission and honest pricing for travellers.

## Core Pages

- [Wayzyy Homepage](${siteUrl}/)
- [Airbnb Alternative in Goa: Discover Wayzyy](${siteUrl}/airbnb-alternative)
- [Airbnb vs Wayzyy Host Earnings Calculator](${siteUrl}/earnings-calculator)
- [The Goa Host's Compliance Checklist](${siteUrl}/goa-host-compliance-checklist)
- [List Your Villa on Wayzyy](${siteUrl}/host)
- [Wayzyy Blog](${siteUrl}/blog)
- [Explore Homestays (App Launch Status)](${siteUrl}/explore)

## Articles & Guides (${blogPosts.length} Guides)

`;

blogPosts.forEach((post) => {
  llmsTxt += `- [${post.title}](${siteUrl}/blog/${post.slug})\n`;
});

llmsTxt += `\n## Legal & Policies\n\n`;
llmsTxt += `- [Privacy Policy](${siteUrl}/privacy)\n`;
llmsTxt += `- [Payment & Refund Policy](${siteUrl}/payment-refund)\n`;
llmsTxt += `- [Host Terms of Service](${siteUrl}/host-terms)\n`;
llmsTxt += `- [Guest Terms of Service](${siteUrl}/guest-terms)\n`;

fs.writeFileSync(path.join(__dirname, '../public/llms.txt'), llmsTxt, 'utf8');
console.log(`Generated llms.txt with ${blogPosts.length} article links.`);

// 3. Generate llms-full.txt
let llmsFullTxt = `# Wayzyy Complete Knowledge Base & Site Directory\n\n`;

staticRoutes.forEach((r) => {
  llmsFullTxt += `- ${siteUrl}${r.url}\n`;
});

blogPosts.forEach((post) => {
  llmsFullTxt += `- ${siteUrl}/blog/${post.slug}\n`;
});

fs.writeFileSync(path.join(__dirname, '../public/llms-full.txt'), llmsFullTxt, 'utf8');
console.log(`Generated llms-full.txt with ${staticRoutes.length + blogPosts.length} URLs.`);
})();
