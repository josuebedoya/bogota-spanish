import { defaultLang } from "@/i18n/ui";
import directus, { directusMedia } from "@/server/directus";
import { readItems } from "@directus/sdk";
import slugify from "@/utils/slug";
import { getLangData } from "@/i18n/getLangData";

const nullDataResponse = {
  data: null,
  error: "Data not found",
};

const fieldsTutor = [
  "*",
  "lang.*",
];

export const getTutorData = async (tutorSlug: string, lang: string = defaultLang) => {

  let error = null;

  const data = await directus?.request(
    readItems("Tutors", {
      active: { _eq: "1" },
      fields: fieldsTutor,
    }
    )) as any;

  if (!data || !tutorSlug) {
    return nullDataResponse;
  }

  let tutorData: any = null;

  for (const t of data) {
    const slug = slugify(`${t.name_tutor}-${t.id}`);

    if (slug === tutorSlug) {
      const photo = await directusMedia(t.photo_tutor, t.name_tutor);
      tutorData = { ...t, photo, ...getLangData(t.lang || {}, lang) };
      break;
    }
  }

  return {
    data: tutorData,
    error
  }
}
