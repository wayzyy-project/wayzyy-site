import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  path?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  children?: React.ReactNode;
}

export function SEO({
  title,
  description,
  ogType = "website",
  ogImage = "/og-image.png",
  path,
  jsonLd,
  children,
}: SEOProps) {
  useEffect(() => {
    // 1. Document Title
    const previousTitle = document.title;
    document.title = title;

    // Helper to select or create a meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Core Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "author", "Wayzyy");

    // 3. Open Graph Tags
    const siteUrl = "https://wayzyy.com";
    const currentPath = path ?? window.location.pathname;
    // Strip trailing slashes consistently, but maintain root
    const cleanPath = currentPath === "/" ? "" : currentPath.replace(/\/+$/, "");
    const canonicalUrl = `${siteUrl}${cleanPath}`;

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:site_name", "Wayzyy");

    const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;
    setMetaTag("property", "og:image", fullImageUrl);
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");

    // 4. Twitter Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", fullImageUrl);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 6. JSON-LD Schemas injection
    const scriptIds: string[] = [];
    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, index) => {
        const id = `jsonld-seo-${index}`;
        scriptIds.push(id);
        
        let script = document.getElementById(id) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement("script");
          script.id = id;
          script.type = "application/ld+json";
          document.head.appendChild(script);
        }
        script.text = JSON.stringify(schema);
      });
    }

    // Cleanup
    return () => {
      document.title = previousTitle;
      
      // Remove dynamically added JSON-LD scripts
      scriptIds.forEach((id) => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, [title, description, ogType, ogImage, path, jsonLd]);

  return <>{children}</>;
}
