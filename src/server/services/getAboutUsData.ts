import directus, {directusMedia} from "@/server/directus";
import {readItems} from "@directus/sdk";
import {defaultLang} from "@/i18n/ui";
import {getLangData} from "@/i18n/getLangData";

const nullDataResponse = {
  dataMainBanner: null,
  dataMeetTutors: null,
  dataOurPhilosophy: null,
  error: "Data not found",
};

const fieldsAboutUs = [
  "*",
  "lang.*",
  "tutors.Tutors_id.*",
  "tutors.Tutors_id.lang.*",
];

export const getAboutUsData = async (lang: string = defaultLang) => {

  let error = null;

  const data = await directus.request(readItems("About_us", {fields: fieldsAboutUs})) as any;

  if (!data) {
    return nullDataResponse;
  }

  const dataLang = getLangData(data?.lang, lang);

  const fileMainBanner = await directusMedia(data?.image_main_banner || "", dataLang?.title_main_banner, {
    width: 610, height: 700,
  });
  const filePhilosophy = await directusMedia(data?.image_philosophy || "", dataLang?.title_philosophy, {
    width: 880, height: 1025,
  });

  const dataMainBanner = {
    title: dataLang?.title_main_banner,
    summary: dataLang?.summary_main_banner,
    image: fileMainBanner?.src_path || "",
  };

  const itemsTutors = (await Promise.all(
    data?.tutors?.filter((tu: any) => tu?.Tutors_id?.status == 1)?.map(async (t: any) => {
      const file = await directusMedia(t?.Tutors_id?.photo_tutor || "", t?.Tutors_id?.name_tutor, {
        width: 210, height: 210,
      });
      if (!t || t?.status === '0') return null;

      const dataTutorLang = getLangData(t?.Tutors_id?.lang, lang);
      return {
        id: t?.Tutors_id?.id || "",
        image: file?.src_path || "",
        name: t?.Tutors_id?.name_tutor || "",
        chargue: dataTutorLang?.position || ""
      };
    }) || [],
  ))?.filter(Boolean);

  const dataMeetTutors = {
    phrase: dataLang?.phrase_our_experts,
    title: dataLang?.title_our_experts,
    summary: dataLang?.subtitle_our_experts,
    items: itemsTutors,
  };

  const dataOurPhilosophy = {
    title: dataLang?.title_philosophy,
    description: dataLang?.description_philosophy,
    image: filePhilosophy?.src_path || "",
  };

  return {
    dataMainBanner,
    dataMeetTutors,
    dataOurPhilosophy,
    error
  };
}