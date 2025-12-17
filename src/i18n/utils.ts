import { ui, defaultLang, languages } from './ui';
import { routes } from "./routes";

type R = keyof typeof routes;
type Ui = keyof typeof ui;

export function useTranslations(lang: Ui) {
  return function t(key: keyof typeof ui[ typeof defaultLang ], values?: Array<{ key: string; value: string }>) {

    let v = ui[ lang ][ key ] || ui[ defaultLang ][ key ];

    if (values && values.length) {
      values.forEach(({ key, value }) => {
        v = v.replaceAll(`#${key}`, value) as typeof v;
      });
    }

    return v;
  }
}

export function foundRoute(slug: string, lang: Ui): R | undefined {
  const route = Object.keys(routes).find((r) => routes[ r as R ][ lang ] === slug);
  return route as R | undefined;
}

export async function validateRoute(url: URL, slug?: string) {
  const homeResponse = { route: 'home', lang: defaultLang as Ui };
  const nullResponse = { route: null, lang: defaultLang as Ui };

  if (!url) {
    return nullResponse;
  }

  const langPage = getLang(url) as Ui;
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (pathParts.length <= 1) {
    // Validate if the path is only the language code (e.g., /en-US or /es-ES)
    if (pathParts[ 0 ] in languages || !pathParts[0]) return homeResponse;

    const t = foundRoute(pathParts[ 0 ], langPage);
    return t ? { route: t as R, lang: langPage as Ui } : nullResponse;
  }

  if (slug) {
    // Find the route that matches the slug for the given language
    const t = foundRoute(slug, langPage);
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

export function to(slug: string, lang: Ui) {
  if (slug?.startsWith(`/${lang}/`) || slug === `/${lang}` || slug?.startsWith('http')) {
    return slug;
  }

  const route = foundRoute(slug, lang);
  if (!route) return null;

  if (lang === defaultLang) {
    return `/${route}`;
  }

  return `/${lang}/${slug}`;
};