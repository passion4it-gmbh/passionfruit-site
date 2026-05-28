import type { Locale } from "~/i18n";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: Record<Locale, FAQ[]> = {
  de: [
    {
      question: "Brauche ich Programmierkenntnisse?",
      answer:
        "Nein! Mit Claude Code können Sie Ihre Website per Konversation erstellen und pflegen. Beschreiben Sie einfach, was Sie möchten.",
    },
    {
      question: "Was kostet das Hosting?",
      answer:
        "Statische Websites können kostenlos auf Plattformen wie Cloudflare Pages, Vercel oder Netlify gehostet werden.",
    },
    {
      question: "Kann ich meine bestehende Domain verwenden?",
      answer:
        "Ja, Sie können jede Domain mit Ihrem Hosting-Anbieter verbinden. Die Einrichtung dauert nur wenige Minuten.",
    },
    {
      question: "Ist die Website DSGVO-konform?",
      answer:
        "Ja. Das Cookie-Consent-Banner ist eingebaut, und die Analytics (PostHog) laufen auf EU-Servern. Alle Daten bleiben in Europa.",
    },
  ],
  en: [
    {
      question: "Do I need programming skills?",
      answer:
        "No! With Claude Code, you can create and maintain your website through conversation. Just describe what you want.",
    },
    {
      question: "What does hosting cost?",
      answer:
        "Static websites can be hosted for free on platforms like Cloudflare Pages, Vercel, or Netlify.",
    },
    {
      question: "Can I use my existing domain?",
      answer:
        "Yes, you can connect any domain with your hosting provider. Setup takes just a few minutes.",
    },
    {
      question: "Is the website GDPR-compliant?",
      answer:
        "Yes. The cookie consent banner is built in, and analytics (PostHog) run on EU servers. All data stays in Europe.",
    },
  ],
};

export function getFAQs(locale: Locale): FAQ[] {
  return faqs[locale];
}
