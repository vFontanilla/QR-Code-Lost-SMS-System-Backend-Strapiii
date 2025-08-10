"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// config/middlewares.ts
exports.default = [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: { 'connect-src': ["'self'", 'https:', 'http:'] },
            },
        },
    },
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            origin: [
                'http://localhost:3000',
                'https://qr-code-lost-sms-system.vercel.app',
                // allow previews; keep only if you use them:
                /\.vercel\.app$/,
            ],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
            keepHeadersOnError: true,
            // credentials: true, // uncomment ONLY if you send cookies
        },
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
