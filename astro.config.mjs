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
            DIRECTUS_URL: envField.string({ context: "server", access: "secret" }),
            SECRET_DIRECTUS_TOKEN: envField.string({ context: "server", access: "secret" }),
            PUBLIC_RECAPTCHA_SITE_KEY: envField.string({ context: "client", access: "public" }),
            SECRET_RECAPTCHA_API_KEY: envField.string({ context: "server", access: "secret" }),
            SECRET_RECAPTCHA_PROJECT_ID: envField.string({ context: "server", access: "secret" }),
            PUBLIC_SITE_URL: envField.string({ context: "client", access: "public" })
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
        }
    },
});