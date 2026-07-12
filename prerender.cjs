const fs = require('fs');
const path = require('path');

// 0. Load server-rendered article HTML (produced by scripts/ssr-blog.tsx), if present.
// This is what makes the prerendered pages actually crawlable by bots that don't run JS
// (GPTBot, ClaudeBot, PerplexityBot, CCBot) — without it they'd only ever see meta tags.
const ssrOutputPath = path.join(__dirname, 'scripts', '.ssr-output.json');
let ssrOutput = {};
if (fs.existsSync(ssrOutputPath)) {
  ssrOutput = JSON.parse(fs.readFileSync(ssrOutputPath, 'utf8'));
  console.log(`Loaded SSR content for ${Object.keys(ssrOutput).length} route(s).`);
} else {
  console.warn('No scripts/.ssr-output.json found — run `npm run ssr:blog` first. Falling back to meta-only prerendering.');
}

// 1. Load blog posts metadata
let blogPostsCode = fs.readFileSync('./src/lib/blogPosts.ts', 'utf8');
// remove interface definition
blogPostsCode = blogPostsCode.replace(/export interface BlogPostMeta[\s\S]*?\n\}/g, '');
// remove type annotation
blogPostsCode = blogPostsCode.replace(': BlogPostMeta[]', '');
// replace export const with const
blogPostsCode = blogPostsCode.replace('export const blogPosts', 'const blogPosts');
// append module exports
blogPostsCode += '\nmodule.exports = { blogPosts };';

// evaluate the code to get the array
const evalModule = { exports: {} };
const runCode = new Function('module', 'exports', 'require', blogPostsCode);
runCode(evalModule, evalModule.exports, require);
const blogPosts = evalModule.exports.blogPosts;

// 2. Read compiled index.html
const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: Build files not found in dist/. Run npm run build first.');
  process.exit(1);
}
const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 3. Define routes and their specific metadata
const routes = [
  {
    path: '/privacy',
    title: 'Privacy Policy — Wayzyy',
    description: "Wayzyy's Privacy Policy: how we collect, use, and protect your personal data, including Aadhaar and DigiLocker verification, under India's DPDP Act 2023.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy — Wayzyy",
      "url": "https://wayzyy.com/privacy",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/payment-refund',
    title: 'Payment & Refund Policy — Wayzyy',
    description: "Wayzyy's Payment & Refund Policy: how flat subscription activation, transactions, and refunds work, per RBI and Consumer Protection Act guidelines.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Payment & Refund Policy — Wayzyy",
      "url": "https://wayzyy.com/payment-refund",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/host-terms',
    title: 'Host Terms of Service — Wayzyy',
    description: "Wayzyy's Host Terms of Service: listing guidelines, prepaid subscription credit limits, and booking rules for hosts, governed by Indian law.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Host Terms of Service — Wayzyy",
      "url": "https://wayzyy.com/host-terms",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/guest-terms',
    title: 'Guest Terms of Service — Wayzyy',
    description: "Wayzyy's Guest Terms of Service: Aadhaar verification, booking rules, cancellations, and consumer protections for guests booking stays on Wayzyy.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Guest Terms of Service — Wayzyy",
      "url": "https://wayzyy.com/guest-terms",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/earnings-calculator',
    title: 'Airbnb vs Wayzyy Host Earnings Calculator — Wayzyy',
    description: "See exactly how much more you'd take home hosting on Wayzyy instead of Airbnb. Enter your booking value, compare commission vs our flat credit model.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Airbnb vs Wayzyy Host Earnings Calculator",
      "url": "https://wayzyy.com/earnings-calculator",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/goa-host-compliance-checklist',
    title: "The Goa Host's Compliance Checklist — Wayzyy",
    description: "Free checklist for registering a Goa homestay, villa, or B&B: documents, fees, timelines, and renewal rules under the Goa Tourist Trade Rules and 2026 Dept. of Tourism order.",
    ogType: 'article',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Goa Host's Compliance Checklist",
      "url": "https://wayzyy.com/goa-host-compliance-checklist",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies',
    title: 'Policies — Wayzyy',
    description: "Every Wayzyy policy in one place: guest and host terms, cancellations, payments, safety, discrimination, disputes, and grievance redressal.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Policies — Wayzyy",
      "url": "https://wayzyy.com/policies",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/cancellation',
    title: 'Cancellation Policy — Wayzyy',
    description: "Wayzyy's Cancellation Policy: the 24-hour free cancellation window, host cancellation tiers, and refund timelines.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cancellation Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/cancellation",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/community-guidelines',
    title: 'Community Guidelines — Wayzyy',
    description: "Wayzyy's Community Guidelines: standards of conduct for guests, hosts, and event organisers across the platform.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Community Guidelines — Wayzyy",
      "url": "https://wayzyy.com/policies/community-guidelines",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/damage-security',
    title: 'Damage & Security Policy — Wayzyy',
    description: "Wayzyy's Damage & Security Policy: guest liability for damage, the evidence-led claim process, and host safety standards.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Damage & Security Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/damage-security",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/discrimination-inclusion',
    title: 'Discrimination & Inclusion Policy — Wayzyy',
    description: "Wayzyy's Discrimination & Inclusion Policy: protected characteristics under Indian law and our zero-tolerance enforcement framework.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Discrimination & Inclusion Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/discrimination-inclusion",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/grievance-redressal',
    title: 'Grievance Redressal Policy — Wayzyy',
    description: "Wayzyy's Grievance Redressal Policy: our statutory consumer protection framework, designated Grievance Officer, and resolution timelines.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Grievance Redressal Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/grievance-redressal",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/dispute-resolution',
    title: 'Dispute Resolution Policy — Wayzyy',
    description: "Wayzyy's Dispute Resolution Policy: the three-level escalation framework for booking disagreements between hosts and guests.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Dispute Resolution Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/dispute-resolution",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/prohibited-content',
    title: 'Prohibited Content & Listings Policy — Wayzyy',
    description: "Wayzyy's Prohibited Content & Listings Policy: what listings, messages, and profile content are not allowed on the platform.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Prohibited Content & Listings Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/prohibited-content",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/review-rating',
    title: 'Review & Rating Policy — Wayzyy',
    description: "Wayzyy's Review & Rating Policy: the double-blind review system, rating categories, and the Wayzyy Verified badge.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Review & Rating Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/review-rating",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/policies/trust-safety',
    title: 'Trust & Safety Policy — Wayzyy',
    description: "Wayzyy's Trust & Safety Policy: identity verification, communication safeguards, and fraud mitigation across the platform.",
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Trust & Safety Policy — Wayzyy",
      "url": "https://wayzyy.com/policies/trust-safety",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  },
  {
    path: '/blog',
    title: 'Wayzyy Blog — Villas, Vacation Rentals & Honest Travel Guides',
    description: 'Guides on booking villas in Goa, comparing Airbnb alternatives, and finding transparent, locally hosted vacation rentals in India.',
    ogType: 'website',
    ogImage: '/og-image.png',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Wayzyy Blog",
      "url": "https://wayzyy.com/blog",
      "publisher": { "@type": "Organization", "name": "Wayzyy" }
    }
  }
];

// Add blog posts to routes
blogPosts.forEach((post) => {
  routes.push({
    path: `/blog/${post.slug}`,
    title: post.metaTitle,
    description: post.metaDescription,
    ogType: 'article',
    ogImage: post.heroImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.publishedDate,
      "author": {
        "@type": "Organization",
        "name": "Wayzyy"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wayzyy",
        "url": "https://wayzyy.com"
      },
      "url": `https://wayzyy.com/blog/${post.slug}`,
      "image": `https://wayzyy.com${post.heroImage}`
    }
  });
});

// 4. Generate folders and write files
routes.forEach((route) => {
  const dirPath = path.join(__dirname, 'dist', ...route.path.split('/').filter(Boolean));
  fs.mkdirSync(dirPath, { recursive: true });

  const canonicalUrl = `https://wayzyy.com${route.path}`;
  const fullImageUrl = route.ogImage.startsWith('http') ? route.ogImage : `https://wayzyy.com${route.ogImage}`;

  let html = templateHtml;

  // Replace title tag
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);

  // Replace description meta tag
  html = html.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/, `<meta name="description" content="${route.description}" />`);

  // Replace og:title
  html = html.replace(/<meta property="og:title" content="[\s\S]*?"\s*\/?>/, `<meta property="og:title" content="${route.title}" />`);

  // Replace og:description
  html = html.replace(/<meta property="og:description" content="[\s\S]*?"\s*\/?>/, `<meta property="og:description" content="${route.description}" />`);

  // Replace og:type
  html = html.replace(/<meta property="og:type" content="[\s\S]*?"\s*\/?>/, `<meta property="og:type" content="${route.ogType}" />`);

  // Replace og:image
  html = html.replace(/<meta property="og:image" content="[\s\S]*?"\s*\/?>/, `<meta property="og:image" content="${fullImageUrl}" />`);

  // Replace twitter:image
  html = html.replace(/<meta name="twitter:image" content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:image" content="${fullImageUrl}" />`);

  // Inject additional meta tags and scripts into head (canonical link, twitter card, twitter title, twitter description, jsonld schema)
  const headInsertions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${fullImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>
  `;

  html = html.replace('</head>', `${headInsertions}\n</head>`);

  // Inject real server-rendered article markup into #root so non-JS crawlers can read it.
  // React's client-side render() replaces this on hydration for real visitors, so there's
  // no mismatch risk — it's just a one-time paint-over, same idea as SSG.
  const ssrHtml = ssrOutput[route.path];
  if (ssrHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`);
  }

  const filePath = path.join(dirPath, 'index.html');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Prerendered page: ${route.path} -> ${filePath}`);
});

// 5. Inject SSR content into the root index.html (the homepage) — its meta tags are
// already correct in the base template, it just needs the real markup in #root.
if (ssrOutput['/']) {
  const rootHtml = templateHtml.replace('<div id="root"></div>', `<div id="root">${ssrOutput['/']}</div>`);
  fs.writeFileSync(indexHtmlPath, rootHtml, 'utf8');
  console.log(`Prerendered page: / -> ${indexHtmlPath}`);
}

console.log('Prerendering completed successfully!');
