import type { Locale } from "~/i18n";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

const testimonials: Record<Locale, Testimonial[]> = {
  de: [
    {
      quote:
        "Greenleaf Digital hat unsere Website in Rekordzeit umgesetzt. Das Ergebnis übertrifft unsere Erwartungen.",
      author: "Thomas Berger",
      company: "Berger Consulting",
    },
    {
      quote:
        "Endlich eine Agentur, die moderne Technologien einsetzt und nicht auf veraltete Systeme setzt.",
      author: "Sarah Klein",
      company: "Klein & Partner",
    },
  ],
  en: [
    {
      quote:
        "Greenleaf Digital delivered our website in record time. The result exceeds our expectations.",
      author: "Thomas Berger",
      company: "Berger Consulting",
    },
    {
      quote:
        "Finally an agency that uses modern technologies instead of relying on outdated systems.",
      author: "Sarah Klein",
      company: "Klein & Partner",
    },
  ],
};

export function getTestimonials(locale: Locale): Testimonial[] {
  return testimonials[locale];
}
