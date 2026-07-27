import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_KEYWORDS = 
  "florante, florant, hackathons, blogs, software, systems, tech, technology, computer, computer science, software development, web applications, programming, tech platform, coding, smart systems, enterprise software";

const DEFAULT_DESCRIPTION = 
  "Florante (Florant) is a premier tech and software platform building powerful applications, enterprise systems, hackathons, and technology blogs. Explore computer science innovations, web solutions, and modern software products.";

const DEFAULT_TITLE = "Florante | Tech, Software, Systems, Hackathons & Blogs";
const BASE_URL = "https://florante.tech"; // Default site domain baseline

export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    // 1. Title
    const pageTitle = title ? `${title} | Florante Tech & Software` : DEFAULT_TITLE;
    document.title = pageTitle;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Tags
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const finalKeywords = keywords 
      ? `${keywords}, ${DEFAULT_KEYWORDS}` 
      : DEFAULT_KEYWORDS;

    setMetaTag('meta[name="description"]', 'name', 'description', finalDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', finalKeywords);
    setMetaTag('meta[name="author"]', 'name', 'author', 'Florante (Florant)');
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');

    // 3. Open Graph Tags
    const currentUrl = canonical ? `${BASE_URL}${canonical}` : window.location.href;
    const finalOgImage = ogImage || `${BASE_URL}/logo.png`;

    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalOgImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Florante');

    // 4. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalOgImage);

    // 5. Canonical URL
    setLinkTag('canonical', currentUrl);

    // 6. JSON-LD Structured Data
    const existingScript = document.getElementById("json-ld-page-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "json-ld-page-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd]);

  return null;
};

export default SEO;
