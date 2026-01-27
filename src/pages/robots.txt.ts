import {PUBLIC_SITE_URL as URL} from "astro:env/client";

const robots = `
user-agent : *, 
Allow: /, 
Sitemap: ${URL}/sitemap.xml`

export function GET() {

  return new Response(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plane",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}