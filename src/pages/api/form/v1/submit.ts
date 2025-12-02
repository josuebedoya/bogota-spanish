import { getLang, useTranslations } from "@/i18n/utils";
import type { APIRoute } from "astro";
import { DIRECTUS_URL as URL, SECRET_DIRECTUS_TOKEN as TOKEN } from 'astro:env/server';

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

    const response = await fetch(`${URL}/items/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();

      if (err?.errors?.[ 0 ]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        return resFetch({ error: err }, t('form.response.existemail'), 400);
      }

      return resFetch({ error: err }, t('form.response.error'), 500);
    }

    return resFetch({ success: true }, t('form.response.success'), 200);

  } catch (error) {
    return resFetch({ error: "Server error.", errors: error }, t('form.response.error'), 500);
  }
};
