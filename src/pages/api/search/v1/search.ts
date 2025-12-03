import { directus } from "@/server/directus";
import { readItems } from "@directus/sdk";
import { routes } from "@/i18n/routes";
import { defaultLang } from "@/i18n/ui";

const buildFilter = (keys: string[], query: string) => ({
  _or: keys?.map(k => ({ [ k ]: { _icontains: query } }))
});

export async function GET({ request }: any) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";
    const currentLang = url.searchParams.get("lang") || defaultLang;


    if (query.length < 1 || !currentLang) {
      return new Response(JSON.stringify({ error: "Error getting data", status: 500 }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const fieldsCourses = [
      "title",
      "summary",
      'description',
      'features_plan',
      'languages_code'
    ];

    const data = await directus?.request(readItems("Courses_translations", {
      filter: buildFilter(fieldsCourses, query),
      fields: [ 'id', ...fieldsCourses ]
    })) as any;

    if (!data?.length) {
      return new Response(JSON.stringify({ error: "Not found data", status: 404 }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const ids = data.map((i: any) => i.id);

    const dataLang = await directus.request(
      readItems("Courses_translations", {
        filter: {
          Courses_id: { _in: ids },
          languages_code: { _eq: currentLang }
        },
        fields: [ ...fieldsCourses ]
      })
    );

    if (!dataLang?.length) {
      return new Response(JSON.stringify({ error: "Not found Lang data", status: 404 }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const fomrmattedData = dataLang.map((item: any) => (
      {
        ...item,
        slug: `${item.languages_code || defaultLang}/${routes[ 'spanish-courses' ][ item.languages_code as keyof typeof routes[ 'spanish-courses' ] ] || routes[ 'spanish-courses' ][ defaultLang ]}`
      }
    )) || [];

    const res = [ ...fomrmattedData || [] ]

    return new Response(
      JSON.stringify(res),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify(error),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
