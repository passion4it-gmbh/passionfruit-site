/**
 * Reusable JSON-LD payloads for site-wide structured data.
 * Consumed by StructuredData.astro.
 */

import type { CollectionEntry } from "astro:content";
import type { Locale } from "~/i18n";

const SITE_URL = "https://example.com";
const LOGO_URL = `${SITE_URL}/logos/greenleaf-digital.svg`;

export const ORGANIZATION_LD = {
  "@id": `${SITE_URL}/#organization`,
  name: "Greenleaf Digital",
  url: SITE_URL,
  logo: LOGO_URL,
} as const;

export const WEBSITE_LD = {
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Greenleaf Digital",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: ["de-DE", "en-US"],
} as const;

export const PUBLISHER_REF = {
  "@type": "Organization",
  name: "Greenleaf Digital",
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
  },
} as const;

export interface BlogAuthor {
  name: string;
  role?: string;
}

export function buildBlogPostingLd(
  entry: CollectionEntry<"blog">,
  author: BlogAuthor | undefined,
  imageUrl: string,
  canonicalUrl: string,
  lang: Locale,
): Record<string, unknown> {
  return {
    headline: entry.data.title,
    description: entry.data.description,
    image: imageUrl,
    datePublished: entry.data.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: author?.name ?? "Greenleaf Digital",
      ...(author?.role ? { jobTitle: author.role } : {}),
    },
    publisher: PUBLISHER_REF,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    inLanguage: lang === "de" ? "de-DE" : "en-US",
  };
}
