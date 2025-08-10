"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/messages/by-document-id',
            handler: 'message.createByDocumentId',
            // Optional per-route config (policies, middlewares, etc.)
            config: {
                // If you want this route usable without a token, set it public in
                // Admin > Settings > Users & Permissions > Roles (Public) afterwards.
                policies: [],
                middlewares: [],
            },
        },
    ],
};
