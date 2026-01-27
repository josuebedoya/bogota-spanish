import {directus} from "@/server/directus";
import {readItems} from "@directus/sdk";
import {defaultLang} from "@/i18n/ui";
import {getLangData} from "@/i18n/getLangData";

const nullDataResponse = {
  data: null,
  error: "Data not found",
};

const fieldsPlansAndPricing = [
  "*",
  "lang.*",
];

export const getPlansAndPricingData = async (lang: string = defaultLang) => {

  let error = null;

  const data = await directus?.request(readItems("plans_and_pricing", {fields: fieldsPlansAndPricing})) as any;

  if (!data) {
    return nullDataResponse;
  }

  const dataLang = getLangData(data?.lang, lang);

  if (!dataLang) {
    return nullDataResponse;
  }

  return {
    data: dataLang,
    error,
  };
}