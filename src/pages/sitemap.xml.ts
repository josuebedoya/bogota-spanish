import type { APIContext } from 'astro';
import { directus } from '@/server/directus'
import { readItems } from "@directus/sdk";
import { SITE_URL } from "astro:env/client";
import { routes } from '@/i18n/routes';


// With Multilanguaje menus
const itemsMenu = await directus.request(
  readItems('Menu', {
    fields: [ { lang: [ "link", ] }
    ],
    deep: {
      lang: {
        _sort: [ "-create_at" ],
      },
    },
    filter: {
      status: {
        _eq: "published",
      },
      lang: {
        link: {
          _neq: "/",   // Exclude homepage
          _ncontains: "#" // Exclude anchors
        }
      }
    },
  })
);

// Join items lang into a single array
const itemsJoined = itemsMenu.flatMap((item) => [ ...item.lang ]);
const formatItems = itemsJoined.map((item) => {
  const path = (item.link.startsWith('/') || item.link.startsWith('http')) ? item.link : `/${item.link}`;
  return {
    title: item.title,
    link: path
  }
});

const staticRoutes = [
  Object.values(routes[ 'book-a-free-class' ]).map(key => {
    return { link: `/${key}` };
  }),
]

const links = [ ...formatItems, ...staticRoutes.flat() ].flatMap(l => l);

export async function GET(context: APIContext) {
  const site = context.site?.toString() || SITE_URL;

  // Generate URLs for all content
  const urls: Array<{ loc: string; changefreq?: string; priority?: number, lastMod?: string }> = [];

  // Static pages
  urls.push({ loc: `${site}`, changefreq: 'daily', priority: 1.0, lastMod: '2025/12/12 13:12:12' });

  links.forEach((item) => {
    urls.push({ loc: `${site}${item.link}/`, changefreq: 'daily', priority: 0.9, lastMod: '2025/12/12 13:12:12' })
  })

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `<url>
    <loc>${url.loc}</loc>${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority}</priority>` : ''}
    <lastMod>${url.lastMod || new Date().toISOString()}</lastMod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
}