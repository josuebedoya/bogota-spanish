import { ui, defaultLang, languages } from './ui';
import { routes } from "./routes";

type R = keyof typeof routes;
type Ui = keyof typeof ui;

export function useTranslations(lang: Ui) {
  return function t(key: keyof typeof ui[ typeof defaultLang ]) {
    return ui[ lang ][ key ] || ui[ defaultLang ][ key ];
  }
}

export async function validateRoute(url: URL, slug?: string) {
  const homeResponse = { route: 'home', lang: defaultLang as Ui };
  const nullResponse = { route: null, lang: defaultLang as Ui };

  if (!url) {
    return nullResponse;
  }

  const langPage = getLang(url) as Ui;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Validate if the path is only the language code (e.g., /en-US or /es-ES)
  if (pathParts.length <= 1 && pathParts[ 0 ] in languages) {
    return homeResponse;
  }

  if (slug) {
    // Find the route that matches the slug for the given language
    const t = Object.keys(routes).find((r) => routes[ r as R ][ langPage ] === slug);
    return t ? { route: t as R, lang: langPage as Ui } : nullResponse;
  }

  return nullResponse;
}

export function getLang(url: URL) {
  if (!url) return defaultLang;
  const urlObj = new URL(url);

  const [ , lang ] = urlObj.pathname.split('/').slice(0, 2);
  if (lang in ui) return lang as Ui;
  return defaultLang;
}