import { readItems } from "@directus/sdk";
import directus from "@/server/directus";
import { getLangData } from "@/i18n/getLangData";
import { defaultLang } from "@/i18n/ui";

export async function getMenuData(position: string | number, lang: string = defaultLang) {

  let error = null;

  const data = await directus?.request(
    readItems("Menu", {
      filter:{status: { _eq: "published" }},
      sort: [ "id" ],
      fields: [ "*", "lang.*" ],
    }),
  );

  if (!data) {
    return error = "Data not found";
  }

  // Filter items by position
  const itemsPosition = data?.filter((item: any) => item?.Position?.[ 0 ] === String(position)) as any;

  // Mapping items and filter by lang
  return itemsPosition?.map((item: any, i: number) => {
    const itemLang = getLangData(item?.lang, lang);

    return {
      id: itemLang.id || i + 1,
      label: itemLang.title,
      slug: lang === defaultLang ? itemLang.link || "" : `/${lang}${itemLang.link}`,
      error
    }
  }) || [];
}