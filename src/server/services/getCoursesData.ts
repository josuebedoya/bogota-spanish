import { directus, directusMedia } from "@/server/directus";
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

export const getCoursesData = async (lang: string = defaultLang) => {

  let error = null;

  const data = await directus?.request(readItems("Courses", { filter: { status: { _eq: "1" } }, fields: fieldsCourses, sort: ['-priority'] })) as any;
  
  if (!data) {
    return nullDataResponse;
  }

  // Mapping items and filter by lang
  const courses = await Promise.all(data?.map(async (item: any, i: number) => {
    const itemLang = getLangData(item?.lang, lang);
    const isEven = i % 2 === 0;
    const isLast = i === data.length - 1;

    return {
      id: item.id || i + 1,
      icon: item?.icon || "",
      image: await directusMedia(item?.image, itemLang?.shurt_title, { width: 670, height: 750 }).then(i => i?.src_path || ""),
      isEven,
      isLast,
      ...itemLang
    }
  }
  )) || [];


  return {
    data: courses,
    error,
  };

}