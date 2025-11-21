import { createDirectus, rest, readFile } from '@directus/sdk';
import { DIRECTUS_URL } from 'astro:env/server';

const URL = DIRECTUS_URL;

if (!URL) {
  throw new Error('DIRECTUS_URL is not defined in environment variables');
}

const directus = createDirectus(URL).with(rest());

const directusMedia = async (id: string) => {
  try {
    const file = await directus.request(readFile(id));

    if (!file || !file.filename_disk) {
      throw new Error('Invalid file or missing filename_disk');
    }

    const src_path = `${URL}/assets/${file.id}`;

    return {
      ...file,
      src_path,
    };
  } catch (error) {
    console.error('Error trying to get media:', error);
    return null;
  }
};



export default directus;
export { directusMedia, directus };