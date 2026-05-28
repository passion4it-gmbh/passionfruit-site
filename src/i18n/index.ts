import de from "./de.json";
import en from "./en.json";

export type Locale = "de" | "en";

export const LOCALES = ["de", "en"] as const;

export const DEFAULT_LOCALE: Locale = "de";

type TranslationValue =
  | string
  | number
  | boolean
  | TranslationValue[]
  | { [k: string]: TranslationValue };
type TranslationDict = { [k: string]: TranslationValue };

const translations: Record<Locale, TranslationDict> = { de, en };

function getNestedValue(
  obj: TranslationDict,
  path: string,
): string | undefined {
  const parts = path.split(".");
  let current: TranslationValue = obj;

  for (const part of parts) {
    if (
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      part in current
    ) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

export function useTranslations(locale: Locale) {
  function t(key: string, vars?: Record<string, string | number>): string {
    const raw = getNestedValue(translations[locale], key);

    if (raw !== undefined) {
      return vars ? interpolate(raw, vars) : raw;
    }

    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Missing translation: "${key}" for locale "${locale}"`,
      );
    }

    return `[missing: ${key}]`;
  }

  return { t, locale };
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Deutsch am Apex (kein Prefix), Englisch unter /en; trailing slash always.
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const prefix = locale === "de" ? "" : "/en";
  if (!clean) return prefix === "" ? "/" : `${prefix}/`;
  return `${prefix}/${clean}/`;
}
