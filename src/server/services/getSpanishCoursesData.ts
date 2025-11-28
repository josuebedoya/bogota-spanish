import directus from "@/server/directus";
import { readItems } from "@directus/sdk";
import { defaultLang } from "@/i18n/ui";
import { getLangData } from "@/i18n/getLangData";
import { routes } from "@/i18n/routes";
import { directusMedia } from "@/server/directus";
import { languages } from "@/i18n/ui";
import { getCoursesData } from "./getCoursesData";
import { getPageData } from "./getPageData";

const nullDataResponse = {
  page: null,
  dataMainBanner: null,
  courses: null,
  error: "Data not found",
};

const fields = [
  "*",
  "lang.*",
];

export const getSpanishCoursesData = async (lang: string = defaultLang) => {

  let error = null;

  const { data, dataLang, error: errorPage } = await getPageData("Spanish_courses", lang) as any;

  if (!data || errorPage) {
    return nullDataResponse;
  }


  const fileMainBanner = await directusMedia(data?.image_main_banner, dataLang?.title_main_banner);

  // Main banner data
  const dataMainBanner = {
    title: dataLang?.title_main_banner ?? "",
    summary: dataLang?.summary_main_banner ?? "",
    button: {
      label: dataLang?.button_main_banner ?? "",
      link: routes[ "book-a-free-class" ][ lang as keyof typeof languages ],
    },
    image: fileMainBanner?.src_path ?? ""
  };

  const { data: dataCourses } = await getCoursesData(lang);
  if (!dataCourses) return nullDataResponse;
  // Mapping courses and filter fields
  const courses = dataCourses?.map((item: any) => {
    return {
      title: item?.title || "",
      summary: item?.description || "",
      image: item?.image || "",
      isEven: item?.isEven || false,
      isLast: item?.isLast || false
    }
  });

  return {
    page: dataLang,
    dataMainBanner,
    courses,
    error
  }
}