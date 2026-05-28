import type { Locale } from "~/i18n";

const localeMap: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
};

export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
