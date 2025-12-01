// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    env: {
        schema: {
            DIRECTUS_URL: envField.string({ context: "server", access: "secret" })
        }
    },
    i18n: {
        defaultLocale: 'en-US',
        locales: [ 'en-US', 'es-ES' ],
        routing: {
            prefixDefaultLocale: false,
            fallbackType: "rewrite",
            redirectToDefaultLocale: true
        },
        fallback: {
            'es-ES': "en-US"
        },
        routes: {
            "about-us": {
                "en-US": '/about-us',
                "es-ES": '/sobre-nosotros'
            },
            "spanish-courses": {
                "en-US": '/spanish-courses',
                "es-ES": '/cursos-de-espanol'
            },
        }
    },
});