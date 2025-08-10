"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// path: config/database.ts
const pg_connection_string_1 = require("pg-connection-string");
exports.default = ({ env }) => {
    const databaseUrl = env("DATABASE_URL");
    if (databaseUrl) {
        // Parse Supabase/Postgres connection string
        const config = (0, pg_connection_string_1.parse)(databaseUrl);
        return {
            connection: {
                client: "postgres",
                connection: {
                    host: config.host,
                    port: config.port,
                    database: config.database,
                    user: config.user,
                    password: config.password,
                    ssl: env.bool("DATABASE_SSL", true)
                        ? { rejectUnauthorized: false }
                        : false,
                },
                pool: { min: 2, max: 10 },
                acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
            },
        };
    }
    // Local dev fallback (SQLite)
    return {
        connection: {
            client: "sqlite",
            connection: {
                filename: env("DATABASE_FILENAME", ".tmp/data.db"),
            },
            useNullAsDefault: true,
            acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
        },
    };
};
