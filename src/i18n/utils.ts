import { ui, defaultLang, languages } from './ui';
import { pathHasLocale } from 'astro:i18n';
import { routes } from "./routes";

type R = keyof typeof routes;
type Ui = keyof typeof ui;


export function getLangFromUrl(url: URL) {
  const [ , lang ] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: Ui) {
  return function t(key: keyof typeof ui[ typeof defaultLang ]) {
    console.log('key', key,ui[ lang ][ key ]);
    return ui[ lang ][ key ] || ui[ defaultLang ][ key ];
  }
}

export async function validateRoute(lang: keyof typeof routes[ R ], slug: string) {

/*   const t = Object.keys(routes).find((r) => {
    if (lang && slug) {
      return routes[ r as R ][ lang ] === slug ? r : null;
    } else {
      // If the path is equal to a language code, return home
      if (slug in languages) {
        return 'home';
      }

      return routes[ r as R ][ defaultLang ] === slug ? r : null;
    }
  }) */
  return {route:'about-us'};
}

export function getLang(url: URL) {
  const urlObj = new URL(url);

  const [ , lang ] = urlObj.pathname.split('/').slice(0, 2);
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}