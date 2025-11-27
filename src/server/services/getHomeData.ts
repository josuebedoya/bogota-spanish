import directus, { directusMedia } from "@/server/directus";
import { readItems } from "@directus/sdk";
import { routes } from "@/i18n/routes";
import { defaultLang, languages } from "@/i18n/ui";
import { getLangData } from "@/i18n/getLangData";

const nullDataResponse = {
  data: null,
  dataMainBanner: null,
  dataBanner2: null,
  dataSpanishCourses: null,
  dataSayOurStudents: null,
  dataBookingTasterSession: null,
  dataFaq: null,
  error: "Data not found",
};

const fieldsHome = [
  "*",
  "lang.*",
  "Courses_List.Courses_id.*",
  "Courses_List.Courses_id.lang.*",
  "Stories.Stories_id.*",
  "Stories.Stories_id.lang.*",
];

type L = keyof typeof languages;

export const getHomeData = async (lang: string = defaultLang) => {

  let error = null;

  const data = await directus?.request(readItems("Home", { fields: fieldsHome })) as any;

  if (!data) {
    return nullDataResponse;
  }

  const dataLang = getLangData(data?.lang, lang);

  const fileBanner = await directusMedia(data?.Image_Main_Banner || "", dataLang?.title_main_banner);
  const fileBanner2 = await directusMedia(data?.Image_Levels_Starting || "", dataLang?.title_levels_starting);
  const fileTesterSession = await directusMedia(data?.image_tester_session || "", dataLang?.title_tester_sesion);

  if (!dataLang || !fileBanner || !fileBanner2 || !fileTesterSession) {
    return nullDataResponse;
  }


  // Main Banner Section
  const dataMainBanner = {
    phrase: dataLang?.phrase_main_banner,
    title: dataLang?.title_main_banner,
    summary: dataLang?.summary_main_banner,
    button1: {
      text: dataLang?.button_main_banner_1,
      link: routes[ "book-a-free-class" ][ lang as L ],
    },
    button2: {
      text: dataLang?.button_main_banner_2,
      link: routes[ "spanish-courses" ][ lang as L ],
    },
    image: fileBanner?.src_path || "",
  };


  // Banner 2 Section
  const dataBanner2 = {
    phrase: dataLang?.phrase_levels_starting,
    title: dataLang?.title_levels_starting,
    summary: dataLang?.summary_levels_starting,
    titleList: dataLang?.title_levels_starting,
    listLevels: dataLang?.list_levels_starting || [],
    button: {
      label: dataLang?.button_levels_starting,
      link: routes[ "about-us" ][ lang as L ],
    },
    image: fileBanner2?.src_path || "",
  };


  // Spanish Courses Section
  const itemsCourses = await Promise.all(
    data?.Courses_List?.map(async (course: any) => {

      const dataCourseLang = getLangData(course?.Courses_id?.lang, lang);

      return {
        icon: course?.Courses_id?.icon || "",
        title: dataCourseLang?.shurt_title || "",
        summary: dataCourseLang?.summary || "",
      };
    }) || [],
  );

  const dataSpanishCourses = {
    title: dataLang?.title_spanish_courses,
    phrase: dataLang?.phrase_spanish_courses,
    items: itemsCourses,
  };


  // Our Students Section
  const itemsStudents = await Promise.all(
    data?.Stories?.map(async (story: any) => {
      const fileImage = await directusMedia(
        story?.Stories_id?.Video_Or_Image || "", story?.Stories_id?.name
      );

      const dataStoryLang = getLangData(story?.Stories_id?.lang, lang);

      return {
        title: story?.Stories_id?.name,
        summary: dataStoryLang?.summary,
        image: fileImage?.src_path,
        videoUrl: story?.Stories_id?.Url_Video,
      };
    }) || [],
  );

  const dataSayOurStudents = {
    phrase: dataLang?.phrase_our_students,
    title: dataLang?.title_our_students,
    items: itemsStudents,
  };

  // Taster Session Section
  const dataBookingTasterSession = {
    title: dataLang?.title_tester_sesion,
    summary: dataLang?.summary_tester_session,
    button: {
      label: dataLang?.button_tester_sesion,
      link: routes[ "book-a-free-class" ][ lang as L ],
    },
    image: fileTesterSession?.src_path || "",
  };

  // FAQ Section
  const dataFaq = {
    title: dataLang?.title_faq,
    summary: dataLang?.summary_faq,
    items: dataLang?.list_faq.map((el: any) => el) || [],
  };

  // Return all data
  return {
    data,
    dataMainBanner,
    dataBanner2,
    dataSpanishCourses,
    dataSayOurStudents,
    dataBookingTasterSession,
    dataFaq,
    error,
  };
}