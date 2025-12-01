import { directus } from "@/server/directus";
import { readItems } from "@directus/sdk";
import { defaultLang } from "@/i18n/ui";
import { getLangData } from "@/i18n/getLangData";

const nullDataResponse = {
  data: null,
  error: "Data not found",
};

const fieldsCourses = [
  "*",
  "lang.*",
];

export const getContactData = async (lang: string = defaultLang) => {

  let error = null;

  const data = await directus?.request(readItems("info_contact", { fields: fieldsCourses })) as any;

  if (!data) {
    return nullDataResponse;
  }

  const langData = getLangData(data?.lang, lang);

  return {
    data: { ...data, whatsapp: langData.whatsapp },
    error,
  };
}