import { getLang, useTranslations } from "@/i18n/utils";
import { directus } from '@/server/directus';
import { createItems } from "@directus/sdk";
import type { APIRoute } from "astro";

const resFetch = (content = {}, message = '', status = 200) => {
  return new Response(JSON.stringify({ ...content, message }), { status });
}

export const POST: APIRoute = async ({ request, url }) => {

  const lang = getLang(url);
  const t = useTranslations(lang || "en-US");

  try {
    const formData = await request.formData();

    const model = formData.get("model");
    if (!model) {
      return resFetch({ error: "Missing model. Is Required" }, t('form.response.error'), 400);
    }

    const payload: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (key !== "model") {
        payload[ key ] = value;
      }
    });

    const res = await directus.request(createItems(model as string, payload as any[]));

    if (!res || !Object.keys(res).length) {
      return resFetch({ error: res }, t('form.response.error'), 500);
    }

    return resFetch({ success: true }, t('form.response.success'), 200);

  } catch (err) {
    console.log("Error", err);
    if (err?.errors?.[ 0 ]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
      return resFetch({ error: err }, t('form.response.existemail'), 400);
    }

    return resFetch({ error: "Server error.", errors: err }, t('form.response.error'), 500);
  }
};
