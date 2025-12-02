import slugify from '@/utils/slug';
import { createDirectus, rest, staticToken } from "@directus/sdk";
import { DIRECTUS_URL as URL, SECRET_DIRECTUS_TOKEN as TOKEN } from 'astro:env/server';
import { buildQuery } from '@/utils/buildQuery';

if (!URL || !TOKEN) {
  throw new Error('DIRECTUS_URL or SECRET_DIRECTUS_TOKEN is not defined in environment variables');
}

const directus = createDirectus(URL)
  .with(rest())
  .with(staticToken(TOKEN || ''));

const directusMedia = async (id: string, name: string, params?: Record<string, any>) => {
  try {

    if (!id) throw new Error('ID is required');

    const src_path = `${URL}/assets/${id}/${slugify(name || 'image')}.webp?${buildQuery(params)}`;

    return {
      src_path,
    };

  } catch (error) {
    console.error('Error trying to get media:', error);
    return null;
  }
};

export default directus;
export { directusMedia, directus };