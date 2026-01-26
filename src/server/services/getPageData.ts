import directus from "@/server/directus";
import {readItems} from "@directus/sdk";
import {defaultLang} from "@/i18n/ui";
import {getLangData} from "@/i18n/getLangData";

const nullDataResponse = {
  data: null,
};

const fields = [
  "*",
  "lang.*",
];

export const getPageData = async (model: string, lang: string = defaultLang, params?: any) => {

  let error = null;

  const data = await directus.request(readItems(model, {fields: [...fields, ...(params?.fields || [])], ...params})) as any;

  if (!data) {
    return nullDataResponse;
  }

  const dataLang = getLangData(data?.lang, lang);

  return {
    data,
    dataLang,
    error
  }
}