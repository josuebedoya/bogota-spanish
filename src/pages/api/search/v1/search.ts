import { directus } from "@/server/directus";
import { readItems } from "@directus/sdk";
import { routes } from "@/i18n/routes";
import { defaultLang } from "@/i18n/ui";

const buildFilter = (keys: string[], query: string) => {
  return {
    _or:
      keys?.map(k => ({ [ k ]: { _icontains: query } }))
  }
}

export async function GET({ request }: any) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";

    if (query.length < 1) {
      return new Response(JSON.stringify([]), {
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
      fields: [ ...fieldsCourses ]
    })) as any;

    const fomrmattedData = data?.map((item: any) => (
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
      JSON.stringify([]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}